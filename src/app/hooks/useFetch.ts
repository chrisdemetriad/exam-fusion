import { useEffect, useState } from "react";

export const useFetch = <T = unknown>(url: string) => {
	const [data, setData] = useState<T | null>(null);
	const [error, setError] = useState<string | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchData = async () => {
			setLoading(true);
			try {
				const respose = await fetch(url);
				if (!respose.ok) {
					throw new Error(`Couldn't fetch the data ${respose.statusText}`);
				}
				const data = (await respose.json()) as T;

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
