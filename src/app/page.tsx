"use client";

import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#070d19] text-white flex flex-col justify-between p-6 md:p-12 relative overflow-hidden font-sans">
      
      {/* 🌐 NAVBAR CONTAINER */}
      <nav className="w-full max-w-7xl mx-auto flex items-center justify-between z-10 py-4">
        <div className="text-2xl font-bold tracking-tight text-blue-400">
          CityPulse AI
        </div>
        <div className="hidden md:flex items-center gap-10 text-sm font-medium text-slate-300 tracking-wide">
          <Link href="/" className="text-white hover:text-blue-400 cursor-pointer transition-colors">Home</Link>
          <Link href="/citizen" className="hover:text-white cursor-pointer transition-colors">Dashboard</Link>
          <Link href="/map" className="hover:text-white cursor-pointer transition-colors">Live Map</Link>
        </div>
        <Link href="/citizen/report">
          <button className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-5 py-2.5 rounded-lg transition-all shadow-md shadow-blue-900/30">
            Report Issue
          </button>
        </Link>
      </nav>

      {/* 🚀 WELL-EXPANDED HERO PRESENTATION LAYOUT */}
      <div className="max-w-5xl w-full mx-auto text-center space-y-8 z-10 my-auto py-20">
        <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-[1.15] text-white max-w-4xl mx-auto">
          Smart City Civic <span className="text-blue-500">Issue</span> <br />
          <span className="text-blue-400">Reporting</span> Platform
        </h1>
        <p className="text-slate-400 text-sm md:text-base max-w-2xl mx-auto font-medium leading-relaxed tracking-wide">
          Report potholes, garbage, water leakage and infrastructure issues with AI-powered classification and real-time tracking.
        </p>
        <div className="flex items-center justify-center gap-4 pt-4">
          <Link href="/citizen">
            <button className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm px-8 py-3.5 rounded-lg transition-all shadow-lg shadow-blue-900/40 tracking-wide">
              Get Started
            </button>
          </Link>
          <Link href="/map">
            <button className="border border-slate-800 bg-transparent hover:bg-white/5 text-slate-400 font-bold text-sm px-8 py-3.5 rounded-lg transition-all tracking-wide">
              Live Map
            </button>
          </Link>
        </div>
      </div>

      {/* 📊 FEATURES & STATS FOOTER MODULE */}
      <div className="w-full max-w-7xl mx-auto space-y-8 z-10 pt-6">
        
        {/* Live Tracking Highlight Ribbon */}
        <div className="max-w-sm bg-[#0b1324]/40 border border-slate-800/80 rounded-xl p-6 text-left">
          <h4 className="text-yellow-500 font-bold text-base tracking-tight">Live Tracking</h4>
          <p className="text-slate-500 text-sm mt-1 leading-relaxed">Track civic issues in real time.</p>
        </div>

        {/* Global Operational Counters Grid */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-5">
          {[
            { count: "12K+", label: "Issues Reported", color: "text-blue-400" },
            { count: "8.5K+", label: "Issues Resolved", color: "text-emerald-400" },
            { count: "120+", label: "Active Workers", color: "text-purple-400" },
            { count: "35+", label: "Smart Cities", color: "text-amber-400" },
          ].map((metric, idx) => (
            <div 
              key={idx} 
              className="bg-[#0b1324]/40 border border-slate-800/40 rounded-xl py-8 text-center"
            >
              <h3 className={`text-3xl md:text-4xl font-black tracking-tight ${metric.color}`}>
                {metric.count}
              </h3>
              <p className="text-xs uppercase tracking-widest font-bold text-slate-500 mt-2">
                {metric.label}
              </p>
            </div>
          ))}
        </section>

      </div>
    </main>
  );
}