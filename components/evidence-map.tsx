"use client";

import "@/components/leaflet-fix";
import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import type { LatLngExpression } from "leaflet";

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

  const mapCenter: LatLngExpression = [
    validLocations[0].location!.lat,
    validLocations[0].location!.lng,
  ];

  return (
    <div className="glass-effect p-6 border border-border rounded-xl mt-8">
      <h2 className="text-xl font-semibold mb-4">Evidence Capture Locations</h2>

      <MapContainer
        center={mapCenter}
        zoom={14}
        scrollWheelZoom={true}
        className="w-full h-[400px] rounded-lg overflow-hidden"
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        {validLocations.map((rec) => {
          const pos: LatLngExpression = [rec.location!.lat, rec.location!.lng];
          return (
            <Marker key={rec.id} position={pos}>
              <Popup>
                <div className="text-sm">
                  <p><strong>Status:</strong> {rec.matchStatus}</p>
                  <p><strong>Device:</strong> {rec.device}</p>
                  <p><strong>Time:</strong> {new Date(rec.capturedAt).toLocaleString()}</p>
                  <img src={rec.dataUrl} className="mt-2 w-32 rounded" />
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}
