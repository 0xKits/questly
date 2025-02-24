import { Onboarding } from "@/components/onboarding";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { getRandomFunFactTitle, getRandomStemFacts } from "@/utils/facts";
import { createClient } from "@/utils/supabase/server";
import { Lightbulb, Wrench, Sparkles, Brain } from "lucide-react";
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

  return (
    <div className="min-h-screen bg-background">
      {userData?.username ? null : <Onboarding />}
      <main className="container px-4 py-6 mx-auto max-w-5xl">
        <div className="flex flex-col gap-6">
          {/* Welcome Section */}
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold">
              Welcome back, {userData?.username}!
            </h1>
            <Sparkles className="h-8 w-8 text-yellow-500" />
          </div>

          {/* Current Project */}
          {userData?.current_project ? (
            <section className="w-full">
              <Card className="border-2 border-blue-500 shadow-lg">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-xl flex items-center gap-2">
                        Current Project
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          Active
                        </span>
                      </CardTitle>
                      <p className="text-sm text-muted-foreground">
                        Started{" "}
                        {moment
                          .duration(
                            moment().diff(
                              userQuests?.find(
                                (q) => q.id == userData.current_project
                              )?.created_at
                            )
                          )
                          .humanize()}{" "}
                        ago
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-lg">
                        {
                          userQuests?.find(
                            (q) => q.id == userData.current_project
                          )?.title
                        }
                      </p>
                      <span className="text-sm font-semibold px-3 py-1 bg-blue-100 text-blue-800 rounded-full">
                        {
                          userQuests?.find(
                            (q) => q.id == userData.current_project
                          )?.progress
                        }
                        % Complete
                      </span>
                    </div>
                    <Progress
                      value={
                        userQuests?.find(
                          (q) => q.id == userData.current_project
                        )?.progress
                      }
                      className={`h-3 ${getProgressBarClass(
                        userQuests?.find(
                          (q) => q.id == userData.current_project
                        )?.progress || 0
                      )}`}
                    />
                  </div>
                </CardContent>
              </Card>
            </section>
          ) : (
            <Card className="bg-blue-50 border-2 border-dashed border-blue-200">
              <CardContent className="flex flex-col items-center justify-center py-8 text-center">
                <Wrench className="h-12 w-12 text-blue-500 mb-4" />
                <p className="text-lg font-medium text-blue-800">
                  You haven't picked a primary quest yet!
                </p>
                <p className="text-sm text-blue-600 mt-1">
                  Go to "Your Quests" to pick one and start your journey
                </p>
              </CardContent>
            </Card>
          )}

          {/* Fun Fact 1 */}
          <Alert className="bg-blue-50 border-blue-200">
            <Brain className="h-4 w-4 text-blue-500" />
            <AlertTitle className="text-blue-800">{getRandomFunFactTitle()}</AlertTitle>
            <AlertDescription className="text-blue-600">{funFacts[0]}</AlertDescription>
          </Alert>

          {/* Projects */}
          <section className="w-full">
            <div className="flex items-center gap-2 mb-4">
              <Wrench className="h-6 w-6 text-blue-500" />
              <h2 className="text-xl font-semibold">My Projects</h2>
            </div>
            <div className="grid gap-4">
              {userQuests &&
                userQuests.length > 0 &&
                userQuests.map((quest) => (
                  <Link key={quest.id} href={`/dashboard/profile/quests/${quest.id}`}>
                    <Card className="transition-all hover:shadow-lg hover:border-blue-200">
                      <CardContent className="pt-6">
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium text-lg">{quest.title}</p>
                              <p className="text-sm text-muted-foreground">
                                {quest.description}
                              </p>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                              quest.progress >= 80 ? 'bg-green-100 text-green-800' :
                              quest.progress >= 50 ? 'bg-yellow-100 text-yellow-800' :
                              'bg-blue-100 text-blue-800'
                            }`}>
                              {quest.progress}% Complete
                            </span>
                          </div>
                          <Progress
                            value={quest.progress}
                            className={`h-2 ${getProgressBarClass(quest.progress)}`}
                          />
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
            </div>
          </section>

          {/* Fun Fact 2 */}
          <Alert className="bg-green-50 border-green-200">
            <Lightbulb className="h-4 w-4 text-green-500" />
            <AlertTitle className="text-green-800">{getRandomFunFactTitle()}</AlertTitle>
            <AlertDescription className="text-green-600">{funFacts[1]}</AlertDescription>
          </Alert>
        </div>
      </main>
    </div>
  );
}