import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { Tests } from "@/app/components/Tests";
import { PageTitle } from "@/app/components/PageTitle";

export default async function PracticeRoute() {
	const session = await getServerSession();
	if (!session || !session.user) {
		redirect("/");
	}

	return (
		<>
			<PageTitle title="Practice" />
			<Tests />
		</>
	);
}
