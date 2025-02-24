"use client"

import React, { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus } from 'lucide-react';


export default function GuildShowcasePage (){
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error('Missing Supabase environment variables');
    }
    const supabase = createClient();
    const [guilds, setGuilds] = useState<any[]>([]);
    const [projects, setProjects] = useState<any[]>([]);
    const [selectedShowcase, setSelectedShowcase] = useState<{ id: string; showcase_name: string; comments?: string } | null>(null);
    const [isGuildDialogOpen, setIsGuildDialogOpen] = useState(false);
    const [isShowcaseDialogOpen, setIsShowcaseDialogOpen] = useState(false);
    const [newGuildName, setNewGuildName] = useState('');
    const [newShowcase, setNewShowcase] = useState({
      projectId: 0,
      guildId: '',
      name: '',
      comment: ''
    });
  
    useEffect(() => {
      fetchGuilds();
      fetchProjects();
    }, []);
  
    const fetchGuilds = async () => {
      const { data } = await supabase.from('guilds').select('*, guild_showcase(*)');
      setGuilds(data || []);
      console.log(data);
    };
  
    const fetchProjects = async () => {
      const { data } = await supabase.from('projects').select('*');
      setProjects(data || []);
      console.log(data);
    };
    async function getUser() {
      let {data, error} = await supabase.auth.getUser();
      let userId = data.user?.id;
      return userId;
    }
    const createGuild = async () => {
      let userId = await getUser();
      await supabase.from('guilds').insert({ guild_name: newGuildName as string ,owner : userId});
      setNewGuildName('');
      setIsGuildDialogOpen(false);
      fetchGuilds();
    };
  
    const createShowcase = async () => {
      let userId=await getUser();
      await supabase.from('showcase').insert({
        project_id: newShowcase.projectId,
        guild_id: newShowcase.guildId,
        showcase_name: newShowcase.name,
        comments: newShowcase.comment,
        user: userId
      });
      setNewShowcase({ projectId: 0, guildId: '', name: '', comment: '' });
      setIsShowcaseDialogOpen(false);
      fetchGuilds();
    };
  
    return (
      <div className="flex h-full w-screen p-4 gap-4">
        {/* Left Panel */}
        <div className="w-full overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <h5 className="text-2xl font-bold">Guilds</h5>
            <div className="space-x-2">
              <Dialog open={isGuildDialogOpen} onOpenChange={setIsGuildDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="sm">
                    <Plus className="w-4 h-4 mr-1" />
                    New Guild
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create New Guild</DialogTitle>
                  </DialogHeader>
                  <Input
                    value={newGuildName}
                    onChange={(e) => setNewGuildName(e.target.value)}
                    placeholder="Guild Name"
                  />
                  <DialogFooter>
                    <Button onClick={createGuild}>Create</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
  
              <Dialog open={isShowcaseDialogOpen} onOpenChange={setIsShowcaseDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="sm">
                    <Plus className="w-4 h-4 mr-1" />
                    New Showcase
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create New Showcase</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <Select onValueChange={(value) => setNewShowcase({ ...newShowcase, projectId: Number(value)})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Project" />
                      </SelectTrigger>
                      <SelectContent>
                        {projects.map(project => (
                          <SelectItem key={project.id} value={project.id}>
                            {project.title}
                          </SelectItem>
                        ))}
                        
                      </SelectContent>
                    </Select>
  
                    <Select onValueChange={(value) => setNewShowcase({ ...newShowcase, guildId: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Guild" />
                      </SelectTrigger>
                      <SelectContent>
                        {guilds.map(guild => (
                          <SelectItem key={guild.id} value={guild.id}>
                            {guild.guild_name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
  
                    <Input
                      placeholder="Showcase Name"
                      value={newShowcase.name}
                      onChange={(e) => setNewShowcase({ ...newShowcase, name: e.target.value })}
                    />
  
                    <Textarea
                      placeholder="Comments"
                      value={newShowcase.comment}
                      onChange={(e) => setNewShowcase({ ...newShowcase, comment: e.target.value })}
                    />
                  </div>
                  <DialogFooter>
                    <Button onClick={createShowcase}>Create</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
  
          {guilds.map(guild => (
            <Card key={guild.id} className="mb-4">
              <CardHeader>
                <CardTitle>{guild.name}</CardTitle>
              </CardHeader>
              <CardContent>
                {guild.guild_showcase?.map((showcase: { id: string; showcase_name: string; }) => 
                  showcase && (
                    <Button
                      key={showcase.id}
                      variant={selectedShowcase?.id === showcase.id ? "default" : "outline"}
                      className="w-full mb-2"
                      onClick={() => setSelectedShowcase(showcase)}
                    >
                      {showcase.showcase_name}
                    </Button>
                  )
                )}
              </CardContent>
            </Card>
          ))}
        </div>
  
        {/* Right Panel */}
        <div className="w-2/3">
          {selectedShowcase ? (
            <Card>
              <CardHeader>
                <CardTitle>{selectedShowcase.showcase_name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">{selectedShowcase.comments}</p>
              </CardContent>
            </Card>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500">
              Select a showcase to view details
            </div>
          )}
        </div>
      </div>
    );
  };