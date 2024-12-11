import { Box, useMantineColorScheme } from "@mantine/core";
import { IconMoon, IconSun } from "@tabler/icons-react";
import type { FC } from "react";

export const ThemeToggle: FC = () => {
	const { colorScheme, toggleColorScheme } = useMantineColorScheme();
	const dark = colorScheme === "dark";

	return (
		<Box
			style={{ cursor: "pointer", display: "flex" }}
			onClick={() => toggleColorScheme()}
			color={dark ? "yellow" : "lightskyblue"}
		>
			{dark ? <IconSun size={18} /> : <IconMoon size={18} />}
		</Box>
	);
};
