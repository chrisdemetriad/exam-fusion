import { PageTitle } from "@/app/components/PageTitle";
import { Tests } from "@/app/components/Tests";
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
			<Tests />
		</>
	);
}
