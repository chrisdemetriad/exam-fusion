"use client";

import Image from "next/image";
import { Box, Button, Text } from "@mantine/core";
import type { Session } from "next-auth";
import { useSession } from "next-auth/react";
import { useTestStore } from "@stores/stateStore";

export default function AuthButton() {
	const { data: session } = useSession() as { data: Session | null };
	const openAuthModal = useTestStore((state) => state.openAuthModal);

	return session ? (
		<>
			<Text>{session.user?.name}</Text>
			{session.user?.image && (
				<Box style={{ width: 38, height: 38, borderRadius: "50%", overflow: "hidden" }}>
					<Image src={session.user.image} alt={session.user.name ?? "User image"} width={38} height={38} priority />
				</Box>
			)}
		</>
	) : (
		<Button onClick={openAuthModal}>Login</Button>
	);
}
