"use client";

import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import { useEffect, useState } from "react";
import { db } from "@/lib/firebase"; // Your firebase config
import { collection, onSnapshot } from "firebase/firestore";

// Fix for marker icons
const icon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

// Component to auto-center map when your location is found
function RecenterMap({ coords }: { coords: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.setView(coords, 13);
  }, [coords, map]);
  return null;
}

export default function MapPage() {
  const [userLocation, setUserLocation] = useState<[number, number]>([23.2599, 77.4126]);
  const [reports, setReports] = useState<any[]>([]);

  // 1. Get User's Current Live Location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation([position.coords.latitude, position.coords.longitude]);
        },
        (error) => console.error("Error getting location:", error)
      );
    }
  }, []);

  // 2. Fetch Real Reports from Firestore
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "reports"), (snapshot) => {
      const reportData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setReports(reportData);
    });
    return () => unsubscribe();
  }, []);

  return (
    <main className="h-screen w-full bg-[#020817] text-white relative">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-[1000] bg-[#020817]/90 backdrop-blur-md border-b border-white/10 px-8 py-5">
        <h1 className="text-4xl font-bold mb-2 text-white">Live Civic Issue Map</h1>
        <p className="text-slate-400">Showing issues near your current location.</p>
      </div>

      {/* Map Container */}
      <div className="h-full pt-24">
        <MapContainer
          center={userLocation}
          zoom={13}
          className="h-full w-full"
        >
          <TileLayer
            attribution='&copy; OpenStreetMap contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          {/* Automatically move map to user's location */}
          <RecenterMap coords={userLocation} />

          {/* Render Real Data from Firebase */}
          {reports.map((report) => (
            report.lat && report.lng && (
              <Marker key={report.id} position={[report.lat, report.lng]} icon={icon}>
                <Popup className="text-black">
                  <h3 className="font-bold">{report.title}</h3>
                  <p>{report.description}</p>
                  <span className="text-xs text-blue-600 font-semibold">{report.status || "Pending"}</span>
                </Popup>
              </Marker>
            )
          ))}
        </MapContainer>
      </div>
    </main>
  );
}