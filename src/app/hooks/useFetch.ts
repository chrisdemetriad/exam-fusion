import { useEffect, useState } from "react";

export const useFetch = <T = unknown>(url: string) => {
	const [data, setData] = useState<T | null>(null);
	const [error, setError] = useState<string | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchData = async () => {
			setLoading(true);
			try {
				const response = await fetch(url);
				if (response.status === 204) {
					setData(null);
					return;
				}
				if (!response.ok) {
					throw new Error(`Couldn't fetch the data: ${response.statusText}`);
				}
				const data = (await response.json()) as T;

				setData(data);
			} catch (error) {
				setError((error as Error).message);
			} finally {
				setLoading(false);
			}
		};

		fetchData();
	}, [url]);

	return { data, error, loading };
};
