import { motion } from "framer-motion";
import { Globe2, Gift, Heart } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import FloatingHearts from "@/components/FloatingHearts";
import { db } from "@/lib/firebase";
import {
  collection,
  doc,
  getCountFromServer,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
} from "firebase/firestore";

type ExpressionItem = {
  from: string;
  fromDisplay?: string | null;
  to: string;
  toDisplay?: string | null;
  feeling: string;
  note?: string | null;
  emoji: string;
  percentage?: number;
};

const feelingEmojis: Record<string, string> = {
  Love: "❤️",
  Like: "💙",
  Crush: "💘",
  Care: "💛",
  Admire: "⭐",
  Hug: "🤗",
  Kiss: "💋",
};

const Index = () => {
  const navigate = useNavigate();
  const [recentExpressions, setRecentExpressions] = useState<ExpressionItem[]>([]);
  const [loveCount, setLoveCount] = useState(0);
  const [giftCount, setGiftCount] = useState(0);

  useEffect(() => {
    const loadRecent = async () => {
      try {
        const expressionsQuery = query(
          collection(db, "loveExpressions"),
          orderBy("createdAt", "desc"),
          limit(8)
        );
        const snapshot = await getDocs(expressionsQuery);
        const entries = snapshot.docs.map((doc) => {
          const data = doc.data() as {
            from?: string;
            fromDisplay?: string | null;
            to?: string;
            toDisplay?: string | null;
            feeling?: string;
            note?: string | null;
            percentage?: number;
          };
          const feeling = data.feeling || "Love";
          return {
            from: data.from || "Someone",
            fromDisplay: data.fromDisplay || null,
            to: data.to || "Someone",
            toDisplay: data.toDisplay || null,
            feeling,
            note: data.note || null,
            percentage: data.percentage,
            emoji: feelingEmojis[feeling] || "❤️",
          };
        });

        setRecentExpressions(entries);

        const statsDoc = await getDoc(doc(db, "stats", "global"));
        if (statsDoc.exists()) {
          const stats = statsDoc.data() as { loveCount?: number; giftCount?: number };
          setLoveCount(stats.loveCount ?? 0);
          setGiftCount(stats.giftCount ?? 0);
        } else {
          const [loveCountSnapshot, giftCountSnapshot] = await Promise.all([
            getCountFromServer(collection(db, "loveExpressions")),
            getCountFromServer(collection(db, "gifts")),
          ]);

          setLoveCount(loveCountSnapshot.data().count);
          setGiftCount(giftCountSnapshot.data().count);
        }
      } catch (error) {
        console.warn("Failed to load recent expressions", error);
      }
    };

    void loadRecent();
  }, []);

  const stats = useMemo(
    () => [
      {
        icon: <Heart className="h-6 w-6 text-love" aria-hidden="true" />,
        count: loveCount.toLocaleString(),
        label: "Love Links Created",
      },
      {
        icon: <Gift className="h-6 w-6 text-love" aria-hidden="true" />,
        count: giftCount.toLocaleString(),
        label: "Gifts Sent",
      },
    ],
    [giftCount, loveCount]
  );

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-10 relative overflow-hidden">
      <FloatingHearts count={30} />
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-28 -left-20 h-56 w-56 rounded-full bg-love-orb blur-3xl opacity-60" />
        <div className="absolute top-1/3 -right-24 h-72 w-72 rounded-full bg-love-orb-alt blur-3xl opacity-60" />
        <div className="absolute bottom-10 left-1/4 h-48 w-48 rounded-full bg-love-orb blur-2xl opacity-60" />
      </div>

      <motion.div
        className="relative z-10 w-full max-w-md text-center"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        {/* Hero */}
        <motion.div
          className="mb-8"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, delay: 0.3 }}
        >
          <span className="text-7xl block mb-4 animate-pulse-heart">💖</span>
          <h1 className="text-5xl font-romantic text-foreground mb-2">
            Love Express
          </h1>
          <p className="text-muted-foreground font-body text-lg">
            Share your feelings, create a love link, and make their day.
          </p>
        </motion.div>

        {/* Options */}
        <div className="space-y-4 mt-8">
          <motion.button
            onClick={() => navigate("/love")}
            className="w-full card-romantic card-romantic-hover flex items-center gap-4 text-left transition-all duration-300 cursor-pointer group"
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <span className="text-4xl group-hover:animate-wiggle">
              <Heart className="h-9 w-9 text-love" aria-hidden="true" />
            </span>
            <div>
              <h2 className="text-xl font-romantic text-foreground">Send Love Percentage</h2>
              <p className="text-sm text-muted-foreground font-body">
                Write a love note and generate a sweet score
              </p>
            </div>
          </motion.button>

          <motion.button
            onClick={() => navigate("/gift")}
            className="w-full card-romantic card-romantic-hover flex items-center gap-4 text-left transition-all duration-300 cursor-pointer group"
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.8 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <span className="text-4xl group-hover:animate-wiggle">
              <Gift className="h-9 w-9 text-love" aria-hidden="true" />
            </span>
            <div>
              <h2 className="text-xl font-romantic text-foreground">Send Gift / Surprise</h2>
              <p className="text-sm text-muted-foreground font-body">
                Create a surprise link with a cute image
              </p>
            </div>
          </motion.button>
        </div>

        {/* Stats Section */}
        <motion.div
          className="mt-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
        >
          <h2 className="text-2xl font-romantic text-foreground mb-5 flex items-center gap-2">
            Spreading Love Worldwide
            <Globe2 className="h-5 w-5 text-foreground/80" aria-hidden="true" />
          </h2>
          <div className="grid grid-cols-2 gap-3">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                className="card-romantic card-romantic-hover py-4 px-2 text-center"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 1.2 + i * 0.15 }}
              >
                <div className="flex justify-center mb-1">{stat.icon}</div>
                <p className="text-lg font-bold font-romantic text-foreground">{stat.count}</p>
                <p className="text-[10px] text-muted-foreground font-body leading-tight">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Recent Love Expressions */}
        <motion.div
          className="mt-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.4 }}
        >
          <h2 className="text-2xl font-romantic text-foreground mb-4">
            Recent Love Expressions 💌
          </h2>
          <div className="space-y-2 max-h-64 overflow-y-auto pr-1 hide-scrollbar">
            {recentExpressions.length === 0 ? (
              <div className="card-romantic py-6 text-sm text-muted-foreground font-body">
                No love expressions yet. Be the first to share one! 💌
              </div>
            ) : (
              recentExpressions.map((expr, i) => (
                <motion.div
                  key={`${expr.from}-${expr.to}-${i}`}
                  className="card-romantic card-romantic-hover py-3 px-4 flex items-center justify-between"
                  initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.6 + i * 0.1 }}
                >
                  <div className="flex flex-col gap-2 text-sm font-body">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-foreground">
                        {expr.fromDisplay || expr.from}
                      </span>
                      <span className="text-muted-foreground">💕</span>
                      <span className="font-semibold text-foreground">
                        {expr.toDisplay || expr.to}
                      </span>
                    </div>
                    {expr.note && (
                      <p className="text-xs text-muted-foreground italic">“{expr.note}”</p>
                    )}
                  </div>
                  <span className="text-xs bg-secondary text-muted-foreground px-2 py-1 rounded-full font-body">
                    {expr.feeling}
                  </span>
                </motion.div>
              ))
            )}
          </div>
        </motion.div>

        {/* Footer */}
        <motion.p
          className="mt-8 text-sm text-muted-foreground font-body"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.6 }}
        >
         Love Express — Simple and Made for Everyone.
        </motion.p>
      </motion.div>
    </div>
  );
};

export default Index;
