"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import ComponentsStep from "../app/steps/components-step";
import TopicsStep from "../app/steps/topics-step";
import NotesStep from "../app/steps/notes-step";
import { createClient } from "@/utils/supabase/client";
import { v4 as uuidv4 } from "uuid";

const steps = [
	{ id: 1, title: "Components" },
	{ id: 2, title: "Topics" },
	{ id: 3, title: "Notes" },
];

export default function ProjectBuilder({
	setInitialPrompt,
}: {
	setInitialPrompt: React.Dispatch<
		React.SetStateAction<{
			message?: string;
			images?: string[];
		} | null>
	>;
}) {
	const supabase = createClient();
	const [currentStep, setCurrentStep] = useState(1);
	const [showFlow, setShowFlow] = useState<boolean>(true);
	const [formData, setFormData] = useState({
		components: "",
		componentImage: null as File | null,
		topics: [] as string[],
		notes: "",
	});

	const updateFormData = (field: string, value: any) => {
		setFormData((prev) => ({
			...prev,
			[field]: value,
		}));
	};

	const handleNext = () => {
		if (currentStep < steps.length) {
			setCurrentStep((prev) => prev + 1);
		}
	};

	const handleBack = () => {
		if (currentStep > 1) {
			setCurrentStep((prev) => prev - 1);
		}
	};

	const getFileExtension = (file: File): string => {
		return file.name.split(".").pop() || "jpg";
	};

	const handleSubmit = () => {
		console.log("Form submitted:", formData);
		const file = formData.componentImage as File;
		if (file) {
			const filename = `${uuidv4()}.${getFileExtension(file)}`;
			const folderPath = "chat-images";

			supabase.storage
				.from("chat-images")
				.upload(`${folderPath}/${filename}`, file, {
					cacheControl: "3600",
					contentType: file.type,
				})
				.then((d) => {
					const {
						data: { publicUrl },
					} = supabase.storage
						.from("chat-images")
						.getPublicUrl(`${folderPath}/${filename}`);

					setInitialPrompt({
						images: [publicUrl],
						message: `Create a quest for me based on the components given\n${formData.components ? `Components: ${formData.components}\n` : ""}${formData.topics ? `I would like to follow these topics: ${formData.topics.toString()}\n` : ""}${formData.notes ? formData.notes + "\n" : ""}`,
					});

					setShowFlow(false);
				});
		} else {
			setInitialPrompt({
				images: [],
				message: `
        Create a quest for me based on the components given\n${formData.components ? `Components: ${formData.components}\n` : ""}${formData.topics ? `I would like to follow these topics: ${formData.topics.toString()}\n` : ""}2${formData.notes ? formData.notes + "\n" : ""}
        `,
			});
		}
	};
	if (showFlow)
		return (
			<div className="h-screen w-full">
				<Card className="w-full max-w-3xl mx-auto z-40 h-full ">
					<CardHeader>
						<CardTitle>Project Builder</CardTitle>
						<div className="flex items-center space-x-2">
							{steps.map((step) => (
								<div
									key={step.id}
									className="flex items-center"
								>
									<div
										className={`w-8 h-8 rounded-full flex items-center justify-center ${
											currentStep >= step.id
												? "bg-primary text-primary-foreground"
												: "bg-muted text-muted-foreground"
										}`}
									>
										{step.id}
									</div>
									{step.id < steps.length && (
										<div
											className={`h-1 w-12 ${currentStep > step.id ? "bg-primary" : "bg-muted"}`}
											aria-hidden="true"
										/>
									)}
								</div>
							))}
						</div>
					</CardHeader>
					<CardContent>
						{currentStep === 1 && (
							<ComponentsStep
								components={formData.components}
								componentImage={formData.componentImage}
								onUpdateComponents={(value) =>
									updateFormData("components", value)
								}
								onUpdateImage={(file) =>
									updateFormData("componentImage", file)
								}
							/>
						)}
						{currentStep === 2 && (
							<TopicsStep
								topics={formData.topics}
								onUpdateTopics={(value) =>
									updateFormData("topics", value)
								}
							/>
						)}
						{currentStep === 3 && (
							<NotesStep
								notes={formData.notes}
								onUpdateNotes={(value) =>
									updateFormData("notes", value)
								}
							/>
						)}
					</CardContent>
					<CardFooter className="flex justify-between">
						<Button
							variant="outline"
							onClick={handleBack}
							disabled={currentStep === 1}
						>
							Back
						</Button>
						{currentStep === steps.length ? (
							<Button onClick={handleSubmit}>Submit</Button>
						) : (
							<Button onClick={handleNext}>Next</Button>
						)}
					</CardFooter>
				</Card>
			</div>
		);
	else return <div className="hidden"></div>;
}
