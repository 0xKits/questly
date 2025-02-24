"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Target, Trophy, Users } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return (
    <main className="flex-1 flex flex-col min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Hero Section */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-16 text-center gap-8">
        <div className="space-y-4 max-w-3xl">
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text">
            Welcome to Questly
          </h1>
          <p className="text-xl text-gray-600">
            Your personal project quest tracker
          </p>
        </div>

        <Button 
          size="lg"
          className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 text-lg rounded-full shadow-lg transition-all hover:scale-105"
          onClick={() => router.push('/sign-in')}
        >
          Sign Up / Sign In
          <ArrowRight className="ml-2 h-5 w-5" />
        </Button>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mt-12">
          <Card className="bg-white/50 backdrop-blur border-2 border-blue-100 hover:border-blue-300 transition-all">
            <CardContent className="pt-6 text-center">
              <div className="flex justify-center mb-4">
                <Target className="h-12 w-12 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Track Goals</h3>
              <p className="text-gray-600">Set meaningful objectives and track your progress</p>
            </CardContent>
          </Card>

          <Card className="bg-white/50 backdrop-blur border-2 border-blue-100 hover:border-blue-300 transition-all">
            <CardContent className="pt-6 text-center">
              <div className="flex justify-center mb-4">
                <Trophy className="h-12 w-12 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Earn Rewards</h3>
              <p className="text-gray-600">Complete quests and earn experience points</p>
            </CardContent>
          </Card>

          <Card className="bg-white/50 backdrop-blur border-2 border-blue-100 hover:border-blue-300 transition-all">
            <CardContent className="pt-6 text-center">
              <div className="flex justify-center mb-4">
                <Users className="h-12 w-12 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Join Guilds</h3>
              <p className="text-gray-600">Connect with others and share achievements</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}