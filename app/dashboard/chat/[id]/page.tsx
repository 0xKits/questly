import { ChatForm } from "@/components/project-chat-form";

import { createClient } from "@/utils/supabase/server";
import { Message } from "ai";

export default async function Page({
	params,
}: {
	params: Promise<{ id: number }>;
}) {
	const { id: projectId } = await params;
	console.log(projectId);
	const supabase = await createClient();
	let user = (await supabase.auth.getUser()).data.user;
	let { data, error } = await supabase
		.from("projects")
		.select("*")
		.eq("id", Number(projectId))
		.single();
	console.log(data);
	if (!data) {
		return (
			<div className="w-full h-full flex justify-center items-center">
				<span>No Project Found!</span>
			</div>
		);
	}
	if (!user) {
		return (
			<div className="w-full h-full flex justify-center items-center">
				<span>No User Found!</span>
			</div>
		);
	}

	const messages = await supabase
		.from("quest_chat")
		.select("*")
		.eq("project_id", Number(projectId))
		.eq("user", user.id);

	const msgs: Message[] = [];

	if (messages.data) {
		messages.data.forEach((msg) => {
			msgs.push({
				id: msg.id.toString(),
				role: msg.role as "user" | "system" | "assistant" | "data",
				content: JSON.stringify({
					text: msg.content,
					image: msg.image,
				}),
			});
		});
	}

	return (
		<div className="flex w-full h-[calc(100vh-8rem)]">
			<ChatForm user={user} prevMessages={msgs} projectId={projectId} />
		</div>
	);
}
