import { Box } from "@mantine/core";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function LeaderboardsRoute(): Promise<JSX.Element> {
	const session = await getServerSession();
	if (!session || !session.user) {
		redirect("/");
	}

	return <Box>Leaderboards</Box>;
}
