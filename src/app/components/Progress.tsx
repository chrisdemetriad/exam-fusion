"use client";

import { Box, Text, List, ListItem } from "@mantine/core";
import { useEffect, useState } from "react";

interface TestAttempt {
	userId: string;
	testType: string;
	startTime: string;
	finishTime: string;
	wrongAnswers: {
		questionId: number;
		questionText: string;
		correctAnswer: string[];
	}[];
}

export const Progress = () => {
	const [testAttempts, setTestAttempts] = useState<TestAttempt[]>([]);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const getStats = async () => {
			try {
				const baseUrl = process.env.NEXT_PUBLIC_API_URL;
				const response = await fetch(`${baseUrl}/api/v1/tests/acca/attempted`);
				if (!response.ok) {
					throw new Error("Couldn't get tests attempts");
				}
				const data = await response.json();
				setTestAttempts(data);
			} catch (error) {
				const errorMessage = (error as Error).message;
				setError(errorMessage);
			}
		};

		getStats();
	}, []);

	if (error) {
		return <Text c="red">{error}</Text>;
	}

	return (
		<Box>
			<Text>Progress</Text>
			{testAttempts.map((attempt, i) => (
				<Box key={i} mb="md">
					<Text>
						Test type: {attempt.testType} | User: {attempt.userId}
					</Text>
					<Text>
						Start time: {new Date(attempt.startTime).toLocaleString()}
					</Text>
					<Text>
						Finish time: {new Date(attempt.finishTime).toLocaleString()}
					</Text>
					<Text>Wrong answers:</Text>
					<List>
						{attempt.wrongAnswers.map((wrongAnswer, i) => (
							<ListItem key={i}>
								<Text>Question: {wrongAnswer.questionText}</Text>
								<Text c="green">
									Correct answer: {wrongAnswer.correctAnswer.join(", ")}
								</Text>
							</ListItem>
						))}
					</List>
				</Box>
			))}
		</Box>
	);
};
