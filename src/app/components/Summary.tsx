"use client";

import { useTestStore } from "@/app/stores/stateStore";
import { Accordion, Box, Button, Group, Text, ThemeIcon, rem } from "@mantine/core";
import { IconCircleCheck, IconX } from "@tabler/icons-react";
import Link from "next/link";
import { PageTitle } from "@components/PageTitle";

export const Summary = () => {
	const answers = useTestStore((state) => state.answers);
	const duration = useTestStore((state) => state.duration);
	const count = answers.filter((a) => a.isCorrect).length;
	const expanded = answers
		.filter((answer) => !answer.isCorrect && answer.id !== undefined)
		.map((answer) => (answer.id !== undefined ? answer.id.toString() : ""));

	return (
		<Box>
			<PageTitle title="Summary" />
			<Group justify="space-between" mb={20}>
				<Text>
					You've answered {count} questions correctly out of {answers.length} in {duration} seconds.
				</Text>
				<Button variant="outline">
					<Link href="/practice">New test</Link>
				</Button>
			</Group>

			<Accordion multiple defaultValue={expanded}>
				{answers.map((answer) => (
					<Accordion.Item key={answer.id ?? Math.random()} value={answer.id?.toString() || Math.random().toString()}>
						<Accordion.Control
							icon={
								<ThemeIcon color={answer.isCorrect ? "teal" : "red"} size={24} radius="xl">
									{answer.isCorrect ? (
										<IconCircleCheck style={{ width: rem(16), height: rem(16) }} />
									) : (
										<IconX style={{ width: rem(16), height: rem(16) }} />
									)}
								</ThemeIcon>
							}
						>
							{answer.id}. {answer.question}
						</Accordion.Control>
						<Accordion.Panel>
							{!answer.isCorrect ? (
								<>
									<Text c="red" style={{ textDecoration: "line-through" }}>
										{answer.userAnswer.join(", ")}
									</Text>{" "}
									<Text c="green">{answer.answer.join(", ")}</Text>
								</>
							) : (
								<Text c="green">{answer.answer.join(", ")}</Text>
							)}
						</Accordion.Panel>
					</Accordion.Item>
				))}
			</Accordion>
		</Box>
	);
};
