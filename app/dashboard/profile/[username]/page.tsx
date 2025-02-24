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
import { ScrollArea } from "@/components/ui/scroll-area";
import Link from "next/link";
import EditProfileDialog from "./EditProfileDialog";

// Achievement configuration
const ACHIEVEMENTS_CONFIG = [
	{
		id: "xp_level_1",
		title: "Level 1 Explorer",
		description: "Reached Level 1 (100 XP)",
		xpRequired: 100,
		icon: Trophy,
	},
	{
		id: "xp_level_5",
		title: "Level 5 Veteran",
		description: "Reached Level 5 (500 XP)",
		xpRequired: 500,
		icon: Medal,
	},
	{
		id: "xp_level_10",
		title: "Level 10 Master",
		description: "Reached Level 10 (1000 XP)",
		xpRequired: 1000,
		icon: Star,
	},
	{
		id: "first_project",
		title: "Project Beginner",
		description: "Completed your first project",
		projectsRequired: 1,
		icon: Target,
	},
	{
		id: "five_projects",
		title: "Project Enthusiast",
		description: "Completed 5 projects",
		projectsRequired: 5,
		icon: Gamepad2,
	},
	{
		id: "ten_projects",
		title: "Project Master",
		description: "Completed 10 projects",
		projectsRequired: 10,
		icon: Trophy,
	},
];

type Achievement = {
	id: string;
	title: string;
	description: string;
	icon: React.ElementType;
	unlocked: boolean;
	unlock_date: string | null;
	xpRequired?: number;
	projectsRequired?: number;
};

const AchievementCard = ({ achievement }: { achievement: Achievement }) => (
	<Card
		className={`mb-4 ${achievement.unlocked ? "bg-secondary/20" : "opacity-50"}`}
	>
		<CardContent className="pt-4 sm:pt-6">
			<div className="flex items-start sm:items-center gap-3 flex-col sm:flex-row">
				<achievement.icon className="w-6 h-6 text-yellow-500" />
				<div className="space-y-1">
					<div className="font-semibold flex items-center flex-wrap gap-2">
						{achievement.title}
						{achievement.unlocked && (
							<Badge variant="secondary">Unlocked</Badge>
						)}
					</div>
					<div className="text-sm text-muted-foreground">
						{achievement.description}
					</div>
					{achievement.unlocked && (
						<div className="text-sm text-muted-foreground">
							Unlocked on{" "}
							{new Date(
								achievement.unlock_date as string
							).toLocaleDateString()}
						</div>
					)}
				</div>
			</div>
		</CardContent>
	</Card>
);

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

	// Calculate completed projects
	const completedProjects =
		userQuests?.filter((project) => project.progress === 100) || [];
	const completedProjectsCount = completedProjects.length;

	// Process achievements
	const processedAchievements = ACHIEVEMENTS_CONFIG.map((achievement) => {
		let unlocked = false;

		if ("xpRequired" in achievement) {
			unlocked = userData.xp >= (achievement.xpRequired as number);
		} else if ("projectsRequired" in achievement) {
			unlocked = completedProjectsCount >= achievement.projectsRequired;
		}

		return {
			...achievement,
			unlocked,
			unlock_date: unlocked ? new Date().toISOString() : null,
		};
	});

	const imageUrl = `https://api.dicebear.com/7.x/pixel-art/svg?seed=${userData.username}`;
	const userLevel = calculateLevel(userData.xp);
	const progress = progressToNextLevel(userData.xp);

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
		<div className="container mx-auto px-4 py-6 sm:py-8 space-y-6">
			<Card className="w-full max-w-4xl mx-auto">
				<CardHeader>
					<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
						<div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
							<Avatar className="h-16 w-16 sm:h-20 sm:w-20 ring-2 ring-offset-2 ring-blue-500">
								<AvatarImage
									src={imageUrl}
									alt={userData.username}
								/>
								<AvatarFallback>
									{userData.username?.substring(0, 2)}
								</AvatarFallback>
							</Avatar>
							<div className="text-center sm:text-left">
								<CardTitle className="text-2xl sm:text-3xl flex items-center gap-2 justify-center sm:justify-start flex-wrap">
									{userData.username}
									<Badge className="bg-blue-500">
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
							<div className="flex justify-center sm:justify-end">
								<EditProfileDialog
									userId={userData.id}
									currentUsername={userData.username}
									currentBio={userData.bio}
									currentPinnedProject={
										userData.current_project
									}
									userProjects={userQuests || []}
								/>
							</div>
						)}
					</div>
				</CardHeader>
				<CardContent className="space-y-6">
					{/* Level Progress Section */}
					<div className="bg-gray-50 dark:bg-gray-800 p-4 sm:p-6 rounded-lg">
						<h3 className="text-lg font-semibold mb-4">
							Level Progress
						</h3>
						<Progress
							value={progress}
							className={`h-4 mb-2 ${getProgressBarClass(progress)}`}
						/>
						<div className="flex justify-between text-sm">
							<span>Level {userLevel}</span>
							<span>
								{progress}% to Level {userLevel + 1}
							</span>
						</div>
					</div>

					{/* Stats Grid */}
					<div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
						<Card>
							<CardContent className="pt-4 sm:pt-6">
								<div className="text-center">
									<Gamepad2 className="w-6 h-6 sm:w-8 sm:h-8 mx-auto mb-2 text-blue-500" />
									<div className="text-xl sm:text-2xl font-bold">
										{userQuests?.length || 0}
									</div>
									<div className="text-xs sm:text-sm text-gray-500">
										Total Projects
									</div>
								</div>
							</CardContent>
						</Card>
						<Card>
							<CardContent className="pt-4 sm:pt-6">
								<div className="text-center">
									<Trophy className="w-6 h-6 sm:w-8 sm:h-8 mx-auto mb-2 text-yellow-500" />
									<div className="text-xl sm:text-2xl font-bold">
										{completedProjectsCount}
									</div>
									<div className="text-xs sm:text-sm text-gray-500">
										Completed
									</div>
								</div>
							</CardContent>
						</Card>
						<Card>
							<CardContent className="pt-4 sm:pt-6">
								<div className="text-center">
									<Star className="w-6 h-6 sm:w-8 sm:h-8 mx-auto mb-2 text-yellow-500" />
									<div className="text-xl sm:text-2xl font-bold">
										{
											processedAchievements.filter(
												(a) => a.unlocked
											).length
										}
									</div>
									<div className="text-xs sm:text-sm text-gray-500">
										Achievements
									</div>
								</div>
							</CardContent>
						</Card>
						<Card>
							<CardContent className="pt-4 sm:pt-6">
								<div className="text-center">
									<Medal className="w-6 h-6 sm:w-8 sm:h-8 mx-auto mb-2 text-blue-500" />
									<div className="text-xl sm:text-2xl font-bold">
										{userData.xp}
									</div>
									<div className="text-xs sm:text-sm text-gray-500">
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
											<CardContent className="pt-4 sm:pt-6">
												<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
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
												<p className="text-sm sm:text-md text-gray-500">
													{project.description ||
														"No description"}
												</p>
											</CardContent>
										</Link>
									</Card>
								))
							) : (
								<Card>
									<CardContent className="py-6 sm:py-8 text-center text-gray-500">
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
						<div className="flex flex-col sm:flex-row items-center justify-between mb-4 gap-2">
							<h3 className="text-xl font-semibold">
								Achievements
							</h3>
							<div className="text-center sm:text-right">
								<p className="text-lg font-semibold">
									{
										processedAchievements.filter(
											(a) => a.unlocked
										).length
									}{" "}
									/ {processedAchievements.length}
								</p>
								<p className="text-sm text-muted-foreground">
									Achievements Unlocked
								</p>
							</div>
						</div>
						<ScrollArea className="h-[300px] sm:h-[400px] rounded-md border p-3 sm:p-4">
							{processedAchievements.map((achievement) => (
								<AchievementCard
									key={achievement.id}
									achievement={achievement}
								/>
							))}
						</ScrollArea>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}

export default Profile;
