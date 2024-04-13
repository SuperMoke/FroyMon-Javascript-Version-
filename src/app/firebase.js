import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyDBjKAeN8Yg6JumcdbWN38Y51bmSxLQNQg",
  authDomain: "froymon-2b381.firebaseapp.com",
  databaseURL: "https://froymon-2b381-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "froymon-2b381",
  storageBucket: "froymon-2b381.appspot.com",
  messagingSenderId: "168869643793",
  appId: "1:168869643793:web:9b25c36f20aafc9ca9d3b0",
  measurementId: "G-E2DT26L42L"
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

export { app, db, auth,storage }