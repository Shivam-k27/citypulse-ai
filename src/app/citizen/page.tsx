"use client";

import { useEffect, useState } from "react";
import { db, auth } from "@/lib/firebase";
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
import { onAuthStateChanged } from "firebase/auth";
import Link from "next/link";
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

export default function CitizenDashboard() {
  const [reports, setReports] = useState<any[]>([]);
  const [allPublicReports, setAllPublicReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const handleUpvote = async (reportId: string, upvotes: string[]) => {
    const user = auth.currentUser;
    if (!user) return alert("Please login to upvote!");
    const reportRef = doc(db, "reports", reportId);
    const hasUpvoted = upvotes.includes(user.uid);
    try {
      await updateDoc(reportRef, {
        upvotes: hasUpvoted ? arrayRemove(user.uid) : arrayUnion(user.uid)
      });
    } catch (err) { console.error("Upvote failed:", err); }
  };

  const stats = [
    { title: "Pending", value: reports.filter(r => r.status?.toLowerCase() === "pending").length, icon: AlertTriangle, color: "text-yellow-400" },
    { title: "Resolved", value: reports.filter(r => r.status?.toLowerCase() === "resolved").length, icon: CheckCircle, color: "text-green-400" },
    { title: "In Progress", value: reports.filter(r => r.status?.toLowerCase() === "in progress").length, icon: Clock3, color: "text-purple-400" },
    { title: "Nearby Issues", value: allPublicReports.length, icon: MapPinned, color: "text-blue-400" },
  ];

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        const qUser = query(collection(db, "reports"), where("userId", "==", user.uid), orderBy("createdAt", "desc"));
        const qPublic = query(collection(db, "reports"), orderBy("createdAt", "desc"));

        const unsubUser = onSnapshot(qUser, (snapshot) => {
          setReports(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data(), upvotes: doc.data().upvotes || [] })));
          setLoading(false);
        });

        const unsubPublic = onSnapshot(qPublic, (snapshot) => {
          setAllPublicReports(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        });

        return () => { unsubUser(); unsubPublic(); };
      }
    });
    return () => unsubscribeAuth();
  }, []);

  if (loading) return <div className="min-h-screen bg-[#0a0f1e] flex items-center justify-center text-white animate-pulse font-bold tracking-widest uppercase text-xs">Syncing City Pulse...</div>;

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
                <div className={`p-4 rounded-2xl bg-white/5 ${item.color} group-hover:scale-110 transition-transform`}><Icon size={32} /></div>
              </div>
            </div>
          );
        })}
      </section>

      <section className="mt-14">
        <h2 className="text-3xl font-bold mb-8 tracking-tight">My Submissions</h2>
        <div className="space-y-6">
          {reports.length > 0 ? reports.map((report) => {
            const hasUpvoted = report.upvotes?.includes(auth.currentUser?.uid);
            return (
              <div key={report.id} className="bg-[#111827] border border-white/5 rounded-[40px] p-10 hover:bg-white/[0.04] transition-all group relative">
                <div className="flex flex-col md:flex-row justify-between gap-10">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="text-blue-400 text-xs font-black uppercase tracking-[0.2em]">{report.category}</span>
                      <span className="text-slate-700">•</span>
                      <span className="text-slate-500 text-xs font-bold">{report.createdAt?.toDate().toLocaleDateString()}</span>
                    </div>
                    <h3 className="text-3xl font-bold mb-4 group-hover:text-blue-400 transition-colors tracking-tight">{report.title}</h3>
                    <p className="text-slate-400 line-clamp-2 text-lg leading-relaxed mb-8">{report.description}</p>
                    <button onClick={() => handleUpvote(report.id, report.upvotes)} className={`flex items-center gap-3 px-6 py-3 rounded-2xl border transition-all duration-300 ${hasUpvoted ? "bg-blue-600 border-blue-500 text-white shadow-lg" : "bg-white/5 border-white/10 text-slate-400 hover:border-white/30"}`}>
                      <ArrowBigUp size={22} fill={hasUpvoted ? "currentColor" : "none"} />
                      <span className="font-black">{report.upvotes?.length || 0} Votes</span>
                    </button>
                  </div>
                  <div className="flex flex-col items-center md:items-end justify-center min-w-[250px] gap-6">
                    <div className="flex items-center gap-4">
                      <StatusNode active={true} icon={<Clock3 size={16}/>} label="Filed" />
                      <div className={`w-12 h-1 rounded-full ${['in progress', 'resolved'].includes(report.status?.toLowerCase()) ? 'bg-blue-600 shadow-[0_0_10px_rgba(37,99,235,0.5)]' : 'bg-slate-800'}`} />
                      <StatusNode active={['in progress', 'resolved'].includes(report.status?.toLowerCase())} icon={<Construction size={16}/>} label="Fixing" />
                      <div className={`w-12 h-1 rounded-full ${report.status?.toLowerCase() === 'resolved' ? 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]' : 'bg-slate-800'}`} />
                      <StatusNode active={report.status?.toLowerCase() === 'resolved'} icon={<CheckCircle size={16}/>} label="Done" />
                    </div>
                    <p className={`text-xs font-black uppercase tracking-[0.3em] ${report.status?.toLowerCase() === 'resolved' ? 'text-green-400' : report.status?.toLowerCase() === 'in progress' ? 'text-blue-400' : 'text-yellow-500'}`}>Stage: {report.status || "Pending"}</p>
                  </div>
                </div>
              </div>
            );
          }) : <div className="text-center py-32 border-2 border-dashed border-white/5 rounded-[40px] bg-white/[0.02]"><MapPinned size={64} className="mx-auto text-slate-800 mb-6 opacity-20" /><p className="text-slate-500 text-xl font-bold tracking-tight">Your city timeline is empty.</p></div>}
        </div>
      </section>
    </main>
  );
}

function StatusNode({ active, icon, label }: any) {
  return (
    <div className="flex flex-col items-center gap-3">
      <div className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all duration-700 ${active ? "bg-blue-600 border-blue-600 text-white scale-110 shadow-lg shadow-blue-900/40" : "bg-slate-900 border-slate-800 text-slate-700"}`}>
        {icon}
      </div>
      <span className={`text-[9px] font-black uppercase tracking-[0.2em] ${active ? "text-white" : "text-slate-700"}`}>{label}</span>
    </div>
  );
}