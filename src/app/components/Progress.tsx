"use client";

import { useState, useEffect } from "react";
import { CustomTooltip } from "./Charts/CustomTooltip";
import {
	BarChart,
	Bar,
	XAxis,
	Tooltip,
	Legend,
	ResponsiveContainer,
	Cell,
	LabelList,
} from "recharts";
import { useSession } from "next-auth/react";
import type { Session } from "next-auth";

const baseUrl = process.env.NEXT_PUBLIC_API_URL;

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
	const [progressData, setProgressData] = useState<ProgressData[]>([]);
	const [visibleProviders, setVisibleProviders] = useState<string[]>([]);
	const [providerColors, setProviderColors] = useState<Record<string, string>>(
		{},
	);

	const colors = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042"];

	const { data: session } = useSession() as { data: Session | null };
	const userEmail = session?.user?.email;

	useEffect(() => {
		const fetchProgress = async () => {
			try {
				const response = await fetch(
					`${baseUrl}/api/v1/tests/progress/${userEmail}`,
				);
				const data: ProgressData[] = await response.json();

				const uniqueProviders = Array.from(
					new Set(data.map((item) => item.testId.provider)),
				);
				const providerColorMap = uniqueProviders.reduce(
					(acc, provider, index) => {
						acc[provider] = colors[index % colors.length];
						return acc;
					},
					{} as Record<string, string>,
				);

				setProviderColors(providerColorMap);
				setVisibleProviders(uniqueProviders);
				setProgressData(data);
			} catch (error) {
				console.error("Error fetching progress data:", error);
			}
		};
		fetchProgress();
	}, []);

	const filteredData = progressData.filter((item) =>
		visibleProviders.includes(item.testId.provider),
	);
	console.log(filteredData);
	const handleLegendClick = (provider: string) => {
		setVisibleProviders((prev) =>
			prev.includes(provider)
				? prev.filter((p) => p !== provider)
				: [...prev, provider],
		);
	};

	const labelFormatter = (label: string) => {
		return label.length > 20 ? `${label.substring(0, 17)}...` : label;
	};

	return (
		<div style={{ width: "100%", height: 500 }}>
			<ResponsiveContainer>
				<BarChart data={filteredData} margin={{ bottom: 80 }}>
					<XAxis
						dataKey={(item: ProgressData) =>
							`${item.testId.provider} - ${item.testId.title}`
						}
						angle={-30}
						textAnchor="end"
						interval={0}
						style={{ fontSize: "10px" }}
						tickFormatter={labelFormatter}
					/>
					<Tooltip content={<CustomTooltip />} />
					{Object.keys(providerColors).map((provider) => (
						<Bar
							key={provider}
							dataKey={(entry: ProgressData) =>
								entry.testId.provider === provider ? entry.score : null
							}
							fill={providerColors[provider]}
							stackId="provider"
						>
							{filteredData.map((entry, index) => (
								<Cell
									key={`cell-${index}`}
									fill={
										entry.testId.provider === provider &&
										(entry.score === 0 || entry.score === null)
											? "red"
											: providerColors[provider]
									}
								/>
							))}
							<LabelList
								dataKey={(entry: ProgressData) => entry.testId.provider}
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
							color: visibleProviders.includes(provider)
								? providerColors[provider]
								: "#d3d3d3",
						}))}
						onClick={(e: { id: string }) => handleLegendClick(e.id)}
					/>
				</BarChart>
			</ResponsiveContainer>
		</div>
	);
};
