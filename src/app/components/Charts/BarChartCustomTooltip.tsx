import { Badge, Box, Flex, rem, Text, useMantineColorScheme } from "@mantine/core";
import dayjs from "dayjs";

export const BarChartCustomTooltip = ({ active, payload }: any) => {
	const { colorScheme } = useMantineColorScheme();
	const isDark = colorScheme === "dark";

	if (active && payload && payload.length) {
		const data = payload[0].payload;
		const startTime = dayjs(data.startTime).format("MMM D, YYYY h:mm A");
		const duration = ((new Date(data.finishTime).getTime() - new Date(data.startTime).getTime()) / 1000).toFixed(2);

		return (
			<Box
				style={{
					backgroundColor: isDark ? "#2c2e33" : "#fff",
					padding: "10px",
					border: `1px solid ${isDark ? "#444" : "#999"}`,
					borderRadius: "5px",
					width: rem(250),
				}}
			>
				<Flex align="center" direction="row" justify="space-between" mb={rem(20)}>
					<Text size="sm">
						{data.testId.provider} - {data.testId.title}
					</Text>
					{data.wrong?.length === 0 && <Badge>100%</Badge>}
				</Flex>
				<Flex justify="space-between">
					<Text size="xs">Score:</Text>
					<Text size="xs">{data.score.toFixed(2)}</Text>
				</Flex>
				{!!data.number && (
					<Flex justify="space-between">
						<Text size="xs">Total questions:</Text>
						<Text size="xs">{data.number}</Text>
					</Flex>
				)}
				<Flex justify="space-between">
					<Text size="xs">Duration:</Text>
					<Text size="xs">{duration} seconds</Text>
				</Flex>
				<Flex justify="space-between">
					<Text size="xs">Started:</Text>
					<Text size="xs">{startTime}</Text>
				</Flex>

				{!!data.wrong?.length && (
					<Flex justify="space-between">
						<Text size="xs">Mistakes:</Text>
						<Text size="xs">{data.wrong.length}</Text>
					</Flex>
				)}
			</Box>
		);
	}

	return null;
};
