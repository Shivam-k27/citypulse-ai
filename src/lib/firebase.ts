import { getStorage } from "firebase/storage";
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAR4187NeGtQuFbFXIRUfMhgE6knNZQuSA",
  authDomain: "citypulse-ai-c314f.firebaseapp.com",
  projectId: "citypulse-ai-c314f",
  storageBucket: "citypulse-ai-c314f.firebasestorage.app",
  messagingSenderId: "606113959349",
  appId: "1:606113959349:web:ecb53eae9728615438ddfc",
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);