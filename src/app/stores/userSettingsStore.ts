import { create } from "zustand";
interface SettingsState {
	theme: "light" | "dark";
	toggleTheme: () => void;
}
export const useUserSettingsStore = create<SettingsState>((set) => ({
	theme: "light",
	toggleTheme: () =>
		set((state) => ({
			theme: state.theme === "light" ? "dark" : "light",
		})),
}));
