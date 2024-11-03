"use client";

import { useTestStore } from "@/app/stores/stateStore";
import { Box, Accordion, Text, ThemeIcon, rem } from "@mantine/core";
import { IconCircleCheck, IconX } from "@tabler/icons-react";

export const Summary = () => {
	const answers = useTestStore((state) => state.answers);

	const expanded = answers
		.filter((answer) => !answer.isCorrect)
		.map((answer) => answer.id.toString());

	return (
		<Box>
			<Text>Summary</Text>
			<Accordion multiple defaultValue={expanded}>
				{answers.map((answer) => (
					<Accordion.Item key={answer.id} value={answer.id.toString()}>
						<Accordion.Control
							icon={
								<ThemeIcon
									color={answer.isCorrect ? "teal" : "red"}
									size={24}
									radius="xl"
								>
									{answer.isCorrect ? (
										<IconCircleCheck
											style={{ width: rem(16), height: rem(16) }}
										/>
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
									<Text c="green">{answer.correctAnswer.join(", ")}</Text>
								</>
							) : (
								<Text c="green">{answer.correctAnswer.join(", ")}</Text>
							)}
						</Accordion.Panel>
					</Accordion.Item>
				))}
			</Accordion>
		</Box>
	);
};
