"use client";
import { Box, Container, Group, Text, rem } from "@mantine/core";
import UserAuth from "@components/UserAuth";
import UserAuthModal from "@components/UserAuthModal";
import { ThemeToggle } from "./ThemeToggle";

export default function Header() {
	return (
		<>
			<Container
				size="xxl"
				style={{
					display: "flex",
					justifyContent: "space-between",
					alignItems: "center",
				}}
			>
				<Box>
					<Text
						size="xl"
						style={{
							fontFamily: "var(--font-comfortaa)",
							textTransform: "uppercase",
							letterSpacing: rem(1),
							color: "darkorchid",
						}}
					>
						<Box component="span">Exam</Box>
						<Box component="span" style={{ color: "blueviolet" }}>
							Fusion
						</Box>
					</Text>
				</Box>
				<Group>
					<UserAuth />
					<ThemeToggle />
				</Group>
			</Container>
			<UserAuthModal />
		</>
	);
}
