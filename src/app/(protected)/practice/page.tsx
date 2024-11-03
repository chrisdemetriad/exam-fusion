import { Questions } from "@/app/components/Questions";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function PracticeRoute(): Promise<JSX.Element> {
	const session = await getServerSession();
	if (!session || !session.user) {
		redirect("/");
	}

	return <Questions />;
}
