import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { Questions } from "@/app/components/Questions";

export default async function PracticeRoute() {
	const session = await getServerSession();
	if (!session || !session.user) {
		redirect("/");
	}

	return <Questions />;
}
