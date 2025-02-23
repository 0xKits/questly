"use client";

import React, { useState } from "react";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
	DialogFooter,
} from "@/components/ui/dialog";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";

interface Project {
	id: number;
	title: string;
}

interface EditProfileDialogProps {
	userId: string;
	currentUsername: string;
	currentBio: string | null;
	currentPinnedProject: number | null;
	userProjects: Project[] | null;
}

export default function EditProfileDialog({
	userId,
	currentUsername,
	currentBio = "",
	currentPinnedProject,
	userProjects,
}: EditProfileDialogProps) {
	const [isOpen, setIsOpen] = useState(false);
	const [username, setUsername] = useState(currentUsername);
	const [bio, setBio] = useState(currentBio);
	const [pinnedProject, setPinnedProject] = useState(
		currentPinnedProject?.toString() || ""
	);
	const [isLoading, setIsLoading] = useState(false);

	const onProfileUpdate = (username: string) => {
		router.push(`/dashboard/profile/${username}`);
		
	};

	const router = useRouter()

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);

		const supabase = createClient();

		const updates = {
			username: username || currentUsername,
			bio: bio || currentBio,
			current_project: pinnedProject ? parseInt(pinnedProject) : null,
		};

		const { error } = await supabase
			.from("profiles")
			.update(updates)
			.eq("id", userId);

		setIsLoading(false);

		if (!error) {
			setIsOpen(false);
			onProfileUpdate(username || currentUsername);
		}
	};

	return (
		<div>
			<Button variant="outline" onClick={() => setIsOpen(true)}>
				Edit Profile
			</Button>

			<Dialog open={isOpen} onOpenChange={setIsOpen}>
				<DialogContent className="sm:max-w-[425px]">
					<DialogHeader>
						<DialogTitle>Edit Profile</DialogTitle>
						<DialogDescription>
							Make changes to your profile. Leave fields empty to
							keep current values.
						</DialogDescription>
					</DialogHeader>
					<form onSubmit={handleSubmit}>
						<div className="space-y-4 py-4">
							<div className="space-y-2">
								<Label htmlFor="username">Username</Label>
								<Input
									id="username"
									placeholder={currentUsername}
									value={username}
									onChange={(e) =>
										setUsername(e.target.value)
									}
								/>
							</div>
							<div className="space-y-2">
								<Label htmlFor="bio">Bio</Label>
								<Textarea
									id="bio"
									placeholder="Tell us about yourself"
									value={bio ? bio : ""}
									onChange={(e) => setBio(e.target.value)}
								/>
							</div>
							<div className="space-y-2">
								<Label htmlFor="pinnedProject">
									Pinned Project
								</Label>
								<Select
									value={pinnedProject}
									onValueChange={setPinnedProject}
								>
									<SelectTrigger>
										<SelectValue placeholder="Select a project to pin" />
									</SelectTrigger>
									<SelectContent>
										<SelectGroup>
											<SelectLabel>
												Your Projects
											</SelectLabel>
											{userProjects?.map((project) => (
												<SelectItem
													key={project.id}
													value={project.id.toString()}
												>
													{project.title ||
														"Untitled Project"}
												</SelectItem>
											))}
										</SelectGroup>
									</SelectContent>
								</Select>
							</div>
						</div>
						<DialogFooter>
							<Button type="submit" disabled={isLoading}>
								{isLoading ? "Saving..." : "Save changes"}
							</Button>
						</DialogFooter>
					</form>
				</DialogContent>
			</Dialog>
		</div>
	);
}
