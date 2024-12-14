import { Progress } from "@mantine/core";

interface ProgressBarProps {
	question: number;
	total: number;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ question, total }) => {
	const progress = ((question - 1) / total) * 100;

	return (
		<Progress.Root size="xl">
			<Progress.Section value={progress}>
				<Progress.Label>{`${Math.round(progress)}% complete`}</Progress.Label>
			</Progress.Section>
		</Progress.Root>
	);
};
