"use client";

import { Button, Group, TextInput, Textarea, Text, Box, Modal } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useState } from "react";
import { PageLoader } from "@components/Loader";
import { useTestStore } from "../stores/stateStore";
import { Question } from "@components/Questions";

interface FormValues {
	subject: string;
	message: string;
	question: Question;
}

export function QuestionReportModal({ question }: { question: Question }) {
	const closeReportModal = useTestStore((state) => state.closeReportModal);
	const reportModalOpen = useTestStore((state) => state.reportModalOpen);

	const [loading, setLoading] = useState(false);
	const [sent, setSent] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const form = useForm({
		initialValues: {
			subject: "",
			message: "",
			question,
		},
		validate: {
			subject: (value) => (value.trim().length === 0 ? "Subject is required" : null),
			message: (value) => (value.trim().length === 0 ? "Message can't be empty" : null),
		},
	});

	const handleSubmit = async (values: FormValues) => {
		setLoading(true);
		setError(null);

		try {
			const response = await fetch("/api/email", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(values),
			});

			if (response.ok) {
				setSent(true);
				form.reset();
			} else {
				let errorMessage = "Couldn't send the message. Please try again.";
				try {
					const data = await response.json();
					errorMessage = data.error || errorMessage;
				} catch {
					console.log("Couldn't parse the error message.");
				}
				setError(errorMessage);
			}
		} catch (e) {
			console.error("Couldn't send the message.", e);
			setError("Something went wrong. Please try again later.");
		} finally {
			setLoading(false);
		}
	};

	if (loading) {
		<PageLoader />;
	}

	return (
		<Modal opened={reportModalOpen} onClose={closeReportModal} title="Report question" centered>
			{sent ? (
				<Text>Nice, your report has been sent, cheers!</Text>
			) : (
				<Box>
					{error && <Text>{error}.</Text>}
					<form onSubmit={form.onSubmit(handleSubmit)}>
						<TextInput
							withAsterisk
							label="Subject"
							placeholder="Subject"
							name="subject"
							mb="md"
							data-autofocus
							{...form.getInputProps("subject")}
						/>
						<Textarea
							withAsterisk
							label="Message"
							placeholder="Your message"
							maxRows={10}
							minRows={5}
							mb="md"
							name="message"
							{...form.getInputProps("message")}
						/>

						<Group justify="left">
							<Button variant="outline" type="submit" size="md">
								Report question
							</Button>
						</Group>
					</form>
				</Box>
			)}
		</Modal>
	);
}
