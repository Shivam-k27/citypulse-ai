"use client";

import { useEffect, useState } from "react";
import { db, auth } from "@/lib/firebase";
import { collection, query, where, onSnapshot, orderBy } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import Link from "next/link";
import {
  AlertTriangle,
  CheckCircle,
  Clock3,
  MapPinned,
  Plus,
  Construction
} from "lucide-react";

export default function CitizenDashboard() {
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Stats are calculated dynamically from the 'reports' state
  const stats = [
    {
      title: "Pending",
      value: reports.filter(r => r.status?.toLowerCase() === "pending").length,
      icon: AlertTriangle,
      color: "text-yellow-400",
    },
    {
      title: "Resolved",
      value: reports.filter(r => r.status?.toLowerCase() === "resolved").length,
      icon: CheckCircle,
      color: "text-green-400",
    },
    {
      title: "In Progress",
      value: reports.filter(r => r.status?.toLowerCase() === "in progress").length,
      icon: Clock3,
      color: "text-purple-400",
    },
    {
      title: "My Total",
      value: reports.length,
      icon: MapPinned,
      color: "text-blue-400",
    },
  ];

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        // Query only this user's reports, sorted by newest first
        const q = query(
          collection(db, "reports"),
          where("userId", "==", user.uid),
          orderBy("createdAt", "desc")
        );

        const unsubscribeSnap = onSnapshot(q, (snapshot) => {
          const userReports = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
          setReports(userReports);
          setLoading(false);
        }, (err) => {
          console.error("Firestore error:", err);
          setLoading(false);
        });

        return () => unsubscribeSnap();
      }
    });

    return () => unsubscribeAuth();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0f1e] flex items-center justify-center text-white font-bold animate-pulse">
        Fetching your city pulse...
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#0a0f1e] text-white p-8">
      {/* Header with New Report Button */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
        <div>
          <h1 className="text-5xl font-bold">Citizen Dashboard</h1>
          <p className="text-slate-400 mt-3">Monitor and manage your civic reports in real-time.</p>
        </div>
        <Link href="/citizen/report">
          <button className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-2xl font-bold flex items-center gap-3 transition-all hover:scale-105 shadow-xl shadow-blue-900/20 active:scale-95">
            <Plus size={24} />
            File New Report
          </button>
        </Link>
      </div>

      {/* Stats Cards */}
      <section className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((item, index) => {
          const Icon = item.icon;
          return (
            <div key={index} className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-xl hover:border-white/20 transition-all">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm font-medium">{item.title}</p>
                  <h2 className="text-4xl font-bold mt-2">{item.value}</h2>
                </div>
                <div className={`p-3 rounded-2xl bg-white/5 ${item.color}`}>
                  <Icon size={32} />
                </div>
              </div>
            </div>
          );
        })}
      </section>

      {/* Reports Feed */}
      <section className="mt-14">
        <h2 className="text-3xl font-bold mb-8">Recent Submissions</h2>
        <div className="space-y-6">
          {reports.length > 0 ? (
            reports.map((report) => (
              <div key={report.id} className="bg-white/5 border border-white/10 rounded-[32px] p-8 hover:bg-white/[0.07] transition-all group">
                <div className="flex flex-col md:flex-row justify-between gap-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                       <span className="text-blue-400 text-xs font-black uppercase tracking-widest">{report.category}</span>
                       <span className="text-slate-600">•</span>
                       <span className="text-slate-500 text-xs">{report.createdAt?.toDate().toLocaleDateString()}</span>
                    </div>
                    <h3 className="text-2xl font-bold mb-3 group-hover:text-blue-400 transition-colors">{report.title}</h3>
                    <p className="text-slate-400 line-clamp-2 text-sm leading-relaxed">{report.description}</p>
                  </div>

                  {/* Status Timeline UI */}
                  <div className="flex flex-col items-center md:items-end justify-center min-w-[200px] gap-4">
                     <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${report.status ? 'bg-blue-600' : 'bg-slate-800'}`}>
                           <Clock3 size={14} className="text-white" />
                        </div>
                        <div className={`w-12 h-[2px] ${['in progress', 'resolved'].includes(report.status?.toLowerCase()) ? 'bg-blue-600' : 'bg-slate-800'}`} />
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${['in progress', 'resolved'].includes(report.status?.toLowerCase()) ? 'bg-blue-600' : 'bg-slate-800'}`}>
                           <Construction size={14} className="text-white" />
                        </div>
                        <div className={`w-12 h-[2px] ${report.status?.toLowerCase() === 'resolved' ? 'bg-green-500' : 'bg-slate-800'}`} />
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${report.status?.toLowerCase() === 'resolved' ? 'bg-green-500' : 'bg-slate-800'}`}>
                           <CheckCircle size={14} className="text-white" />
                        </div>
                     </div>
                     <p className={`text-xs font-black uppercase tracking-tighter ${
                        report.status?.toLowerCase() === 'resolved' ? 'text-green-400' : 
                        report.status?.toLowerCase() === 'in progress' ? 'text-blue-400' : 'text-yellow-500'
                     }`}>
                        Current Status: {report.status || "Pending"}
                     </p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-24 border-2 border-dashed border-white/5 rounded-[40px] bg-white/[0.02]">
              <MapPinned size={48} className="mx-auto text-slate-700 mb-4" />
              <p className="text-slate-500 text-lg">No reports found. Help your city by filing your first issue.</p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}