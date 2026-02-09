import { cubicBezier, motion } from "framer-motion";
import FloatingHearts from "@/components/FloatingHearts";
import chocolateIcon from "@/assets/chocolate.png";

const giftIcons: Record<string, string> = {
  Love: "https://cdn-icons-png.flaticon.com/128/1405/1405110.png",
  Rose: "https://cdn-icons-png.flaticon.com/128/14761/14761548.png",
  Hug: "https://cdn-icons-png.flaticon.com/128/16695/16695102.png",
  Kiss: "https://cdn-icons-png.flaticon.com/128/13726/13726431.png",
  Chocolate: chocolateIcon,
  Teddy: "https://cdn-icons-png.flaticon.com/128/332/332921.png",
};

interface GiftAnimationProps {
  type: string;
  senderName: string;
  receiverName: string;
  message?: string;
  imageUrl?: string;
  reveal?: boolean;
}

const GiftAnimation = ({ type, senderName, receiverName, message, imageUrl, reveal }: GiftAnimationProps) => {
  const iconUrl = giftIcons[type] || giftIcons.Love;
  const revealProps = reveal
    ? {
        initial: { clipPath: "inset(100% 0 0 0)" },
        animate: { clipPath: "inset(0% 0 0 0)" },
        transition: {
          duration: 0.9,
          type: "tween" as const,
          ease: cubicBezier(0.25, 0.46, 0.45, 0.94),
        },
      }
    : {};

  return (
    <motion.div
      className="fixed inset-0 flex items-center justify-center bg-background z-50 overflow-hidden"
      {...revealProps}
    >
      <FloatingHearts count={24} />

      {/* Center content */}
      <motion.div
        className="relative z-10 text-center px-6 max-w-sm"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 150, delay: 0.5 }}
      >
        <motion.div
          className="mb-3 flex items-center justify-center"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <img
            src={iconUrl}
            alt={type}
            className="h-20 w-20 drop-shadow"
            loading="lazy"
          />
        </motion.div>

        <p className="text-xl font-romantic text-foreground mb-2">
          <span className="text-primary font-semibold">{senderName}</span> ❤{" "}
          <span className="text-primary font-semibold">{receiverName}</span>
        </p>

        <h1 className="text-3xl font-romantic text-foreground mb-3">
          A Special {type} For You!
        </h1>

        {message && (
          <motion.div
            className="card-romantic mt-4"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1.2 }}
          >
            <p className="text-foreground font-body italic">"{message}"</p>
          </motion.div>
        )}

        {imageUrl && (
          <motion.div
            className="card-romantic mt-4"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1.3 }}
          >
            <img
              src={imageUrl}
              alt="Gift"
              className="w-full rounded-xl border border-border object-cover"
              loading="lazy"
            />
          </motion.div>
        )}

        <motion.p
          className="mt-6 text-sm text-muted-foreground font-body"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
        >
          Made with 💖
        </motion.p>
      </motion.div>
    </motion.div>
  );
};

export default GiftAnimation;
