"use client";

import { useState } from "react";
import { auth, db } from "@/lib/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SignupPage() {
  const router = useRouter();
  const [role, setRole]         = useState<"citizen" | "admin">("citizen");
  const [name, setName]         = useState("");
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm]   = useState("");
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");

  const handleSignup = async () => {
    setError("");

    if (!name || !email || !password || !confirm)
      return setError("Please fill in all fields.");
    if (password !== confirm)
      return setError("Passwords do not match.");
    if (password.length < 6)
      return setError("Password must be at least 6 characters.");

    try {
      setLoading(true);
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await setDoc(doc(db, "users", user.uid), {
        uid:       user.uid,
        name:      name.trim(),
        email:     user.email,
        role:      role,
        createdAt: new Date(),
      });

      router.push("/login");
    } catch (err: any) {
      setError(err.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const isAdmin = role === "admin";

  return (
    <main className="min-h-screen bg-[#0a0f1e] flex items-center justify-center p-6 font-sans">

      {/* Background glow */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className={`absolute top-[-100px] left-1/2 -translate-x-1/2 w-[600px] h-[350px] rounded-full blur-3xl transition-all duration-700 ${
          isAdmin ? "bg-amber-600/8" : "bg-blue-600/10"
        }`} />
      </div>

      <div className="bg-[#111827] p-8 rounded-3xl border border-slate-800 w-full max-w-md space-y-6 z-10 relative">

        {/* Header */}
        <div className="text-center">
          <div className="text-3xl mb-3">{isAdmin ? "🛡️" : "🏙️"}</div>
          <h1 className="text-4xl font-bold text-white mb-2">
            {isAdmin ? "Admin Registration" : "Join CityPulse"}
          </h1>
          <p className="text-slate-400 text-sm">
            {isAdmin
              ? "Create an administrative account."
              : "Create an account to report public issues."}
          </p>
        </div>

        {/* Role Toggle */}
        <div className="grid grid-cols-2 p-1.5 bg-[#070d19] rounded-xl border border-slate-800/80">
          <button
            type="button"
            onClick={() => { setRole("citizen"); setError(""); }}
            className={`py-2.5 text-xs font-bold rounded-lg transition-all ${
              !isAdmin ? "bg-blue-600 text-white shadow-md" : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Citizen Portal
          </button>
          <button
            type="button"
            onClick={() => { setRole("admin"); setError(""); }}
            className={`py-2.5 text-xs font-bold rounded-lg transition-all ${
              isAdmin ? "bg-amber-500 text-black shadow-md" : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Admin Console
          </button>
        </div>

        {/* Admin warning banner */}
        {isAdmin && (
          <div className="bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs p-3 rounded-xl text-center font-medium">
            ⚠️ Admin accounts require approval before access is granted.
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs p-3 rounded-xl text-center font-medium">
            {error}
          </div>
        )}

        {/* Form Fields */}
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-[#0b1220] border border-slate-700 rounded-xl p-4 text-white outline-none focus:border-blue-500 transition text-sm placeholder:text-slate-600"
          />
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-[#0b1220] border border-slate-700 rounded-xl p-4 text-white outline-none focus:border-blue-500 transition text-sm placeholder:text-slate-600"
          />
          <input
            type="password"
            placeholder="Password (min. 6 characters)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-[#0b1220] border border-slate-700 rounded-xl p-4 text-white outline-none focus:border-blue-500 transition text-sm placeholder:text-slate-600"
          />
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            className="w-full bg-[#0b1220] border border-slate-700 rounded-xl p-4 text-white outline-none focus:border-blue-500 transition text-sm placeholder:text-slate-600"
          />

          <button
            onClick={handleSignup}
            disabled={loading}
            className={`w-full transition rounded-xl p-4 font-bold text-sm shadow-lg ${
              isAdmin
                ? "bg-amber-500 hover:bg-amber-400 text-black shadow-amber-900/10"
                : "bg-blue-600 hover:bg-blue-500 text-white shadow-blue-900/20"
            } ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            {loading
              ? "Creating Profile..."
              : isAdmin
              ? "Register Admin Account"
              : "Create Citizen Account"}
          </button>
        </div>

        {/* Footer Link */}
        <div className="text-center pt-2">
          <Link href="/login" className="text-xs text-slate-400 hover:text-white transition font-medium">
            Already have an account?{" "}
            <span className="text-blue-400 underline">Log In</span>
          </Link>
        </div>

      </div>
    </main>
  );
}