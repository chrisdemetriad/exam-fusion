import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { Questions } from "@/app/components/Questions";
import { PageTitle } from "@/app/components/PageTitle";

export default async function PracticeRoute() {
	const session = await getServerSession();
	if (!session || !session.user) {
		redirect("/");
	}

	return (
		<>
			<PageTitle title="Practice" />
			<Questions />
		</>
	);
}
