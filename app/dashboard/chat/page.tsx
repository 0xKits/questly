import ProjectBuilder from "@/components/project-builder";
import { ChatForm } from "@/components/chat-form";

import { createClient } from "@/utils/supabase/server";
import { Message } from "ai";
import {v4 as uuidv4} from 'uuid';
export default async function Page() {
	const supabase = await createClient();
	let user = (await supabase.auth.getUser()).data.user;
	let session = uuidv4();
	if (!user) {
		return (
			<div className="w-full h-full flex justify-center items-center">
				<span>No User Found!</span>
			</div>
		);
	}

	const messages = await supabase
		.from("chat")
		.select("*")
		.eq("user", user.id)
		.eq("session", session);

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
			<ChatForm user={user} prevMessages={msgs} session={session} />
		</div>
	);
}
