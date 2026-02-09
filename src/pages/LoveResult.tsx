import { useSearchParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import FloatingHearts from "@/components/FloatingHearts";
import LovePercentageCircle from "@/components/LovePercentageCircle";
import {
  generateLovePercentageFromNote,
  getLoveMessage,
  createShareableLink,
  getWhatsAppShareUrl,
} from "@/lib/love-utils";
import { db } from "@/lib/firebase";
import { addDoc, collection, doc, increment, serverTimestamp, setDoc } from "firebase/firestore";

const LoveResult = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);
  const [saveError, setSaveError] = useState("");

  const yourName = searchParams.get("you") || "Someone";
  const theirName = searchParams.get("them") || "Someone";
  const feeling = searchParams.get("feeling") || "Love";
  const note = searchParams.get("note") || "";

  const percentage = generateLovePercentageFromNote(note, yourName, theirName);
  const message = getLoveMessage(percentage, feeling);

  const shareLink = createShareableLink("/view/love", {
    you: yourName,
    them: theirName,
    feeling,
    note,
  });

  const shareText = `💖 ${yourName} & ${theirName} - Love Percentage: ${percentage}%! Open the love note:`;

  useEffect(() => {
    const saveExpression = async () => {
      try {
        await addDoc(collection(db, "loveExpressions"), {
          from: yourName,
          to: theirName,
          feeling,
          percentage,
          note,
          createdAt: serverTimestamp(),
        });
        await setDoc(
          doc(db, "stats", "global"),
          { loveCount: increment(1) },
          { merge: true }
        );
        setSaveError("");
      } catch (error) {
        console.warn("Failed to save love expression", error);
        setSaveError("Saving failed. Check Firestore rules and try again.");
        sessionStorage.removeItem(dedupeKey);
      }
    };

    if (!note.trim()) return;

    const dedupeKey = `love-${yourName}-${theirName}-${feeling}-${note}`;
    if (sessionStorage.getItem(dedupeKey)) return;
    sessionStorage.setItem(dedupeKey, "1");

    void saveExpression();
  }, [feeling, note, percentage, theirName, yourName]);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(shareLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-8 relative overflow-hidden">
      <FloatingHearts count={25} />

      <motion.div
        className="relative z-10 w-full max-w-md text-center"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, type: "spring" }}
      >
        <h1 className="text-3xl font-romantic text-foreground mb-2">
          {yourName}.. ❤️ {theirName}..
        </h1>

        <div className="flex justify-center my-8">
          <LovePercentageCircle percentage={percentage} />
        </div>

        <motion.div
          className="card-romantic mb-6"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <p className="text-lg font-body text-foreground">{message}</p>
          <p className="mt-3 text-sm font-body text-foreground italic">“{note}”</p>
          <p className="text-sm text-muted-foreground font-body mt-2">
            Feeling: {feeling} ✨
          </p>
          {saveError && (
            <p className="mt-3 text-xs font-body text-destructive">{saveError}</p>
          )}
        </motion.div>

        {/* Share Buttons */}
        <motion.div
          className="space-y-3"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1.5 }}
        >
          <p className="text-sm font-body text-muted-foreground mb-3">
            Send the link to your special someone 💕
          </p>

          <button onClick={handleCopy} className="w-full btn-love">
            {copied ? "Copied! " : "Copy Link "}
          </button>

          <a
            href={getWhatsAppShareUrl(shareText, shareLink)}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full btn-outline-love text-center"
          >
            Share on WhatsApp 
          </a>

          <button
            onClick={() => navigate("/")}
            className="w-full text-sm text-muted-foreground font-body mt-4 hover:text-foreground transition-colors"
          >
            ← Create Another
          </button>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default LoveResult;
