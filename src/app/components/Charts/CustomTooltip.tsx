import { Box, Text } from "@mantine/core";

export const CustomTooltip = ({ active, payload }: any) => {
	if (active && payload && payload.length) {
		const data = payload[0].payload;

		return (
			<Box
				style={{
					backgroundColor: "#fff",
					padding: "10px",
					border: "1px solid #999",
					borderRadius: "5px",
				}}
			>
				<Text size="sm">
					{data.testId.provider} - {data.testId.title}
				</Text>
				<Text size="xs">Score: {data.score}</Text>
				{!!data.number && <Text size="xs">Total questions: {data.number}</Text>}
			</Box>
		);
	}

	return null;
};
