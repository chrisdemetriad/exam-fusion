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
} from "@mantine/core";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useTestStore } from "../stores/stateStore";
import { useSession } from "next-auth/react";

// import questionsData from "../../../public/data/accaQuestions.json";

interface Answers {
	answerText: string;
	isCorrect?: boolean;
}

interface Question {
	id: number;
	questionText: string;
	answerType: string;
	possibleAnswers: Answers[];
}

interface TestData {
	userId: string;
	testType: string;
	startTime: Date;
	finishTime: Date;
	wrongAnswers: {
		questionId: number;
		questionText: string;
		correctAnswer: string[];
	}[];
}

const getCorrectAnswers = (question: Question) =>
	question.possibleAnswers
		.filter((answer) => answer.isCorrect)
		.map((answer) => answer.answerText);

const isAnswerCorrect = (selectedAnswers: string[], question: Question) => {
	const correctAnswers = getCorrectAnswers(question);
	return (
		selectedAnswers.length === correctAnswers.length &&
		selectedAnswers.every((answer) => correctAnswers.includes(answer))
	);
};

const baseUrl = process.env.NEXT_PUBLIC_API_URL;

const saveTest = async (testData: TestData) => {
	try {
		const response = await fetch(`${baseUrl}/api/v1/tests/acca/save`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(testData),
		});
		if (!response.ok) {
			const errorData = await response.json();
			throw new Error(
				`Couldn't save test: ${errorData.message || "Unknown error"}`,
			);
		}
		console.log("Test saved");
	} catch (error) {
		console.error("Couldn't save test: ", error);
	}
};

export const Questions = () => {
	const [tests, setTests] = useState<Question[]>([]);
	const [loading, setLoading] = useState(true);

	const { data: session } = useSession();
	const router = useRouter();
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
		const getTests = async () => {
			try {
				const response = await fetch(`${baseUrl}/api/v1/tests/acca`);
				if (!response.ok) {
					throw new Error("Couldn't get tests");
				}
				const data = await response.json();
				setTests(data[0].questions);
			} catch (error) {
				console.log((error as Error).message);
			} finally {
				setLoading(false);
			}
		};

		resetTest();
		getTests();
	}, [resetTest]);

	if (tests.length === 0 || loading) {
		return (
			<Box pos="relative">
				<Loader color="indigo" size="sm" type="dots" />
			</Box>
		);
	}

	const currentQuestion = tests[currentIndex];
	const totalQuestions = tests.length;

	const handleAnswerSelect = (selectedValue: string) => {
		if (feedback.show) return;

		if (currentQuestion.answerType === "checkbox") {
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
		console.log("Current question:", currentQuestion);
		const correct = isAnswerCorrect(answers, currentQuestion);
		setFeedback({ isCorrect: correct, show: true });

		addAnswer({
			id: currentQuestion.id,
			question: currentQuestion.questionText,
			userAnswer: answers,
			correctAnswer: getCorrectAnswers(currentQuestion),
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

			const wrongAnswers = allAnswers
				.filter((answer) => !answer.isCorrect)
				.map((answer) => ({
					questionId: answer.id,
					questionText: answer.question,
					correctAnswer: answer.correctAnswer,
				}));

			const testData: TestData = {
				userId: session?.user?.email || "unknown",
				testType: "ACCA",
				startTime,
				finishTime,
				wrongAnswers,
			};
			await saveTest(testData);

			router.push("/practice/summary");
		}
	};

	return (
		<Box>
			<Group mb={20} justify="space-between">
				<h3>ACCA Test Questions</h3>
				<Badge variant="outline" radius="sm">
					Question {currentIndex + 1} out of {totalQuestions}
				</Badge>
			</Group>

			<Text size="md" mb={10}>
				{currentQuestion.questionText}
			</Text>

			<Stack>
				{currentQuestion.possibleAnswers.map((answer) => {
					const isSelected = selectedAnswers.includes(answer.answerText);
					const isCorrectAnswer = feedback.show && answer.isCorrect;
					return (
						<Card
							key={answer.answerText}
							shadow="sm"
							padding="md"
							onClick={() => handleAnswerSelect(answer.answerText)}
							style={{
								cursor: feedback.show ? "not-allowed" : "pointer",
								backgroundColor: isCorrectAnswer
									? "beige"
									: isSelected
										? "#E0F7FA"
										: "white",
								borderColor: isCorrectAnswer
									? "green"
									: isSelected
										? "#00ACC1"
										: "#e0e0e0",
								borderWidth: 1,
								borderStyle: "solid",
								pointerEvents: feedback.show ? "none" : "auto",
							}}
						>
							{currentQuestion.answerType === "checkbox" ? (
								<Checkbox
									label={answer.answerText}
									checked={isSelected}
									onChange={() => handleAnswerSelect(answer.answerText)}
								/>
							) : (
								<Text>{answer.answerText}</Text>
							)}
						</Card>
					);
				})}
			</Stack>

			<Button
				mt="md"
				onClick={handleNextQuestion}
				disabled={
					currentQuestion.answerType === "checkbox"
						? selectedAnswers.length < 2
						: selectedAnswers.length === 0
				}
			>
				{currentIndex < totalQuestions - 1 ? "Next" : "Finish"}
			</Button>
		</Box>
	);
};
