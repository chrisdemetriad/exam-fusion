import { create } from "zustand";

interface AnswerSummary {
	id: number;
	question: string;
	userAnswer: string[];
	correctAnswer: string[];
	isCorrect: boolean;
}

interface TestState {
	answers: AnswerSummary[];
	addAnswer: (answer: AnswerSummary) => void;
	resetTest: () => void;
}

export const useTestStore = create<TestState>((set) => ({
	answers: [],
	addAnswer: (answer) =>
		set((state) => ({ answers: [...state.answers, answer] })),
	resetTest: () => set({ answers: [] }),
}));
