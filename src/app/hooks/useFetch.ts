import { useEffect, useState } from "react";

export const useFetch = <T = unknown>(url: string) => {
	const [data, setData] = useState<T | null>(null);
	const [error, setError] = useState<string | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchData = async () => {
			setLoading(true);
			try {
				const res = await fetch(url);
				if (!res.ok) {
					throw new Error(`Couldn't get the data ${res.statusText}`);
				}
				const data = (await res.json()) as T;

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
