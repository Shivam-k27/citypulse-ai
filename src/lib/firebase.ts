import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAR4187NeGtQuFbFXIRUfMhgE6knNZQuSA",
  authDomain: "citypulse-ai-c314f.firebaseapp.com",
  projectId: "citypulse-ai-c314f",
  storageBucket: "citypulse-ai-c314f.firebasestorage.app",
  messagingSenderId: "606113959349",
  appId: "1:606113959349:web:c32786cb0623883d38ddfc"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);