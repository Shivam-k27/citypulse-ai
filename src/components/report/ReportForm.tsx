"use client";

import { useState } from "react";

import { db, storage } from "@/lib/firebase";

import {
  collection,
  addDoc,
  Timestamp,
} from "firebase/firestore";

import {
  ref,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";

export default function ReportForm() {

  const [title, setTitle] =
    useState("");

  const [category, setCategory] =
    useState("Road Damage");

  const [description, setDescription] =
    useState("");

  const [address, setAddress] =
    useState("");

  const [image, setImage] =
    useState<File | null>(null);

  const [latitude, setLatitude] =
    useState<number | null>(null);

  const [longitude, setLongitude] =
    useState<number | null>(null);

  const [loading, setLoading] =
    useState(false);

  // GET LOCATION

  const getLocation = () => {

    if (!navigator.geolocation) {

      alert("Geolocation not supported");

      return;

    }

    navigator.geolocation.getCurrentPosition(

      (position) => {

        setLatitude(
          position.coords.latitude
        );

        setLongitude(
          position.coords.longitude
        );

        alert("Location captured!");

      },

      () => {

        alert("Failed to get location");

      }

    );
  };

  // SUBMIT REPORT

  const handleSubmit = async () => {

    try {

      setLoading(true);

      let imageUrl = "";

      // IMAGE UPLOAD

      if (image) {

        const imageRef = ref(
          storage,
          `reports/${Date.now()}-${image.name}`
        );

        await uploadBytes(
          imageRef,
          image
        );

        imageUrl =
          await getDownloadURL(
            imageRef
          );
      }

      // SAVE TO FIRESTORE

      await addDoc(
        collection(db, "reports"),
        {

          title,
          category,
          description,
          address,

          latitude,
          longitude,

          imageUrl,

          status: "pending",

          createdAt:
            Timestamp.now(),

        }
      );

      alert(
        "Report submitted successfully!"
      );

      setTitle("");

      setCategory(
        "Road Damage"
      );

      setDescription("");

      setAddress("");

      setImage(null);

      setLatitude(null);

      setLongitude(null);

    } catch (error) {

      console.error(error);

      alert(
        "Failed to submit report"
      );

    } finally {

      setLoading(false);

    }
  };

  return (

    <div className="max-w-md mx-auto">

      <div className="bg-[#111827] p-8 rounded-3xl border border-slate-800">

        <h2 className="text-4xl font-bold mb-8 text-center">
          Submit Civic Issue
        </h2>

        <div className="space-y-6">

          {/* TITLE */}

          <div>

            <label className="block mb-2 text-sm text-slate-400">
              Issue Title
            </label>

            <input
              type="text"
              placeholder="Street light broken"
              value={title}
              onChange={(e) =>
                setTitle(
                  e.target.value
                )
              }
              className="w-full bg-[#0b1220] border border-slate-700 rounded-xl p-4 outline-none"
            />

          </div>

          {/* CATEGORY */}

          <div>

            <label className="block mb-2 text-sm text-slate-400">
              Category
            </label>

            <select
              value={category}
              onChange={(e) =>
                setCategory(
                  e.target.value
                )
              }
              className="w-full bg-[#0b1220] border border-slate-700 rounded-xl p-4 outline-none"
            >

              <option>
                Road Damage
              </option>

              <option>
                Garbage
              </option>

              <option>
                Street Light
              </option>

              <option>
                Water Leakage
              </option>

              <option>
                Electricity
              </option>

            </select>

          </div>

          {/* DESCRIPTION */}

          <div>

            <label className="block mb-2 text-sm text-slate-400">
              Description
            </label>

            <textarea
              placeholder="Describe the issue..."
              value={description}
              onChange={(e) =>
                setDescription(
                  e.target.value
                )
              }
              className="w-full bg-[#0b1220] border border-slate-700 rounded-xl p-4 h-32 outline-none"
            />

          </div>

          {/* ADDRESS */}

          <div>

            <label className="block mb-2 text-sm text-slate-400">
              Address
            </label>

            <input
              type="text"
              placeholder="Enter issue address"
              value={address}
              onChange={(e) =>
                setAddress(
                  e.target.value
                )
              }
              className="w-full bg-[#0b1220] border border-slate-700 rounded-xl p-4 outline-none"
            />

          </div>

          {/* LOCATION BUTTON */}

          <button
            type="button"
            onClick={getLocation}
            className="w-full bg-green-500 hover:bg-green-600 transition rounded-xl p-4 font-semibold"
          >
            Use Current Location
          </button>

          {/* MAP */}

          {latitude &&
            longitude && (

            <div className="bg-[#0b1220] border border-slate-700 rounded-2xl p-4">

              <iframe
                width="100%"
                height="250"
                className="rounded-2xl"
                loading="lazy"
                src={`https://maps.google.com/maps?q=${latitude},${longitude}&z=15&output=embed`}
              />

              <div className="mt-4 text-sm text-slate-400">

                <p>
                  Latitude:
                  {" "}
                  {latitude}
                </p>

                <p>
                  Longitude:
                  {" "}
                  {longitude}
                </p>

              </div>

            </div>

          )}

          {/* IMAGE */}

          <div>

            <label className="block mb-2 text-sm text-slate-400">
              Upload Image
            </label>

            <input
              type="file"
              accept="image/*"
              onChange={(e) => {

                if (
                  e.target.files &&
                  e.target.files[0]
                ) {

                  setImage(
                    e.target.files[0]
                  );

                }

              }}
              className="w-full bg-[#0b1220] border border-slate-700 rounded-xl p-3 text-white"
            />

          </div>

          {/* IMAGE PREVIEW */}

          {image && (

  <div className="mt-4">

    <img
      src={URL.createObjectURL(image)}
      alt="Preview"
      className="w-full h-64 object-cover rounded-2xl border border-slate-700"
    />

  </div>

)}

          {/* SUBMIT BUTTON */}

          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-blue-500 hover:bg-blue-600 transition rounded-xl p-4 font-semibold disabled:opacity-50"
          >

            {loading
              ? "Submitting..."
              : "Submit Report"}

          </button>

        </div>

      </div>

    </div>

  );
}