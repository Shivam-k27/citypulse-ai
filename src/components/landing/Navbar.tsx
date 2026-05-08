"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

export default function Navbar() {
  return (
    <nav className="flex items-center justify-between px-8 py-6 border-b border-white/10 backdrop-blur-xl sticky top-0 z-50">

      <motion.h1
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        className="text-2xl font-bold text-blue-400"
      >
        CityPulse AI
      </motion.h1>

      <div className="hidden md:flex gap-8 text-slate-300">
        <a href="#" className="hover:text-blue-400 transition">
          Features
        </a>

        <a href="#" className="hover:text-blue-400 transition">
          Dashboard
        </a>

        <a href="#" className="hover:text-blue-400 transition">
          Live Map
        </a>
      </div>

      <Button className="bg-blue-500 hover:bg-blue-600">
        Report Issue
      </Button>
    </nav>
  );
}