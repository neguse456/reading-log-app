import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// .env（VITE_FIREBASE_*）で上書きできる。未設定ならこのプロジェクトの値を使う
const env = import.meta.env;
const firebaseConfig = {
  apiKey: env.VITE_FIREBASE_API_KEY || "AIzaSyD_Qaogi2qIVtthkm55nWyHn8HDs1AIKAw",
  authDomain: env.VITE_FIREBASE_AUTH_DOMAIN || "webprog001.firebaseapp.com",
  projectId: env.VITE_FIREBASE_PROJECT_ID || "webprog001",
  storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET || "webprog001.firebasestorage.app",
  messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID || "703652689821",
  appId: env.VITE_FIREBASE_APP_ID || "1:703652689821:web:84edc49e6aa020c83de174",
  measurementId: env.VITE_FIREBASE_MEASUREMENT_ID || "G-HTFQ1SM90Z"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
