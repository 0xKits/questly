"use client";

import React, { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { QueryData } from "@supabase/supabase-js";

export default function GuildShowcasePage() {
  const supabase = createClient();
  const [guilds, setGuilds] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [showcases, setShowcases] = useState<Record<string, any>>({});
  const [selectedShowcase, setSelectedShowcase] = useState<{
    id: string;
    showcase_name: string;
    project_id: number;
    comments?: string;
    project?: any;
  } | null>(null);
  const [isGuildDialogOpen, setIsGuildDialogOpen] = useState(false);
  const [isShowcaseDialogOpen, setIsShowcaseDialogOpen] = useState(false);
  const [newGuildName, setNewGuildName] = useState("");
  const [newShowcase, setNewShowcase] = useState({
    projectId: 0,
    guildId: "",
    name: "",
    comment: "",
  });

  useEffect(() => {
    fetchGuilds();
    fetchProjects();
  }, []);

  const fetchGuilds = async () => {
    const query = supabase.from("guilds").select("*, guild_showcase(*)");
    type QueryResponse = QueryData<typeof query>;
    const { data } = await query;
    setGuilds(data || []);
  };

  const fetchProjects = async () => {
    const userId = await getUser();
    const { data } = await supabase.from("projects").select("*").eq("user",userId ? userId : "");
    setProjects(data || []);
  };

  const getUser = async () => {
    const { data } = await supabase.auth.getUser();
    return data.user?.id;
  };

  const createGuild = async () => {
    const userId = await getUser();
    await supabase
      .from("guilds")
      .insert({ guild_name: newGuildName, owner: userId });
    setNewGuildName("");
    setIsGuildDialogOpen(false);
    fetchGuilds();
  };

  const createShowcase = async () => {
    const userId = await getUser();
    const res = await supabase
      .from("showcase")
      .insert({
        project_id: newShowcase.projectId,
        showcase_name: newShowcase.name,
        comments: newShowcase.comment,
        user: userId,
      })
      .select("*");
    
    if (res.data) {
      await supabase.from("guild_showcase").insert({
        guild_id: Number(newShowcase.guildId),
        showcase_id: res.data[0].id,
      });
      setNewShowcase({
        projectId: 0,
        guildId: "",
        name: "",
        comment: "",
      });
      setIsShowcaseDialogOpen(false);
      fetchGuilds();
    }
  };

  const fetchShowcase = async (showcase_id: string) => {
    if (showcases[showcase_id]) {
      setSelectedShowcase(showcases[showcase_id]);
      return;
    }

    const { data } = await supabase
      .from("showcase")
      .select("*, project:projects(*)")
      .eq("id", showcase_id)
      .single();

    if (data) {
      setShowcases(prev => ({ ...prev, [showcase_id]: data }));
      setSelectedShowcase(data);
    }
  };

  return (
    <div className="flex w-screen flex-col md:flex-row h-full p-2 md:p-4 gap-4">
      {/* Left Panel */}
      <div className="w-full md:w-1/2 lg:w-1/3 overflow-y-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2">
          <h5 className="text-2xl font-bold">Guilds</h5>
          <div className="flex flex-wrap gap-2">
            {/* Guild Dialog */}
            <Dialog open={isGuildDialogOpen} onOpenChange={setIsGuildDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm" className="w-full sm:w-auto">
                  <Plus className="w-4 h-4 mr-1" />
                  New Guild
                </Button>
              </DialogTrigger>
              <DialogContent className="w-[95vw] max-w-[400px] sm:w-full">
                <DialogHeader>
                  <DialogTitle>Create New Guild</DialogTitle>
                </DialogHeader>
                <Input
                  value={newGuildName}
                  onChange={(e) => setNewGuildName(e.target.value)}
                  placeholder="Guild Name"
                />
                <DialogFooter>
                  <Button onClick={createGuild} className="w-full sm:w-auto">
                    Create
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            {/* Showcase Dialog */}
            <Dialog
              open={isShowcaseDialogOpen}
              onOpenChange={setIsShowcaseDialogOpen}
            >
              <DialogTrigger asChild>
                <Button size="sm" className="w-full sm:w-auto">
                  <Plus className="w-4 h-4 mr-1" />
                  New Showcase
                </Button>
              </DialogTrigger>
              <DialogContent className="w-[95vw] max-w-[400px] sm:w-full">
                <DialogHeader>
                  <DialogTitle>Create New Showcase</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <Select
                    onValueChange={(value) =>
                      setNewShowcase({
                        ...newShowcase,
                        projectId: Number(value),
                      })
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select Project" />
                    </SelectTrigger>
                    <SelectContent>
                      {projects.map((project) => (
                        <SelectItem key={project.id} value={project.id}>
                          {project.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select
                    onValueChange={(value) =>
                      setNewShowcase({
                        ...newShowcase,
                        guildId: value,
                      })
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select Guild" />
                    </SelectTrigger>
                    <SelectContent>
                      {guilds.map((guild) => (
                        <SelectItem key={guild.id} value={guild.id}>
                          {guild.guild_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Input
                    placeholder="Showcase Name"
                    value={newShowcase.name}
                    onChange={(e) =>
                      setNewShowcase({
                        ...newShowcase,
                        name: e.target.value,
                      })
                    }
                  />

                  <Textarea
                    placeholder="Comments"
                    value={newShowcase.comment}
                    onChange={(e) =>
                      setNewShowcase({
                        ...newShowcase,
                        comment: e.target.value,
                      })
                    }
                  />
                </div>
                <DialogFooter>
                  <Button onClick={createShowcase} className="w-full sm:w-auto">
                    Create
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {guilds.map((guild) => (
          <Card key={guild.id} className="mb-4">
            <CardHeader>
              <CardTitle>{guild.guild_name}</CardTitle>
            </CardHeader>
            <CardContent>
              {guild.guild_showcase?.map(
                (showcase: {
                  id: string;
                  guild_id: string;
                  showcase_id: string;
                }) =>
                  showcase && (
                    <Button
                      key={showcase.id}
                      variant={
                        selectedShowcase?.id === showcase.id
                          ? "default"
                          : "outline"
                      }
                      className="w-full mb-2"
                      onClick={() => fetchShowcase(showcase.showcase_id)}
                    >
                      {showcases[showcase.showcase_id]?.showcase_name || "click to reveal"}
                    </Button>
                  )
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Right Panel */}
      <div className="w-full md:w-1/2 lg:w-2/3">
        {selectedShowcase ? (
          <Card>
            <CardHeader>
              <CardTitle>{selectedShowcase.showcase_name}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-2">Project Details</h3>
                <div className="space-y-2">
                  <p><span className="font-medium">Title:</span> {selectedShowcase.project?.title}</p>
                  <p><span className="font-medium">Description:</span> {selectedShowcase.project?.description}</p>
                  <p><span className="font-medium">Status:</span> {selectedShowcase.project?.progress}% </p>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Showcase Comments</h3>
                <p className="text-gray-600">{selectedShowcase.comments}</p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="flex items-center justify-center h-full min-h-[200px] text-gray-500">
            Select a showcase to view details
          </div>
        )}
      </div>
    </div>
  );
}