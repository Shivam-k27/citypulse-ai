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

  const [reports, setReports] =
    useState<Report[]>([]);

  const [searchTerm, setSearchTerm] =
    useState("");

  const [statusFilter, setStatusFilter] =
    useState("all");

  const [categoryFilter, setCategoryFilter] =
    useState("all");

  // UPDATE STATUS

  const updateStatus = async (
    id: string,
    newStatus: string
  ) => {

    try {

      const reportRef = doc(
        db,
        "reports",
        id
      );

      await updateDoc(reportRef, {
        status: newStatus,
      });

    } catch (error) {

      console.error(error);

    }
  };

  // DELETE REPORT

  const deleteReport = async (
    id: string
  ) => {

    try {

      await deleteDoc(
        doc(db, "reports", id)
      );

    } catch (error) {

      console.error(error);

    }
  };

  // REALTIME REPORTS

  useEffect(() => {

    const q = query(
      collection(db, "reports"),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(

      q,

      (querySnapshot) => {

        const reportsData: Report[] = [];

        querySnapshot.forEach((docItem) => {

          reportsData.push({
            id: docItem.id,
            ...(docItem.data() as Omit<
              Report,
              "id"
            >),
          });

        });

        setReports(reportsData);

      },

      (error) => {

        console.error(error);

      }

    );

    return () => unsubscribe();

  }, []);

  // FILTER REPORTS

  const filteredReports = reports.filter(
    (report) => {

      const matchesSearch =
        report.title
          .toLowerCase()
          .includes(
            searchTerm.toLowerCase()
          );

      const matchesStatus =
        statusFilter === "all" ||
        report.status === statusFilter;

      const matchesCategory =
        categoryFilter === "all" ||
        report.category === categoryFilter;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesCategory
      );
    }
  );

  // STATUS DATA

  const statusData = [

    {
      name: "Pending",
      value: reports.filter(
        (r) => r.status === "pending"
      ).length,
    },

    {
      name: "In Progress",
      value: reports.filter(
        (r) =>
          r.status === "in progress"
      ).length,
    },

    {
      name: "Resolved",
      value: reports.filter(
        (r) => r.status === "resolved"
      ).length,
    },

  ];

  // CATEGORY DATA

  const categoryData = [

    {
      name: "Road",
      value: reports.filter(
        (r) =>
          r.category ===
          "Road Damage"
      ).length,
    },

    {
      name: "Garbage",
      value: reports.filter(
        (r) =>
          r.category ===
          "Garbage"
      ).length,
    },

    {
      name: "Street Light",
      value: reports.filter(
        (r) =>
          r.category ===
          "Street Light"
      ).length,
    },

  ];

  return (

    <main className="min-h-screen bg-[#0a0f1e] text-white p-8">

      <div className="max-w-6xl mx-auto">

        <h1 className="text-5xl font-bold mb-10">
          Admin Dashboard
        </h1>

        {/* STATS */}

        <div className="grid md:grid-cols-4 gap-4 mb-8">

          <div className="bg-[#111827] p-6 rounded-2xl border border-slate-800">

            <p className="text-slate-400 text-sm mb-2">
              Total Reports
            </p>

            <h2 className="text-4xl font-bold">
              {reports.length}
            </h2>

          </div>

          <div className="bg-[#111827] p-6 rounded-2xl border border-slate-800">

            <p className="text-slate-400 text-sm mb-2">
              Pending
            </p>

            <h2 className="text-4xl font-bold text-yellow-400">

              {
                reports.filter(
                  (report) =>
                    report.status ===
                    "pending"
                ).length
              }

            </h2>

          </div>

          <div className="bg-[#111827] p-6 rounded-2xl border border-slate-800">

            <p className="text-slate-400 text-sm mb-2">
              In Progress
            </p>

            <h2 className="text-4xl font-bold text-blue-400">

              {
                reports.filter(
                  (report) =>
                    report.status ===
                    "in progress"
                ).length
              }

            </h2>

          </div>

          <div className="bg-[#111827] p-6 rounded-2xl border border-slate-800">

            <p className="text-slate-400 text-sm mb-2">
              Resolved
            </p>

            <h2 className="text-4xl font-bold text-green-400">

              {
                reports.filter(
                  (report) =>
                    report.status ===
                    "resolved"
                ).length
              }

            </h2>

          </div>

        </div>

        {/* CHARTS */}

        <div className="grid md:grid-cols-2 gap-6 mb-10">

          <div className="bg-[#111827] p-6 rounded-2xl border border-slate-800">

            <h2 className="text-2xl font-semibold mb-6">
              Report Status
            </h2>

            <div className="h-[300px]">

              <ResponsiveContainer width="100%" height="100%">

                <PieChart>

                  <Pie
                    data={statusData}
                    dataKey="value"
                    outerRadius={100}
                    label
                  >

                    <Cell fill="#eab308" />
                    <Cell fill="#3b82f6" />
                    <Cell fill="#22c55e" />

                  </Pie>

                  <Tooltip />

                </PieChart>

              </ResponsiveContainer>

            </div>

          </div>

          <div className="bg-[#111827] p-6 rounded-2xl border border-slate-800">

            <h2 className="text-2xl font-semibold mb-6">
              Categories
            </h2>

            <div className="h-[300px]">

              <ResponsiveContainer width="100%" height="100%">

                <BarChart data={categoryData}>

                  <XAxis dataKey="name" />

                  <YAxis />

                  <Tooltip />

                  <Bar
                    dataKey="value"
                    fill="#3b82f6"
                  />

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
            onChange={(e) =>
              setSearchTerm(
                e.target.value
              )
            }
            className="bg-[#111827] border border-slate-700 rounded-xl p-4 outline-none"
          />

          <select
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(
                e.target.value
              )
            }
            className="bg-[#111827] border border-slate-700 rounded-xl p-4 outline-none"
          >

            <option value="all">
              All Status
            </option>

            <option value="pending">
              Pending
            </option>

            <option value="in progress">
              In Progress
            </option>

            <option value="resolved">
              Resolved
            </option>

          </select>

          <select
            value={categoryFilter}
            onChange={(e) =>
              setCategoryFilter(
                e.target.value
              )
            }
            className="bg-[#111827] border border-slate-700 rounded-xl p-4 outline-none"
          >

            <option value="all">
              All Categories
            </option>

            <option value="Road Damage">
              Road Damage
            </option>

            <option value="Garbage">
              Garbage
            </option>

            <option value="Street Light">
              Street Light
            </option>

            <option value="Water Leakage">
              Water Leakage
            </option>

            <option value="Electricity">
              Electricity
            </option>

          </select>

        </div>

        {/* REPORTS */}

        <div className="grid gap-6">

          {filteredReports.map(
            (report) => (

              <div
                key={report.id}
                className="bg-[#111827] border border-slate-800 rounded-2xl p-6"
              >

                <div className="flex justify-between items-center mb-4">

                  <h2 className="text-2xl font-semibold">
                    {report.title}
                  </h2>

                  <span className="bg-yellow-500/20 text-yellow-300 px-4 py-1 rounded-full text-sm">
                    {report.status}
                  </span>

                </div>

                <p className="text-blue-400 mb-3">
                  {report.category}
                </p>

                <p className="text-slate-300">
                  {report.description}
                </p>

                <p className="text-slate-400 mt-4">
                  📍 Address:
                  {" "}
                  {report.address ||
                    "N/A"}
                </p>

                {report.imageUrl && (

  <div className="mt-4">

    <img
      src={report.imageUrl}
      alt="Report"
      className="w-full h-72 object-cover rounded-2xl border border-slate-700"
    />

  </div>

)}

                {report.latitude &&
                  report.longitude && (

                  <div className="mt-5 rounded-2xl overflow-hidden">

                    <iframe
                      width="100%"
                      height="250"
                      loading="lazy"
                      src={`https://maps.google.com/maps?q=${report.latitude},${report.longitude}&z=15&output=embed`}
                    />

                  </div>

                )}

                <div className="flex gap-3 mt-5 flex-wrap">

                  <button
                    onClick={() =>
                      updateStatus(
                        report.id,
                        "pending"
                      )
                    }
                    className="bg-yellow-500 px-4 py-2 rounded-lg text-black font-medium"
                  >
                    Pending
                  </button>

                  <button
                    onClick={() =>
                      updateStatus(
                        report.id,
                        "in progress"
                      )
                    }
                    className="bg-blue-500 px-4 py-2 rounded-lg font-medium"
                  >
                    In Progress
                  </button>

                  <button
                    onClick={() =>
                      updateStatus(
                        report.id,
                        "resolved"
                      )
                    }
                    className="bg-green-500 px-4 py-2 rounded-lg font-medium"
                  >
                    Resolved
                  </button>

                  <button
                    onClick={() =>
                      deleteReport(
                        report.id
                      )
                    }
                    className="bg-red-500 px-4 py-2 rounded-lg font-medium"
                  >
                    Delete
                  </button>

                </div>

              </div>

            )
          )}

        </div>

      </div>

    </main>

  );
}