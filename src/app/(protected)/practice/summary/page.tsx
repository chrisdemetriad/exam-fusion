import { Summary } from "@/app/components/Summary";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function SummaryRoute(): Promise<JSX.Element> {
	const session = await getServerSession();
	if (!session || !session.user) {
		redirect("/");
	}

	return <Summary />;
}
