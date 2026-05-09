"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function Navbar() {
  return (
    <nav className="flex items-center justify-between px-8 py-6 border-b border-white/10 backdrop-blur-xl sticky top-0 z-50">

      {/* Logo */}
      <motion.h1
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        className="text-2xl font-bold text-blue-400"
      >
        CityPulse AI
      </motion.h1>

      {/* Navigation Links */}
      <div className="hidden md:flex gap-8 text-slate-300">

        <Link
          href="/"
          className="hover:text-white transition"
        >
          Home
        </Link>

        <Link
          href="/dashboard"
          className="hover:text-white transition"
        >
          Dashboard
        </Link>

        <Link
          href="/map"
          className="hover:text-white transition"
        >
          Live Map
        </Link>

      </div>

      {/* Report Button */}
      <Link href="/report">
        <button className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-lg text-sm font-medium transition">
          Report Issue
        </button>
      </Link>

    </nav>
  );
}