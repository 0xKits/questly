"use client";

import React, { useState, useRef, useCallback, useEffect } from "react";
import { Send, ImagePlus, X } from "lucide-react";
import { Message, useChat } from "@ai-sdk/react";
import { createClient } from "@/utils/supabase/client";
import { v4 as uuidv4 } from "uuid";
import Image from "next/image";
import { User } from "@supabase/supabase-js";
import Markdown from "react-markdown";
import ProjectBuilder from "./project-builder";

const supabase = createClient();

const ACCEPTED_IMAGE_TYPES = [
	"image/jpeg",
	"image/png",
	"image/gif",
	"image/webp",
] as const;
const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

type MessageContent = {
	text: string;
	image: string[] | null;
};

interface ChatFormProps extends React.ComponentProps<"div"> {
	prevMessages: Message[];
	user: User;
	projectId: number;
}

const getFileExtension = (file: File): string => {
	return file.name.split(".").pop() || "jpg";
};

const parseMessageContent = (message: Message): MessageContent => {
	try {
		const parsed = JSON.parse(message.content.toString());
		return {
			text: parsed.text || "",
			image: parsed.image || null,
		};
	} catch {
		return {
			text: message.content.toString(),
			image: null,
		};
	}
};

export function ChatForm({
	className,
	prevMessages,
	user,
	projectId,
	...props
}: ChatFormProps) {
	// const [initialPrompt, setInitialPrompt] = useState<{
	// 	message?: string;
	// 	images?: string[];
	// } | null>(null);

	const { messages, input, setInput, append } = useChat({
		api: "/api/quest/chat",
		initialMessages: [...prevMessages],
		async onFinish(message) {
			await supabase.from("quest_chat").insert([
				{
					content: message.content.toString(),
					user: user.id,
					role: message.role,
					project_id: projectId,
				},
			]);
		},
	});

	// useEffect(() => {
	// 	const submitInitialPrompt = async () => {
	// 		await supabase.from("chat").insert([
	// 			{
	// 				content: initialPrompt?.message,
	// 				image: initialPrompt?.images,
	// 				user: user.id,
	// 				role: "user",
	// 			},
	// 		]);

	// 		const messageContent = JSON.stringify({
	// 			text: initialPrompt?.message,
	// 			image: initialPrompt?.images,
	// 		});
	// 		console.log(messageContent);

	// 		await append({ content: messageContent, role: "user" });
	// 	};

	// 	if (initialPrompt) {
	// 		submitInitialPrompt();
	// 	}
	// }, [initialPrompt]);

	const messagesEndRef = useRef<HTMLDivElement>(null);
	const fileInputRef = useRef<HTMLInputElement>(null);
	const [selectedImage, setSelectedImage] = useState<File[] | null>(null);
	const [imagePreview, setImagePreview] = useState<string[] | null>(null);
	const [isUploading, setIsUploading] = useState(false);

	const scrollToBottom = useCallback(() => {
		``;
		if (messagesEndRef.current) {
			messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
		}
	}, []);

	useEffect(() => {
		scrollToBottom();
	}, [messages, scrollToBottom]);

	const uploadImage = async (file: File): Promise<string> => {
		const filename = `${uuidv4()}.${getFileExtension(file)}`;
		const folderPath = "chat-images";

		const { error } = await supabase.storage
			.from("chat-images")
			.upload(`${folderPath}/${filename}`, file, {
				cacheControl: "3600",
				contentType: file.type,
			});

		if (error) throw error;

		const {
			data: { publicUrl },
		} = supabase.storage
			.from("chat-images")
			.getPublicUrl(`${folderPath}/${filename}`);

		return publicUrl;
	};

	const handleImageSelect = useCallback(async (file: File) => {
		if (
			!ACCEPTED_IMAGE_TYPES.includes(
				file.type as (typeof ACCEPTED_IMAGE_TYPES)[number]
			)
		) {
			alert("Please upload a valid image file (JPEG, PNG, GIF, or WebP)");
			return;
		}

		if (file.size > MAX_IMAGE_SIZE) {
			alert("Image size should be less than 5MB");
			return;
		}

		setSelectedImage((prev) => {
			if (!prev) prev = [];
			return [...prev, file];
		});

		const reader = new FileReader();
		reader.onloadend = () => {
			setImagePreview((prev) => {
				if (!prev) prev = [];
				return [...prev, reader.result as string];
			});
		};
		reader.readAsDataURL(file);
	}, []);

	const handlePaste = useCallback(
		(e: React.ClipboardEvent) => {
			const items = e.clipboardData.items;
			for (const item of items) {
				if (item.type.startsWith("image")) {
					const file = item.getAsFile();
					if (file) {
						handleImageSelect(file);
						break;
					}
				}
			}
		},
		[handleImageSelect]
	);

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) handleImageSelect(file);
	};
	const handleRemoveImage = (index: number) => {
		setSelectedImage((prev) => {
			if (!prev) return null;
			const newImages = [...prev];
			newImages.splice(index, 1);
			return newImages.length > 0 ? newImages : null;
		});

		setImagePreview((prev) => {
			if (!prev) return null;
			const newPreviews = [...prev];
			newPreviews.splice(index, 1);
			return newPreviews.length > 0 ? newPreviews : null;
		});
	};

	const handleRemoveAllImage = () => {
		setSelectedImage(null);
		setImagePreview(null);
		if (fileInputRef.current) {
			fileInputRef.current.value = "";
		}
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!input.trim()) return;

		try {
			setIsUploading(true);

			let imageUrls = [];

			if (selectedImage) {
				for (let img of selectedImage) {
					imageUrls.push(await uploadImage(img));
				}
			}

			setInput("");
			handleRemoveAllImage();

			await supabase.from("quest_chat").insert([
				{
					content: input,
					image: imageUrls,
					user: user.id,
					role: "user",
					project_id: projectId
				},
			]);

			const messageContent = JSON.stringify({
				text: input,
				image: imageUrls,
			});
			console.log(messageContent);

			await append({ content: messageContent, role: "user" });
		} catch (error) {
			console.error("Error uploading image:", error);
			alert("Failed to upload image. Please try again.");
		} finally {
			setIsUploading(false);
		}
	};

	return (
		<div className="flex flex-col w-screen h-full bg-gray-50">
			{/* Messages Container */}
			<div className="flex-1 overflow-y-auto p-4">
				<div className="flex flex-col gap-6">
					{messages.map((message, index) => {
						const { text, image } = parseMessageContent(message);
						return (
							<div
								key={index}
								className={`flex ${
									message.role === "user"
										? "justify-end"
										: "justify-start"
								}`}
							>
								<div
									className={`max-w-[80%] rounded-lg p-4 ${
										message.role === "user"
											? "bg-blue-500 text-white"
											: "bg-slate-200 text-gray-800"
									}`}
								>
									{text && (
										<div className="text-sm">
											<Markdown>{text}</Markdown>
										</div>
									)}
									<div>
										{image &&
											image.map((url: string, index) => (
												<div
													key={index}
													className="mt-2 overflow-hidden rounded-lg"
												>
													<Image
														src={url}
														alt="Uploaded content"
														width={400}
														height={300}
														className="max-w-full"
													/>
												</div>
											))}
									</div>
								</div>
							</div>
						);
					})}
					<div ref={messagesEndRef} />
				</div>
			</div>

			{/* Input Form */}
			<div className="border-t bg-white p-4">
				<div className="flex gap-4">
					{imagePreview &&
						imagePreview.map((img, index) => {
							return (
								<div
									key={index}
									className="relative mb-2 inline-block"
								>
									<span>
										<img
											src={img}
											alt="Preview"
											className="h-20 rounded-lg object-contain"
										/>
									</span>
									<button
										onClick={() => handleRemoveImage(index)}
										className="absolute -right-2 -top-2 rounded-full bg-gray-800 p-1 text-white"
										disabled={isUploading}
									>
										<X className="h-4 w-4" />
									</button>
								</div>
							);
						})}
				</div>
				<form onSubmit={handleSubmit} className="flex items-end gap-2 ">
					<input
						type="file"
						ref={fileInputRef}
						onChange={handleFileChange}
						accept="image/*"
						className="hidden"
						disabled={isUploading}
					/>

					<button
						type="button"
						onClick={() => fileInputRef.current?.click()}
						className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-gray-100"
						disabled={isUploading}
					>
						<ImagePlus className="h-5 w-5 text-gray-500" />
					</button>

					<textarea
						value={input}
						onChange={(e) => setInput(e.target.value)}
						onPaste={handlePaste}
						placeholder="Type a message..."
						className="flex-1 resize-none rounded-lg border border-gray-200 p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
						rows={1}
						disabled={isUploading}
						onKeyDown={(e) => {
							if (e.key === "Enter" && !e.shiftKey) {
								e.preventDefault();
								handleSubmit(e);
							}
						}}
					/>

					<button
						type="submit"
						className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500 text-white hover:bg-blue-600 disabled:grayscale"
						disabled={!input.trim() || isUploading}
					>
						<Send className="h-5 w-5" />
					</button>
				</form>
			</div>
		</div>
	);
}
