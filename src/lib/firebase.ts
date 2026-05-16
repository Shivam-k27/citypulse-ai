import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage"; // 1. Added storage import

const firebaseConfig = {
  apiKey: "AIzaSyDwEJJjxqHTKIjPMf1i7JmOjcB4kmL_tCI",
  authDomain: "city-pluse-final.firebaseapp.com",
  projectId: "city-pluse-final",
  storageBucket: "city-pluse-final.firebasestorage.app",
  messagingSenderId: "877267962587",
  appId: "1:877267962587:web:ba3b39686dc9f7ae4b9afe"
};


const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app); // 2. Added storage export