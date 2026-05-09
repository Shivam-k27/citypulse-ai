"use client";

import { useState } from "react";
import { db } from "@/lib/firebase";
import { collection, addDoc, Timestamp } from "firebase/firestore";

export default function ReportForm() {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Road Damage");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState<File | null>(null);

  const handleSubmit = async () => {
    try {
      await addDoc(collection(db, "reports"), {
        title,
        category,
        description,
        imageName: image ? image.name : null,
        status: "pending",
        createdAt: Timestamp.now(),
      });

      alert("Report submitted successfully!");

      setTitle("");
      setCategory("Road Damage");
      setDescription("");
      setImage(null);

    } catch (error) {
      console.error(error);
      alert("Failed to submit report");
    }
  };

  return (
    <div className="max-w-md">
      <div className="bg-[#111827] p-8 rounded-3xl border border-slate-800">

        <h2 className="text-4xl font-bold mb-8">
          Submit Civic Issue
        </h2>

        <div className="space-y-6">

          <div>
            <label className="block mb-2 text-sm text-slate-400">
              Issue Title
            </label>

            <input
              type="text"
              placeholder="Street light broken"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-[#0b1220] border border-slate-700 rounded-xl p-4 outline-none"
            />
          </div>

          <div>
            <label className="block mb-2 text-sm text-slate-400">
              Category
            </label>

            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-[#0b1220] border border-slate-700 rounded-xl p-4 outline-none"
            >
              <option>Road Damage</option>
              <option>Garbage</option>
              <option>Street Light</option>
              <option>Water Leakage</option>
              <option>Electricity</option>
            </select>
          </div>

          <div>
            <label className="block mb-2 text-sm text-slate-400">
              Description
            </label>

            <textarea
              placeholder="Describe the issue..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-[#0b1220] border border-slate-700 rounded-xl p-4 h-32 outline-none"
            />
          </div>

          <div>
            <label className="block mb-2 text-sm text-slate-400">
              Upload Image
            </label>

            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  setImage(e.target.files[0]);
                }
              }}
              className="w-full bg-[#0b1220] border border-slate-700 rounded-xl p-3 text-white"
            />
          </div>

          <button
            type="button"
            onClick={handleSubmit}
            className="w-full bg-blue-500 hover:bg-blue-600 transition rounded-xl p-4 font-semibold"
          >
            Submit Report
          </button>

        </div>
      </div>
    </div>
  );
}