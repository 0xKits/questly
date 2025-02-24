"use client"
import React, { useEffect, useState } from 'react';
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Trophy } from "lucide-react";
import { createClient } from "@/utils/supabase/client";

const supabase = createClient();

// Define achievements based on XP and projects
const ACHIEVEMENTS_CONFIG = [
  {
    id: 'xp_level_1',
    title: "Level 1 Explorer",
    description: "Reached Level 1 (100 XP)",
    xpRequired: 100
  },
  {
    id: 'xp_level_5',
    title: "Level 5 Veteran",
    description: "Reached Level 5 (500 XP)",
    xpRequired: 500
  },
  {
    id: 'xp_level_10',
    title: "Level 10 Master",
    description: "Reached Level 10 (1000 XP)",
    xpRequired: 1000
  },
  {
    id: 'first_project',
    title: "Project Beginner",
    description: "Completed your first project",
    projectsRequired: 1
  },
  {
    id: 'five_projects',
    title: "Project Enthusiast",
    description: "Completed 5 projects",
    projectsRequired: 5
  },
  {
    id: 'ten_projects',
    title: "Project Master",
    description: "Completed 10 projects",
    projectsRequired: 10
  }
];

const AchievementCard = ({ achievement }) => {
  return (
    <Card className={`mb-4 ${achievement.unlocked ? 'bg-secondary/20' : 'opacity-50'}`}>
      <CardHeader className="flex flex-row items-center gap-4">
        <div className={`p-2 rounded-full ${achievement.unlocked ? 'bg-primary' : 'bg-muted'}`}>
          <Trophy className={`w-6 h-6 ${achievement.unlocked ? 'text-primary-foreground' : 'text-muted-foreground'}`} />
        </div>
        <div>
          <CardTitle className="text-lg">
            {achievement.title}
            {achievement.unlocked && (
              <Badge variant="secondary" className="ml-2">
                Unlocked
              </Badge>
            )}
          </CardTitle>
          <CardDescription>{achievement.description}</CardDescription>
        </div>
      </CardHeader>
      {achievement.unlocked && (
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Unlocked on {new Date(achievement.unlock_date).toLocaleDateString()}
          </p>
        </CardContent>
      )}
    </Card>
  );
};

export default function AchievementsPage() {
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUserProgress() {
      try {
        // Get current user
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        // Fetch user profile
        const { data: profile } = await supabase
          .from('profiles')
          .select('xp')
          .eq('id', user.id)
          .single();

        // Fetch completed projects count
        const { data: projects } = await supabase
          .from('projects')
          .select('id')
          .eq('user', user.id)
          .eq('progress', 100);

        const completedProjectsCount = projects?.length || 0;
        const userXP = profile?.xp || 0;

        // Process achievements
        const processedAchievements = ACHIEVEMENTS_CONFIG.map(achievement => {
          let unlocked = false;
          
          // Check if achievement is unlocked based on type
          if ('xpRequired' in achievement) {
            unlocked = userXP >= achievement.xpRequired;
          } else if ('projectsRequired' in achievement) {
            unlocked = completedProjectsCount >= achievement.projectsRequired;
          }

          return {
            ...achievement,
            unlocked,
            unlock_date: unlocked ? new Date().toISOString() : null // You might want to store actual unlock dates in a separate table
          };
        });

        setAchievements(processedAchievements);
      } catch (error) {
        console.error('Error fetching progress:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchUserProgress();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Achievements</h1>
            <p className="text-muted-foreground mt-2">Loading achievements...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Achievements</h1>
          <p className="text-muted-foreground mt-2">
            Track your progress and unlock new achievements
          </p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold">
            {achievements.filter(a => a.unlocked).length} / {achievements.length}
          </p>
          <p className="text-sm text-muted-foreground">Achievements Unlocked</p>
        </div>
      </div>
      <ScrollArea className="h-[600px] rounded-md border p-4">
        {achievements.map((achievement) => (
          <AchievementCard key={achievement.id} achievement={achievement} />
        ))}
      </ScrollArea>
    </div>
  );
}