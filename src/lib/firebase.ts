import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

export const firebaseConfig = {
  apiKey: "AIzaSyA5ztPQ0xiaLwCTmZ291uuiZAX1737N4tA",
  authDomain: "bangles-236db.firebaseapp.com",
  projectId: "bangles-236db",
  storageBucket: "bangles-236db.firebasestorage.app",
  messagingSenderId: "845484648077",
  appId: "1:845484648077:web:cb9b4d4cff57f15a22a4c4",
  measurementId: "G-4GFEHHD2F2"
};

// Initialize Firebase safely
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;
