"use client";

import { Box, Group, SegmentedControl, Avatar, Text, Stack, rem, useMantineColorScheme } from "@mantine/core";
import { useState } from "react";
import { useTestStore } from "@stores/stateStore";
import { PageLoader } from "@components/Loader";
import { useFetch } from "@hooks/useFetch";

interface MostTests {
	_id: string;
	testCount: number;
}

interface Scores {
	_id: string;
	bestScore: number;
	averageScore: number;
}

interface Times {
	_id: string;
	bestTime: number;
	averageTime: number;
}

interface LeaderboardData {
	mostTests: MostTests[];
	scores: Scores[];
	times: Times[];
}

export const Leaderboard = () => {
	const [selectedCategory, setSelectedCategory] = useState("mostTests");
	const baseUrl = useTestStore((state) => state.baseUrl);
	const { colorScheme } = useMantineColorScheme();
	const dark = colorScheme === "dark";

	const { data: leaderboardData, error, loading } = useFetch<LeaderboardData>(`${baseUrl}/api/v1/tests/leaderboard`);

	if (loading) {
		return <PageLoader />;
	}

	if (error) {
		return <Text c="red">{error}</Text>;
	}

	if (!leaderboardData) {
		return <Text c="red">Couldn't get the leaderboard data, please try again.</Text>;
	}

	const data = leaderboardData[selectedCategory as keyof LeaderboardData];

	if (!Array.isArray(data) || data.length === 0) {
		return <Text c="dimmed">No data available for this category.</Text>;
	}

	return (
		<Box>
			<Group justify="end" mb="xl">
				<SegmentedControl
					value={selectedCategory}
					onChange={setSelectedCategory}
					data={[
						{ label: "Most Tests Taken", value: "mostTests" },
						{ label: "Scores", value: "scores" },
						{ label: "Times", value: "times" },
					]}
				/>
			</Group>

			<Stack align="stretch" justify="center">
				{data.map((entry, index) => (
					<Group
						key={entry._id}
						align="center"
						style={{
							width: rem(400),
							margin: "0 auto",
							padding: rem(10),
							background: dark ? "#333" : "#F5F5FF",
							borderRadius: rem(8),
							border: `1px solid ${index === 0 ? "gold" : "#9fc6bb"}`,
						}}
					>
						<Box
							style={{
								width: rem(40),
								display: "flex",
								justifyContent: "center",
								alignItems: "center",
								fontWeight: "bold",
								fontSize: rem(16),
								background: "white",
								borderRadius: "50%",
								height: rem(40),
								color: "#333333",
							}}
						>
							{index + 1}
						</Box>
						<Avatar size="md" radius="xl" alt={entry._id} />
						<Box style={{ flexGrow: 1 }}>
							<Text size="sm" fw="700">
								{entry._id}
							</Text>
						</Box>
						<Box>
							<Text size="sm" fw="700">
								{selectedCategory === "mostTests" && `${(entry as MostTests).testCount}`}
								{selectedCategory === "scores" && `${(entry as Scores).averageScore.toFixed(2)}`}
								{selectedCategory === "times" && `${((entry as Times).averageTime / 1000).toFixed(2)}s`}
							</Text>
						</Box>
					</Group>
				))}
			</Stack>
		</Box>
	);
};
