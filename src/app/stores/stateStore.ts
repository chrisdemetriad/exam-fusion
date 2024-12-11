import { create } from "zustand";
import { persist } from "zustand/middleware";
import { TestData } from "@components/Tests";

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
	modalOpen: boolean;
	baseUrl: string;
	currentTest: TestData | null;
	navbarOpen: boolean;
	toggleNavbar: () => void;
	addAnswer: (answer: AnswerSummary) => void;
	resetTest: () => void;
	setDuration: (time: number) => void;
	resetDuration: () => void;
	openModal: () => void;
	closeModal: () => void;
	setCurrentTest: (test: TestData) => void;
}

export const useTestStore = create<TestState>()(
	persist(
		(set) => ({
			answers: [],
			duration: 0,
			modalOpen: false,
			baseUrl: (process.env.NODE_ENV === "production"
				? process.env.NEXT_PUBLIC_API_URL_PRODUCTION
				: process.env.NEXT_PUBLIC_API_URL_LOCAL) as string,
			currentTest: null,
			navbarOpen: true,
			toggleNavbar: () => set((state) => ({ navbarOpen: !state.navbarOpen })),
			addAnswer: (answer) => set((state) => ({ answers: [...state.answers, answer] })),
			resetTest: () => set({ answers: [] }),
			setDuration: (time) => set({ duration: time }),
			resetDuration: () => set({ duration: 0 }),
			openModal: () => set({ modalOpen: true }),
			closeModal: () => set({ modalOpen: false }),
			setCurrentTest: (test) => set({ currentTest: test }),
		}),
		{
			name: "test-store",
			partialize: (state) => ({
				answers: state.answers,
				currentTest: state.currentTest,
				navbarOpen: state.navbarOpen,
			}),
		}
	)
);
