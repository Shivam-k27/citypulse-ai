"use client";

import { useState } from "react";

import { auth } from "@/lib/firebase";

import {
  createUserWithEmailAndPassword,
} from "firebase/auth";

import { useRouter } from "next/navigation";

export default function SignupPage() {

  const router = useRouter();

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const handleSignup = async () => {

    try {

      setLoading(true);

      await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      alert("Account created!");

      router.push("/login");

    } catch (error: any) {

  console.log(error);
  console.log(error.code);
  console.log(error.message);

  alert(error.code);

} finally {

      setLoading(false);

    }
  };

  return (

    <main className="min-h-screen bg-[#0a0f1e] flex items-center justify-center p-6">

      <div className="bg-[#111827] p-8 rounded-3xl border border-slate-800 w-full max-w-md">

        <h1 className="text-4xl font-bold text-white mb-8 text-center">
          Sign Up
        </h1>

        <div className="space-y-5">

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
            className="w-full bg-[#0b1220] border border-slate-700 rounded-xl p-4 text-white outline-none"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
            className="w-full bg-[#0b1220] border border-slate-700 rounded-xl p-4 text-white outline-none"
          />

          <button
            onClick={handleSignup}
            disabled={loading}
            className="w-full bg-blue-500 hover:bg-blue-600 transition rounded-xl p-4 font-semibold text-white"
          >

            {loading
              ? "Creating..."
              : "Create Account"}

          </button>

        </div>

      </div>

    </main>

  );
}