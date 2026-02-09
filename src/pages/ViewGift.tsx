import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import GiftAnimation from "@/components/GiftAnimation";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import chocolateIcon from "@/assets/chocolate.png";

const ViewGift = () => {
  const [searchParams] = useSearchParams();

  const giftId = searchParams.get("id") || "";
  const [giftData, setGiftData] = useState<{
    from: string;
    to: string;
    type: string;
    message?: string;
    imgUrl?: string;
  } | null>(null);
  const [loading, setLoading] = useState(Boolean(giftId));
  const [opened, setOpened] = useState(false);

  const fromName = searchParams.get("from") || "Someone";
  const toName = searchParams.get("to") || "Someone";
  const type = searchParams.get("type") || "Love";
  const msg = searchParams.get("msg") || "";
  const img = searchParams.get("img") || "";

  const giftIcons: Record<string, string> = {
    Love: "https://cdn-icons-png.flaticon.com/128/1405/1405110.png",
    Rose: "https://cdn-icons-png.flaticon.com/128/14761/14761548.png",
    Hug: "https://cdn-icons-png.flaticon.com/128/16695/16695102.png",
    Kiss: "https://cdn-icons-png.flaticon.com/128/13726/13726431.png",
    Chocolate: chocolateIcon,
    Teddy: "https://cdn-icons-png.flaticon.com/128/332/332921.png",
  };

  useEffect(() => {
    if (!giftId) return;

    const loadGift = async () => {
      try {
        const snapshot = await getDoc(doc(db, "gifts", giftId));
        if (snapshot.exists()) {
          const data = snapshot.data() as {
            from?: string;
            to?: string;
            type?: string;
            message?: string;
            imgUrl?: string;
          };
          setGiftData({
            from: data.from || "Someone",
            to: data.to || "Someone",
            type: data.type || "Love",
            message: data.message || "",
            imgUrl: data.imgUrl || "",
          });
        }
      } catch (error) {
        console.warn("Failed to load gift", error);
      } finally {
        setLoading(false);
      }
    };

    void loadGift();
  }, [giftId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-muted-foreground font-body">
        Loading gift...
      </div>
    );
  }

  const resolvedType = giftData?.type || type;
  const resolvedFrom = giftData?.from || fromName;
  const resolvedTo = giftData?.to || toName;
  const resolvedMessage = giftData?.message || msg || undefined;
  const resolvedImage = giftData?.imgUrl || img || undefined;
  const iconUrl = giftIcons[resolvedType] || giftIcons.Love;

  if (!opened) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="card-romantic w-full max-w-sm text-center">
          <img
            src={iconUrl}
            alt={resolvedType}
            className="mx-auto h-20 w-20 drop-shadow mb-3"
            loading="lazy"
          />
          <p className="text-xl font-romantic text-foreground mb-1">
            Click to open
          </p>
          <p className="text-sm text-muted-foreground font-body">
            {resolvedFrom} ❤ {resolvedTo}
          </p>
          <button
            className="w-full btn-love mt-4"
            onClick={() => setOpened(true)}
          >
            Open Gift
          </button>
        </div>
      </div>
    );
  }

  return (
    <GiftAnimation
      type={resolvedType}
      senderName={resolvedFrom}
      receiverName={resolvedTo}
      message={resolvedMessage}
      imageUrl={resolvedImage}
      reveal
    />
  );
};

export default ViewGift;
