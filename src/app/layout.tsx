import { ColorSchemeScript, MantineProvider } from "@mantine/core";
import "@mantine/core/styles.css";
import type { Metadata } from "next";
import { Comfortaa, Mulish } from "next/font/google";
import type React from "react";
import "./globals.css";
// import '@mantine/dates/styles.css';
import { getServerSession } from "next-auth";
import SessionProvider from "./components/SessionProvider";
import MainLayout from "./components/MainLayout";

const comfortaa = Comfortaa({
	weight: ["400", "700"],
	subsets: ["latin"],
	variable: "--font-comfortaa",
	display: "swap",
});

const mulish = Mulish({
	weight: ["300", "400", "600", "700"],
	subsets: ["latin"],
	variable: "--font-mulish",
	display: "swap",
});

export const metadata: Metadata = {
	title: "ExamFusion",
	description:
		"ExamFusion offers a comprehensive collection of practice questions to help students prepare for their exams. Enhance your knowledge, test your skills and achieve academic success with our expertly curated questions and detailed explanations.",
};

export default async function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const session = await getServerSession();

	return (
		<html lang="en" className={`${comfortaa.variable} ${mulish.variable}`}>
			<head>
				<ColorSchemeScript />
				<title>{metadata.title?.toString() || "ExamFusion"}</title>
				<meta name="description" content={metadata.description || "Practice questions for accountants"} />
			</head>
			<body>
				<MantineProvider>
					<SessionProvider session={session}>
						<MainLayout children={children} />
					</SessionProvider>
				</MantineProvider>
			</body>
		</html>
	);
}
