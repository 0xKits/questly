import { createClient } from "@/utils/supabase/server";
import React from "react";
import { calculateLevel } from "@/utils/calculate-level";
import { progressToNextLevel } from "@/utils/calculate-level";

import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

async function Profile({ params }: { params: Promise<{ username: string }> }) {
	const { username } = await params;
	console.log(username);

	const supabase = await createClient();
	const user = await supabase.auth.getUser();

	if (!user.data.user) {
		return <div>Not logged in</div>;
	}

	const { data: userData, error: userError } = await supabase
		.from("profiles")
		.select("*")
		.eq("username", username)
		.single();

	if (!userData || userError) {
		console.log(userData, userError);
		console.log(username);
		console.log(user.data.user.id);
		return <div>Profile not found</div>;
	}

	const { data: userQuests, error: questError } = await supabase
		.from("projects")
		.select("*")
		.eq("user", userData.id);

	// Mock Image URL if profile image is not present
	const imageUrl = `https://api.dicebear.com/7.x/pixel-art/svg?seed=${userData.username}`;

	const userLevel = calculateLevel(userData.xp);
	const progress = progressToNextLevel(userData.xp);

	return (
		<div className="container mx-auto py-8 	">
			<Card className="w-full max-w-2xl mx-auto">
				<CardHeader>
					<div className="flex items-center justify-between">
						<CardTitle className="text-2xl">User Profile</CardTitle>
						<Button variant="outline">Edit Profile</Button>
					</div>
					<CardDescription>
						View and manage your profile information.
					</CardDescription>
				</CardHeader>
				<CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
					<div className="flex flex-col items-center md:items-start">
						<Avatar className="h-32 w-32 mb-4">
							<AvatarImage
								src={imageUrl}
								alt={userData.username}
							/>
							<AvatarFallback>
								{userData.username?.substring(0, 2)}
							</AvatarFallback>
						</Avatar>
						<h2 className="text-xl font-semibold mb-2">
							{userData.username}
						</h2>
						<p className="text-gray-500">Level: {userLevel}</p>
						<p className="text-gray-500">
							Current Project: {userData.current_project}
						</p>
						<Progress value={progress} className="w-full" />
						<p className="text-sm text-gray-500 mt-1">
							{progress}% to next level
						</p>
					</div>
					<div>
						<h2 className="text-xl font-semibold mb-2">Projects</h2>
						{userQuests && userQuests.length > 0 ? (
							<ul className="list-none pl-0">
								{userQuests.map((project) => (
									<li key={project.id} className="mb-2">
										<div className="flex items-center justify-between">
											<span>
												{project.title ||
													"Untitled Project"}
											</span>
											<Badge variant="secondary">
												{project.progress}
											</Badge>
										</div>
										<p className="text-sm text-gray-500">
											{project.description ||
												"No description"}
										</p>
										{/* Add more project details here */}
									</li>
								))}
							</ul>
						) : (
							<p>No projects found.</p>
						)}
					</div>
				</CardContent>
			</Card>
		</div>
	);
}

export default Profile;
