import { useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import FloatingHearts from "@/components/FloatingHearts";
import LovePercentageCircle from "@/components/LovePercentageCircle";
import { generateLovePercentageFromNote, getLoveMessage } from "@/lib/love-utils";

const ViewLove = () => {
  const [searchParams] = useSearchParams();

  const yourName = searchParams.get("you") || "Someone";
  const theirName = searchParams.get("them") || "Someone";
  const feeling = searchParams.get("feeling") || "Love";
  const note = searchParams.get("note") || "";

  const percentage = generateLovePercentageFromNote(note, yourName, theirName);
  const message = getLoveMessage(percentage, feeling);


  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-8 relative overflow-hidden">
      <FloatingHearts count={30} />

      <motion.div
        className="relative z-10 w-full max-w-sm text-center"
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, type: "spring", stiffness: 100 }}
      >
        <motion.h1
          className="text-4xl font-romantic text-foreground mb-1"
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          {yourName}
        </motion.h1>

        <motion.span
          className="text-3xl block my-2"
          initial={{ scale: 0 }}
          animate={{ scale: [0, 1.5, 1] }}
          transition={{ delay: 0.8, duration: 0.5 }}
        >
          💕
        </motion.span>

        <motion.h1
          className="text-4xl font-romantic text-foreground mb-6"
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          {theirName}
        </motion.h1>

        <div className="flex justify-center my-6">
          <LovePercentageCircle percentage={percentage} size={180} />
        </div>

        <motion.div
          className="card-romantic mt-6"
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 2 }}
        >
          <p className="text-lg font-body text-foreground">{message}</p>
          {note && <p className="mt-3 text-sm font-body text-foreground italic">“{note}”</p>}
          <p className="text-sm text-muted-foreground font-body mt-2">
            Feeling: {feeling} ✨
          </p>
        </motion.div>

        <motion.p
          className="mt-8 text-xs text-muted-foreground font-body"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 3 }}
        >
          Made with 💖 on Love Express
        </motion.p>
      </motion.div>
    </div>
  );
};

export default ViewLove;
