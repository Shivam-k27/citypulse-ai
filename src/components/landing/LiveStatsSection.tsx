export default function LiveStatsSection() {
  return (
    <section className="px-8 pb-24">
      <div className="grid md:grid-cols-4 gap-6">

        <div className="bg-white/5 border border-white/10 rounded-2xl p-8 text-center">
          <h2 className="text-4xl font-bold text-blue-400">
            12K+
          </h2>

          <p className="text-slate-400 mt-3">
            Issues Reported
          </p>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-8 text-center">
          <h2 className="text-4xl font-bold text-green-400">
            8.5K+
          </h2>

          <p className="text-slate-400 mt-3">
            Issues Resolved
          </p>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-8 text-center">
          <h2 className="text-4xl font-bold text-purple-400">
            120+
          </h2>

          <p className="text-slate-400 mt-3">
            Active Workers
          </p>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-8 text-center">
          <h2 className="text-4xl font-bold text-yellow-400">
            35+
          </h2>

          <p className="text-slate-400 mt-3">
            Smart Cities
          </p>
        </div>

      </div>
    </section>
  );
}