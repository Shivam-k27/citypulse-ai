"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

export default function HeroSection() {
  return (
    <section className="text-center py-32 px-6 relative">

      <div className="absolute inset-0 bg-blue-500/10 blur-3xl" />

      <motion.h1
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="text-6xl md:text-7xl font-bold leading-tight max-w-5xl mx-auto relative z-10"
      >
        Smart City Civic
        <span className="text-blue-400"> Issue Reporting </span>
        Platform
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-slate-400 mt-8 max-w-2xl mx-auto text-lg relative z-10"
      >
        Report potholes, garbage, water leakage and infrastructure issues
        with AI-powered classification and real-time tracking.
      </motion.p>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="flex justify-center gap-4 mt-10 relative z-10"
      >
        <Button className="bg-blue-500 hover:bg-blue-600 px-8 py-6 text-lg">
          Get Started
        </Button>

        <Button
          variant="outline"
          className="px-8 py-6 text-lg border-white/20 text-black"
        >
          Live Map
        </Button>
      </motion.div>
    </section>
  );
}