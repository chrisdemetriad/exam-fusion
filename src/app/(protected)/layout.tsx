import { Box } from "@mantine/core";

export default function ProtectedLayout({
	children,
}: {
	children: React.ReactNode;
}): JSX.Element {
	return <Box>{children}</Box>;
}
