import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import FloatingHearts from "@/components/FloatingHearts";

const feelings = ["Love", "Like", "Crush", "Care", "Admire"];
const feelingEmojis: Record<string, string> = {
  Love: "❤️",
  Like: "💙",
  Crush: "💘",
  Care: "💛",
  Admire: "⭐",
};

const experiencePoints = [
  { emoji: "💫", label: "Name Compatibility" },
  { emoji: "🔤", label: "Letter Match Score" },
  { emoji: "🌙", label: "Zodiac Vibes" },
  { emoji: "🎯", label: "Feeling Intensity" },
  { emoji: "✨", label: "Destiny Factor" },
  { emoji: "💎", label: "Soul Connection" },
];

const LoveForm = () => {
  const navigate = useNavigate();
  const [yourName, setYourName] = useState("");
  const [theirName, setTheirName] = useState("");
  const [feeling, setFeeling] = useState("Love");
  const [note, setNote] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!yourName.trim() || !theirName.trim() || !note.trim()) return;
    const params = new URLSearchParams({
      you: yourName.trim(),
      them: theirName.trim(),
      feeling,
      note: note.trim(),
    });
    navigate(`/love-result?${params.toString()}`);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-8 relative overflow-hidden">
      <FloatingHearts count={10} />

      <motion.div
        className="relative z-10 w-full max-w-md"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <button
          onClick={() => navigate("/")}
          className="mb-6 text-muted-foreground font-body text-sm hover:text-foreground transition-colors"
        >
          ← Back
        </button>

        <div className="text-center mb-8">
          <motion.span
            className="text-5xl block mb-3"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
          >
            ❤️
          </motion.span>
          <h1 className="text-4xl font-romantic text-foreground">Love Percentage</h1>
          <p className="text-muted-foreground font-body mt-2">
            Write your feelings to unlock a love score.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="card-romantic space-y-5">
          <div>
            <label className="block text-sm font-body font-semibold text-foreground mb-2">
              Boy Name 💕
            </label>
            <input
              type="text"
              value={yourName}
              onChange={(e) => setYourName(e.target.value)}
              placeholder="Enter boy name"
              className="w-full px-4 py-3 rounded-xl bg-secondary border border-border font-body text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-body font-semibold text-foreground mb-2">
              Girl Name 💗
            </label>
            <input
              type="text"
              value={theirName}
              onChange={(e) => setTheirName(e.target.value)}
              placeholder="Enter girl name"
              className="w-full px-4 py-3 rounded-xl bg-secondary border border-border font-body text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-body font-semibold text-foreground mb-3">
              Your Feeling ✨
            </label>
            <div className="flex flex-wrap gap-2">
              {feelings.map((f) => (
                <button
                  key={f}
                  type="button"
                  onClick={() => setFeeling(f)}
                  className={`px-4 py-2 rounded-full font-body text-sm font-medium transition-all duration-200 ${
                    feeling === f
                      ? "bg-love-gradient text-primary-foreground shadow-love scale-105"
                      : "bg-secondary text-secondary-foreground hover:bg-muted"
                  }`}
                >
                  {feelingEmojis[f]} {f}
                </button>
              ))}
            </div>
          </div>

          {/* Love Experience Points */}
          <div>
            <label className="block text-sm font-body font-semibold text-foreground mb-2">
              Your Love Note 💌
            </label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Write a few sweet lines..."
              rows={4}
              className="w-full px-4 py-3 rounded-xl bg-secondary border border-border font-body text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all resize-none"
              required
            />
           
          </div>

          <div>
            <label className="block text-sm font-body font-semibold text-foreground mb-3">
              Love Experience Factors 💖
            </label>
            <div className="grid grid-cols-2 gap-2">
              {experiencePoints.map((point, i) => (
                <motion.div
                  key={point.label}
                  className="flex items-center gap-2 bg-secondary rounded-lg px-3 py-2 text-xs font-body text-foreground"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                >
                  <span className="text-base">{point.emoji}</span>
                  <span>{point.label}</span>
                </motion.div>
              ))}
            </div>
            <p className="text-[10px] text-muted-foreground font-body mt-2 text-center">
              All factors are used to calculate your love percentage ✨
            </p>
          </div>

          <button type="submit" className="w-full btn-love text-lg mt-4">
            Calculate Love 💖
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default LoveForm;
