"use client";

import { Text, Box, SegmentedControl, Group } from "@mantine/core";
import type { Session } from "next-auth";
import { useSession } from "next-auth/react";
import { Bar, BarChart, Cell, ResponsiveContainer, Tooltip, XAxis, LineChart, Line } from "recharts";
import { useTestStore } from "@stores/stateStore";
import { BarChartCustomTooltip } from "@components/Charts/BarChartCustomTooltip";
import { useFetch } from "@hooks/useFetch";
import { useState, useEffect } from "react";
import { PageLoader } from "@components/Loader";
import { BarChartLegend } from "@/app/components/Charts/BarChartLegend";
import { useMemo } from "react";
import Link from "next/link";
import { HorizontalBarChart } from "./Charts/HorizontalBarChart";

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
	const baseUrl = useTestStore((state) => state.baseUrl);
	const [limit, setLimit] = useState(25);
	const [visibleProviders, setVisibleProviders] = useState<string[]>([]);

	const { data: session } = useSession() as { data: Session | null };
	const userEmail = session?.user?.email;
	const data1 = [
		{ name: "ACCA", value: 85 },
		{ name: "ACA", value: 70 },
		{ name: "CIMA", value: 90 },
		{ name: "AAT", value: 90 },
	];

	const data2 = [
		{ name: "ACCA", value: 45 },
		{ name: "ACA", value: 85 },
		{ name: "CIMA", value: 75 },
		{ name: "AAT", value: 60 },
	];

	const data3 = [
		{ name: "ACCA", value: 65 },
		{ name: "ACA", value: 30 },
		{ name: "CIMA", value: 20 },
		{ name: "AAT", value: 85 },
	];
	const {
		data: progressData,
		loading,
		error,
	} = useFetch<ProgressData[]>(`${baseUrl}/api/v1/tests/progress/${userEmail}?limit=${limit}`);

	const uniqueProviders = useMemo(() => {
		if (!progressData) return [];
		return progressData.reduce((acc, item) => {
			if (!acc.includes(item.testId.provider)) {
				acc.push(item.testId.provider);
			}
			return acc;
		}, [] as string[]);
	}, [progressData]);

	useEffect(() => {
		if (progressData) {
			setVisibleProviders(uniqueProviders);
		}
	}, [progressData, uniqueProviders]);

	const filteredData = progressData?.filter((item) => visibleProviders.includes(item.testId.provider)) || [];

	if (loading) {
		return <PageLoader />;
	}
	if (error) {
		return <Text c="red">{error}.</Text>;
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

	const handleLegendClick = (provider: string) => {
		setVisibleProviders((prev) => (prev.includes(provider) ? prev.filter((p) => p !== provider) : [...prev, provider]));
	};

	const averageScores = uniqueProviders.map((provider) => {
		const providerData = (progressData || ([] as ProgressData[])).filter((item) => item.testId.provider === provider);
		const averageScore = providerData.reduce((sum, entry) => sum + (entry.score ?? 0), 0) / providerData.length || 0;
		return { provider, averageScore };
	});

	const providerColours: { [key: string]: string } = {
		ACCA: "darkgoldenrod",
		AAT: "darkkhaki",
		ACA: "burlywood",
		CIMA: "darkolivegreen",
	};

	return (
		<Box>
			<Group justify="space-between" mb={20}>
				<Text>Daily progress</Text>
				<SegmentedControl
					value={limit.toString()}
					onChange={(value: string) => setLimit(Number(value))}
					data={[
						{ label: "Last 25 tests", value: "25" },
						{ label: "Last 50 tests", value: "50" },
					]}
				/>
			</Group>

			<BarChartLegend
				uniqueProviders={uniqueProviders}
				visibleProviders={visibleProviders}
				onProviderToggle={handleLegendClick}
				providerColours={providerColours}
			/>

			<Box style={{ width: "100%", height: 400, marginBottom: "2rem" }}>
				<ResponsiveContainer>
					<BarChart data={filteredData} margin={{ bottom: 80 }}>
						<XAxis
							axisLine={false}
							tickLine={false}
							dataKey={(entry) => `${entry.testId.provider} - ${entry.testId.title}`}
							angle={-30}
							textAnchor="end"
							interval={0}
							style={{ fontSize: "10px" }}
						/>
						<Tooltip cursor={false} content={<BarChartCustomTooltip />} />
						<Bar dataKey={(entry) => entry.score} stackId="provider">
							{filteredData.map((entry, index) => {
								const barColor = providerColours[entry.testId.provider] || "#8884d8";
								return (
									<Cell
										key={`cell-${index}`}
										fill={entry.score === 0 || entry.score === null ? "gray" : barColor}
										radius={[5, 5, 0, 0] as unknown as string | number}
									/>
								);
							})}
						</Bar>
					</BarChart>
				</ResponsiveContainer>
			</Box>

			<Text>Average scores</Text>
			<Box style={{ width: "100%", height: 300, marginBottom: "2rem" }}>
				<ResponsiveContainer>
					<LineChart data={averageScores} margin={{ left: 10, right: 10 }}>
						<XAxis dataKey="provider" padding={{ left: 10, right: 10 }} tickMargin={10} />
						<Line type="monotone" dataKey="averageScore" stroke="#8884d8" />
					</LineChart>
				</ResponsiveContainer>
			</Box>

			<Group>
				<HorizontalBarChart data={data1} title="Best average scores by provider" />
				<HorizontalBarChart data={data2} title="Best test times" />
				<HorizontalBarChart data={data3} title="Most wrong questions" />
			</Group>
		</Box>
	);
};
