"use client";

import { useState } from "react";
import { db } from "@/lib/firebase"; 
import { collection, addDoc, Timestamp } from "firebase/firestore";

export default function ReportForm() {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Road Damage");
  const [description, setDescription] = useState("");
  const [address, setAddress] = useState("");
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  // GET LOCATION
  const getLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation not supported");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLatitude(position.coords.latitude);
        setLongitude(position.coords.longitude);
        alert("Location captured!");
      },
      () => {
        alert("Failed to get location");
      }
    );
  };

  // SUBMIT REPORT
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);
      console.log("Saving to Firestore...");
      
      // SAVE TO FIRESTORE (Without Image)
      await addDoc(collection(db, "reports"), {
        title,
        category,
        description,
        address,
        latitude,
        longitude,
        imageUrl: "", // Keeping this blank for now
        status: "pending",
        createdAt: Timestamp.now(),
      });

      console.log("Saved successfully!");
      alert("Report submitted successfully!");

      // RESET FORM
      setTitle("");
      setCategory("Road Damage");
      setDescription("");
      setAddress("");
      setLatitude(null);
      setLongitude(null);

    } catch (error) {
      console.error("FULL ERROR:", error);
      alert("Failed to submit report");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-[#111827] p-8 rounded-3xl border border-slate-800 text-left">
        <h2 className="text-4xl font-bold mb-8 text-center text-white">
          Submit Civic Issue
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* TITLE */}
          <div>
            <label className="block mb-2 text-sm text-slate-400">Issue Title</label>
            <input
              type="text"
              required
              placeholder="Street light broken"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-[#0b1220] border border-slate-700 rounded-xl p-4 outline-none text-white focus:border-blue-500 transition-colors"
            />
          </div>

          {/* CATEGORY */}
          <div>
            <label className="block mb-2 text-sm text-slate-400">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-[#0b1220] border border-slate-700 rounded-xl p-4 outline-none text-white focus:border-blue-500 transition-colors"
            >
              <option>Road Damage</option>
              <option>Garbage</option>
              <option>Street Light</option>
              <option>Water Leakage</option>
              <option>Electricity</option>
            </select>
          </div>

          {/* DESCRIPTION */}
          <div>
            <label className="block mb-2 text-sm text-slate-400">Description</label>
            <textarea
              required
              placeholder="Describe the issue..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-[#0b1220] border border-slate-700 rounded-xl p-4 h-32 outline-none text-white focus:border-blue-500 transition-colors"
            />
          </div>

          {/* ADDRESS */}
          <div>
            <label className="block mb-2 text-sm text-slate-400">Address</label>
            <input
              type="text"
              required
              placeholder="Enter issue address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full bg-[#0b1220] border border-slate-700 rounded-xl p-4 outline-none text-white focus:border-blue-500 transition-colors"
            />
          </div>

          {/* LOCATION BUTTON */}
          <button
            type="button"
            onClick={getLocation}
            className="w-full bg-green-500 hover:bg-green-600 text-white transition rounded-xl p-4 font-semibold"
          >
            Use Current Location
          </button>

          {/* MAP */}
          {latitude && longitude && (
            <div className="bg-[#0b1220] border border-slate-700 rounded-2xl p-4">
              <iframe
                width="100%"
                height="250"
                className="rounded-2xl"
                loading="lazy"
                src={`https://maps.google.com/maps?q=${latitude},${longitude}&z=15&output=embed`}
              />
              <div className="mt-4 text-sm text-slate-400">
                <p>Latitude: {latitude}</p>
                <p>Longitude: {longitude}</p>
              </div>
            </div>
          )}

          {/* SUBMIT BUTTON */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white transition rounded-xl p-4 font-semibold disabled:opacity-50"
          >
            {loading ? "Submitting..." : "Submit Report"}
          </button>
        </form>
      </div>
    </div>
  );
}