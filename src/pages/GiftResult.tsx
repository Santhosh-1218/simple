import { useSearchParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import FloatingHearts from "@/components/FloatingHearts";
import { createShareableLink, getWhatsAppShareUrl } from "@/lib/love-utils";
import { db } from "@/lib/firebase";
import { addDoc, collection, doc, getDoc, increment, serverTimestamp, setDoc } from "firebase/firestore";
import chocolateIcon from "@/assets/chocolate.png";

const giftIcons: Record<string, string> = {
  Love: "https://cdn-icons-png.flaticon.com/128/1405/1405110.png",
  Rose: "https://cdn-icons-png.flaticon.com/128/14761/14761548.png",
  Hug: "https://cdn-icons-png.flaticon.com/128/16695/16695102.png",
  Kiss: "https://cdn-icons-png.flaticon.com/128/13726/13726431.png",
  Chocolate: chocolateIcon,
  Teddy: "https://cdn-icons-png.flaticon.com/128/332/332921.png",
};

const GiftResult = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [giftId, setGiftId] = useState<string | null>(null);

  const fromName = searchParams.get("from") || "Someone";
  const toName = searchParams.get("to") || "Someone";
  const type = searchParams.get("type") || "Love";
  const msg = searchParams.get("msg") || "";
  const img = searchParams.get("img") || "";

  const iconUrl = giftIcons[type] || giftIcons.Love;

  const shareLink = useMemo(() => {
    if (giftId) {
      return createShareableLink("/view/gift", { id: giftId });
    }
    return createShareableLink("/view/gift", {
      from: fromName,
      to: toName,
      type,
      ...(msg && { msg }),
      ...(img && { img }),
    });
  }, [fromName, giftId, img, msg, toName, type]);

  const shareText = `🎁 ${fromName} sent a special ${type} surprise to ${toName}! Open it:`;

  useEffect(() => {
    const dedupeKey = `gift-${fromName}-${toName}-${type}-${msg}-${img}`;
    const storedId = sessionStorage.getItem(`giftId:${dedupeKey}`);
    if (storedId) {
      setGiftId(storedId);
      return;
    }
    if (sessionStorage.getItem(dedupeKey)) return;
    sessionStorage.setItem(dedupeKey, "1");

    const saveGift = async () => {
      try {
        const docRef = await addDoc(collection(db, "gifts"), {
          from: fromName,
          to: toName,
          type,
          message: msg,
          imgUrl: img,
          createdAt: serverTimestamp(),
        });
        await setDoc(
          doc(db, "stats", "global"),
          { giftCount: increment(1) },
          { merge: true }
        );
        setGiftId(docRef.id);
        sessionStorage.setItem(`giftId:${dedupeKey}`, docRef.id);
        setSaveError("");
      } catch (error) {
        console.warn("Failed to save gift", error);
        setSaveError("Saving failed. Check Firestore rules and try again.");
        sessionStorage.removeItem(dedupeKey);
        sessionStorage.removeItem(`giftId:${dedupeKey}`);
      }
    };

    void saveGift();
  }, [fromName, img, msg, toName, type]);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(shareLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-8 relative overflow-hidden">
      <FloatingHearts count={20} />

      <motion.div
        className="relative z-10 w-full max-w-md text-center"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, type: "spring" }}
      >
        <motion.div
          className="mb-4 flex items-center justify-center"
          animate={{ scale: [1, 1.15, 1], rotate: [0, 6, -6, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <img
            src={iconUrl}
            alt={type}
            className="h-20 w-20 drop-shadow"
            loading="lazy"
          />
        </motion.div>

        <h1 className="text-3xl font-romantic text-foreground mb-2">
          Surprise Created!
        </h1>

        <p className="text-muted-foreground font-body mb-6">
          A special <span className="text-primary font-semibold">{type}</span> from{" "}
          <span className="font-semibold">{fromName}</span> to{" "}
          <span className="font-semibold">{toName}</span>
        </p>

        {msg && (
          <motion.div
            className="card-romantic mb-6"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <p className="text-foreground font-body italic">"{msg}"</p>
          </motion.div>
        )}

        {img && (
          <motion.div
            className="card-romantic mb-6"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <img
              src={img}
              alt="Gift preview"
              className="w-full rounded-xl border border-border object-cover"
              loading="lazy"
            />
          </motion.div>
        )}

        <motion.div
          className="space-y-3"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          {saveError && (
            <p className="text-xs font-body text-destructive">{saveError}</p>
          )}
          <p className="text-sm font-body text-muted-foreground mb-3">
            Send this link to {toName} 💕
          </p>

          <button onClick={handleCopy} className="w-full btn-love" disabled={!giftId}>
            {giftId ? (copied ? "Copied! " : "Copy Link ") : "Generating Link..."}
          </button>

          <a
            href={getWhatsAppShareUrl(shareText, shareLink)}
            target="_blank"
            rel="noopener noreferrer"
            className={`block w-full btn-outline-love text-center ${
              giftId ? "" : "pointer-events-none opacity-60"
            }`}
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

export default GiftResult;
