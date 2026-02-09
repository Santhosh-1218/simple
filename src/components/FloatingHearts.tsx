import { useEffect, useState } from "react";

interface Heart {
  id: number;
  x: number;
  delay: number;
  size: number;
  emoji: string;
  drift: number;
}

const emojis = ["🥰", "❤️", "💕", "😍", "😘"];

const FloatingHearts = ({ count = 20 }: { count?: number }) => {
  const [hearts, setHearts] = useState<Heart[]>([]);

  useEffect(() => {
    const generated: Heart[] = Array.from({ length: count }, (_, i) => ({
      id: i,
      x:
        Math.random() < 0.4
          ? Math.random() * 12 + (Math.random() < 0.5 ? 0 : 88)
          : Math.random() * 100,
      delay: Math.random() * 6,
      size: 14 + Math.random() * 20,
      emoji: emojis[Math.floor(Math.random() * emojis.length)],
      drift: -20 + Math.random() * 40,
    }));
    setHearts(generated);
  }, [count]);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {hearts.map((heart) => (
        <span
          key={heart.id}
          className="absolute animate-float-up-sway"
          style={{
            left: `${heart.x}%`,
            bottom: "-10%",
            animationDelay: `${heart.delay}s`,
            animationDuration: `${8 + Math.random() * 8}s`,
            fontSize: `${heart.size}px`,
            animationIterationCount: "infinite",
            filter: "drop-shadow(0 0 10px hsl(350 90% 85% / 0.9))",
            ["--heart-drift" as string]: `${heart.drift}px`,
          }}
        >
          {heart.emoji}
        </span>
      ))}
    </div>
  );
};

export default FloatingHearts;
