"use client";

import { Badge, Box, Button, Card, Checkbox, Group, rem, SegmentedControl, Stack, Text, Tooltip } from "@mantine/core";
import { useSession } from "next-auth/react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useTestStore } from "@stores/stateStore";
import { PageLoader } from "@components/Loader";
import Timer from "@components/Timer";
import { useFetch } from "@hooks/useFetch";
import { IconMessageQuestion } from "@tabler/icons-react";
import { QuestionReportModal } from "./QuestionReportModal";

interface Answers {
	answer: string;
	isCorrect?: boolean;
}

export interface Question {
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

interface QuestionsResponse {
	questions: Question[];
}

const getCorrectAnswers = (question: Question) =>
	question.answers.filter((answer) => answer.isCorrect).map((answer) => answer.answer);

const isAnswerCorrect = (selectedAnswers: string[], question: Question) => {
	const correctAnswers = getCorrectAnswers(question);
	return (
		selectedAnswers.length === correctAnswers.length &&
		selectedAnswers.every((answer) => correctAnswers.includes(answer))
	);
};

export const Questions = () => {
	const [questionsNumber, setQuestionsNumber] = useState("20");
	const [started, setStarted] = useState(false);
	const baseUrl = useTestStore((state) => state.baseUrl);
	const currentTest = useTestStore((state) => state.currentTest);

	const { data: session } = useSession();
	const router = useRouter();
	const params = useParams();
	const { provider, testId } = params;
	const addAnswer = useTestStore((state) => state.addAnswer);
	const resetTest = useTestStore((state) => state.resetTest);
	const openReportModal = useTestStore((state) => state.openReportModal);

	const { data, error, loading } = useFetch<QuestionsResponse>(
		`${baseUrl}/api/v1/tests/${provider}/${testId}?limit=${questionsNumber}`
	);

	const questions = data?.questions || [];
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
		if (provider && testId) resetTest();
	}, [provider, testId, resetTest]);

	const handleStartTest = () => setStarted(true);

	const handleSaveTest = async (testData: TestData) => {
		try {
			const response = await fetch(`${baseUrl}/api/v1/tests/${provider}/${testId}/attempt`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(testData),
			});
			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(`Couldn't save the test: ${errorData.message || "Error"}`);
			}
		} catch (err) {
			console.error(`Couldn't save the test: ${err}`);
		}
	};

	if (loading) return <PageLoader />;
	if (error) return <Text>Error: {error}</Text>;

	if (!started) {
		return (
			<Box>
				<Text size="xl" mb={40}>
					{provider} - {currentTest?.description}
				</Text>
				<Text mb="md">There are {questions.length} randomly chosen questions.</Text>
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
					<Button onClick={handleStartTest} variant="outline">
						Start
					</Button>
				</Group>
			</Box>
		);
	}

	const currentQuestion = questions[currentIndex];
	const totalQuestions = questions.length;

	const handleAnswerSelect = (selectedValue: string) => {
		if (feedback.show) return;

		if (currentQuestion.type === "checkbox") {
			setSelectedAnswers((prev) => (prev.includes(selectedValue) ? prev : [...prev, selectedValue]));

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

			const correctAnswersCount = allAnswers.filter((answer) => answer.isCorrect).length;
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

			await handleSaveTest(testData);
			router.push("/practice/summary");
		}
	};

	return (
		<Box>
			<Group mb={40} justify="space-between">
				<Text size="xl">
					{provider} - {currentTest?.description}
				</Text>
				<Timer />
				<Badge variant="outline" radius="sm">
					Question {currentIndex + 1} out of {totalQuestions}
				</Badge>
			</Group>

			<Text size="md" mb={10}>
				{currentQuestion.question}
			</Text>

			<Stack>
				{currentQuestion.answers.map((answer: Answers) => {
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
								backgroundColor: isCorrectAnswer ? "beige" : isSelected ? "pink" : "inherit",
								borderColor: isCorrectAnswer ? "green" : isSelected ? "red" : "#e0e0e0",
								borderWidth: 1,
								borderStyle: "solid",
								pointerEvents: feedback.show ? "none" : "auto",
								...(isCorrectAnswer ? { color: "green" } : isSelected ? { color: "#333" } : {}),
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

			<Group justify="space-between" mt="md">
				<Button
					variant="outline"
					onClick={handleNextQuestion}
					disabled={currentQuestion.type === "checkbox" ? selectedAnswers.length < 2 : selectedAnswers.length === 0}
				>
					{currentIndex < totalQuestions - 1 ? "Next" : "Finish"}
				</Button>

				<Tooltip arrowSize={8} label="Report question" withArrow position="top">
					<Box onClick={openReportModal}>
						<IconMessageQuestion style={{ cursor: "pointer", color: "gray", width: rem(24), height: rem(24) }} />
					</Box>
				</Tooltip>
				<QuestionReportModal question={currentQuestion} />
			</Group>
		</Box>
	);
};
