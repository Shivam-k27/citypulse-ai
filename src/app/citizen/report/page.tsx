"use client";

import { useState } from "react";
import { Upload, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ReportIssuePage() {
  const [preview, setPreview] = useState<string | null>(null);

  const handleImage = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setPreview(URL.createObjectURL(file));
  };

  return (
    <main className="min-h-screen bg-[#0a0f1e] text-white p-8">

      {/* Header */}
      <div className="mb-10">
        <h1 className="text-5xl font-bold">
          Report Civic Issue
        </h1>

        <p className="text-slate-400 mt-3">
          Upload issue details with image and location.
        </p>
      </div>

      {/* Form */}
      <div className="max-w-3xl bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-xl">

        {/* Title */}
        <div className="mb-6">
          <label className="block mb-2 text-slate-300">
            Issue Title
          </label>

          <input
            type="text"
            placeholder="Enter issue title"
            className="w-full bg-[#10192f] border border-white/10 rounded-xl p-4 outline-none"
          />
        </div>

        {/* Description */}
        <div className="mb-6">
          <label className="block mb-2 text-slate-300">
            Description
          </label>

          <textarea
            placeholder="Describe the issue..."
            rows={5}
            className="w-full bg-[#10192f] border border-white/10 rounded-xl p-4 outline-none"
          />
        </div>

        {/* Category */}
        <div className="mb-6">
          <label className="block mb-2 text-slate-300">
            Category
          </label>

          <select className="w-full bg-[#10192f] border border-white/10 rounded-xl p-4 outline-none">
            <option>Pothole</option>
            <option>Garbage</option>
            <option>Street Light</option>
            <option>Water Leakage</option>
          </select>
        </div>

        {/* Upload */}
        <div className="mb-6">
          <label className="block mb-2 text-slate-300">
            Upload Image
          </label>

          <label className="flex flex-col items-center justify-center border-2 border-dashed border-white/10 rounded-2xl h-64 cursor-pointer bg-[#10192f]">

            <Upload className="text-blue-400 mb-4" size={42} />

            <p className="text-slate-400">
              Click to upload image
            </p>

            <input
              type="file"
              hidden
              onChange={handleImage}
            />
          </label>

          {preview && (
            <img
              src={preview}
              alt="Preview"
              className="mt-6 rounded-2xl border border-white/10"
            />
          )}
        </div>

        {/* Location */}
        <div className="mb-8">
          <label className="block mb-2 text-slate-300">
            Location
          </label>

          <button className="flex items-center gap-3 bg-[#10192f] border border-white/10 rounded-xl px-5 py-4 hover:border-blue-500/40 transition">
            <MapPin size={20} />
            Detect Current Location
          </button>
        </div>

        {/* AI Suggestion */}
        <div className="mb-8 bg-blue-500/10 border border-blue-500/20 rounded-2xl p-5">
          <h3 className="text-blue-400 font-semibold mb-2">
            AI Prediction
          </h3>

          <p className="text-slate-300">
            Category: <span className="text-white">Pothole</span>
          </p>

          <p className="text-slate-300 mt-2">
            Severity: <span className="text-red-400">High</span>
          </p>
        </div>

        {/* Submit */}
        <Button className="w-full bg-blue-500 hover:bg-blue-600 py-7 text-lg rounded-2xl">
          Submit Report
        </Button>

      </div>

    </main>
  );
}