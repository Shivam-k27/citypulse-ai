"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import {
  collection,
  getDocs,
  orderBy,
  query,
} from "firebase/firestore";

interface Report {
  id: string;
  title: string;
  category: string;
  description: string;
  status: string;
}

export default function DashboardPage() {
  const [reports, setReports] = useState<Report[]>([]);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const q = query(
          collection(db, "reports"),
          orderBy("createdAt", "desc")
        );

        const querySnapshot = await getDocs(q);

        const reportsData: Report[] = [];

        querySnapshot.forEach((doc) => {
          reportsData.push({
            id: doc.id,
            ...(doc.data() as Omit<Report, "id">),
          });
        });

        setReports(reportsData);

      } catch (error) {
        console.error(error);
      }
    };

    fetchReports();
  }, []);

  return (
    <main className="min-h-screen bg-[#0a0f1e] text-white p-8">

      <div className="max-w-6xl mx-auto">

        <h1 className="text-5xl font-bold mb-10">
          Admin Dashboard
        </h1>

        <div className="grid gap-6">

          {reports.map((report) => (
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
            </div>
          ))}

        </div>

      </div>

    </main>
  );
}