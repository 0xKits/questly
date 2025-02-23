import { Onboarding } from "@/components/onboarding";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { getRandomFunFactTitle, getRandomStemFacts } from "@/utils/facts";
import { createClient } from "@/utils/supabase/server";
import { Lightbulb, Users, Wrench } from "lucide-react";
import moment from "moment";
import Link from "next/link";

export default async function Home() {
	const supabase = await createClient();
	const user = await supabase.auth.getUser();

	if (!user.data.user) {
		return <div>Not logged in</div>;
	}

	const { data: userData, error: userError } = await supabase
		.from("profiles")
		.select("*")
		.eq("id", user.data.user.id)
		.single();

	const { data: userQuests, error: questError } = await supabase
		.from("projects")
		.select("*")
		.eq("user", user.data.user.id);

	const funFacts = getRandomStemFacts(2);

	return (
		<div className="min-h-screen bg-background">
			{userData?.username ? null : <Onboarding />}
			<main className="container px-4 py-6 mx-auto max-w-5xl">
				<div className="flex flex-col gap-6">
					{/* Current Project */}
					{userData?.current_project ? (
						<section className="w-full">
							<Card className="border-2 border-primary">
								<CardHeader className="pb-2">
									<CardTitle className="text-lg">
										Current Project
									</CardTitle>
									<p className="text-sm text-muted-foreground">
										Started{" "}
										{moment
											.duration(
												moment().diff(
													userQuests?.find(
														(q) =>
															q.id ==
															userData.current_project
													)?.created_at
												)
											)
											.humanize()}{" "}
										ago
									</p>
								</CardHeader>
								<CardContent>
									<div className="space-y-2">
										<div className="flex items-center justify-between">
											<p className="font-medium">
												{
													userQuests?.find(
														(q) =>
															q.id ==
															userData.current_project
													)?.title
												}
											</p>
											<span className="text-sm text-muted-foreground">
												{
													userQuests?.find(
														(q) =>
															q.id ==
															userData.current_project
													)?.progress
												}
												%
											</span>
										</div>
										<Progress
											value={
												userQuests?.find(
													(q) =>
														q.id ==
														userData.current_project
												)?.progress
											}
										/>
									</div>
								</CardContent>
							</Card>
						</section>
					) : (
						<div className="flex justify-center items-center">
							<p>
								You haven't picked a primary quest yet! Go to
								"Your Quests" to pick one
							</p>
						</div>
					)}

					{/* Fun Fact 1 */}
					<Alert>
						<Lightbulb className="h-4 w-4" />
						<AlertTitle>{getRandomFunFactTitle()}</AlertTitle>
						<AlertDescription>{funFacts[0]}</AlertDescription>
					</Alert>

					{/* Guilds */}
					{/* <section className="w-full">
						<div className="flex items-center gap-2 mb-4">
							<Users className="h-5 w-5" />
							<h2 className="text-lg font-semibold">My Guilds</h2>
						</div>
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
							{MOCK_DATA.guilds.map((guild) => (
								<Card key={guild.id} className="flex flex-col">
									<CardHeader>
										<CardTitle className="text-base">
											{guild.name}
										</CardTitle>
									</CardHeader>
									<CardContent className="flex justify-between text-sm text-muted-foreground mt-auto">
										<span>{guild.members} members</span>
										<span>
											{guild.activeProjects} projects
										</span>
									</CardContent>
								</Card>
							))}
						</div>
					</section> */}

					{/* Projects */}
					<section className="w-full">
						<div className="flex items-center gap-2 mb-4">
							<Wrench className="h-5 w-5" />
							<h2 className="text-lg font-semibold">
								My Projects
							</h2>
						</div>
						<div className="grid gap-4">
							{userQuests &&
								userQuests.length > 0 &&
								userQuests.map((quest) => (
									<Link
										key={quest.id}
										href={`/projects/${quest.id}`}
									>
										<Card className="transition-colors hover:bg-muted/50">
											<CardContent className="pt-6">
												<div className="space-y-3">
													<div className="flex items-center justify-between">
														<div>
															<p className="font-medium">
																{quest.title}
															</p>
															<p className="text-sm text-muted-foreground">
																{
																	quest.description
																}
															</p>
														</div>
														<span className="text-sm text-muted-foreground">
															{quest.progress}%
														</span>
													</div>
													<Progress
														value={quest.progress}
													/>
												</div>
											</CardContent>
										</Card>
									</Link>
								))}
						</div>
					</section>
					{/* Fun Fact 2 */}
					<Alert>
						<Lightbulb className="h-4 w-4" />
						<AlertTitle>{getRandomFunFactTitle()}</AlertTitle>
						<AlertDescription>{funFacts[1]}</AlertDescription>
					</Alert>
				</div>
			</main>
		</div>
	);
}
