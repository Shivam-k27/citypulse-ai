"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

export default function HeroSection() {
  return (
    <section className="text-center py-32 px-6">

      <motion.h1
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-6xl font-bold"
      >
        Smart City Civic Platform
      </motion.h1>

      <p className="text-slate-400 mt-6">
        AI-powered civic issue reporting system.
      </p>

      <div className="mt-8">
        <Button>Get Started</Button>
      </div>

    </section>
  );
}