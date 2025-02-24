import { createClient } from "@/utils/supabase/server";
import { google } from "@ai-sdk/google";
import { streamText, tool } from "ai";
import { NextResponse } from "next/server";
import { z } from "zod";

export const maxDuration = 60;

export async function POST(req: Request) {
	const supabase = await createClient();

	try {
		const { messages } = await req.json();
		const initialMessages = messages.slice(0, -1);
		const currentMessage = messages[messages.length - 1];
		let questCreated: boolean = false;
		let createdQuestId: number | null = null;

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
You are an expert STEM project mentor who helps students design and build engaging hands-on projects (called "Quests"). Your role is to:

1. Review the student's available resources, which they can share through:
   - Photos of their parts/materials
   - Text lists of available components

2. Suggest 3-5 creative projects that:
   - Make optimal use of their existing materials
   - May incorporate common household items or affordable additions
   - Match their skill level and interests
   - Teach valuable STEM concepts

3. Present each project option in this format:

# Quest {number}: {engaging_title}

**Description:** Brief, exciting overview of the project and its learning outcomes

**Required Materials:**
- List of all needed components
- ✓ = Already has
- + = Needs to acquire

**Project Steps:**
1. High-level outline of major steps
2. Keep it clear but intriguing
3. Full details provided after selection

---

4. When a student selects a project:
   - Confirm their choice: "Would you like to begin [Project Name]?"
   - Upon confirmation, call createQuest()
   - Respond: "Quest created! Check your My Quests tab to begin."

Guidelines:
- Write conversationally, not in JSON
- Focus on projects that build fundamental STEM skills
- Prioritize safety and appropriate difficulty level
- Encourage creativity and experimentation
- Make efficient use of available materials
- Break complex concepts into manageable steps
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

						const { error: chatCreationError } = await supabase
							.from("quest_chat")
							.insert(
								messageContent.map((msg) => ({
									content: msg.content,
									image: msg.image,
									role: msg.role,
									project_id: questCreationResponse[0].id,
									user: user.data.user?.id,
								}))
							);
						if (chatCreationError) {
							throw chatCreationError;
						}
						// const { error: chatDeleteError } = await supabase
						// 	.from("chat")
						// 	.delete()
						// 	.eq("user", user.data.user.id);

						// if (chatDeleteError) {
						// 	console.error(
						// 		"Error deleting chat messages:",
						// 		chatDeleteError
						// 	);
						// }
						if (!tasksCreationError) {
							return { message: "Quest created successfully" };
						}
					},
				}),
			},
		});

		// if (questCreated && createdQuestId) {
		// 	return NextResponse.redirect(
		// 		new URL(`/dashboard/profile/quests/${createdQuestId}`, req.url)
		// 	);
		// }
		return result.toDataStreamResponse();
	} catch (error) {
		console.error("Error processing request:", error);

		return new Response(
			JSON.stringify({ error: "Failed to process request" }),
			{ status: 500 }
		);
	}
}
