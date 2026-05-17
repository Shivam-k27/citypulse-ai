"use client";

import { useState } from "react";
import { auth, db } from "@/lib/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore"; // Import getDoc
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    try {
      setLoading(true);
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // 🛡️ RBAC Logic: Fetch user role from Firestore
      const userDoc = await getDoc(doc(db, "users", user.uid));
      
      if (userDoc.exists()) {
        const userData = userDoc.data();
        if (userData.role === "admin") {
          router.push("/dashboard"); // Admin goes to management
        } else {
          router.push("/citizen"); // User goes to their tracking portal
        }
      } else {
        // Fallback if doc doesn't exist
        router.push("/citizen");
      }
    } catch (error: any) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#0a0f1e] flex items-center justify-center p-6">
      <div className="bg-[#111827] p-8 rounded-3xl border border-slate-800 w-full max-w-md">
        <h1 className="text-4xl font-bold text-white mb-2 text-center">Welcome Back</h1>
        <p className="text-slate-400 text-center mb-8">Login to manage city reports.</p>
        <div className="space-y-5">
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-[#0b1220] border border-slate-700 rounded-xl p-4 text-white outline-none focus:border-green-500 transition"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-[#0b1220] border border-slate-700 rounded-xl p-4 text-white outline-none focus:border-green-500 transition"
          />
          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full bg-green-600 hover:bg-green-500 disabled:bg-slate-700 transition rounded-xl p-4 font-bold text-white shadow-lg shadow-green-900/20"
          >
            {loading ? "Verifying..." : "Login"}
          </button>
        </div>
      </div>
    </main>
  );
}