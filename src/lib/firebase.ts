import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCR5bqy7gDbI7LZIdvI8cA8OPCMl3fwvUM",
  authDomain: "love-32702.firebaseapp.com",
  projectId: "love-32702",
  storageBucket: "love-32702.appspot.com",
  messagingSenderId: "1066499090813",
  appId: "1:1066499090813:web:1d724f7c4acb938235c414",
  measurementId: "G-EX1ZQQRKVN",
};

const app = initializeApp(firebaseConfig);

export const analytics = getAnalytics(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
