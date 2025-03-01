import { initializeApp, getApps } from "firebase/app";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAjxvGmQhmL_I2UpGZQC1Y8_KrueDLI8ME",
  authDomain: "investifai-21641.firebaseapp.com",
  projectId: "investifai-21641",
  storageBucket: "investifai-21641.firebasestorage.app",
  messagingSenderId: "1009283837142",
  appId: "1:1009283837142:web:83053e1c0b16f233eaad77",
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
