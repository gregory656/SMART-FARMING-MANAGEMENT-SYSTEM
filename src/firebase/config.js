import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCBt33ycjF5sMnISU4G3eFe5sX4x9HViUA",
  authDomain: "smartfarm-b754e.firebaseapp.com",
  projectId: "smartfarm-b754e",
  storageBucket: "smartfarm-b754e.appspot.com",
  messagingSenderId: "835718635830",
  appId: "1:835718635830:web:df616681410ec11b31d397",
  measurementId: "G-CPDZHX5BH4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// OpenWeather API key
export const WEATHER_API_KEY = "a3e032a9accdc878062290ec8578c465";
