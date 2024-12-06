"use client";

import { Text, Box } from "@mantine/core";
import type { Session } from "next-auth";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { Bar, BarChart, Cell, Legend, ResponsiveContainer, Tooltip, XAxis, LineChart, Line, LabelList } from "recharts";
import { useTestStore } from "../stores/stateStore";
import { CustomTooltip } from "./Charts/CustomTooltip";

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

interface CustomLegendPayload {
	id?: string;
	value: any;
	type: string;
	color: string;
}

export const Progress = () => {
	const [progressData, setProgressData] = useState<ProgressData[]>([]);
	const [visibleProviders, setVisibleProviders] = useState<string[]>([]);
	const [providerColors, setProviderColors] = useState<Record<string, string>>({});
	const baseUrl = useTestStore((state) => state.baseUrl);
	const colors = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#ffcc00", "#00c49f"];

	const { data: session } = useSession() as { data: Session | null };
	const userEmail = session?.user?.email;

	useEffect(() => {
		const fetchProgress = async () => {
			try {
				const response = await fetch(`${baseUrl}/api/v1/tests/progress/${userEmail}`);

				if (response.status === 204) {
					console.log("No progress data found for this user");
					setProgressData([]);
					setVisibleProviders([]);
					return;
				}

				const data: ProgressData[] = await response.json();

				const uniqueProviders = Array.from(new Set(data.map((item) => item.testId.provider)));
				const providerColorMap = uniqueProviders.reduce(
					(acc, provider, index) => {
						acc[provider] = colors[index % colors.length];
						return acc;
					},
					{} as Record<string, string>
				);

				setProviderColors(providerColorMap);
				setVisibleProviders(uniqueProviders);
				setProgressData(data);
			} catch (error) {
				console.error("Error fetching progress data:", error);
			}
		};
		fetchProgress();
	}, [userEmail]);

	const filteredData = progressData.filter((item) => visibleProviders.includes(item.testId.provider));

	if (progressData.length === 0) {
		return (
			<Text c="dimmed">
				No progress data available for you yet. Start doing some tests first in order to see your progress here!
			</Text>
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
			<Text>Daily progress</Text>
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
						{/* <CartesianGrid strokeDasharray="3 3" /> */}
						<XAxis dataKey="provider" padding={{ left: 10, right: 10 }} tickMargin={10} />
						{/* <YAxis /> */}
						<Tooltip />
						<Line type="monotone" dataKey="averageScore" stroke="#8884d8" />
					</LineChart>
				</ResponsiveContainer>
			</Box>
		</Box>
	);
};
