import { createTheme, rem } from "@mantine/core";

export const theme = createTheme({
	fontFamily: "Mulish, sans-serif",
	fontSizes: {
		xs: rem(12),
		sm: rem(14),
		md: rem(16),
		lg: rem(18),
		xl: rem(20),
	},
	headings: {
		sizes: {
			h1: {
				fontWeight: "700",
				fontSize: rem(32),
				lineHeight: "1.4",
			},
		},
	},
	colors: {
		primary: [
			"#e3f2fd",
			"#bbdefb",
			"#90caf9",
			"#64b5f6",
			"#42a5f5",
			"#2196f3",
			"#1e88e5",
			"#1976d2",
			"#1565c0",
			"#0d47a1",
		],
	},
	primaryColor: "primary",
});
