import { useEffect, useRef, useState } from "react";

type Sparkle = {
	id: number;
	x: number;
	y: number;
	emoji: string;
	size: number;
	rotate: number;
};

const sparkleEmojis = ["🩷"];

const HeartSparkles = () => {
	const [sparkles, setSparkles] = useState<Sparkle[]>([]);
	const nextId = useRef(0);
	const timeouts = useRef<number[]>([]);

	useEffect(() => {
		const handleMove = (event: MouseEvent) => {
			const sparkle: Sparkle = {
				id: nextId.current++,
				x: event.clientX,
				y: event.clientY,
				emoji: sparkleEmojis[Math.floor(Math.random() * sparkleEmojis.length)],
				size: 16 + Math.random() * 12,
				rotate: -15 + Math.random() * 30,
			};

			setSparkles((prev) => [...prev.slice(-24), sparkle]);

			const timeoutId = window.setTimeout(() => {
				setSparkles((prev) => prev.filter((item) => item.id !== sparkle.id));
			}, 900);

			timeouts.current.push(timeoutId);
		};

		window.addEventListener("mousemove", handleMove);
		return () => {
			window.removeEventListener("mousemove", handleMove);
			timeouts.current.forEach((timeoutId) => window.clearTimeout(timeoutId));
			timeouts.current = [];
		};
	}, []);

	return (
		<div className="pointer-events-none fixed inset-0 z-20">
			{sparkles.map((sparkle) => (
				<span
					key={sparkle.id}
					className="cursor-sparkle"
					style={{
						left: `${sparkle.x}px`,
						top: `${sparkle.y}px`,
						fontSize: `${sparkle.size}px`,
						["--sparkle-rotate" as string]: `${sparkle.rotate}deg`,
					}}
				>
					{sparkle.emoji}
				</span>
			))}
		</div>
	);
};

export default HeartSparkles;
