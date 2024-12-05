import { PageTitle } from "@/app/components/PageTitle";
import { Questions } from "@/app/components/Questions";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

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
