import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { Tests } from "@/app/components/Tests";

export default async function PracticeRoute() {
	const session = await getServerSession();
	if (!session || !session.user) {
		redirect("/");
	}

	return <Tests />;
}
