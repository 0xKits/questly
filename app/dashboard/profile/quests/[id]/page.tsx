"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CalendarDays, CheckCircle2, Clock, Target, TargetIcon, Trophy, User } from "lucide-react";
import { createClient } from "@/utils/supabase/client";

interface ProjectData {
	created_at: string;
	description: string;
	id: number;
	progress: number;
	title: string;
	user: string;
}

interface TaskData {
	completed: boolean;
	created_at: string;
	id: number;
	position: number;
	project: number;
	task: string;
}

interface ProfileData {
	id: string;
	username: string;
}

export default function ProjectStatus({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const [projectId, setProjectId] = useState<number | null>(null);
	const [projectData, setProjectData] = useState<ProjectData | null>(null);
	const [tasksData, setTasksData] = useState<TaskData[] | null>(null);
	const [profileData, setProfileData] = useState<ProfileData | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const supabase = createClient();

	useEffect(() => {
		async function fetchData() {
			try {
				setIsLoading(true);
				setError(null);
				const { id } = await params;
				setProjectId(Number(id));
				// Fetch project data
				const { data: project, error: projectError } = await supabase
					.from("projects")
					.select()
					.eq("id", Number(id))
					.single();

				if (projectError) throw projectError;
				setProjectData(project);

				// Fetch tasks data
				const { data: tasks, error: tasksError } = await supabase
					.from("project_roadmap")
					.select()
					.eq("project", Number(id));

				if (tasksError) throw tasksError;
				setTasksData(tasks);

				// Fetch profile data
				if (project?.user) {
					const { data: profile, error: profileError } =
						await supabase
							.from("profiles")
							.select()
							.eq("id", project.user)
							.single();

					if (profileError) throw profileError;
					setProfileData(profile);
				}
			} catch (err) {
				setError(
					err instanceof Error ? err.message : "An error occurred"
				);
			} finally {
				setIsLoading(false);
			}
		}

		fetchData();
	}, [supabase]);

	const formatDate = (dateString: string) => {
		return new Date(dateString).toLocaleDateString("en-US", {
			month: "short",
			day: "numeric",
			year: "numeric",
		});
	};

	const handleTaskToggle = async (taskId: number) => {
		try {
			const taskToUpdate = tasksData?.find((task) => task.id === taskId);
			if (!taskToUpdate) return;

			const newCompletedState = !taskToUpdate.completed;

			// Update in Supabase
			const { error } = await supabase
				.from("project_roadmap")
				.update({ completed: newCompletedState })
				.eq("id", taskId);

			if (error) throw error;

			// Update local state
			setTasksData(
				(prevTasks) =>
					prevTasks?.map((task) =>
						task.id === taskId
							? { ...task, completed: newCompletedState }
							: task
					) ?? null
			);

			// Recalculate project progress
			if (tasksData) {
				const completedTasks = tasksData.filter((task) =>
					task.id === taskId ? newCompletedState : task.completed
				).length;
				const newProgress = Math.round(
					(completedTasks / tasksData.length) * 100
				);

				// Update project progress in Supabase
				await supabase
					.from("projects")
					.update({ progress: newProgress })
					.eq("id", Number(projectId));

				// Update local project data
				setProjectData((prev) =>
					prev ? { ...prev, progress: newProgress } : null
				);
			}
		} catch (err) {
			console.error("Error updating task:", err);
		}
	};

	const getProgressColor = (progress: number) => {
		if (progress >= 80) return "bg-green-500";
		if (progress >= 50) return "bg-yellow-500";
		return "bg-blue-500";
	};

	const getProgressBarClass = (progress: number) => {
		if (progress >= 80) return "[&>div]:bg-green-500";
		if (progress >= 50) return "[&>div]:bg-yellow-500";
		return "[&>div]:bg-blue-500";
	};

	const getProgressTextColor = (progress: number) => {
		if (progress >= 80) return "text-green-600";
		if (progress >= 50) return "text-yellow-600";
		return "text-blue-600";
	};

	if (isLoading) {
		return (
			<div className="min-h-screen w-full flex items-center justify-center">
				<div className="flex items-center gap-2 text-blue-600">
					<Clock className="h-5 w-5 animate-spin" />
					Loading...
				</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="min-h-screen w-full flex items-center justify-center">
				<div className="text-red-500 flex items-center gap-2">
					<span className="text-lg">Error: {error}</span>
				</div>
			</div>
		);
	}

	if (!projectData || !tasksData) {
		return (
			<div className="min-h-screen w-full flex items-center justify-center">
				<div className="text-gray-500">No project data found</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gray-50 py-8 px-4">
			<div className="max-w-4xl mx-auto space-y-6">
				<Card className="border-2 border-blue-200 shadow-lg">
					<CardHeader>
						<div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
							<div className="space-y-2">
								<div className="flex items-center gap-3">
									<TargetIcon className={`h-6 w-6 ${getProgressTextColor(projectData.progress)}`} />
									<CardTitle className="text-2xl font-bold">{projectData.title}</CardTitle>
								</div>
								<p className="text-gray-600">{projectData.description}</p>
							</div>
							<div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 text-sm">
								<div className="flex items-center gap-2 px-3 py-1 bg-blue-50 rounded-full">
									<User size={16} className="text-blue-500" />
									<span className="text-blue-700">{profileData?.username}</span>
								</div>
								<div className="flex items-center gap-2 px-3 py-1 bg-blue-50 rounded-full">
									<CalendarDays size={16} className="text-blue-500" />
									<span className="text-blue-700">{formatDate(projectData.created_at)}</span>
								</div>
							</div>
						</div>
					</CardHeader>
					<CardContent>
						<div className="space-y-3">
							<div className="flex justify-between items-center">
								<span className="font-medium">Progress</span>
								<span className={`px-3 py-1 rounded-full text-sm font-medium ${
									projectData.progress >= 80 ? "bg-green-100 text-green-800" :
									projectData.progress >= 50 ? "bg-yellow-100 text-yellow-800" :
									"bg-blue-100 text-blue-800"
								}`}>
									{projectData.progress}% Complete
								</span>
							</div>
							<Progress
								value={projectData.progress}
								className={`h-3 ${getProgressBarClass(projectData.progress)}`}
							/>
						</div>
					</CardContent>
				</Card>

				<Card className="border-2 border-blue-200 shadow-lg">
					<CardHeader>
						<div className="flex items-center justify-between">
							<div className="flex items-center gap-2">
								<CheckCircle2 className="h-5 w-5 text-blue-500" />
								<CardTitle>Tasks</CardTitle>
							</div>
							{tasksData.filter(t => t.completed).length === tasksData.length && (
								<div className="flex items-center gap-2 text-green-600">
									<Trophy className="h-5 w-5" />
									<span className="text-sm font-medium">All Tasks Complete!</span>
								</div>
							)}
						</div>
					</CardHeader>
					<CardContent>
						<ScrollArea className="h-[400px] pr-4">
							<div className="space-y-4">
								{tasksData.map((task) => (
									<div
										key={task.id}
										className={`flex items-start gap-4 p-4 rounded-lg border-2 transition-all ${
											task.completed
												? "bg-green-50 border-green-200"
												: "bg-white border-blue-100 hover:border-blue-300"
										}`}
									>
										<Checkbox
											checked={task.completed}
											onCheckedChange={() => handleTaskToggle(task.id)}
											className={`mt-1 ${
												task.completed
													? "border-green-500 text-green-500"
													: "border-blue-500 text-blue-500"
											}`}
										/>
										<div className="flex-1 min-w-0">
											<p className={`font-medium ${
												task.completed
													? "line-through text-green-700"
													: "text-gray-800"
											}`}>
												{task.task}
											</p>
											{task.completed ? (
												<p className="text-sm text-green-600 mt-1 flex items-center gap-1">
													<CheckCircle2 className="h-4 w-4" />
													Completed
												</p>
											) : (
												<p className="text-sm text-gray-500 mt-1 flex items-center gap-1">
													<Clock className="h-4 w-4" />
													Created {formatDate(task.created_at)}
												</p>
											)}
										</div>
									</div>
								))}
							</div>
						</ScrollArea>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
