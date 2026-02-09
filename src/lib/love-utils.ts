export const generateLovePercentage = (name1: string, name2: string): number => {
  const combined = (name1 + name2).toLowerCase().trim();
  let hash = 0;
  for (let i = 0; i < combined.length; i++) {
    const char = combined.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash % 61) + 40; // 40-100 range for positivity
};

const loveKeywords = [
  "love",
  "forever",
  "always",
  "heart",
  "soul",
  "kiss",
  "hug",
  "miss",
  "smile",
  "dream",
  "star",
  "sweet",
  "dear",
  "beloved",
  "angel",
  "spark",
];

export const generateLovePercentageFromNote = (
  note: string,
  name1: string,
  name2: string
): number => {
  const cleaned = note.toLowerCase().replace(/[^a-z\s]/g, " ");
  const words = cleaned.split(/\s+/).filter(Boolean);
  const keywordHits = words.reduce((count, word) => {
    return loveKeywords.includes(word) ? count + 1 : count;
  }, 0);

  const lengthScore = Math.min(10, Math.floor(cleaned.replace(/\s+/g, "").length / 18));
  const keywordScore = Math.min(5, keywordHits);
  const nameBoost = (name1.trim().length + name2.trim().length) % 2;
  const score = 80 + lengthScore + keywordScore + nameBoost;

  return Math.min(95, Math.max(80, score));
};

export const getLoveMessage = (percentage: number, feeling: string): string => {
  if (feeling === "Crush") {
    if (percentage >= 80) return "Your feelings are magical! Something beautiful is brewing ✨";
    if (percentage >= 60) return "Your feelings are honest and beautiful 💕";
    return "Take it slow—good things grow naturally 🌱";
  }
  if (feeling === "Care") {
    if (percentage >= 80) return "Your care runs deep and true 💛";
    if (percentage >= 60) return "What a beautiful connection you share 🌸";
    return "Every little care makes a big difference 🤗";
  }
  if (feeling === "Admire") {
    if (percentage >= 80) return "Your admiration shines like stars ⭐";
    if (percentage >= 60) return "True admiration is a rare gift 💎";
    return "Admiration is the beginning of something wonderful ✨";
  }
  // Love or Like
  if (percentage >= 90) return "You two are made for each other! 💖";
  if (percentage >= 75) return "Love is in the air! Your bond is strong 💕";
  if (percentage >= 60) return "A beautiful connection is blossoming 🌹";
  return "Every love story starts somewhere beautiful 💗";
};

export const createShareableLink = (baseUrl: string, params: Record<string, string>): string => {
  const url = new URL(baseUrl, window.location.origin);
  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.set(key, value);
  });
  return url.toString();
};

export const getWhatsAppShareUrl = (text: string, link: string): string => {
  return `https://wa.me/?text=${encodeURIComponent(text + "\n" + link)}`;
};
