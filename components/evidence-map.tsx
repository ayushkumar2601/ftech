"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";

const markerIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/854/854895.png",
  iconSize: [32, 32],
});

interface CaptureRecord {
  id: string;
  dataUrl: string;
  capturedAt: number;
  matchStatus: string;
  browser: string;
  device: string;
  resolution: string;
  location?: { lat: number; lng: number };
}

export default function EvidenceMap() {
  const [captures, setCaptures] = useState<CaptureRecord[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem("captured-evidence");
    if (stored) {
      setCaptures(JSON.parse(stored));
    }
  }, []);

  const validLocations = captures.filter((c) => c.location);

  if (validLocations.length === 0) {
    return (
      <div className="glass-effect p-6 border border-border rounded-xl text-center text-muted-foreground">
        No GPS-tagged evidence yet.
      </div>
    );
  }

  return (
    <div className="glass-effect p-6 border border-border rounded-xl">
      <h2 className="text-xl font-semibold mb-4">Evidence Capture Locations</h2>

      <MapContainer
        center={[validLocations[0].location!.lat, validLocations[0].location!.lng]}
        zoom={12}
        scrollWheelZoom={false}
        className="w-full h-[400px] rounded-lg overflow-hidden"
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        {validLocations.map((rec) => (
          <Marker
            key={rec.id}
            position={[rec.location!.lat, rec.location!.lng]}
            icon={markerIcon}
          >
            <Popup>
              <div className="text-sm">
                <p><strong>Status:</strong> {rec.matchStatus}</p>
                <p><strong>Device:</strong> {rec.device}</p>
                <p><strong>Time:</strong> {new Date(rec.capturedAt).toLocaleString()}</p>
                <img src={rec.dataUrl} className="mt-2 w-32 rounded" />
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
