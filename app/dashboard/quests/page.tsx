import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { createClient } from "@/utils/supabase/server";
import { Scroll, Trophy, Clock, Target, Plus } from "lucide-react";
import moment from "moment";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function Quests() {
	const supabase = await createClient();
	const user = await supabase.auth.getUser();

	if (!user.data.user) {
		return <div>Not logged in</div>;
	}

	const { data: questData, error: questError } = await supabase
		.from("projects")
		.select("*")
		.eq("user", user.data.user.id);

	const getProgressColor = (progress: number) => {
		if (progress >= 80) return "bg-green-500";
		if (progress >= 50) return "bg-yellow-500";
		return "bg-blue-500";
	};

	const getStatusBadge = (progress: number) => {
		if (progress >= 80) return "bg-green-100 text-green-800";
		if (progress >= 50) return "bg-yellow-100 text-yellow-800";
		return "bg-blue-100 text-blue-800";
	};

	return (
		<div className="container mx-auto px-4 py-8 max-w-5xl">
			<div className="flex items-center justify-between mb-8">
				<div className="flex items-center gap-3">
					<Scroll className="h-8 w-8 text-blue-500" />
					<h1 className="text-3xl font-bold">Your Quests</h1>
				</div>
				<Button asChild className="bg-blue-500 hover:bg-blue-600">
					<Link href="/dashboard/chat">
						<Plus className="h-4 w-4 mr-2" />
						New Quest
					</Link>
				</Button>
			</div>

			<div className="grid gap-6">
				{questData && questData.length > 0 ? (
					questData.map((quest) => (
						<Link
							href={`/dashboard/quests/${quest.id}`}
							key={quest.id}
							className="block transition-transform hover:-translate-y-1"
						>
							<Card className="border-2 hover:border-blue-200 hover:shadow-lg">
								<CardHeader className="pb-3">
									<div className="flex items-center justify-between">
										<div className="flex items-center gap-3">
											<Target
												className={`h-6 w-6 ${
													quest.progress >= 80
														? "text-green-500"
														: quest.progress >= 50
															? "text-yellow-500"
															: "text-blue-500"
												}`}
											/>
											<CardTitle className="text-xl">
												{quest.title}
											</CardTitle>
										</div>
										<span
											className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusBadge(quest.progress)}`}
										>
											{quest.progress}% Complete
										</span>
									</div>
								</CardHeader>
								<CardContent className="space-y-4">
									<p className="text-gray-600">
										{quest.description}
									</p>

									<div className="flex items-center gap-4 text-sm text-gray-500">
										<div className="flex items-center gap-1">
											<Clock className="h-4 w-4" />
											Started{" "}
											{moment
												.duration(
													moment().diff(
														quest.created_at
													)
												)
												.humanize()}{" "}
											ago
										</div>
										{quest.progress >= 80 && (
											<div className="flex items-center gap-1 text-green-600">
												<Trophy className="h-4 w-4" />
												Nearly Complete!
											</div>
										)}
									</div>

									<div className="space-y-2">
										<Progress
											value={quest.progress}
											className={`h-3 ${getProgressColor(quest.progress)} text-red-500`}
										/>
									</div>
								</CardContent>
							</Card>
						</Link>
					))
				) : (
					<Card className="bg-blue-50 border-2 border-dashed border-blue-200">
						<CardContent className="flex flex-col items-center justify-center py-12 text-center">
							<Scroll className="h-12 w-12 text-blue-500 mb-4" />
							<h3 className="text-xl font-medium text-blue-800 mb-2">
								No Quests Yet
							</h3>
							<p className="text-blue-600 mb-4">
								Start your first quest to begin your journey!
							</p>
							<Button className="bg-blue-500 hover:bg-blue-600">
								<Plus className="h-4 w-4 mr-2" />
								Create Your First Quest
							</Button>
						</CardContent>
					</Card>
				)}
			</div>
		</div>
	);
}
