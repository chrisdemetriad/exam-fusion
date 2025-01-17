import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Tests } from "@components/Tests";

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
	authModalOpen: boolean;
	reportModalOpen: boolean;
	baseUrl: string;
	currentTest: Tests | null;
	navbarOpen: boolean;
	toggleNavbar: () => void;
	addAnswer: (answer: AnswerSummary) => void;
	resetTest: () => void;
	setDuration: (time: number) => void;
	resetDuration: () => void;
	openAuthModal: () => void;
	closeAuthModal: () => void;
	openReportModal: () => void;
	closeReportModal: () => void;
	setCurrentTest: (test: Tests) => void;
}

export const useTestStore = create<TestState>()(
	persist(
		(set) => ({
			answers: [],
			duration: 0,
			authModalOpen: false,
			reportModalOpen: false,
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
			openAuthModal: () => set({ authModalOpen: true }),
			closeAuthModal: () => set({ authModalOpen: false }),
			setCurrentTest: (test) => set({ currentTest: test }),
			openReportModal: () => set({ reportModalOpen: true }),
			closeReportModal: () => set({ reportModalOpen: false }),
		}),
		{
			name: "exam-fusion-store",
			partialize: (state) => ({
				answers: state.answers,
				currentTest: state.currentTest,
				navbarOpen: state.navbarOpen,
			}),
		}
	)
);
