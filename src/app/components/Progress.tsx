"use client";

import { Text, Box, SegmentedControl, Group } from "@mantine/core";
import type { Session } from "next-auth";
import { useSession } from "next-auth/react";
import { Bar, BarChart, Cell, Legend, ResponsiveContainer, Tooltip, XAxis, LineChart, Line, LabelList } from "recharts";
import { useTestStore } from "@stores/stateStore";
import { CustomTooltip } from "@components/Charts/CustomTooltip";
import { useFetch } from "@hooks/useFetch";
import { useState, useEffect } from "react";
import { PageLoader } from "@components/Loader";
import Link from "next/link";

interface TestId {
	provider: string;
	title: string;
}

interface ProgressData {
	testId: TestId;
	score: number | null;
	number: number;
	correctQuestions: number;
	totalQuestions: number;
	testDate: string;
	duration: number;
}

export const Progress = () => {
	const [visibleProviders, setVisibleProviders] = useState<string[]>([]);
	const [providerColors, setProviderColors] = useState<Record<string, string>>({});
	const baseUrl = useTestStore((state) => state.baseUrl);
	const colors = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#ffcc00", "#00c49f"];

	const [limit, setLimit] = useState(10);

	const { data: session } = useSession() as { data: Session | null };
	const userEmail = session?.user?.email;

	const {
		data: progressData,
		loading,
		error,
	} = useFetch<ProgressData[]>(`${baseUrl}/api/v1/tests/progress/${userEmail}?limit=${limit}`);

	useEffect(() => {
		if (progressData) {
			const uniqueProviders = Array.from(new Set(progressData.map((item) => item.testId.provider)));
			const providerColorMap = uniqueProviders.reduce(
				(acc, provider, index) => {
					acc[provider] = colors[index % colors.length];
					return acc;
				},
				{} as Record<string, string>
			);

			setProviderColors(providerColorMap);
			setVisibleProviders(uniqueProviders);
		}
	}, [progressData]);
	const filteredData = progressData?.filter((item) => visibleProviders.includes(item.testId.provider)) || [];

	if (loading) return <PageLoader />;

	if (error) {
		return <Text c="red">{error}</Text>;
	}

	if (!progressData || progressData.length === 0) {
		return (
			<>
				<Text c="dimmed" mb={20}>
					No progress data available for you yet.
				</Text>
				<Text>
					<Link href="/practice">Click here</Link> to start a test in order to see your progress here!
				</Text>
			</>
		);
	}

	const handleLegendClick = (provider?: string) => {
		if (provider) {
			setVisibleProviders((prev) =>
				prev.includes(provider) ? prev.filter((p) => p !== provider) : [...prev, provider]
			);
		}
	};

	const averageScores = Object.keys(providerColors).map((provider) => {
		const providerData = progressData.filter((item) => item.testId.provider === provider);
		const averageScore = providerData.reduce((sum, entry) => sum + (entry.score ?? 0), 0) / providerData.length || 0;
		return { provider, averageScore };
	});

	return (
		<Box>
			<Group justify="space-between" mb={20}>
				<Text>Daily progress</Text>
				<SegmentedControl
					size="md"
					value={limit.toString()}
					onChange={(value: string) => setLimit(Number(value))}
					data={[
						{ label: "Last 10 tests", value: "10" },
						{ label: "Last 20 tests", value: "20" },
					]}
				/>
			</Group>

			<Box style={{ width: "100%", height: 400, marginBottom: "2rem" }}>
				<ResponsiveContainer>
					<BarChart data={filteredData} margin={{ bottom: 80 }}>
						<XAxis
							dataKey={(entry) => `${entry.testId.provider} - ${entry.testId.title}`}
							angle={-30}
							textAnchor="end"
							interval={0}
							style={{ fontSize: "10px" }}
						/>
						<Tooltip content={<CustomTooltip />} />
						{Object.keys(providerColors).map((provider) => (
							<Bar
								key={provider}
								dataKey={(entry) => (entry.testId.provider === provider ? entry.score : null)}
								fill={providerColors[provider]}
								stackId="provider"
							>
								{filteredData.map((entry, index) => (
									<Cell
										key={`cell-${index}`}
										fill={
											entry.testId.provider === provider && (entry.score === 0 || entry.score === null)
												? "red"
												: providerColors[provider]
										}
									/>
								))}
								<LabelList
									dataKey={(entry) => (entry as ProgressData).testId.provider}
									position="insideBottom"
									style={{ fontSize: "10px", fill: "#fff" }}
								/>
							</Bar>
						))}
						<Legend
							layout="horizontal"
							align="center"
							verticalAlign="top"
							payload={Object.keys(providerColors).map((provider) => ({
								id: provider,
								value: provider,
								type: "square",
								color: visibleProviders.includes(provider) ? providerColors[provider] : "#d3d3d3",
							}))}
							onClick={(data, index, event) => {
								if (data?.id) {
									handleLegendClick(data.id);
								}
							}}
						/>
					</BarChart>
				</ResponsiveContainer>
			</Box>

			<Text>Average scores</Text>
			<Box style={{ width: "100%", height: 300, marginBottom: "2rem" }}>
				<ResponsiveContainer>
					<LineChart data={averageScores} margin={{ left: 10, right: 10 }}>
						<XAxis dataKey="provider" padding={{ left: 10, right: 10 }} tickMargin={10} />
						<Tooltip />
						<Line type="monotone" dataKey="averageScore" stroke="#8884d8" />
					</LineChart>
				</ResponsiveContainer>
			</Box>
		</Box>
	);
};
