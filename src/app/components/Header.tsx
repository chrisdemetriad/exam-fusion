"use client";
import { Box, Container, Group, Text, rem } from "@mantine/core";
import UserAuth from "./UserAuth";
import UserAuthModal from "./UserAuthModal";

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
						Exam
						<Box component="span" style={{ color: "blueviolet" }}>
							Fusion
						</Box>
					</Text>
				</Box>
				<Group>
					<UserAuth />
				</Group>
			</Container>
			<UserAuthModal />
		</>
	);
}
