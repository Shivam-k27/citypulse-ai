"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { collection, query, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const markerIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

interface IncidentReport {
  id: string;
  title: string;
  category: string;
  status: string;
  latitude: number;
  longitude: number;
}

export default function LiveMap() {
  const [reports, setReports] = useState<IncidentReport[]>([]);
  const mapCenter: [number, number] = [23.2189, 77.4073];

  useEffect(() => {
    const reportsQuery = query(collection(db, "reports"));
    const unsubscribe = onSnapshot(reportsQuery, (snapshot) => {
      const parsedReports: IncidentReport[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        if (data.latitude && data.longitude) {
          parsedReports.push({
            id: doc.id,
            title: data.title || "Untitled Issue",
            category: data.category || "General",
            status: data.status || "pending",
            latitude: data.latitude,
            longitude: data.longitude,
          });
        }
      });
      setReports(parsedReports);
    });
    return () => unsubscribe();
  }, []);

  return (
    <div className="w-full h-[500px] rounded-[30px] overflow-hidden border border-white/5 shadow-2xl relative z-0">
      <MapContainer center={mapCenter} zoom={13} className="w-full h-full">
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />
        {reports.map((report) => {
          const issueStatus = report.status.toLowerCase();
          const statusBadgeColor = 
            issueStatus === "resolved" ? "bg-emerald-600" :
            issueStatus === "in progress" ? "bg-amber-500" : 
            "bg-blue-600";

          return (
            <Marker key={report.id} position={[report.latitude, report.longitude]} icon={markerIcon}>
              <Popup>
                <div className="p-1 text-slate-900">
                  <h3 className="font-bold text-sm">{report.title}</h3>
                  <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider mt-1">
                    {report.category}
                  </p>
                  <div className="mt-2">
                    <span className={`text-[10px] px-2 py-1 rounded-full font-bold text-white uppercase ${statusBadgeColor}`}>
                      {report.status}
                    </span>
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}