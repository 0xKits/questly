"use client";

import { createClient } from "@/utils/supabase/client";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";

export function Onboarding() {
	const supabase = createClient();
	// const [user, setUser] = useState("");
	// useEffect(() => {
	// 	const getUser = async () => {
	// 		const user = await supabase.auth.getUser();
	// 		if (user.data.user) {
	// 			setUser(user.data.user.id);
	// 		}
	// 	};
	// });
	const [username, setUsername] = useState("");
	const [bio, setBio] = useState("");

	return (
		<div className="fixed inset-0 bg-black/50 h-screen w-screen z-50 flex flex-col justify-center items-center text-white">
			<div className="max-w-sm mx-auto my-8 bg-white p-4 rounded-lg">
				<h1 className="text-3xl font-bold text-black">Welcome to Questly!</h1>
				<p className="text-lg mt-2 text-black">
					Let's get you set up with a profile.
				</p>
				<form
					className="mt-4"
					onSubmit={async (e) => {
						e.preventDefault();
						async function createProfile() {
							const user = await supabase.auth.getUser();
							if (!user.data.user) return;
							const { data, error } = await supabase
								.from("profiles")
								.insert({
									id: user.data.user.id,
									username: username,
									bio: bio,
								});
						}
                        createProfile()
					}}
				>
					<Input
						type="text"
						placeholder="Username"
						className="w-full bg-background border-b border-white/20 text-black"
						value={username}
						onChange={(e) => setUsername(e.target.value)}
					/>
					<Textarea
						placeholder="Bio"
						className="w-full bg-background border-b border-white/20 text-black mt-2"
						value={bio}
						onChange={(e) => setBio(e.target.value)}
					/>
					<Button
						type="submit"
						className="w-full bg-primary text-white mt-4 py-2 rounded"
					>
						Create Profile
					</Button>
				</form>
			</div>
		</div>
	);
}
