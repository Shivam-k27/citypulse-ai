"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="relative text-center py-32 px-6 overflow-hidden">
      {/* 🌌 Background Glow Effect */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-blue-600/10 blur-[120px] rounded-full -z-10" />

      {/* 🏷️ Professional Badge */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-blue-500/20 bg-blue-500/5 text-blue-400 text-xs font-bold tracking-wider uppercase mb-8"
      >
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
        </span>
        Live in Patna, Bihar
      </motion.div>

      {/* 🚀 Main Heading */}
      <motion.h1
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="text-6xl md:text-8xl font-black tracking-tighter leading-[1.1]"
      >
        Fixing Cities with <br />
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
          Intelligence.
        </span>
      </motion.h1>

      <motion.p 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-slate-400 mt-8 text-xl max-w-2xl mx-auto leading-relaxed"
      >
        Empowering citizens to build cleaner, smarter neighborhoods through real-time 
        AI issue tracking and community engagement.
      </motion.p>

      {/* 🔘 Functional Buttons */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mt-12 flex flex-wrap justify-center gap-4"
      >
        <Link href="/signup">
          <Button size="lg" className="bg-blue-600 hover:bg-blue-500 px-8 py-7 text-lg rounded-2xl font-bold shadow-xl shadow-blue-600/20 group">
            Get Started
            <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </Link>
        
        <Link href="/map">
          <Button variant="outline" size="lg" className="border-slate-800 bg-white/5 hover:bg-white/10 px-8 py-7 text-lg rounded-2xl font-bold">
            Live View
          </Button>
        </Link>
      </motion.div>

    </section>
  );
}