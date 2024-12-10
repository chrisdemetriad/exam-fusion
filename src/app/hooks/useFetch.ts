import { useEffect, useState } from "react";
import { Question } from "../components/Questions";

export const useFetch = (url: string) => {
	const [data, setData] = useState<Question[]>([]);
	const [error, setError] = useState<string | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchData = async () => {
			setLoading(true);
			try {
				const res = await fetch(url);
				if (!res.ok) {
					throw new Error("Couldn't get the data");
				}
				const data = await res.json();
				setData(data);
			} catch (err) {
				setError((err as Error).message);
			} finally {
				setLoading(false);
			}
		};

		fetchData();
	}, [url]);

	return { data, error, loading };
};
