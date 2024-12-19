import { Group, Button } from "@mantine/core";
import { FC } from "react";

interface Props {
	uniqueProviders: string[];
	visibleProviders: string[];
	onProviderToggle: (provider: string) => void;
	providerColours: { [key: string]: string };
}

export const BarChartLegend: FC<Props> = ({ uniqueProviders, visibleProviders, onProviderToggle, providerColours }) => (
	<Group justify="center" mb="xl">
		{uniqueProviders.map((provider) => (
			<Button
				key={provider}
				size="xs"
				variant={visibleProviders.includes(provider) ? "filled" : "outline"}
				style={{
					backgroundColor: visibleProviders.includes(provider) ? providerColours[provider] : undefined,
					color: visibleProviders.includes(provider) ? "#fff" : providerColours[provider] || "#000",
					borderColor: providerColours[provider] || "#000",
				}}
				onClick={() => onProviderToggle(provider)}
			>
				{provider}
			</Button>
		))}
	</Group>
);
