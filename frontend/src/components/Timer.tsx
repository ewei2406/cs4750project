import { useEffect, useState } from "react";

const Timer = ({ disabled = false }: { disabled?: boolean }) => {
	const [seconds, setSeconds] = useState(0);

	useEffect(() => {
		const startTime = new Date().getTime();
		if (disabled) return;

		const interval = setInterval(() => {
			const currentTime = new Date().getTime();
			const elapsed = Math.floor((currentTime - startTime) / 10) / 100;
			setSeconds(elapsed);
		}, 100);

		return () => clearInterval(interval);
	}, [disabled]);

	return (
		<div style={{ fontFamily: "monospace" }}>t: {seconds.toFixed(1)}s</div>
	);
};

export default Timer;
