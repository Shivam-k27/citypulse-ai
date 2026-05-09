import ReportForm from "@/components/report/ReportForm";

export default function ReportPage() {
  return (
    <main className="min-h-screen bg-[#0a0f1e] text-white px-6 py-16">

      <div className="max-w-5xl mx-auto mb-12">

        <h1 className="text-6xl font-bold mb-6">
          Report an Issue
        </h1>

        <p className="text-slate-400 text-lg">
          Help improve your city by reporting civic problems
          in real time.
        </p>

      </div>

      <ReportForm />

    </main>
  );
}