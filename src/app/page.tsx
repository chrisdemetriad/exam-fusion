"use client";

import { Box, Button, Container, Group, List, Text, ThemeIcon, Title, rem } from "@mantine/core";
import { IconCheck } from "@tabler/icons-react";
import type { Session } from "next-auth";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useTestStore } from "@stores/stateStore";
import { GridTests } from "@components/GridTests";
import { PageTitle } from "@components/PageTitle";

export default function Home() {
	const { data: session } = useSession() as { data: Session | null };
	const openAuthModal = useTestStore((state) => state.openAuthModal);
	return !session ? (
		<Container size="md">
			<Box
				style={{
					display: "flex",
					justifyContent: "space-between",
					paddingTop: rem(120),
				}}
			>
				<Box
					style={{
						maxWidth: rem(480),
						marginRight: rem(80),
					}}
				>
					<Title
						style={{
							color: "light-dark(var(--mantine-color-black), var(--mantine-color-white))",
							fontFamily: "Mulish, sans-serif",
							fontSize: rem(44),
							lineHeight: 1.2,
							fontWeight: 900,
							"@media (maxWidth: 480px)": {
								fontSize: rem(28),
							},
						}}
					>
						Your{" "}
						<Box
							component="span"
							style={{
								position: "relative",
								backgroundColor: "var(--mantine-color-blue-light)",
								borderRadius: "var(--mantine-radius-sm)",
								padding: `${rem(4)} ${rem(12)}`,
							}}
						>
							free
						</Box>
						<br /> practice tests
					</Title>
					<Text c="dimmed" mt="md">
						Our platform offers a comprehensive set of practice tests designed to help you excel in your studies. With a
						user-friendly interface and diverse question sets, you can practice anytime, anywhere.
					</Text>

					<List
						mt={30}
						spacing="sm"
						size="sm"
						icon={
							<ThemeIcon size={20} radius="xl">
								<IconCheck style={{ width: rem(12), height: rem(12) }} stroke={1.5} />
							</ThemeIcon>
						}
					>
						<List.Item>
							<b>Accessible Anytime</b> – take practice tests at your convenience, without the constraints of location
							or time.
						</List.Item>
						<List.Item>
							<b>Diverse Question Sets</b> – access a wide variety of questions across multiple subjects and difficulty
							levels.
						</List.Item>
						<List.Item>
							<b>Instant Feedback</b> – receive immediate results and performance analytics to help identify strengths
							and weaknesses.
						</List.Item>
					</List>

					<Group mt={30}>
						<Button onClick={openAuthModal} size="md" style={{ flex: 1 }}>
							Get started
						</Button>
					</Group>
				</Box>
				<Image
					alt="Studying group (pngwing.com)"
					src="/images/tree.png"
					width="400"
					height="500"
					style={{
						width: rem(400),
						height: rem(500),
					}}
				/>
			</Box>
		</Container>
	) : (
		<>
			<PageTitle title="Tests" />
			<GridTests />
		</>
	);
}
