import type { FC } from "react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Cell, LabelList } from "recharts";
import { Box, Text } from "@mantine/core";

const colors = ["#457AA6", "#A2BBD2", "#E3EBF2", "#264F73", "#1A334A"];

const getColor = (index: number) => colors[index % colors.length];

interface Props {
	data: { name: string; value: number }[];
	title: string;
}

export const HorizontalBarChart: FC<Props> = ({ data, title }) => {
	return (
		<Box style={{ flex: 1, margin: "10px" }}>
			<Text size="md" mb="sm">
				{title}
			</Text>
			<ResponsiveContainer width="100%" height={50 * data.length}>
				<BarChart data={data} layout="vertical" margin={{ left: 0 }}>
					<XAxis hide type="number" />
					<YAxis dataKey="name" type="category" axisLine={false} tickLine={false} width={80} />
					<Bar dataKey="value" barSize={20} radius={[10, 10, 10, 10]}>
						{data.map((entry, index) => (
							<Cell key={`cell-${index}`} fill={getColor(index)} />
						))}
						<LabelList dataKey="value" position="insideLeft" style={{ fill: "#fff", fontSize: "12px" }} />
					</Bar>
				</BarChart>
			</ResponsiveContainer>
		</Box>
	);
};
