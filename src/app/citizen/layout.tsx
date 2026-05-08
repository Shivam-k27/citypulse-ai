import React from "react";
import Sidebar from "@/components/layout/Sidebar";

export default function CitizenLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex bg-[#0a0f1e] text-white">
      <Sidebar />

      <main className="flex-1">
        {children}
      </main>
    </div>
  );
}