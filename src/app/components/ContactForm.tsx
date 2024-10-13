"use client";

import {
	Button,
	Flex,
	Group,
	SimpleGrid,
	Text,
	TextInput,
	Textarea,
} from "@mantine/core";
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
				<Text>Get in touch</Text>

				<SimpleGrid cols={{ base: 1, sm: 2 }} mt="xl">
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
					mt="md"
					name="subject"
					variant="filled"
					{...form.getInputProps("subject")}
				/>
				<Textarea
					mt="md"
					label="Message"
					placeholder="Your message"
					maxRows={10}
					minRows={5}
					autosize
					name="message"
					variant="filled"
					{...form.getInputProps("message")}
				/>

				<Group justify="center" mt="xl">
					<Button type="submit" size="md">
						Send message
					</Button>
				</Group>
			</form>
		</Flex>
	);
}
