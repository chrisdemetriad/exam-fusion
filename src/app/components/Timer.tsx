import { useEffect, useState } from "react";
import { useTestStore } from "@stores/stateStore";

const Timer = () => {
	const [localTime, setLocalTime] = useState(0);
	const setDuration = useTestStore((state) => state.setDuration);

	useEffect(() => {
		const timer = setInterval(() => {
			setLocalTime((prev) => prev + 1);
		}, 1000);

		return () => clearInterval(timer);
	}, []);

	useEffect(() => {
		setDuration(localTime);
	}, [localTime, setDuration]);

	const minutes = Math.floor(localTime / 60);
	const seconds = localTime % 60;

	return (
		<>
			{minutes}:{seconds < 10 ? `0${seconds}` : seconds}
		</>
	);
};

export default Timer;
