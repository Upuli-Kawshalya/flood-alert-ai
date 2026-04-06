"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useEffect } from "react";

// Fix Leaflet default marker icon issue in Next.js
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

interface FloodMapProps {
  lat: number;
  lng: number;
  risk: string;
}

export default function FloodMap({ lat, lng, risk }: FloodMapProps) {
  const getMarkerColor = () => {
    switch (risk) {
      case "Red": return "#dc2626";
      case "Yellow": return "#eab308";
      default: return "#16a34a";
    }
  };

  return (
    <div className="rounded-lg overflow-hidden shadow-lg border-2 border-slate-200">
      <MapContainer 
        center={[lat, lng]} 
        zoom={12} 
        style={{ height: "400px", width: "100%" }}
        scrollWheelZoom={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={[lat, lng]}>
          <Popup>
            <div className="text-center">
              <p className="font-bold">Flood Risk: <span style={{ color: getMarkerColor() }}>{risk}</span></p>
              <p className="text-sm text-slate-600">{lat.toFixed(4)}, {lng.toFixed(4)}</p>
            </div>
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}