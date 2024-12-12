import { Box, rem, useMantineColorScheme } from "@mantine/core";
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
import { usePathname } from "next/navigation";
import Link from "next/link";

interface NavMenuItem {
	link: string;
	label: string;
	icon: TablerIcon;
	onClick?: () => void;
}

export function NavBar() {
	const pathname = usePathname();
	const { colorScheme } = useMantineColorScheme();
	const dark = colorScheme === "dark";

	const navMenuItems: NavMenuItem[] = [
		{ link: "/practice", label: "Practice", icon: IconBrain },
		{ link: "/progress", label: "Progress", icon: IconTrendingUp },
		{ link: "/leaderboards", label: "Leaderboards", icon: IconMilitaryRank },
		{ link: "/help", label: "Help", icon: IconInfoSquareRounded },
		{ link: "/settings", label: "Settings", icon: IconAdjustmentsHorizontal },
	];

	const logoutItem: NavMenuItem = {
		link: "/#",
		label: "Logout",
		icon: IconLogout,
		onClick: () => {
			signOut({ callbackUrl: "/" });
		},
	};

	const navItems = {
		display: "flex",
		alignItems: "center",
		textDecoration: "none",
		padding: rem(10),
		borderRadius: rem(5),
		fontWeight: 500,
		cursor: "pointer",
	};

	return (
		<Box style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
			<Box style={{ flex: 1 }}>
				{navMenuItems.map((item) => (
					<Link href={item.link} key={item.label} passHref>
						<Box
							style={{
								...navItems,
								color: pathname.startsWith(item.link) ? "#238be6" : "#495057",
								backgroundColor: pathname.startsWith(item.link) ? (dark ? "#3b4958" : "#eaf3fd") : "transparent",
							}}
						>
							<item.icon
								style={{
									color: pathname.startsWith(item.link) ? "#238be6" : "#868e96",
									marginRight: rem(16),
									width: rem(25),
									height: rem(25),
								}}
								stroke={1}
							/>
							<Box component="span">{item.label}</Box>
						</Box>
					</Link>
				))}
			</Box>
			<Box
				onClick={logoutItem.onClick}
				style={{
					...navItems,
					color: "#495057",
					backgroundColor: "transparent",
				}}
			>
				<logoutItem.icon
					style={{
						color: "#868e96",
						marginRight: rem(16),
						width: rem(25),
						height: rem(25),
					}}
					stroke={1}
				/>
				<Box component="span">{logoutItem.label}</Box>
			</Box>
		</Box>
	);
}
