export default function DashboardPreviewSection() {
  return (
    <section className="px-8 pb-28">

      <div className="text-center mb-14">

        <h2 className="text-5xl font-bold">
          Smart Analytics Dashboard
        </h2>

        <p className="text-slate-400 mt-5">
          Monitor real-time civic analytics.
        </p>

      </div>

      <div className="grid md:grid-cols-4 gap-6">

        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <h3 className="text-4xl font-bold text-yellow-400">
            342
          </h3>

          <p className="text-slate-400 mt-2">
            Pending Issues
          </p>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <h3 className="text-4xl font-bold text-green-400">
            1284
          </h3>

          <p className="text-slate-400 mt-2">
            Resolved Issues
          </p>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <h3 className="text-4xl font-bold text-purple-400">
            89
          </h3>

          <p className="text-slate-400 mt-2">
            In Progress
          </p>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <h3 className="text-4xl font-bold text-blue-400">
            542
          </h3>

          <p className="text-slate-400 mt-2">
            Mapped Locations
          </p>
        </div>

      </div>

    </section>
  );
}