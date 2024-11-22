"use client";

import {
	Badge,
	Box,
	Button,
	Card,
	Checkbox,
	Group,
	Stack,
	Text,
	Loader,
	SegmentedControl,
} from "@mantine/core";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useTestStore } from "../stores/stateStore";
import { useSession } from "next-auth/react";
import Timer from "./Timer";
import { PageLoader } from "./Loader";

interface Answers {
	answer: string;
	isCorrect?: boolean;
}

interface Question {
	id: number;
	question: string;
	type: string;
	answers: Answers[];
}

interface TestData {
	testId: string;
	userId: string;
	startTime: Date;
	finishTime: Date;
	score: number;
	number: number;
	wrong: {
		questionId: number;
		question: string;
		answer: string[];
	}[];
}

const getCorrectAnswers = (question: Question) =>
	question.answers
		.filter((answer) => answer.isCorrect)
		.map((answer) => answer.answer);

const isAnswerCorrect = (selectedAnswers: string[], question: Question) => {
	const correctAnswers = getCorrectAnswers(question);
	return (
		selectedAnswers.length === correctAnswers.length &&
		selectedAnswers.every((answer) => correctAnswers.includes(answer))
	);
};

const baseUrl = process.env.NEXT_PUBLIC_API_URL;

const saveTest = async (
	testData: TestData,
	provider: string,
	testId: string,
) => {
	try {
		const response = await fetch(
			`${baseUrl}/api/v1/tests/${provider}/${testId}/attempt`,
			{
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(testData),
			},
		);
		if (!response.ok) {
			const errorData = await response.json();
			throw new Error(
				`Couldn't save test: ${errorData.message || "Unknown error"}`,
			);
		}
	} catch (error) {
		console.error("Couldn't save test: ", error);
	}
};

export const Questions = () => {
	const [questions, setQuestions] = useState<Question[]>([]);
	const [questionsNumber, setQuestionsNumber] = useState("20");
	const [loading, setLoading] = useState(true);
	const [started, setStarted] = useState(false);

	const { data: session } = useSession();
	const router = useRouter();
	const params = useParams();
	const { provider, testId } = params;
	const addAnswer = useTestStore((state) => state.addAnswer);
	const resetTest = useTestStore((state) => state.resetTest);

	const [currentIndex, setCurrentIndex] = useState(0);
	const [selectedAnswers, setSelectedAnswers] = useState<string[]>([]);
	const [feedback, setFeedback] = useState<{
		isCorrect: boolean | null;
		show: boolean;
	}>({
		isCorrect: null,
		show: false,
	});
	const startTime = new Date();

	useEffect(() => {
		if (!provider || !testId) return;

		const getTests = async () => {
			try {
				const response = await fetch(
					`${baseUrl}/api/v1/tests/${provider}/${testId}?limit=${questionsNumber}`,
				);
				if (!response.ok) {
					throw new Error("Couldn't get tests");
				}
				const data = await response.json();
				setQuestions(data.questions);
			} catch (error) {
				console.log((error as Error).message);
			} finally {
				setLoading(false);
			}
		};

		resetTest();
		getTests();
	}, [provider, testId, resetTest, questionsNumber]);

	const handleStartTest = () => {
		setStarted(true);
	};

	if (loading) {
		return <PageLoader />;
	}

	if (!started) {
		return (
			<Box>
				<Text size="xl" mb="md">
					{provider} Test
				</Text>

				<Text mb="md">
					There are {questions.length} randomly chosen questions.
				</Text>
				<Text mb="md">There is no time limit.</Text>
				<Text mb="md">Choose a test type then press "Start" to begin.</Text>

				<Group>
					<SegmentedControl
						value={questionsNumber}
						onChange={(value) => setQuestionsNumber(value)}
						data={[
							{ label: "Long (20 questions)", value: "20" },
							{ label: "Short (10 questions)", value: "10" },
						]}
					/>
					<Button onClick={handleStartTest}>Start</Button>
				</Group>
			</Box>
		);
	}

	const currentQuestion = questions[currentIndex];
	const totalQuestions = questions.length;

	const handleAnswerSelect = (selectedValue: string) => {
		if (feedback.show) return;

		if (currentQuestion.type === "checkbox") {
			setSelectedAnswers((prev) =>
				prev.includes(selectedValue) ? prev : [...prev, selectedValue],
			);

			const correctAnswers = getCorrectAnswers(currentQuestion);
			const newSelectedAnswers = selectedAnswers.includes(selectedValue)
				? selectedAnswers
				: [...selectedAnswers, selectedValue];

			if (newSelectedAnswers.length === correctAnswers.length) {
				handleSubmitAnswer(newSelectedAnswers);
			}
		} else {
			setSelectedAnswers([selectedValue]);
			handleSubmitAnswer([selectedValue]);
		}
	};

	const handleSubmitAnswer = (answers: string[]) => {
		const correct = isAnswerCorrect(answers, currentQuestion);
		setFeedback({ isCorrect: correct, show: true });

		addAnswer({
			id: currentQuestion.id,
			question: currentQuestion.question,
			userAnswer: answers,
			answer: getCorrectAnswers(currentQuestion),
			isCorrect: correct,
		});
	};

	const handleNextQuestion = async () => {
		setSelectedAnswers([]);
		setFeedback({ isCorrect: null, show: false });

		if (currentIndex < totalQuestions - 1) {
			setCurrentIndex((prev) => prev + 1);
		} else {
			const finishTime = new Date();
			const allAnswers = useTestStore.getState().answers;

			const correctAnswersCount = allAnswers.filter(
				(answer) => answer.isCorrect,
			).length;
			const totalQuestions = allAnswers.length;
			const score = (correctAnswersCount / totalQuestions) * 100;

			const wrong = allAnswers
				.filter((answer) => !answer.isCorrect)
				.map((answer) => ({
					questionId: answer.id,
					question: answer.question,
					answer: answer.answer,
				}));

			const testData: TestData = {
				testId: testId as string,
				userId: session?.user?.email || "unknown",
				startTime,
				finishTime,
				number: Number(questionsNumber),
				score,
				wrong,
			};

			await saveTest(testData, provider as string, testId as string);
			router.push("/practice/summary");
		}
	};

	return (
		<Box>
			<Group mb={20} justify="space-between">
				<h3>{provider} Test Questions</h3>
				<Timer />
				<Badge variant="outline" radius="sm">
					Question {currentIndex + 1} out of {totalQuestions}
				</Badge>
			</Group>

			<Text size="md" mb={10}>
				{currentQuestion.question}
			</Text>

			<Stack>
				{currentQuestion.answers.map((answer) => {
					const isSelected = selectedAnswers.includes(answer.answer);
					const isCorrectAnswer = feedback.show && answer.isCorrect;
					return (
						<Card
							key={answer.answer}
							shadow="sm"
							padding="md"
							onClick={() => handleAnswerSelect(answer.answer)}
							style={{
								cursor: feedback.show ? "not-allowed" : "pointer",
								backgroundColor: isCorrectAnswer
									? "beige"
									: isSelected
										? "pink"
										: "white",
								borderColor: isCorrectAnswer
									? "green"
									: isSelected
										? "red"
										: "#e0e0e0",
								borderWidth: 1,
								borderStyle: "solid",
								pointerEvents: feedback.show ? "none" : "auto",
							}}
						>
							{currentQuestion.type === "checkbox" ? (
								<Checkbox
									label={answer.answer}
									checked={isSelected}
									onChange={() => handleAnswerSelect(answer.answer)}
								/>
							) : (
								<Text>{answer.answer}</Text>
							)}
						</Card>
					);
				})}
			</Stack>

			<Button
				mt="md"
				onClick={handleNextQuestion}
				disabled={
					currentQuestion.type === "checkbox"
						? selectedAnswers.length < 2
						: selectedAnswers.length === 0
				}
			>
				{currentIndex < totalQuestions - 1 ? "Next" : "Finish"}
			</Button>
		</Box>
	);
};
