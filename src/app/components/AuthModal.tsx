import { Modal, Button, rem } from "@mantine/core";
import { signIn } from "next-auth/react";
import { useTestStore } from "../stores/stateStore";

export default function AuthModal() {
	const closeModal = useTestStore((state) => state.closeModal);
	const modalOpen = useTestStore((state) => state.modalOpen);
	return (
		<Modal opened={modalOpen} onClose={closeModal} title="Sign in">
			<Button
				fullWidth
				onClick={() => signIn("github", { callbackUrl: "/practice" })}
				variant="default"
				style={{ marginBottom: rem(10) }}
			>
				Sign in with GitHub
			</Button>
			<Button
				fullWidth
				onClick={() => signIn("google", { callbackUrl: "/practice" })}
				variant="default"
			>
				Sign in with Google
			</Button>
		</Modal>
	);
}
