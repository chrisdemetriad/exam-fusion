"use client";

import { Badge, Center, Group, ScrollArea, Table, Text, TextInput, UnstyledButton, rem } from "@mantine/core";
import { IconChevronDown, IconChevronUp, IconSearch, IconSelector } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { type ReactNode, useEffect, useState } from "react";
import { useTestStore } from "@stores/stateStore";
import { PageLoader } from "@components/Loader";
import { useFetch } from "@hooks/useFetch";

export interface Tests {
	_id: string;
	provider: string;
	level: string;
	title: string;
	description: string;
}

interface TableHeader {
	children: ReactNode;
	reversed: boolean;
	sorted: boolean;
	onSort(): void;
}

const styles = {
	th: {
		padding: 0,
	},
	control: {
		width: "100%",
		padding: "var(--mantine-spacing-xs) var(--mantine-spacing-md)",
		cursor: "pointer",
		"&:hover": {
			backgroundColor: "var(--mantine-color-gray-0)",
		},
	},
	icon: {
		width: rem(21),
		height: rem(21),
	},
};

const TableHeader = ({ children, reversed, sorted, onSort }: TableHeader) => {
	const Icon = sorted ? (reversed ? IconChevronUp : IconChevronDown) : IconSelector;
	return (
		<Table.Th style={styles.th}>
			<UnstyledButton onClick={onSort} style={styles.control}>
				<Group justify="space-between">
					<Text fw={500} fz="sm">
						{children}
					</Text>
					<Center style={styles.icon}>
						<Icon style={{ width: rem(16), height: rem(16) }} stroke={1.5} />
					</Center>
				</Group>
			</UnstyledButton>
		</Table.Th>
	);
};

const filterData = (data: Tests[], search: string) => {
	const query = search.toLowerCase().trim();
	return data.filter((item) => Object.values(item).some((value) => value.toLowerCase().includes(query)));
};

const sortData = (data: Tests[], payload: { sortBy: keyof Tests | null; reversed: boolean; search: string }) => {
	const { sortBy } = payload;

	if (!sortBy) {
		return filterData(data, payload.search);
	}

	return filterData(
		[...data].sort((a, b) => {
			if (payload.reversed) {
				return b[sortBy].localeCompare(a[sortBy]);
			}
			return a[sortBy].localeCompare(b[sortBy]);
		}),
		payload.search
	);
};

export const Tests = () => {
	const [tests, setTests] = useState<Tests[]>([]);
	const [search, setSearch] = useState("");
	const [sortedData, setSortedData] = useState<Tests[]>([]);
	const [sortBy, setSortBy] = useState<keyof Tests | null>(null);
	const [reverseSortDirection, setReverseSortDirection] = useState(false);
	const baseUrl = useTestStore((state) => state.baseUrl);
	const setSelectedTest = useTestStore((state) => state.setCurrentTest);
	const router = useRouter();

	const { data, error, loading } = useFetch<Tests[]>(`${baseUrl}/api/v1/tests/all`);

	useEffect(() => {
		if (data) {
			setTests(data);
		}
	}, [data]);

	useEffect(() => {
		setSortedData(sortData(tests, { sortBy, reversed: reverseSortDirection, search }));
	}, [tests, sortBy, reverseSortDirection, search]);

	const setSorting = (field: keyof Tests) => {
		const reversed = field === sortBy ? !reverseSortDirection : false;
		setReverseSortDirection(reversed);
		setSortBy(field);
		setSortedData(sortData(tests, { sortBy: field, reversed, search }));
	};

	const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const { value } = event.currentTarget;
		setSearch(value);
		setSortedData(
			sortData(tests, {
				sortBy,
				reversed: reverseSortDirection,
				search: value,
			})
		);
	};

	const handleRowClick = (test: Tests) => {
		setSelectedTest(test);
		router.push(`/practice/${test.provider}/${test._id}`);
	};

	if (loading) {
		return <PageLoader />;
	}

	if (error) {
		return (
			<ScrollArea>
				<Text c="red">{error}.</Text>
			</ScrollArea>
		);
	}

	if (sortedData.length === 0) {
		return (
			<ScrollArea>
				<Text c="red">No tests available.</Text>
			</ScrollArea>
		);
	}

	const rows = sortedData.map((test) => (
		<Table.Tr key={test._id} onClick={() => handleRowClick(test)} style={{ cursor: "pointer" }}>
			<Table.Td>{test.provider}</Table.Td>
			<Table.Td>{test.title}</Table.Td>
			<Table.Td>{test.description}</Table.Td>
			<Table.Td>
				<Badge variant="outline" radius="xs">
					{test.level}
				</Badge>
			</Table.Td>
		</Table.Tr>
	));

	return (
		<ScrollArea>
			<TextInput
				placeholder="Search by any field"
				mb="md"
				leftSection={<IconSearch style={{ width: rem(16), height: rem(16) }} stroke={1} />}
				value={search}
				onChange={handleSearchChange}
			/>
			<Table horizontalSpacing="md" verticalSpacing="xs" miw={700} layout="fixed">
				<Table.Thead>
					<Table.Tr>
						<TableHeader
							sorted={sortBy === "provider"}
							reversed={reverseSortDirection}
							onSort={() => setSorting("provider")}
						>
							Provider
						</TableHeader>

						<TableHeader sorted={sortBy === "title"} reversed={reverseSortDirection} onSort={() => setSorting("title")}>
							Title
						</TableHeader>
						<TableHeader
							sorted={sortBy === "description"}
							reversed={reverseSortDirection}
							onSort={() => setSorting("description")}
						>
							Description
						</TableHeader>
						<TableHeader sorted={sortBy === "level"} reversed={reverseSortDirection} onSort={() => setSorting("level")}>
							Level
						</TableHeader>
					</Table.Tr>
				</Table.Thead>
				<Table.Tbody>{rows}</Table.Tbody>
			</Table>
		</ScrollArea>
	);
};
