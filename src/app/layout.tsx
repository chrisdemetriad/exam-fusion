import {
	Box,
	ColorSchemeScript,
	Flex,
	MantineProvider,
	rem,
} from "@mantine/core";
import "@mantine/core/styles.css";
import type { Metadata } from "next";
import localFont from "next/font/local";
import type React from "react";
import "./globals.css";
// import '@mantine/dates/styles.css';
import { getServerSession } from "next-auth";
import Header from "./components/Header";
import { Navbar } from "./components/NavBar";
import SessionProvider from "./components/SessionProvider";

const geistSans = localFont({
	src: "./fonts/GeistVF.woff",
	variable: "--font-geist-sans",
	weight: "100 900",
});
const geistMono = localFont({
	src: "./fonts/GeistMonoVF.woff",
	variable: "--font-geist-mono",
	weight: "100 900",
});

export const metadata: Metadata = {
	title: "Exam Fusion",
	description:
		"Exam Practice Hub offers a comprehensive collection of practice questions to help students prepare for their exams. Enhance your knowledge, test your skills, and achieve academic success with our expertly curated questions and detailed explanations.",
};

export default async function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const session = await getServerSession();
	return (
		<html lang="en">
			<head>
				<ColorSchemeScript />
				<title>{metadata.title?.toString() ?? "Exam Fusion"}</title>
				<meta
					name="description"
					content={metadata.description ?? "Default Description"}
				/>
			</head>
			<body className={`${geistSans.variable} ${geistMono.variable}`}>
				<MantineProvider>
					<SessionProvider session={session}>
						<Flex direction="column" style={{ height: "100vh" }}>
							<Box style={{ flex: "0 0 56px" }}>
								<Header />
							</Box>
							<Flex style={{ flex: "1 1 auto", overflow: "hidden" }}>
								{session ? <Navbar /> : null}
								<main style={{ flex: 1, overflow: "auto", padding: rem(16) }}>
									{children}
								</main>
							</Flex>
						</Flex>
					</SessionProvider>
				</MantineProvider>
			</body>
		</html>
	);
}
