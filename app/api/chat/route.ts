import { createClient } from "@/utils/supabase/server";
import { google } from "@ai-sdk/google";
import { streamText, tool } from "ai";
import { NextResponse } from "next/server";
import { z } from "zod";

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
			imageUrls = parsedContent.image;
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
						"Create a quest (project) for the user based on the provided response...",
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

						const { error: tasksCreationError } = await supabase
							.from("project_roadmap")
							.insert(
								tasks.map((t: any, i: any) => ({
									project: questCreationResponse[0].id,
									task: t,
									position: i,
									completed: false,
								}))
							);

						// Format messages for quest_chat insertion
						const formattedMessages = messageContent.map((msg) => {
							let content;
							let images = null;

							if (Array.isArray(msg.content)) {
								const textContent = msg.content
									.filter(
										(item: { type: string }) =>
											item.type === "text"
									)
									.map((item: { text: any }) => item.text)
									.join("\n");

								const imageContent = msg.content
									.filter(
										(item: { type: string }) =>
											item.type === "image"
									)
									.map((item: { image: any }) => item.image);

								content = textContent;
								images =
									imageContent.length > 0
										? imageContent
										: null;
							} else {
								try {
									const parsed = JSON.parse(
										msg.content.toString()
									);
									content = parsed.text || msg.content;
									images = parsed.image || null;
								} catch {
									content = msg.content.toString();
								}
							}

							return {
								content: content,
								image: images,
								role: msg.role,
								project_id: questCreationResponse[0].id,
								user: user.data.user?.id,
							};
						});

						const { error: chatCreationError } = await supabase
							.from("quest_chat")
							.insert(formattedMessages);

						if (chatCreationError) {
							throw chatCreationError;
						}

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
