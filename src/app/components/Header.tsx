"use client";
import {
	Avatar,
	Box,
	Button,
	Container,
	Group,
	Text,
	rem,
} from "@mantine/core";
import type { Session } from "next-auth";
import { signIn, signOut, useSession } from "next-auth/react";

function AuthButton() {
	const { data: session } = useSession() as { data: Session | null };

	return session ? (
		<>
			<Text>{session.user?.name}</Text>
			{session.user?.image && (
				<Avatar
					src={session.user.image}
					alt={session.user.name ?? "User image"}
				/>
			)}
			<Button onClick={() => signOut({ callbackUrl: "/" })} variant="default">
				Logout
			</Button>
		</>
	) : (
		<Button
			onClick={() => signIn("github", { callbackUrl: "/practice" })}
			variant="default"
		>
			Login
		</Button>
	);
}

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
		</header>
	);
}
