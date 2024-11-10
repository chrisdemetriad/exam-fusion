"use client";

import { useEffect, useState } from "react";
import {
	Table,
	ScrollArea,
	UnstyledButton,
	Group,
	Text,
	Center,
	TextInput,
	rem,
	Badge,
} from "@mantine/core";
import {
	IconSelector,
	IconChevronDown,
	IconChevronUp,
	IconSearch,
} from "@tabler/icons-react";
import { useRouter } from "next/navigation";

const baseUrl = process.env.NEXT_PUBLIC_API_URL;

interface TestData {
	_id: string;
	provider: string;
	level: string;
	title: string;
	description: string;
}

interface ThProps {
	children: React.ReactNode;
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

const TableHeader = ({ children, reversed, sorted, onSort }: ThProps) => {
	const Icon = sorted
		? reversed
			? IconChevronUp
			: IconChevronDown
		: IconSelector;
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

const filterData = (data: TestData[], search: string) => {
	const query = search.toLowerCase().trim();
	return data.filter((item) =>
		Object.values(item).some((value) => value.toLowerCase().includes(query)),
	);
};

const sortData = (
	data: TestData[],
	payload: { sortBy: keyof TestData | null; reversed: boolean; search: string },
) => {
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
		payload.search,
	);
};

export const Tests = () => {
	const [tests, setTests] = useState<TestData[]>([]);
	const [search, setSearch] = useState("");
	const [sortedData, setSortedData] = useState<TestData[]>([]);
	const [sortBy, setSortBy] = useState<keyof TestData | null>(null);
	const [reverseSortDirection, setReverseSortDirection] = useState(false);

	const router = useRouter();

	useEffect(() => {
		const fetchTests = async () => {
			try {
				const response = await fetch(`${baseUrl}/api/v1/tests`);
				const data = await response.json();
				setTests(data);
				setSortedData(data);
			} catch (error) {
				console.error("Couldn't get tests: ", error);
			}
		};

		fetchTests();
	}, []);

	const setSorting = (field: keyof TestData) => {
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
			}),
		);
	};

	const handleRowClick = (provider, id) => {
		router.push(`/practice/${provider}/${id}`);
	};

	const rows = sortedData.map((test) => (
		<Table.Tr
			key={test._id}
			onClick={() => handleRowClick(test.provider, test._id)}
			style={{ cursor: "pointer" }}
		>
			<Table.Td>{test.provider}</Table.Td>
			<Table.Td>
				<Badge variant="outline" radius="sm">
					{test.level}
				</Badge>
			</Table.Td>

			<Table.Td>{test.title}</Table.Td>
			<Table.Td>{test.description}</Table.Td>
		</Table.Tr>
	));

	return (
		<ScrollArea>
			<TextInput
				placeholder="Search by any field"
				mb="md"
				leftSection={
					<IconSearch
						style={{ width: rem(16), height: rem(16) }}
						stroke={1.5}
					/>
				}
				value={search}
				onChange={handleSearchChange}
			/>
			<Table
				horizontalSpacing="md"
				verticalSpacing="xs"
				miw={700}
				layout="fixed"
			>
				<Table.Thead>
					<Table.Tr>
						<TableHeader
							sorted={sortBy === "provider"}
							reversed={reverseSortDirection}
							onSort={() => setSorting("provider")}
						>
							Provider
						</TableHeader>
						<TableHeader
							sorted={sortBy === "level"}
							reversed={reverseSortDirection}
							onSort={() => setSorting("level")}
						>
							Level
						</TableHeader>
						<TableHeader
							sorted={sortBy === "title"}
							reversed={reverseSortDirection}
							onSort={() => setSorting("title")}
						>
							Title
						</TableHeader>
						<TableHeader
							sorted={sortBy === "description"}
							reversed={reverseSortDirection}
							onSort={() => setSorting("description")}
						>
							Description
						</TableHeader>
					</Table.Tr>
				</Table.Thead>
				<Table.Tbody>
					{rows.length > 0 ? (
						rows
					) : (
						<Table.Tr>
							<Table.Td colSpan={4}>
								<Text fw={500} ta="center">
									Nothing found
								</Text>
							</Table.Td>
						</Table.Tr>
					)}
				</Table.Tbody>
			</Table>
		</ScrollArea>
	);
};
