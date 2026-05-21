"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { onAuthStateChanged } from "firebase/auth";
import { 
  collection, 
  query, 
  where, 
  onSnapshot, 
  orderBy, 
  doc, 
  updateDoc, 
  arrayUnion, 
  arrayRemove 
} from "firebase/firestore";
import { db, auth } from "@/lib/firebase";
import {
  AlertTriangle,
  CheckCircle,
  Clock3,
  MapPinned,
  Plus,
  Construction,
  ArrowBigUp,
  Map as MapIcon
} from "lucide-react";

const LazyLiveMap = dynamic(
  () => import("@/components/report/LiveMap").then((mod) => mod.default),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-[500px] bg-[#111827] rounded-[40px] flex items-center justify-center border border-white/5 text-slate-500 text-xs font-bold uppercase animate-pulse">
        Loading Live Map...
      </div>
    ),
  }
);

export default function CitizenDashboard() {
  const [reports, setReports] = useState<any[]>([]);
  const [allPublicReports, setAllPublicReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // References to preserve baseline application state across snapshot evaluations
  const isFirstLoad = useRef(true); 
  const previousStatuses = useRef<{ [key: string]: string }>({});

  const handleUpvote = async (reportId: string, upvotes: string[]) => {
    const user = auth.currentUser;
    if (!user) {
      alert("Please login to upvote!");
      return;
    }

    const reportRef = doc(db, "reports", reportId);
    const hasUpvoted = upvotes.includes(user.uid);

    try {
      await updateDoc(reportRef, {
        upvotes: hasUpvoted ? arrayRemove(user.uid) : arrayUnion(user.uid)
      });
    } catch (err) {
      console.error("Error executing vote modification:", err);
    }
  };

  useEffect(() => {
    // Request permission to send system push notifications on mount
    if (typeof window !== "undefined" && "Notification" in window) {
      if (Notification.permission === "default") {
        Notification.requestPermission();
      }
    }

    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        const qUser = query(
          collection(db, "reports"), 
          where("userId", "==", user.uid), 
          orderBy("createdAt", "desc")
        );
        const qPublic = query(collection(db, "reports"), orderBy("createdAt", "desc"));

        // Establish real-time data stream binding
        const unsubUser = onSnapshot(qUser, (snapshot) => {
          const currentReports = snapshot.docs.map(doc => ({ 
            id: doc.id, 
            ...doc.data(), 
            upvotes: doc.data().upvotes || [] 
          }));

          // Process delta mutations for system notifications
          currentReports.forEach((report) => {
            const reportId = report.id;
            const currentStatus = report.status || "Pending";
            const oldStatus = previousStatuses.current[reportId];

            // If a status modifies post-initial load, trigger native notification dispatch
            if (!isFirstLoad.current && oldStatus && oldStatus !== currentStatus) {
              if (Notification.permission === "granted") {
                const systemAlert = new Notification("CityPulse Status Update", {
                  body: `Your issue "${report.title}" has been updated to: ${currentStatus}`,
                  icon: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
                  tag: reportId, // Prevents duplicate instances for the same change event
                });

                // Auto-focus window and scroll to submissions section on interaction
                systemAlert.onclick = () => {
                  window.focus();
                  const targetElement = document.getElementById("submissions-list");
                  if (targetElement) {
                    targetElement.scrollIntoView({ behavior: "smooth", block: "start" });
                  }
                };
              }
            }

            // Commit state parameters to baseline lookup ref
            previousStatuses.current[reportId] = currentStatus;
          });

          if (isFirstLoad.current) {
            isFirstLoad.current = false;
          }

          setReports(currentReports);
          setLoading(false);
        });

        const unsubPublic = onSnapshot(qPublic, (snapshot) => {
          setAllPublicReports(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        });

        return () => {
          unsubUser();
          unsubPublic();
        };
      } else {
        setReports([]);
        setLoading(false);
      }
    });

    return () => unsubscribeAuth();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0f1e] flex items-center justify-center text-white font-bold tracking-widest uppercase text-xs animate-pulse">
        Syncing City Pulse...
      </div>
    );
  }

  const pendingCount = reports.filter(r => r.status?.toLowerCase() === "pending").length;
  const resolvedCount = reports.filter(r => r.status?.toLowerCase() === "resolved").length;
  const progressCount = reports.filter(r => r.status?.toLowerCase() === "in progress").length;

  const stats = [
    { title: "Pending", value: pendingCount, icon: AlertTriangle, color: "text-yellow-400" },
    { title: "Resolved", value: resolvedCount, icon: CheckCircle, color: "text-green-400" },
    { title: "In Progress", value: progressCount, icon: Clock3, color: "text-purple-400" },
    { title: "Nearby Issues", value: allPublicReports.length, icon: MapPinned, color: "text-blue-400" },
  ];

  return (
    <main className="min-h-screen bg-[#0a0f1e] text-white p-8">
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
        <div>
          <h1 className="text-5xl font-bold tracking-tight">Citizen Dashboard</h1>
          <p className="text-slate-400 mt-3 font-medium">Track your impact on the city in real-time.</p>
        </div>
        <div className="flex gap-3">
          <Link href="/map">
            <button className="bg-white/5 border border-white/10 hover:bg-white/10 text-white px-6 py-4 rounded-2xl font-bold flex items-center gap-3 transition-all">
              <MapIcon size={20} /> View Live Map
            </button>
          </Link>
          <Link href="/citizen/report">
            <button className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-2xl font-bold flex items-center gap-3 transition-all hover:scale-105 shadow-xl shadow-blue-900/20 active:scale-95">
              <Plus size={24} /> File New Report
            </button>
          </Link>
        </div>
      </div>

      <section className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((item, index) => {
          const Icon = item.icon;
          return (
            <div key={index} className="bg-white/5 border border-white/10 rounded-[32px] p-8 backdrop-blur-xl hover:border-white/20 transition-all group">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-xs font-black uppercase tracking-[0.2em]">{item.title}</p>
                  <h2 className="text-5xl font-black mt-2">{item.value}</h2>
                </div>
                <div className={`p-4 rounded-2xl bg-white/5 ${item.color} group-hover:scale-110 transition-transform`}>
                  <Icon size={32} />
                </div>
              </div>
            </div>
          );
        })}
      </section>

      <section className="mt-14">
        <div className="mb-8">
          <h2 className="text-3xl font-bold tracking-tight">Live Analytics Grid</h2>
          <p className="text-slate-400 mt-1 text-sm font-medium">Real-time geospatial tracking across the network mapping active disruptions.</p>
        </div>
        <LazyLiveMap />
      </section>

      <section id="submissions-list" className="mt-14 scroll-mt-6">
        <h2 className="text-3xl font-bold mb-8 tracking-tight">My Submissions</h2>
        <div className="space-y-6">
          {reports.length > 0 ? reports.map((report) => {
            const currentStatus = report.status?.toLowerCase() || "pending";
            const hasUpvoted = report.upvotes?.includes(auth.currentUser?.uid);
            const isFixing = currentStatus === "in progress" || currentStatus === "resolved";
            const isDone = currentStatus === "resolved";

            return (
              <div key={report.id} className="bg-[#111827] border border-white/5 rounded-[40px] p-10 hover:bg-white/[0.04] transition-all group relative">
                <div className="flex flex-col md:flex-row justify-between gap-10">
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="text-blue-400 text-xs font-black uppercase tracking-[0.2em]">{report.category}</span>
                      <span className="text-slate-700">•</span>
                      <span className="text-slate-500 text-xs font-bold">
                        {report.createdAt?.toDate().toLocaleDateString()}
                      </span>
                    </div>
                    <h3 className="text-3xl font-bold mb-4 group-hover:text-blue-400 transition-colors tracking-tight">
                      {report.title}
                    </h3>
                    <p className="text-slate-400 line-clamp-2 text-lg leading-relaxed mb-8">
                      {report.description}
                    </p>
                    <button 
                      onClick={() => handleUpvote(report.id, report.upvotes)} 
                      className={`flex items-center gap-3 px-6 py-3 rounded-2xl border transition-all duration-300 ${
                        hasUpvoted 
                          ? "bg-blue-600 border-blue-500 text-white shadow-lg" 
                          : "bg-white/5 border-white/10 text-slate-400 hover:border-white/30"
                      }`}
                    >
                      <ArrowBigUp size={22} fill={hasUpvoted ? "currentColor" : "none"} />
                      <span className="font-black">{report.upvotes?.length || 0} Votes</span>
                    </button>
                  </div>

                  <div className="flex flex-col items-center md:items-end justify-center min-w-[250px] gap-6">
                    <div className="flex items-center gap-4">
                      <StatusNode active={true} icon={<Clock3 size={16}/>} label="Filed" />
                      <div className={`w-12 h-1 rounded-full ${isFixing ? 'bg-blue-600 shadow-[0_0_10px_rgba(37,99,235,0.5)]' : 'bg-slate-800'}`} />
                      <StatusNode active={isFixing} icon={<Construction size={16}/>} label="Fixing" />
                      <div className={`w-12 h-1 rounded-full ${isDone ? 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]' : 'bg-slate-800'}`} />
                      <StatusNode active={isDone} icon={<CheckCircle size={16}/>} label="Done" />
                    </div>
                    <p className={`text-xs font-black uppercase tracking-[0.3em] ${
                      isDone ? 'text-green-400' : isFixing ? 'text-blue-400' : 'text-yellow-500'
                    }`}>
                      Stage: {report.status || "Pending"}
                    </p>
                  </div>

                </div>
              </div>
            );
          }) : (
            <div className="text-center py-32 border-2 border-dashed border-white/5 rounded-[40px] bg-white/[0.02]">
              <MapPinned size={64} className="mx-auto text-slate-800 mb-6 opacity-20" />
              <p className="text-slate-500 text-xl font-bold tracking-tight">Your city timeline is empty.</p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

function StatusNode({ active, icon, label }: { active: boolean; icon: any; label: string }) {
  return (
    <div className="flex flex-col items-center gap-3">
      <div className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all duration-700 ${
        active 
          ? "bg-blue-600 border-blue-600 text-white scale-110 shadow-lg shadow-blue-900/40" 
          : "bg-slate-900 border-slate-800 text-slate-700"
      }`}>
        {icon}
      </div>
      <span className={`text-[9px] font-black uppercase tracking-[0.2em] ${active ? "text-white" : "text-slate-700"}`}>
        {label}
      </span>
    </div>
  );
}