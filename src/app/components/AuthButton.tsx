"use client";
import { Avatar, Button, Text } from "@mantine/core";
import type { Session } from "next-auth";
import { signOut, useSession } from "next-auth/react";
import { useTestStore } from "../stores/stateStore";

export default function AuthButton() {
	const { data: session } = useSession() as { data: Session | null };
	const openModal = useTestStore((state) => state.openModal);

	return session ? (
		<>
			<Text>{session.user?.name}</Text>
			{session.user?.image && <Avatar src={session.user.image} alt={session.user.name ?? "User image"} />}
			<Button onClick={() => signOut({ callbackUrl: "/" })} variant="default">
				Logout
			</Button>
		</>
	) : (
		<Button onClick={openModal} variant="default">
			Login
		</Button>
	);
}
