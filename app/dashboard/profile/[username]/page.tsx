import React from "react";
import { createClient } from "@/utils/supabase/server";
import { calculateLevel } from "@/utils/calculate-level";
import { progressToNextLevel } from "@/utils/calculate-level";
import { Trophy, Star, Target, Medal, Gamepad2 } from "lucide-react";
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
import Link from "next/link";
import EditProfileDialog from "./EditProfileDialog";

async function Profile({ params }: { params: Promise<{ username: string }> }) {
	const { username } = await params;
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
		return <div>Profile not found</div>;
	}

	const { data: userQuests, error: questError } = await supabase
		.from("projects")
		.select("*")
		.eq("user", userData.id);

	const imageUrl = `https://api.dicebear.com/7.x/pixel-art/svg?seed=${userData.username}`;
	const userLevel = calculateLevel(userData.xp);
	const progress = progressToNextLevel(userData.xp);

	// Mock achievements - in real app, fetch from database
	const achievements = [
		{ icon: Trophy, label: "First Project", earned: true },
		{ icon: Star, label: "Rising Star", earned: true },
		{ icon: Target, label: "Goal Setter", earned: false },
	];

	const getProjectStatusColor = (progress: number) => {
		if (progress >= 80) return "bg-green-500";
		if (progress >= 50) return "bg-yellow-500";
		return "bg-blue-500";
	};

	const getProgressBarClass = (progress: number) => {
		if (progress >= 80) return "[&>div]:bg-green-500";
		if (progress >= 50) return "[&>div]:bg-yellow-500";
		return "[&>div]:bg-blue-500";
	};

	return (
		<div className="container mx-auto py-8 space-y-6">
			<Card className="w-full max-w-4xl mx-auto">
				<CardHeader>
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-4">
							<Avatar className="h-20 w-20 ring-2 ring-offset-2 ring-blue-500">
								<AvatarImage
									src={imageUrl}
									alt={userData.username}
								/>
								<AvatarFallback>
									{userData.username?.substring(0, 2)}
								</AvatarFallback>
							</Avatar>
							<div>
								<CardTitle className="text-3xl flex items-center gap-2 flex-col sm:flex-row">
									{userData.username}
									<Badge className="ml-2 bg-blue-500">
										Level {userLevel}
									</Badge>
								</CardTitle>
								<CardDescription className="mt-2">
									Maker since{" "}
									{new Date(
										userData.created_at
									).toLocaleDateString()}
								</CardDescription>
							</div>
						</div>
						{userData.id === user.data.user.id && (
							<EditProfileDialog
								userId={userData.id}
								currentUsername={userData.username}
								currentBio={userData.bio}
								currentPinnedProject={userData.current_project}
								userProjects={userQuests || []}
								
							/>
						)}
					</div>
				</CardHeader>
				<CardContent className="space-y-6">
					{/* Level Progress Section */}
					<div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg">
						<h3 className="text-lg font-semibold mb-4">
							Level Progress
						</h3>
						<Progress value={progress} className={`h-4 mb-2 ${getProgressBarClass(progress)}`} />
						<div className="flex justify-between text-sm">
							<span>Level {userLevel}</span>
							<span>
								{progress}% to Level {userLevel + 1}
							</span>
						</div>
					</div>

					{/* Stats Grid */}
					<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
						<Card>
							<CardContent className="pt-6">
								<div className="text-center">
									<Gamepad2 className="w-8 h-8 mx-auto mb-2 text-blue-500" />
									<div className="text-2xl font-bold">
										{userQuests?.length || 0}
									</div>
									<div className="text-sm text-gray-500">
										Total Projects
									</div>
								</div>
							</CardContent>
						</Card>
						<Card>
							<CardContent className="pt-6">
								<div className="text-center">
									<Trophy className="w-8 h-8 mx-auto mb-2 text-yellow-500" />
									<div className="text-2xl font-bold">
										{
											achievements.filter((a) => a.earned)
												.length
										}
									</div>
									<div className="text-sm text-gray-500">
										Achievements
									</div>
								</div>
							</CardContent>
						</Card>
						<Card>
							<CardContent className="pt-6">
								<div className="text-center">
									<Medal className="w-8 h-8 mx-auto mb-2 text-blue-500" />
									<div className="text-2xl font-bold">
										{userData.xp}
									</div>
									<div className="text-sm text-gray-500">
										Total XP
									</div>
								</div>
							</CardContent>
						</Card>
					</div>

					{/* Projects Section */}
					<div>
						<h3 className="text-xl font-semibold mb-4">
							Active Projects
						</h3>
						<div className="grid gap-4">
							{userQuests && userQuests.length > 0 ? (
								userQuests.map((project) => (
									<Card key={project.id}>
										<Link
											href={`/dashboard/profile/quests/${project.id}`}
										>
											<CardContent className="pt-6">
												<div className="flex items-center justify-between mb-2">
													<div className="flex items-center gap-2">
														<div
															className={`w-3 h-3 rounded-full ${getProjectStatusColor(project.progress)}`}
														/>
														<h4 className="font-semibold">
															{project.title ||
																"Untitled Project"}
														</h4>
													</div>
													<Badge variant="secondary">
														{project.progress}%
													</Badge>
												</div>
												<Progress
													value={project.progress}
													className={`mb-2 ${getProgressBarClass(project.progress)}`}
												/>
												<p className="text-md text-gray-500">
													{project.description ||
														"No description"}
												</p>
											</CardContent>
										</Link>
									</Card>
								))
							) : (
								<Card>
									<CardContent className="py-8 text-center text-gray-500">
										<p>
											No projects yet. Time to start your
											maker journey!
										</p>
										<Button className="mt-4">
											Start New Project
										</Button>
									</CardContent>
								</Card>
							)}
						</div>
					</div>

					{/* Achievements Section */}
					<div>
						<h3 className="text-xl font-semibold mb-4">
							Achievements
						</h3>
						<div className="grid grid-cols-2 md:grid-cols-3 gap-4">
							{achievements.map((achievement, index) => (
								<Card
									key={index}
									className={
										!achievement.earned ? "opacity-50" : ""
									}
								>
									<CardContent className="pt-6">
										<div className="flex items-center gap-3">
											<achievement.icon className="w-6 h-6 text-yellow-500" />
											<div>
												<div className="font-semibold">
													{achievement.label}
												</div>
												<div className="text-sm text-gray-500">
													{achievement.earned
														? "Earned"
														: "Locked"}
												</div>
											</div>
										</div>
									</CardContent>
								</Card>
							))}
						</div>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}

export default Profile;
