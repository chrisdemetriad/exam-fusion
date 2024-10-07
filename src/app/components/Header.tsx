"use client";
import { Avatar, Button, Container, Group, Text } from "@mantine/core";
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
					justifyContent: "end",
					alignItems: "center",
				}}
			>
				<Group>
					<AuthButton />
				</Group>
			</Container>
		</header>
	);
}
