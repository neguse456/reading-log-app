import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyD_Qaogi2qIVtthkm55nWyHn8HDs1AIKAw",
  authDomain: "webprog001.firebaseapp.com",
  projectId: "webprog001",
  storageBucket: "webprog001.firebasestorage.app",
  messagingSenderId: "703652689821",
  appId: "1:703652689821:web:84edc49e6aa020c83de174",
  measurementId: "G-HTFQ1SM90Z"
};

// Firebaseアプリの初期化
const app = initializeApp(firebaseConfig);
// データベース(Firestore)のインスタンスをエクスポート
export const db = getFirestore(app);