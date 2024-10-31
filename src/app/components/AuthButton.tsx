"use client";
import { Avatar, Button, Modal, Text, rem } from "@mantine/core";
import type { Session } from "next-auth";
import { signIn, signOut, useSession } from "next-auth/react";
import { useState } from "react";

export default function AuthButton() {
	const { data: session } = useSession() as { data: Session | null };
	const [opened, setOpened] = useState(false);

	const openModal = () => setOpened(true);
	const closeModal = () => setOpened(false);

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
		<>
			<Button onClick={openModal} variant="default">
				Login
			</Button>
			<Modal opened={opened} onClose={closeModal} title="Sign in">
				<Button
					fullWidth
					onClick={() => signIn("github", { callbackUrl: "/practice" })}
					variant="default"
					style={{ marginBottom: rem(10) }}
				>
					Sign in with GitHub
				</Button>
				<Button
					fullWidth
					onClick={() => signIn("google", { callbackUrl: "/practice" })}
					variant="default"
				>
					Sign in with Google
				</Button>
			</Modal>
		</>
	);
}
