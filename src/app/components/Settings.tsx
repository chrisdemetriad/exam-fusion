import { Box, Group, rem, Switch, Text } from "@mantine/core";
import type { FC } from "react";

const data = [
	{ title: "Progress", description: "Show a percentage progress bar during a test." },
	{ title: "Timer", description: "Show a timer during a test." },
	{ title: "AI assistant", description: "Enable AI during a test to re-formulate questions." },
	{ title: "Tips", description: "Show modal with tips after logging in." },
];

export const Settings: FC = () => {
	return (
		<Box>
			{data.map((item, index) => (
				<Group
					justify="space-between"
					style={{
						paddingTop: index === 0 ? 0 : rem(15),
						marginTop: index === 0 ? 0 : rem(15),
						borderTop: index === 0 ? "none" : "1px solid var(--app-shell-border-color)",
					}}
					key={item.title}
				>
					<Box>
						<Text>{item.title}</Text>
						<Text size="xs" c="dimmed">
							{item.description}
						</Text>
					</Box>
					<Switch
						onLabel="ON"
						offLabel="OFF"
						style={{
							"*": {
								cursor: "pointer !important",
							},
						}}
						size="lg"
					/>
				</Group>
			))}
		</Box>
	);
};
