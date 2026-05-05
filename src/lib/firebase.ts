// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";


// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "farmsmartv01.firebaseapp.com",
  projectId: "farmsmartv01",
  storageBucket: "farmsmartv01.firebasestorage.app",
  messagingSenderId: "530748166440",
  appId: "1:530748166440:web:0863ff344a5fdc3a77001d",
  measurementId: "G-47QYBYHPKV"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const analytics = typeof window !== "undefined" ? getAnalytics(app) : null;