"use client";

import { useState } from "react";
import { auth, db } from "@/lib/firebase"; // Make sure db is imported
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore"; // Import Firestore methods
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    if (!email || !password) return alert("Please fill in all fields");
    
    try {
      setLoading(true);
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // ✨ PROFESSIONAL ADDITION: Create user role document
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        email: user.email,
        role: "citizen", // Default role
        createdAt: new Date(),
      });

      alert("Account created successfully!");
      router.push("/login");
    } catch (error: any) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#0a0f1e] flex items-center justify-center p-6">
      <div className="bg-[#111827] p-8 rounded-3xl border border-slate-800 w-full max-w-md">
        <h1 className="text-4xl font-bold text-white mb-2 text-center">Join CityPulse</h1>
        <p className="text-slate-400 text-center mb-8">Create an account to report issues.</p>
        <div className="space-y-5">
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-[#0b1220] border border-slate-700 rounded-xl p-4 text-white outline-none focus:border-blue-500 transition"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-[#0b1220] border border-slate-700 rounded-xl p-4 text-white outline-none focus:border-blue-500 transition"
          />
          <button
            onClick={handleSignup}
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700 transition rounded-xl p-4 font-bold text-white shadow-lg shadow-blue-900/20"
          >
            {loading ? "Creating Profile..." : "Create Account"}
          </button>
        </div>
      </div>
    </main>
  );
}