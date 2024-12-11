"use client";

import { Box, Group, SegmentedControl, Table, Text } from "@mantine/core";
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

	const renderTable = () => {
		const data = leaderboardData[selectedCategory as keyof LeaderboardData];

		if (!Array.isArray(data) || data.length === 0) {
			return <Text c="dimmed">No data available for this category.</Text>;
		}

		switch (selectedCategory) {
			case "mostTests":
				return (
					<Table highlightOnHover>
						<Table.Thead>
							<Table.Tr>
								<Table.Th>Name</Table.Th>
								<Table.Th>Tests Taken</Table.Th>
							</Table.Tr>
						</Table.Thead>
						<Table.Tbody>
							{(data as MostTests[]).map((entry) => (
								<Table.Tr key={entry._id}>
									<Table.Td>{entry._id}</Table.Td>
									<Table.Td>{entry.testCount}</Table.Td>
								</Table.Tr>
							))}
						</Table.Tbody>
					</Table>
				);
			case "scores":
				return (
					<Table highlightOnHover>
						<Table.Thead>
							<Table.Tr>
								<Table.Th>Name</Table.Th>
								<Table.Th>Average Score</Table.Th>
							</Table.Tr>
						</Table.Thead>
						<Table.Tbody>
							{(data as Scores[]).map((entry) => (
								<Table.Tr key={entry._id}>
									<Table.Td>{entry._id}</Table.Td>
									<Table.Td>{entry.averageScore.toFixed(2)}</Table.Td>
								</Table.Tr>
							))}
						</Table.Tbody>
					</Table>
				);
			case "times":
				return (
					<Table highlightOnHover>
						<Table.Thead>
							<Table.Tr>
								<Table.Th>Name</Table.Th>
								<Table.Th>Average Time</Table.Th>
							</Table.Tr>
						</Table.Thead>
						<Table.Tbody>
							{(data as Times[]).map((entry) => (
								<Table.Tr key={entry._id}>
									<Table.Td>{entry._id}</Table.Td>
									<Table.Td>{(entry.averageTime / 1000).toFixed(2)} seconds</Table.Td>
								</Table.Tr>
							))}
						</Table.Tbody>
					</Table>
				);
			default:
				return null;
		}
	};

	return (
		<Box>
			<SegmentedControl
				value={selectedCategory}
				onChange={setSelectedCategory}
				data={[
					{ label: "Most Tests Taken", value: "mostTests" },
					{ label: "Scores", value: "scores" },
					{ label: "Times", value: "times" },
				]}
			/>

			<Group>{renderTable()}</Group>
		</Box>
	);
};
