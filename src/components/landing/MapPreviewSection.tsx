import {
  MapPinned,
  MapPin,
} from "lucide-react";

export default function MapPreviewSection() {
  return (
    <section className="px-8 pb-28">

      <div className="text-center mb-14">

        <h2 className="text-5xl font-bold">
          Live City Issue Map
        </h2>

        <p className="text-slate-400 mt-5 max-w-2xl mx-auto">
          Visualize civic complaints with live geolocation
          and smart city tracking.
        </p>

      </div>

      <div className="relative h-[500px] rounded-3xl overflow-hidden border border-white/10 bg-gradient-to-br from-[#10192f] to-[#0a0f1e]">

        {/* Grid */}
        <div className="absolute inset-0 opacity-20 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:40px_40px]" />

        {/* Center Icon */}
        <div className="absolute inset-0 flex items-center justify-center">
          <MapPinned size={120} className="text-blue-500/20" />
        </div>

        {/* Markers */}
        <div className="absolute top-20 left-24">
          <MapPin className="text-red-400" size={34} />
        </div>

        <div className="absolute top-40 right-40">
          <MapPin className="text-yellow-400" size={34} />
        </div>

        <div className="absolute bottom-28 left-1/2">
          <MapPin className="text-green-400" size={34} />
        </div>

        <div className="absolute bottom-20 right-28">
          <MapPin className="text-blue-400" size={34} />
        </div>

      </div>

    </section>
  );
}