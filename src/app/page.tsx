"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, onSnapshot } from "firebase/firestore";
import { Activity, CheckCircle2, Users, MapPin } from "lucide-react";

export default function LiveStatsSection() {
  const [stats, setStats] = useState({
    total: 0,
    resolved: 0,
    workers: 54, // Mocked/Manual count
    cities: 1    // Starting with Patna!
  });

  useEffect(() => {
    // This listener watches your 'reports' collection in real-time
    const unsubscribe = onSnapshot(collection(db, "reports"), (snapshot) => {
      const reports = snapshot.docs.map(doc => doc.data());
      
      setStats(prev => ({
        ...prev,
        total: reports.length,
        // Only count the ones marked as 'resolved'
        resolved: reports.filter((r: any) => r.status?.toLowerCase() === "resolved").length
      }));
    });

    return () => unsubscribe();
  }, []);

  const statItems = [
    { label: "Issues Reported", value: stats.total, icon: <Activity className="text-blue-500" />, color: "blue" },
    { label: "Problems Resolved", value: stats.resolved, icon: <CheckCircle2 className="text-green-500" />, color: "green" },
    { label: "Active Workers", value: stats.workers, icon: <Users className="text-purple-500" />, color: "purple" },
    { label: "Smart Cities", value: stats.cities, icon: <MapPin className="text-red-500" />, color: "red" },
  ];

  return (
    <section className="py-24 px-6 max-w-7xl mx-auto">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {statItems.map((item, index) => (
          <div 
            key={index} 
            className="bg-[#111827] border border-slate-800 p-8 rounded-[32px] hover:border-slate-600 transition-all group"
          >
            <div className="mb-4 bg-white/5 w-12 h-12 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
              {item.icon}
            </div>
            <h3 className="text-4xl md:text-5xl font-black mb-1">
              {item.value}
              <span className="text-blue-500">+</span>
            </h3>
            <p className="text-slate-500 font-bold uppercase text-[10px] tracking-[0.2em]">
              {item.label}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}