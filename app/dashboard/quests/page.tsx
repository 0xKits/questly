import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { createClient } from "@/utils/supabase/server";
import moment from "moment";

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

	if (questData) {
		return (
			<div className="p-6 mx-auto w-screen">
				<h1 className="text-3xl font-bold mb-6">Quests</h1>

				<div className="grid gap-4">
					{questData.map((quest) => (
						<Card key={quest.id}>
							<CardHeader>
								<CardTitle className="text-xl">
									{quest.title}
								</CardTitle>
							</CardHeader>
							<CardContent className="space-y-4">
								<p className="text-gray-600">
									{quest.description}
								</p>
								<div className="flex items-center gap-2">
									<span className="text-sm text-gray-500">
										Started{" "}
										{moment
											.duration(
												moment().diff(
													quest.created_at
												)
											)
											.humanize()}{" "}
										ago
									</span>
								</div>
								<div className="space-y-2">
									<div className="flex justify-between">
										<span className="text-sm">
											Progress
										</span>
										<span className="text-sm">
											{quest.progress}%
										</span>
									</div>
									<Progress
										value={quest.progress}
										className="h-2"
									/>
								</div>
							</CardContent>
						</Card>
					))}
				</div>
			</div>
		);
	}
}
