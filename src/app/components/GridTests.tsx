"use client";

import { SimpleGrid, Text, UnstyledButton, useMantineTheme } from "@mantine/core";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useTestStore } from "@stores/stateStore";
import { PageLoader } from "@components/Loader";
import { useFetch } from "@hooks/useFetch";
import { TestData } from "@components/Tests";

export const GridTests = () => {
	const [tests, setTests] = useState<TestData[]>([]);
	const baseUrl = useTestStore((state) => state.baseUrl);
	const setSelectedTest = useTestStore((state) => state.setCurrentTest);
	const router = useRouter();
	const theme = useMantineTheme();

	const { data, error, loading } = useFetch<TestData[]>(`${baseUrl}/api/v1/tests/all`);

	useEffect(() => {
		if (data) {
			setTests(data);
		}
	}, [data]);

	const handleTestClick = (test: TestData) => {
		setSelectedTest(test);
		router.push(`/practice/${test.provider}/${test._id}`);
	};

	if (loading) {
		return <PageLoader />;
	}
	if (error) {
		return <Text c="red">{error}.</Text>;
	}
	if (tests.length === 0) {
		return <Text c="red">Could not find any tests.</Text>;
	}

	return (
		<>
			<SimpleGrid cols={4} mt="md">
				{tests.map((test) => (
					<UnstyledButton
						key={test._id}
						onClick={() => handleTestClick(test)}
						style={{
							display: "flex",
							flexDirection: "column",
							alignItems: "center",
							justifyContent: "center",
							padding: theme.spacing.md,
							borderRadius: theme.radius.md,
							border: "1px solid var(--app-shell-border-color)",
							cursor: "pointer",
						}}
					>
						<Text size="sm">{test.title}</Text>
						<Text size="xs" c="dimmed" mt={5}>
							{test.description}
						</Text>
					</UnstyledButton>
				))}
			</SimpleGrid>
		</>
	);
};
