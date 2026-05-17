"use client";

import { useEffect, useState, useMemo } from "react";
import { db, auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  doc,
  updateDoc,
  deleteDoc,
  getDoc,
} from "firebase/firestore";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
} from "recharts";

interface Report {
  id: string;
  title: string;
  category: string;
  description: string;
  status: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  imageUrl?: string;
  upvotes?: string[]; // Community votes array
}

export default function DashboardPage() {
  const router = useRouter();
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");

  useEffect(() => {
    // 🛡️ Security Guard: Only admins allowed
    const checkAdminAccess = async (user: any) => {
      if (!user) {
        router.push("/login");
        return;
      }
      
      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (!userDoc.exists() || userDoc.data().role !== "admin") {
        router.push("/citizen"); 
      } else {
        setLoading(false);
      }
    };

    const authUnsubscribe = onAuthStateChanged(auth, checkAdminAccess);

    // 🚀 PRIORITY QUERY: Sort by upvotes (community importance) then date
    // Note: You might need to click the link in your console to build this index!
    const q = query(
      collection(db, "reports"), 
      orderBy("upvotes", "desc"), 
      orderBy("createdAt", "desc")
    );

    const snapUnsubscribe = onSnapshot(q, (snapshot) => {
      const reportsData = snapshot.docs.map((docItem) => ({
        id: docItem.id,
        ...(docItem.data() as Omit<Report, "id">),
        upvotes: docItem.data().upvotes || [] // Fallback to empty array
      }));
      setReports(reportsData);
    }, (error) => {
      console.error("Firebase sync failed:", error);
    });

    return () => {
      authUnsubscribe();
      snapUnsubscribe();
    };
  }, [router]);

  // Handler for status toggle buttons
  const updateStatus = async (id: string, newStatus: string) => {
    try {
      const reportRef = doc(db, "reports", id);
      await updateDoc(reportRef, { status: newStatus });
    } catch (error) {
      alert("Failed to update status. Check permissions.");
    }
  };

  const deleteReport = async (id: string) => {
    if (!window.confirm("This is permanent. You sure?")) return;
    try {
      await deleteDoc(doc(db, "reports", id));
    } catch (error) {
      alert("Delete failed.");
    }
  };

  // Filter logic for the search and dropdowns
  const filteredReports = reports.filter((report) => {
    const matchesSearch = report.title?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || report.status?.toLowerCase() === statusFilter.toLowerCase();
    const matchesCategory = categoryFilter === "all" || report.category === categoryFilter;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  // Re-calculating stats for the charts
  const statusData = useMemo(() => [
    { name: "Pending", value: reports.filter((r) => r.status?.toLowerCase() === "pending").length },
    { name: "In Progress", value: reports.filter((r) => r.status?.toLowerCase() === "in progress").length },
    { name: "Resolved", value: reports.filter((r) => r.status?.toLowerCase() === "resolved").length },
  ], [reports]);

  const categoryData = useMemo(() => [
    { name: "Road", value: reports.filter((r) => r.category === "Road Damage").length },
    { name: "Garbage", value: reports.filter((r) => r.category === "Garbage").length },
    { name: "Light", value: reports.filter((r) => r.category === "Street Light").length },
    { name: "Water", value: reports.filter((r) => r.category === "Water Leakage").length },
  ], [reports]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0f1e] flex flex-col items-center justify-center text-white font-black">
        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="tracking-widest uppercase text-xs">Accessing Command Center...</p>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#0a0f1e] text-white p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-4xl font-bold tracking-tight">Admin Dashboard</h1>
          <button 
            onClick={() => auth.signOut()} 
            className="bg-red-500/10 text-red-400 border border-red-500/20 px-5 py-2 rounded-xl hover:bg-red-600 hover:text-white transition-all font-medium"
          >
            Sign Out
          </button>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <div className="bg-[#111827] p-6 rounded-3xl border border-slate-800 shadow-xl">
            <p className="text-slate-400 text-sm mb-1 uppercase font-bold tracking-widest text-[10px]">Total Reports</p>
            <h2 className="text-4xl font-bold">{reports.length}</h2>
          </div>
          {statusData.map((status) => (
            <div key={status.name} className="bg-[#111827] p-6 rounded-3xl border border-slate-800 shadow-xl">
              <p className="text-slate-400 text-sm mb-1 uppercase font-bold tracking-widest text-[10px]">{status.name}</p>
              <h2 className={`text-4xl font-bold ${
                status.name === 'Pending' ? 'text-yellow-400' : 
                status.name === 'In Progress' ? 'text-blue-400' : 'text-green-400'
              }`}>
                {status.value}
              </h2>
            </div>
          ))}
        </div>

        {/* Visual Analytics */}
        <div className="grid md:grid-cols-2 gap-6 mb-10">
          <div className="bg-[#111827] p-6 rounded-3xl border border-slate-800">
            <h2 className="text-xl font-semibold mb-6">Live Status</h2>
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={statusData} dataKey="value" outerRadius={90} stroke="none">
                    <Cell fill="#eab308" />
                    <Cell fill="#3b82f6" />
                    <Cell fill="#22c55e" />
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: '15px', backgroundColor: '#111827', border: '1px solid #1e293b' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-[#111827] p-6 rounded-3xl border border-slate-800">
            <h2 className="text-xl font-semibold mb-6">Category Distribution</h2>
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={categoryData}>
                  <XAxis dataKey="name" stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
                  <YAxis hide />
                  <Tooltip cursor={{fill: '#1f2937'}} contentStyle={{ borderRadius: '15px', backgroundColor: '#111827', border: 'none' }} />
                  <Bar dataKey="value" fill="#3b82f6" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Filtering & Search Bar */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <input
            type="text"
            placeholder="Search reports..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-[#111827] border border-slate-800 rounded-2xl p-4 outline-none focus:ring-2 ring-blue-500/50 transition-all"
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-[#111827] border border-slate-800 rounded-2xl p-4 outline-none"
          >
            <option value="all">Filter: All Status</option>
            <option value="pending">Pending</option>
            <option value="in progress">In Progress</option>
            <option value="resolved">Resolved</option>
          </select>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-[#111827] border border-slate-800 rounded-2xl p-4 outline-none"
          >
            <option value="all">Filter: All Categories</option>
            <option value="Road Damage">Road Damage</option>
            <option value="Garbage">Garbage Issues</option>
            <option value="Street Light">Street Lighting</option>
            <option value="Water Leakage">Water/Plumbing</option>
          </select>
        </div>

        {/* Priority Feed */}
        <div className="grid gap-6">
          {filteredReports.map((report) => (
            <div key={report.id} className="bg-[#111827] border border-slate-800 rounded-[32px] p-8 hover:border-slate-600 transition-all shadow-xl group">
              <div className="flex flex-col md:flex-row justify-between items-start mb-6 gap-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h2 className="text-3xl font-bold group-hover:text-blue-400 transition-colors">{report.title}</h2>
                    {/* 📊 Priority Badge */}
                    <div className="bg-blue-600/20 text-blue-400 px-3 py-1 rounded-lg text-[10px] font-black flex items-center gap-1 border border-blue-600/20 uppercase tracking-tighter">
                      <span>▲</span> {report.upvotes?.length || 0} Priority Votes
                    </div>
                  </div>
                  <p className="text-blue-500 text-xs font-black uppercase tracking-widest">{report.category}</p>
                </div>
                <span className={`px-5 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest ${
                  report.status?.toLowerCase() === 'resolved' ? 'bg-green-500/10 text-green-400 border border-green-500/20' :
                  report.status?.toLowerCase() === 'in progress' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' :
                  'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'
                }`}>
                  {report.status}
                </span>
              </div>

              <p className="text-slate-400 mb-6 leading-relaxed text-sm">{report.description}</p>
              
              <div className="flex items-center gap-2 text-slate-500 text-xs mb-8">
                <span className="bg-slate-800 p-1.5 rounded-lg">📍</span>
                {report.address || "Location not provided"}
              </div>

              {report.imageUrl && (
                <div className="mb-8">
                  <img 
                    src={report.imageUrl} 
                    alt="Citizen Evidence" 
                    className="w-full h-[450px] object-cover rounded-[24px] border border-slate-800" 
                  />
                </div>
              )}

              {/* Action Toolbar */}
              <div className="flex gap-3 flex-wrap border-t border-slate-800/50 pt-8">
                <button 
                  onClick={() => updateStatus(report.id, "pending")} 
                  className="bg-yellow-500/10 text-yellow-500 px-6 py-2.5 rounded-xl hover:bg-yellow-500 hover:text-black transition-all text-xs font-bold uppercase tracking-widest"
                >
                  Set Pending
                </button>
                <button 
                  onClick={() => updateStatus(report.id, "in progress")} 
                  className="bg-blue-500/10 text-blue-500 px-6 py-2.5 rounded-xl hover:bg-blue-500 hover:text-white transition-all text-xs font-bold uppercase tracking-widest"
                >
                  Start Working
                </button>
                <button 
                  onClick={() => updateStatus(report.id, "resolved")} 
                  className="bg-green-500/10 text-green-500 px-6 py-2.5 rounded-xl hover:bg-green-500 hover:text-white transition-all text-xs font-bold uppercase tracking-widest"
                >
                  Resolve
                </button>
                <button 
                  onClick={() => deleteReport(report.id)} 
                  className="bg-red-500/10 text-red-500 px-6 py-2.5 rounded-xl hover:bg-red-600 hover:text-white transition-all text-xs font-bold uppercase tracking-widest ml-auto"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
          
          {filteredReports.length === 0 && (
            <div className="text-center py-24 bg-[#111827] rounded-[32px] border border-dashed border-slate-800">
              <p className="text-slate-500 font-medium">No reports matches your search criteria.</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}