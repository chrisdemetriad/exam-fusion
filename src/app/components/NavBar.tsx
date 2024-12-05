"use client";

import { Box, rem } from "@mantine/core";
import {
	IconAdjustmentsHorizontal,
	IconBrain,
	IconInfoSquareRounded,
	IconLogout,
	IconMilitaryRank,
	IconTrendingUp,
	type TablerIcon,
} from "@tabler/icons-react";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const BASE_ROUTE = {
	display: "flex",
	alignItems: "center",
	textDecoration: "none",
	fontSize: rem(14),
	padding: rem(10),
	borderRadius: rem(5),
	fontWeight: 500,
	cursor: "pointer",
};

const ACTIVE_ROUTE = {
	...BASE_ROUTE,
	color: "#238be6",
	backgroundColor: "#eaf3fd",
};

const INACTIVE_ROUTE = {
	...BASE_ROUTE,
	color: "#495057",
	backgroundColor: "transparent",
};

const menuItemStyles = (active: boolean) => ({
	color: active ? "#238be6" : "#868e96",
	marginRight: rem(16),
	width: rem(25),
	height: rem(25),
});

interface NavMenuItem {
	link: string;
	label: string;
	icon: TablerIcon;
}

const navMenuItems: NavMenuItem[] = [
	{ link: "/practice", label: "Practice", icon: IconBrain },
	{ link: "/progress", label: "Progress", icon: IconTrendingUp },
	{ link: "/leaderboards", label: "Leaderboards", icon: IconMilitaryRank },
	{ link: "/help", label: "Help", icon: IconInfoSquareRounded },
	{ link: "/settings", label: "Settings", icon: IconAdjustmentsHorizontal },
];

export function Navbar() {
	const pathname = usePathname();

	const links = navMenuItems.map((item) => (
		<Link href={item.link} key={item.label} passHref>
			<Box style={pathname === item.link ? ACTIVE_ROUTE : INACTIVE_ROUTE}>
				<item.icon style={menuItemStyles(pathname === item.link)} stroke={1} />
				<Box component="span">{item.label}</Box>
			</Box>
		</Link>
	));

	return (
		<nav
			style={{
				width: rem(250),
				padding: rem(16),
				display: "flex",
				flexDirection: "column",
				borderRight: `${rem(1)} solid #dee2e6`,
			}}
		>
			<Box style={{ flex: 1 }}>{links}</Box>

			<Box
				style={{
					paddingTop: rem(16),
					marginTop: rem(16),
					borderTop: `${rem(1)} solid #dee2e6`,
				}}
			>
				<Box onClick={() => signOut({ callbackUrl: "/" })} style={INACTIVE_ROUTE}>
					<IconLogout style={menuItemStyles(false)} stroke={1} />
					<span>Logout</span>
				</Box>
			</Box>
		</nav>
	);
}
