"use client";

import { Button, Flex, Group, SimpleGrid, TextInput, Textarea, Text, Box } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useState } from "react";
import { PageLoader } from "./Loader";

interface FormValues {
	name: string;
	email: string;
	subject: string;
	message: string;
}

export function ContactForm() {
	const [loading, setLoading] = useState(false);
	const [sent, setSent] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const form = useForm({
		initialValues: {
			name: "",
			email: "",
			subject: "",
			message: "",
		},
		validate: {
			name: (value) => (value.trim().length < 2 ? "Name must be more than 2 chars" : null),
			email: (value) => (!/^\S+@\S+$/.test(value) ? "Email is not valid" : null),
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
			console.error("Couldn't send the message", e);
			setError("Something went wrong. Please try again later.");
		} finally {
			setLoading(false);
		}
	};

	if (loading) {
		return <PageLoader />;
	}

	return (
		<Flex justify="flex-start" align="flex-start" direction="row" wrap="wrap">
			{sent ? (
				<Text>Your message has been sent. We will do our best to get back to you within a few hours!</Text>
			) : (
				<Box>
					{error && <Text>{error}</Text>}
					<form onSubmit={form.onSubmit(handleSubmit)}>
						<SimpleGrid cols={{ base: 1, sm: 2 }} mb="md">
							<TextInput
								label="Name"
								placeholder="Your name"
								name="name"
								variant="filled"
								{...form.getInputProps("name")}
							/>
							<TextInput
								label="Email"
								placeholder="Your email"
								name="email"
								variant="filled"
								{...form.getInputProps("email")}
							/>
						</SimpleGrid>

						<TextInput
							label="Subject"
							placeholder="Subject"
							name="subject"
							variant="filled"
							mb="md"
							{...form.getInputProps("subject")}
						/>
						<Textarea
							label="Message"
							placeholder="Your message"
							maxRows={10}
							minRows={5}
							mb="md"
							name="message"
							variant="filled"
							{...form.getInputProps("message")}
						/>

						<Group justify="left">
							<Button type="submit" size="md">
								Send message
							</Button>
						</Group>
					</form>
				</Box>
			)}
		</Flex>
	);
}
