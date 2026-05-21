"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
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
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from "recharts";

interface Report {
  id: string;
  title: string;
  category: string;
  description: string;
  status: string;
  Location?: { lat: number; lng: number; address?: string };
  createdAt?: any;
}

export default function AdminDashboard() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [categoryFilter, setCategoryFilter] = useState("All Categories");

  useEffect(() => {
    let unsubscribe: () => void;

    const trySubscribe = (withOrder: boolean) => {
      const base = collection(db, "reports");
      const q = withOrder
        ? query(base, orderBy("createdAt", "desc"))
        : query(base);

      unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          const data = snapshot.docs.map((d) => ({
            id: d.id,
            ...d.data(),
          })) as Report[];

          if (!withOrder) {
            data.sort((a, b) => {
              const ta = a.createdAt?.toMillis?.() ?? 0;
              const tb = b.createdAt?.toMillis?.() ?? 0;
              return tb - ta;
            });
          }

          setReports(data);
          setLoading(false);
          setError(null);
        },
        (err) => {
          console.error("Firestore query error:", err);
          if (withOrder) {
            trySubscribe(false); // retry without orderBy
          } else {
            setError("Failed to load reports. Check Firestore rules/indexes.");
            setLoading(false);
          }
        }
      );
    };

    trySubscribe(true);
    return () => unsubscribe?.();
  }, []);

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      await updateDoc(doc(db, "reports", id), { status: newStatus.toLowerCase() });
    } catch (err) {
      console.error("Error updating status:", err);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this report?")) {
      try {
        await deleteDoc(doc(db, "reports", id));
      } catch (err) {
        console.error("Error deleting report:", err);
      }
    }
  };

  const totalReports = reports.length;
  const pendingCount = reports.filter((r) => r.status?.toLowerCase() === "pending").length;
  const inProgressCount = reports.filter((r) => r.status?.toLowerCase() === "in progress").length;
  const resolvedCount = reports.filter((r) => r.status?.toLowerCase() === "resolved").length;

  const pieData = [
    { name: "Pending", value: pendingCount, color: "#eab308" },
    { name: "In Progress", value: inProgressCount, color: "#3b82f6" },
    { name: "Resolved", value: resolvedCount, color: "#22c55e" },
  ];

  const categories = ["Road Damage", "Garbage", "Water Leakage", "Street Light", "Electricity"];
  const barData = categories.map((cat) => ({
    name: cat,
    count: reports.filter((r) => r.category?.toLowerCase() === cat.toLowerCase()).length,
  }));

  const filteredReports = reports.filter((report) => {
    const matchesSearch =
      report.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "All Status" ||
      report.status?.toLowerCase() === statusFilter.toLowerCase();
    const matchesCategory =
      categoryFilter === "All Categories" ||
      report.category?.toLowerCase() === categoryFilter.toLowerCase();
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const buildMapUrl = (lat: number, lng: number) => {
    const delta = 0.01;
    const bbox = `${lng - delta},${lat - delta},${lng + delta},${lat + delta}`;
    return `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat},${lng}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#070d19] text-white flex items-center justify-center">
        <p className="animate-pulse tracking-wider font-semibold">Loading Administrative Dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#070d19] text-white flex items-center justify-center">
        <p className="text-red-400 font-semibold">{error}</p>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#070d19] text-white p-6 md:p-10">
      <div className="max-w-7xl mx-auto space-y-8">

        <h1 className="text-4xl font-extrabold tracking-tight">Admin Dashboard</h1>

        {/* STAT COUNTERS */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Total Reports", value: totalReports, color: "text-white" },
            { label: "Pending", value: pendingCount, color: "text-yellow-500" },
            { label: "In Progress", value: inProgressCount, color: "text-blue-500" },
            { label: "Resolved", value: resolvedCount, color: "text-green-500" },
          ].map(({ label, value, color }) => (
            <div key={label} className="bg-[#0f172a] border border-slate-800 rounded-xl p-6">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">{label}</h3>
              <p className={`text-3xl font-bold mt-2 ${color}`}>{value}</p>
            </div>
          ))}
        </section>

        {/* CHARTS */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-[#0f172a] border border-slate-800 rounded-xl p-6 h-80 flex flex-col">
            <h3 className="text-lg font-bold mb-4">Report Status</h3>
            <div className="flex-1 min-h-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={70}>
                    {pieData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-[#0f172a] border border-slate-800 rounded-xl p-6 h-80 flex flex-col">
            <h3 className="text-lg font-bold mb-4">Categories</h3>
            <div className="flex-1 min-h-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData}>
                  <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} />
                  <YAxis stroke="#94a3b8" fontSize={11} allowDecimals={false} />
                  <Tooltip />
                  <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </section>

        {/* FILTERS */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            type="text"
            placeholder="Search reports..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-[#0f172a] border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-200 focus:outline-none focus:border-blue-500 transition-colors w-full"
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-[#0f172a] border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-300 focus:outline-none focus:border-blue-500 transition-colors w-full"
          >
            <option>All Status</option>
            <option>Pending</option>
            <option>In Progress</option>
            <option>Resolved</option>
          </select>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-[#0f172a] border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-300 focus:outline-none focus:border-blue-500 transition-colors w-full"
          >
            <option>All Categories</option>
            {categories.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
          </select>
        </section>

        {/* REPORTS LIST */}
        <section className="space-y-4">
          {filteredReports.length > 0 ? filteredReports.map((report) => {
            const lat = report.Location?.lat ?? 25.5941;
            const lng = report.Location?.lng ?? 85.1234;

            return (
              <div key={report.id} className="bg-[#0f172a] border border-slate-800 rounded-xl p-6 space-y-4">
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <h2 className="text-xl font-bold tracking-tight text-slate-100 capitalize">{report.title}</h2>
                    <p className="text-xs text-blue-400 font-medium uppercase tracking-wider mt-1">{report.category}</p>
                  </div>
                  <span className={`px-2.5 py-1 rounded text-xs font-mono font-bold uppercase border ${
                    report.status?.toLowerCase() === "resolved" ? "bg-green-500/10 border-green-500/20 text-green-400" :
                    report.status?.toLowerCase() === "in progress" ? "bg-blue-500/10 border-blue-500/20 text-blue-400" :
                    "bg-yellow-500/10 border-yellow-500/20 text-yellow-400"
                  }`}>
                    {report.status || "pending"}
                  </span>
                </div>

                <p className="text-sm text-slate-400 leading-relaxed">{report.description}</p>

                {report.Location?.address && (
                  <p className="text-xs text-slate-400 flex items-center gap-1">
                    📍 <span className="text-slate-500">Address:</span> {report.Location.address}
                  </p>
                )}

                {/* ✅ FIXED: OpenStreetMap embed — no API key needed, works in all browsers */}
                {report.Location && (
                  <div className="w-full h-64 rounded-xl border border-slate-800/80 overflow-hidden shadow-inner">
                    <iframe
                      title={`Map for ${report.title}`}
                      width="100%"
                      height="100%"
                      className="border-none"
                      loading="lazy"
                      src={buildMapUrl(lat, lng)}
                    />
                  </div>
                )}

                <div className="flex flex-wrap gap-2 pt-3 border-t border-slate-800/40">
                  <button onClick={() => handleStatusChange(report.id, "pending")}
                    className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold text-xs px-4 py-2 rounded-lg transition-colors">
                    Pending
                  </button>
                  <button onClick={() => handleStatusChange(report.id, "in progress")}
                    className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs px-4 py-2 rounded-lg transition-colors">
                    In Progress
                  </button>
                  <button onClick={() => handleStatusChange(report.id, "resolved")}
                    className="bg-green-600 hover:bg-green-500 text-white font-bold text-xs px-4 py-2 rounded-lg transition-colors">
                    Resolved
                  </button>
                  <button onClick={() => handleDelete(report.id)}
                    className="bg-red-600 hover:bg-red-500 text-white font-bold text-xs px-4 py-2 rounded-lg transition-colors sm:ml-auto">
                    Delete
                  </button>
                </div>
              </div>
            );
          }) : (
            <div className="text-center py-12 border border-dashed border-slate-800 rounded-xl text-slate-500 text-sm">
              No matching records found.
            </div>
          )}
        </section>

      </div>
    </main>
  );
}