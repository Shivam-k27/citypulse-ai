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
}

export default function DashboardPage() {
  const router = useRouter();
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");

  // 1. AUTH PROTECTION & REAL-TIME LISTENER
  useEffect(() => {
    // Watch for Auth changes
    const authUnsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.push("/login");
      }
    });

    // Real-time Firestore Listener
    const q = query(collection(db, "reports"), orderBy("createdAt", "desc"));
    const snapUnsubscribe = onSnapshot(q, (snapshot) => {
      const reportsData = snapshot.docs.map((docItem) => ({
        id: docItem.id,
        ...(docItem.data() as Omit<Report, "id">),
      }));
      setReports(reportsData);
      setLoading(false);
    }, (error) => {
      console.error("Firestore Error:", error);
      setLoading(false);
    });

    // CLEANUP
    return () => {
      authUnsubscribe();
      snapUnsubscribe();
    };
  }, [router]);

  // 2. ACTION LOGIC
  const updateStatus = async (id: string, newStatus: string) => {
    try {
      const reportRef = doc(db, "reports", id);
      await updateDoc(reportRef, { status: newStatus });
    } catch (error) {
      console.error("Update Error:", error);
    }
  };

  const deleteReport = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this report?")) {
      try {
        await deleteDoc(doc(db, "reports", id));
      } catch (error) {
        console.error("Delete Error:", error);
      }
    }
  };

  // 3. FILTERED DATA
  const filteredReports = reports.filter((report) => {
    const matchesSearch = report.title?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || report.status?.toLowerCase() === statusFilter.toLowerCase();
    const matchesCategory = categoryFilter === "all" || report.category === categoryFilter;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  // 4. CHART CALCULATIONS (Memoized)
  const statusData = useMemo(() => [
    { name: "Pending", value: reports.filter((r) => r.status?.toLowerCase() === "pending").length },
    { name: "In Progress", value: reports.filter((r) => r.status?.toLowerCase() === "in progress").length },
    { name: "Resolved", value: reports.filter((r) => r.status?.toLowerCase() === "resolved").length },
  ], [reports]);

  const categoryData = useMemo(() => [
    { name: "Road", value: reports.filter((r) => r.category === "Road Damage").length },
    { name: "Garbage", value: reports.filter((r) => r.category === "Garbage").length },
    { name: "Street Light", value: reports.filter((r) => r.category === "Street Light").length },
    { name: "Water", value: reports.filter((r) => r.category === "Water Leakage").length },
  ], [reports]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0f1e] flex flex-col items-center justify-center text-white">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-xl">Loading Admin Panel...</p>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#0a0f1e] text-white p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-5xl font-bold">Admin Dashboard</h1>
          <button 
            onClick={() => auth.signOut()} 
            className="bg-red-500/10 text-red-400 border border-red-500/20 px-4 py-2 rounded-lg hover:bg-red-600 hover:text-white transition"
          >
            Logout
          </button>
        </div>

        {/* STATS CARDS */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <div className="bg-[#111827] p-6 rounded-2xl border border-slate-800">
            <p className="text-slate-400 text-sm mb-2">Total Reports</p>
            <h2 className="text-4xl font-bold">{reports.length}</h2>
          </div>
          {statusData.map((status) => (
            <div key={status.name} className="bg-[#111827] p-6 rounded-2xl border border-slate-800">
              <p className="text-slate-400 text-sm mb-2">{status.name}</p>
              <h2 className={`text-4xl font-bold ${status.name === 'Pending' ? 'text-yellow-400' : status.name === 'In Progress' ? 'text-blue-400' : 'text-green-400'}`}>
                {status.value}
              </h2>
            </div>
          ))}
        </div>

        {/* CHARTS */}
        <div className="grid md:grid-cols-2 gap-6 mb-10">
          <div className="bg-[#111827] p-6 rounded-2xl border border-slate-800">
            <h2 className="text-2xl font-semibold mb-6">Report Status</h2>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={statusData} dataKey="value" outerRadius={100} label>
                    <Cell fill="#eab308" />
                    <Cell fill="#3b82f6" />
                    <Cell fill="#22c55e" />
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: '#111827', border: '1px solid #1e293b' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-[#111827] p-6 rounded-2xl border border-slate-800">
            <h2 className="text-2xl font-semibold mb-6">Categories</h2>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={categoryData}>
                  <XAxis dataKey="name" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip contentStyle={{ backgroundColor: '#111827', border: '1px solid #1e293b' }} />
                  <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* FILTERS */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <input
            type="text"
            placeholder="Search reports..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-[#111827] border border-slate-700 rounded-xl p-4 outline-none focus:border-blue-500"
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-[#111827] border border-slate-700 rounded-xl p-4 outline-none"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="in progress">In Progress</option>
            <option value="resolved">Resolved</option>
          </select>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-[#111827] border border-slate-700 rounded-xl p-4 outline-none"
          >
            <option value="all">All Categories</option>
            <option value="Road Damage">Road Damage</option>
            <option value="Garbage">Garbage</option>
            <option value="Street Light">Street Light</option>
            <option value="Water Leakage">Water Leakage</option>
          </select>
        </div>

        {/* REPORTS FEED */}
        <div className="grid gap-6">
          {filteredReports.map((report) => (
            <div key={report.id} className="bg-[#111827] border border-slate-800 rounded-2xl p-6 hover:border-slate-600 transition">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-2xl font-semibold">{report.title}</h2>
                  <p className="text-blue-400 font-medium">{report.category}</p>
                </div>
                <span className={`px-4 py-1 rounded-full text-sm font-bold ${
                  report.status?.toLowerCase() === 'resolved' ? 'bg-green-500/20 text-green-400' :
                  report.status?.toLowerCase() === 'in progress' ? 'bg-blue-500/20 text-blue-400' :
                  'bg-yellow-500/20 text-yellow-300'
                }`}>
                  {report.status}
                </span>
              </div>

              <p className="text-slate-300 mb-4">{report.description}</p>
              <p className="text-slate-500 text-sm mb-4">📍 {report.address || "Location not provided"}</p>

              {report.imageUrl && (
                <div className="mb-4">
                  <img src={report.imageUrl} alt="Report" className="w-full h-72 object-cover rounded-2xl border border-slate-700" />
                </div>
              )}

              {report.latitude && report.longitude && (
                <div className="mb-6 rounded-2xl overflow-hidden border border-slate-700 h-[250px]">
                   <iframe
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      loading="lazy"
                      src={`https://maps.google.com/maps?q=${report.latitude},${report.longitude}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
                    />
                </div>
              )}

              <div className="flex gap-3 flex-wrap border-t border-slate-800 pt-5">
                <button onClick={() => updateStatus(report.id, "pending")} className="bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 px-4 py-2 rounded-lg hover:bg-yellow-500 hover:text-black transition">Set Pending</button>
                <button onClick={() => updateStatus(report.id, "in progress")} className="bg-blue-500/10 text-blue-500 border border-blue-500/20 px-4 py-2 rounded-lg hover:bg-blue-500 hover:text-white transition">In Progress</button>
                <button onClick={() => updateStatus(report.id, "resolved")} className="bg-green-500/10 text-green-500 border border-green-500/20 px-4 py-2 rounded-lg hover:bg-green-500 hover:text-white transition">Resolve</button>
                <button onClick={() => deleteReport(report.id)} className="bg-red-500/10 text-red-500 border border-red-500/20 px-4 py-2 rounded-lg hover:bg-red-600 hover:text-white transition ml-auto">Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}