"use client";

import {
  AlertTriangle,
  CheckCircle,
  Clock3,
  MapPinned,
} from "lucide-react";

const stats = [
  {
    title: "Pending",
    value: "34",
    icon: AlertTriangle,
    color: "text-yellow-400",
  },
  {
    title: "Resolved",
    value: "128",
    icon: CheckCircle,
    color: "text-green-400",
  },
  {
    title: "In Progress",
    value: "12",
    icon: Clock3,
    color: "text-purple-400",
  },
  {
    title: "Nearby Issues",
    value: "9",
    icon: MapPinned,
    color: "text-blue-400",
  },
];

export default function CitizenDashboard() {
  return (
    <main className="min-h-screen bg-[#0a0f1e] text-white p-8">

      {/* Header */}
      <div className="mb-10">
        <h1 className="text-5xl font-bold">
          Citizen Dashboard
        </h1>

        <p className="text-slate-400 mt-3">
          Monitor and manage reported civic issues.
        </p>
      </div>

      {/* Stats */}
      <section className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">

        {stats.map((item, index) => {
          const Icon = item.icon;

          return (
            <div
              key={index}
              className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-xl"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400">
                    {item.title}
                  </p>

                  <h2 className="text-4xl font-bold mt-3">
                    {item.value}
                  </h2>
                </div>

                <Icon className={item.color} size={42} />
              </div>
            </div>
          );
        })}

      </section>

      {/* Recent Issues */}
      <section className="mt-14">

        <h2 className="text-3xl font-bold mb-6">
          Recent Issues
        </h2>

        <div className="space-y-5">

          <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <div className="flex items-center justify-between">

              <div>
                <h3 className="text-xl font-semibold">
                  Pothole on Main Road
                </h3>

                <p className="text-slate-400 mt-2">
                  Reported 2 hours ago
                </p>
              </div>

              <span className="bg-yellow-500/20 text-yellow-400 px-4 py-2 rounded-full text-sm">
                Pending
              </span>

            </div>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <div className="flex items-center justify-between">

              <div>
                <h3 className="text-xl font-semibold">
                  Garbage Collection Delay
                </h3>

                <p className="text-slate-400 mt-2">
                  Reported yesterday
                </p>
              </div>

              <span className="bg-green-500/20 text-green-400 px-4 py-2 rounded-full text-sm">
                Resolved
              </span>

            </div>
          </div>

        </div>

      </section>
    </main>
  );
}