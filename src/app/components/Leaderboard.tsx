"use client";

import { Avatar, Box, Group, rem, SegmentedControl, Text } from "@mantine/core";
import { useState } from "react";
import { useTestStore } from "@stores/stateStore";
import { PageLoader } from "@components/Loader";
import { useFetch } from "@hooks/useFetch";
import { useSession } from "next-auth/react";
import type { Session } from "next-auth";

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
	const { data: session } = useSession() as { data: Session | null };
	const [selectedCategory, setSelectedCategory] = useState("mostTests");
	const baseUrl = useTestStore((state) => state.baseUrl);

	const {
		data: leaderboardData,
		error,
		loading,
	} = useFetch<LeaderboardData>(`${baseUrl}/api/v1/tests/leaderboard`);

	if (loading) {
		return <PageLoader />;
	}
	if (error) {
		return <Text c="red">{error}.</Text>;
	}

	if (!leaderboardData) {
		return (
			<Text c="red">Couldn't get the leaderboard data, please try again.</Text>
		);
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

			<Box>
				{data.map((entry, index) => (
					<Group
						justify="flex-start"
						key={entry._id}
						style={{
							paddingTop: index === 0 ? 0 : rem(15),
							marginTop: index === 0 ? 0 : rem(15),
							borderTop:
								index === 0
									? "none"
									: "1px solid var(--app-shell-border-color)",
						}}
					>
						<Avatar size="md">{index + 1}</Avatar>
						<Avatar
							size="md"
							radius="xl"
							alt={entry._id}
							src={
								entry._id === session?.user?.email
									? session?.user?.image
									: undefined
							}
						/>
						<Text>{entry._id}</Text>
						<Text size="xs" c="dimmed">
							{selectedCategory === "mostTests" &&
								`${(entry as MostTests).testCount} tests taken`}
							{selectedCategory === "scores" &&
								`${(entry as Scores).averageScore.toFixed(2)} average score`}
							{selectedCategory === "times" &&
								`${((entry as Times).averageTime / 1000).toFixed(2)}s average time`}
						</Text>
					</Group>
				))}
			</Box>
		</Box>
	);
};
