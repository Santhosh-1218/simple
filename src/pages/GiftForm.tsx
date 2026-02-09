import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import FloatingHearts from "@/components/FloatingHearts";
import chocolateIcon from "@/assets/chocolate.png";

const giftTypes = [
  { label: "Love", iconUrl: "https://cdn-icons-png.flaticon.com/128/1405/1405110.png" },
  { label: "Rose", iconUrl: "https://cdn-icons-png.flaticon.com/128/14761/14761548.png" },
  { label: "Hug", iconUrl: "https://cdn-icons-png.flaticon.com/128/16695/16695102.png" },
  { label: "Kiss", iconUrl: "https://cdn-icons-png.flaticon.com/128/13726/13726431.png" },
  { label: "Chocolate", iconUrl: chocolateIcon },
  { label: "Teddy", iconUrl: "https://cdn-icons-png.flaticon.com/128/332/332921.png" },
];

const GiftForm = () => {
  const navigate = useNavigate();
  const [yourName, setYourName] = useState("");
  const [theirName, setTheirName] = useState("");
  const [giftType, setGiftType] = useState(giftTypes[0].label);
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!yourName.trim() || !theirName.trim()) return;
    const params = new URLSearchParams({
      from: yourName.trim(),
      to: theirName.trim(),
      type: giftType,
      ...(message.trim() && { msg: message.trim() }),
    });
    navigate(`/gift-result?${params.toString()}`);
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
          <span className="text-5xl block mb-3 animate-pulse-heart">🎁</span>
          <h1 className="text-4xl font-romantic text-foreground">Send a Surprise</h1>
          <p className="text-muted-foreground font-body mt-2">Create a magical gift link!</p>
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
              Gift Type 🎀
            </label>
            <div className="grid grid-cols-3 gap-2">
              {giftTypes.map((g) => (
                <button
                  key={g.label}
                  type="button"
                  onClick={() => setGiftType(g.label)}
                  className={`px-3 py-2.5 rounded-xl font-body text-sm font-medium transition-all duration-200 flex flex-col items-center gap-1 ${
                    giftType === g.label
                      ? "bg-love-gradient text-primary-foreground shadow-love scale-105"
                      : "bg-secondary text-secondary-foreground hover:bg-muted"
                  }`}
                >
                  <img
                    src={g.iconUrl}
                    alt={g.label}
                    className="h-7 w-7"
                    loading="lazy"
                  />
                  {g.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-body font-semibold text-foreground mb-2">
              Message (Optional) 💌
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Write a sweet message..."
              rows={3}
              className="w-full px-4 py-3 rounded-xl bg-secondary border border-border font-body text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all resize-none"
            />
          </div>

          <button type="submit" className="w-full btn-love text-lg mt-4">
            Create Surprise 🎁
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default GiftForm;
