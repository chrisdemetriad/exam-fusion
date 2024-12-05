"use client";

import { Button, Flex, Group, SimpleGrid, TextInput, Textarea } from "@mantine/core";
import { useForm } from "@mantine/form";

export function ContactForm() {
	const form = useForm({
		initialValues: {
			name: "",
			email: "",
			subject: "",
			message: "",
		},
		validate: {
			name: (value) => value.trim().length < 2,
			email: (value) => !/^\S+@\S+$/.test(value),
			subject: (value) => value.trim().length === 0,
		},
	});

	return (
		<Flex justify="flex-start" align="flex-start" direction="row" wrap="wrap">
			<form onSubmit={form.onSubmit(() => {})}>
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
					autosize
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
		</Flex>
	);
}
