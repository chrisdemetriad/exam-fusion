import { PageTitle } from "@/app/components/PageTitle";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function SettingsRoute(): Promise<JSX.Element> {
	const session = await getServerSession();
	if (!session || !session.user) {
		redirect("/");
	}

	return <PageTitle title="Settings" />;
}
