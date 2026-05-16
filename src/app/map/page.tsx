"use client";

import "leaflet/dist/leaflet.css";

import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
} from "react-leaflet";

import L from "leaflet";

const icon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

export default function MapPage() {
  return (
    <main className="h-screen w-full bg-[#020817] text-white">

      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-[1000] bg-[#020817]/90 backdrop-blur-md border-b border-white/10 px-8 py-5">

        <h1 className="text-4xl font-bold mb-2">
          Live Civic Issue Map
        </h1>

        <p className="text-slate-400">
          Real-time issue tracking across the city.
        </p>

      </div>

      {/* Map */}
      <div className="h-full pt-24">

        <MapContainer
          center={[23.2599, 77.4126]}
          zoom={13}
          className="h-full w-full"
        >

          <TileLayer
            attribution='&copy; OpenStreetMap contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <Marker position={[23.2599, 77.4126]} icon={icon}>
            <Popup>
              Pothole Reported Here
            </Popup>
          </Marker>

          <Marker position={[23.25, 77.41]} icon={icon}>
            <Popup>
              Garbage Issue
            </Popup>
          </Marker>

        </MapContainer>

      </div>

    </main>
  );
}