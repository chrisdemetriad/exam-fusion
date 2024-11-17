import { create } from "zustand";

interface AnswerSummary {
	id: number;
	question: string;
	userAnswer: string[];
	answer: string[];
	isCorrect: boolean;
}

interface TestState {
	answers: AnswerSummary[];
	duration: number;
	addAnswer: (answer: AnswerSummary) => void;
	resetTest: () => void;
	setDuration: (time: number) => void;
	resetDuration: () => void;
}

export const useTestStore = create<TestState>((set) => ({
	answers: [],
	duration: 0,
	addAnswer: (answer) =>
		set((state) => ({ answers: [...state.answers, answer] })),
	resetTest: () => set({ answers: [] }),
	setDuration: (time) => set({ duration: time }),
	resetDuration: () => set({ duration: 0 }),
}));
