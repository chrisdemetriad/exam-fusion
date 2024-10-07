import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import type { ReactElement } from "react";

export default async function SigninRoute(): Promise<ReactElement> {
	const session = await getServerSession();
	if (!session || !session.user) {
		redirect("/api/auth/signin");
	}

	return redirect("/");
}
