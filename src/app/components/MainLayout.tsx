"use client";

import { AppShell, Box, Burger, Group, rem } from "@mantine/core";
import { useSession } from "next-auth/react";
import Header from "@components/Header";
import { NavBar } from "@components/NavBar";
import { useTestStore } from "@stores/stateStore";

export default function MainLayout({ children }: { children: React.ReactNode }) {
	const { data: session } = useSession();
	const navbarOpen = useTestStore((state) => state.navbarOpen);
	const toggleNavbar = useTestStore((state) => state.toggleNavbar);

	return (
		<AppShell
			header={{ height: 60 }}
			navbar={{
				width: 240,
				breakpoint: "sm",
				collapsed: { desktop: !navbarOpen },
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
				{session && (
					<Group h="100%" style={{ flexShrink: 0 }}>
						<Burger opened={navbarOpen} onClick={toggleNavbar} size="sm" />
					</Group>
				)}
				<Box style={{ width: "100%" }}>
					<Header />
				</Box>
			</AppShell.Header>
			{session && (
				<AppShell.Navbar p="md">
					<NavBar />
				</AppShell.Navbar>
			)}
			<AppShell.Main>
				<Box style={{ flex: 1, overflow: "auto" }}>{children}</Box>
			</AppShell.Main>
		</AppShell>
	);
}
