"use client";

import { useState } from "react";
import { db, auth } from "@/lib/firebase";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { MapPin, Send, Crosshair, Loader2, AlertCircle } from "lucide-react";

export default function ReportForm() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Road Damage");
  const [address, setAddress] = useState("");
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLocating, setIsLocating] = useState(false);

  const handleGetLocation = () => {
    setIsLocating(true);
    if (!navigator.geolocation) {
      alert("Geolocation is not supported");
      setIsLocating(false);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCoords({ lat: position.coords.latitude, lng: position.coords.longitude });
        setAddress(`Location Captured: ${position.coords.latitude.toFixed(4)}, ${position.coords.longitude.toFixed(4)}`);
        setIsLocating(false);
      },
      () => { alert("Location permission denied"); setIsLocating(false); }
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth.currentUser) return alert("Please login first");
    if (!title || !description || !address) return alert("Please fill all fields");

    setIsSubmitting(true);
    try {
      await addDoc(collection(db, "reports"), {
        title,
        description,
        category,
        address,
        latitude: coords?.lat || null,
        longitude: coords?.lng || null,
        userId: auth.currentUser.uid,
        status: "pending",
        upvotes: [],
        createdAt: Timestamp.now(),
      });
      router.push("/citizen");
    } catch (err) { console.error(err); } finally { setIsSubmitting(false); }
  };

  return (
    <div className="flex flex-col w-full items-center justify-center p-6 min-h-screen bg-[#0a0f1e]">
      <div className="w-full max-w-2xl bg-[#111827] border border-slate-800 rounded-[40px] p-10 shadow-2xl">
        <div className="flex items-center gap-3 mb-8 text-white">
            <div className="p-3 bg-blue-600/20 rounded-2xl text-blue-400"><AlertCircle size={24} /></div>
            <h2 className="text-3xl font-black tracking-tight uppercase">Submit Civic Issue</h2>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Issue Title</label>
                <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Street light broken" className="w-full bg-[#0a0f1e] border border-slate-800 rounded-2xl p-4 text-white outline-none focus:border-blue-500" />
            </div>
            <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Category</label>
                <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full bg-[#0a0f1e] border border-slate-800 rounded-2xl p-4 text-white outline-none cursor-pointer">
                  <option value="Road Damage">Road Damage</option>
                  <option value="Garbage">Garbage Issues</option>
                  <option value="Water Leakage">Water/Plumbing</option>
                  <option value="Street Light">Street Lighting</option>
                </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Detailed Description</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Describe the issue..." className="w-full bg-[#0a0f1e] border border-slate-800 rounded-2xl p-4 h-32 text-white outline-none resize-none" />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Location / Address</label>
            <div className="relative">
                <MapPin className="absolute left-4 top-4 text-slate-600" size={18} />
                <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Enter address or nearby landmark" className="w-full bg-[#0a0f1e] border border-slate-800 rounded-2xl pl-12 p-4 text-white outline-none focus:border-blue-500" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
            <button type="button" onClick={handleGetLocation} className="bg-emerald-600 hover:bg-emerald-500 py-4 rounded-2xl font-bold text-white transition-all flex items-center justify-center gap-2 active:scale-95">
                {isLocating ? <Loader2 className="animate-spin" size={20} /> : <Crosshair size={20} />}
                {isLocating ? "Locating..." : "Use Current Location"}
            </button>
            <button type="submit" disabled={isSubmitting} className="bg-blue-600 hover:bg-blue-500 py-4 rounded-2xl font-black text-white transition-all flex items-center justify-center gap-3">
                {isSubmitting ? "Uploading..." : "Submit Report"}
                <Send size={18} />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}