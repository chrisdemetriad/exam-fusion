"use client";
import { Box, Container, Group, Text, rem } from "@mantine/core";
import AuthButton from "./AuthButton";
import AuthModal from "./AuthModal";

export default function Header() {
	return (
		<header
			style={{
				height: "56px",
				backgroundColor: "#fff",
				borderBottom: "1px solid #dee2e6",
			}}
		>
			<Container
				size="xxl"
				style={{
					height: "56px",
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
					<AuthButton />
				</Group>
			</Container>
			<AuthModal />
		</header>
	);
}
