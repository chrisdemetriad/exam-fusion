"use client";

import { Text } from "@mantine/core";
import { useTestStore } from "../stores/stateStore";

interface PageTitle {
	title: string;
}

export const PageTitle = ({ title }: PageTitle) => {
	const navBarOpen = useTestStore((state) => state.navbarOpen);
	if (navBarOpen) return null;
	return (
		<Text size="md" mb="lg">
			{title}
		</Text>
	);
};
