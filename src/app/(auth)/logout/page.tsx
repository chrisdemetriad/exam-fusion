import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import type { ReactElement } from "react";

export default async function LogoutRoute(): Promise<ReactElement> {
	const session = await getServerSession();
	if (session) {
		redirect("/api/auth/signout");
	}

	return redirect("/");
}
