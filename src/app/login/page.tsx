"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {

  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {

    if (
      email === "admin@citypulse.com" &&
      password === "123456"
    ) {
      alert("Login successful!");
      router.push("/dashboard");
    } else {
      alert("Wrong email or password");
    }

  };

  return (
    <main className="min-h-screen bg-[#0a0f1e] text-white flex items-center justify-center p-6">

      <div className="bg-[#111827] p-10 rounded-3xl border border-slate-800 w-full max-w-md">

        <h1 className="text-4xl font-bold mb-8">
          Admin Login
        </h1>

        <div className="space-y-5">

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-[#0b1220] border border-slate-700 rounded-xl p-4 outline-none"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-[#0b1220] border border-slate-700 rounded-xl p-4 outline-none"
          />

          <button
            onClick={handleLogin}
            className="w-full bg-blue-500 hover:bg-blue-600 transition rounded-xl p-4 font-semibold"
          >
            Login
          </button>

        </div>

      </div>

    </main>
  );
}