"use client";

import ReportForm from "@/components/report/ReportForm";

export default function ReportPage() {
  return (
    <main className="min-h-screen bg-[#020817] text-white p-6">
      <div className="max-w-6xl mx-auto">
        
        {/* ADDED: Centering wrapper for the text */}
        <div className="text-center flex flex-col items-center">
          <h1 className="text-7xl font-bold mb-6">
            Report an Issue
          </h1>
          
          {/* Added max-w-2xl to keep the text from stretching too wide on large screens */}
          <p className="text-slate-400 mb-12 text-xl max-w-2xl">
            Help improve your city by reporting civic problems in real time.
          </p>
        </div>

        <ReportForm />
      </div>
    </main>
  );
}