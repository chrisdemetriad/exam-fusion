import { Button, Modal, rem } from "@mantine/core";
import { signIn } from "next-auth/react";
import { useTestStore } from "@stores/stateStore";

export default function UserAuthModal() {
	const closeAuthModal = useTestStore((state) => state.closeAuthModal);
	const authModalOpen = useTestStore((state) => state.authModalOpen);
	return (
		<Modal opened={authModalOpen} onClose={closeAuthModal} title="Sign in">
			<Button
				fullWidth
				onClick={() => signIn("github", { callbackUrl: "/practice" })}
				variant="default"
				style={{ marginBottom: rem(10) }}
			>
				Sign in with GitHub
			</Button>
			<Button fullWidth onClick={() => signIn("google", { callbackUrl: "/practice" })} variant="default">
				Sign in with Google
			</Button>
		</Modal>
	);
}
