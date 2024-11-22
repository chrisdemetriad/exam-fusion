import { Text } from "@mantine/core";

interface PageTitle {
	title: string;
}

export const PageTitle = ({ title }: PageTitle) => (
	<Text size="md" mb="lg">
		{title}
	</Text>
);
