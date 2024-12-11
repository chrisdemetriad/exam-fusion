"use client";

import { AppShell, Box, Burger, Group, rem } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useSession } from "next-auth/react";
import Header from "./Header";
import { Navbar } from "./NavBar";

export default function MainLayout({ children }: { children: React.ReactNode }) {
	const { data: session } = useSession();
	const [mobileOpened, { toggle: toggleMobile }] = useDisclosure();
	const [desktopOpened, { toggle: toggleDesktop }] = useDisclosure(true);

	return (
		<AppShell
			header={{ height: 60 }}
			navbar={{
				width: 240,
				breakpoint: "sm",
				collapsed: { mobile: !mobileOpened, desktop: !desktopOpened },
			}}
			padding="md"
		>
			<AppShell.Header
				style={{
					display: "flex",
					alignItems: "center",
					justifyContent: "space-between",
					padding: rem(16),
				}}
			>
				<Group h="100%" style={{ flexShrink: 0 }}>
					<Burger opened={mobileOpened} onClick={toggleMobile} hiddenFrom="sm" size="sm" />
					<Burger opened={desktopOpened} onClick={toggleDesktop} visibleFrom="sm" size="sm" />
				</Group>
				<Box style={{ width: "100%" }}>
					<Header />
				</Box>
			</AppShell.Header>
			{session && (
				<AppShell.Navbar p="md">
					<Navbar />
				</AppShell.Navbar>
			)}
			<AppShell.Main>
				<Box style={{ flex: 1, overflow: "auto" }}>{children}</Box>
			</AppShell.Main>
		</AppShell>
	);
}
