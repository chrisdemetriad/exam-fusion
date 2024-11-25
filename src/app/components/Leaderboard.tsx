"use client";

import { useState, useEffect } from "react";
import { Table, Text, Box, SegmentedControl, Group } from "@mantine/core";
import { PageLoader } from "./Loader";
import { useTestStore } from "../stores/stateStore";

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
	const [leaderboardData, setLeaderboardData] =
		useState<LeaderboardData | null>(null);
	const [loading, setLoading] = useState(true);
	const [selectedCategory, setSelectedCategory] = useState("mostTests");
	const baseUrl = useTestStore((state) => state.baseUrl);
	console.log(baseUrl);

	useEffect(() => {
		const fetchLeaderboard = async () => {
			try {
				const response = await fetch(`${baseUrl}/api/v1/tests/leaderboard`);
				if (!response.ok) {
					throw new Error("Couldn't fetch leaderboard data");
				}
				const data = await response.json();
				setLeaderboardData(data);
			} catch (error) {
				console.error("Couldn't fetch leaderboard data", error);
			} finally {
				setLoading(false);
			}
		};

		fetchLeaderboard();
	}, []);

	if (loading) {
		return <PageLoader />;
	}

	if (!leaderboardData) {
		return (
			<Text c="red">Couldn't get the leaderboard data, please try again.</Text>
		);
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
									<Table.Td>
										{(entry.averageTime / 1000).toFixed(2)} seconds
									</Table.Td>
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
