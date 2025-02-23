import { createClient } from "@/utils/supabase/server";
import { google } from "@ai-sdk/google";
import { streamText, tool } from "ai";
import { z } from "zod";

export const maxDuration = 60;

export async function POST(req: Request) {
	const supabase = await createClient();

	try {
		const { messages } = await req.json();

		const initialMessages = messages.slice(0, -1);
		const currentMessage = messages[messages.length - 1];

		let parsedContent;
		let imageUrls = null;

		try {
			parsedContent = JSON.parse(currentMessage.content);
			imageUrls = parsedContent.image; // Now directly using the URL
		} catch {
			parsedContent = { text: currentMessage.content };
		}

		const messageContent = [
			...initialMessages,
			{
				role: "user",
				content: [
					{ type: "text", text: parsedContent.text || parsedContent },
				],
			},
		];

		if (imageUrls) {
			for (let imageUrl of imageUrls) {
				messageContent[messageContent.length - 1].content.push({
					type: "image",
					image: imageUrl,
				});
				console.log(imageUrl);
			}
		}

		const result = streamText({
			model: google("gemini-1.5-flash"),
			system: `
			You are an AI Assistant tasked with helping STEM students build unique projects. 
			Students may prompt you with either pictures of parts/resources they have or a list of parts. 
			Your task is to devise a set of projects which the user can build using their parts (and maybe add some other common household/cheap parts if necessary) and create a Quest for them (once they confirm they want to pursue the project) 
			Once you create a Quest, tell the user "Quest Created!" and instruct them to visit the "My Quests" tab to view it
	  `,
			messages: messageContent,
			tools: {
				createQuest: tool({
					description:
						"Create a quest (project) for the user based on the provided response. First, ask the user whether they want to accept the quest. If they do, then call this tool. This tool will add the quest to the database on behalf of the user",
					parameters: z.object({
						title: z
							.string()
							.describe("The title of the quest (project)"),
						description: z
							.string()
							.describe("The description of the quest (project)"),
						tasks: z
							.array(z.string())
							.describe(
								"The tasks that the user needs to complete to finish the quest (project)"
							),
					}),
					execute: async ({ title, description, tasks }) => {
						const user = await supabase.auth.getUser();
						if (!user.data.user) {
							throw new Error("User not found");
						}
						const {
							data: questCreationResponse,
							error: questCreationError,
						} = await supabase
							.from("projects")
							.insert({
								title: title,
								description: description,
								user: user.data.user.id,
							})
							.select();

						if (questCreationError) {
							throw questCreationError;
						}

						const {
							data: tasksCreationResponse,
							error: tasksCreationError,
						} = await supabase.from("project_roadmap").insert(
							tasks.map((t, i) => {
								return {
									project: questCreationResponse[0].id,
									task: t,
									position: i,
									completed: false,
								};
							})
						);

						if (!tasksCreationError) {
							return { message: "Quest created successfully" };
						}
					},
				}),
			},
		});

		return result.toDataStreamResponse();
	} catch (error) {
		console.error("Error processing request:", error);

		return new Response(
			JSON.stringify({ error: "Failed to process request" }),
			{ status: 500 }
		);
	}
}
