"use client"

import { useEffect, useState } from "react"

interface CaptureRecord {
  id: string
  dataUrl: string
  capturedAt: number
  matchStatus: string
  browser: string
  device: string
  resolution: string
  location?: { lat: number; lng: number }
}

export default function HistoryTimeline() {
  const [captures, setCaptures] = useState<CaptureRecord[]>([])

  useEffect(() => {
    const stored = localStorage.getItem("captured-evidence")
    if (stored) {
      setCaptures(JSON.parse(stored))
    }
  }, [])

  if (captures.length === 0) {
    return (
      <div className="glass-effect p-6 border border-border rounded-xl text-center text-muted-foreground">
        No evidence chain records yet.
      </div>
    )
  }

  return (
    <div className="glass-effect p-6 border border-border rounded-xl">
      <h2 className="text-xl font-semibold mb-4">Evidence Chain-of-Custody Timeline</h2>

      <div className="flex flex-col gap-4">
        {captures.map((rec) => (
          <div
            key={rec.id}
            className="p-4 border border-border rounded-lg bg-white/5 hover:bg-white/10 transition"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">
                {new Date(rec.capturedAt).toLocaleString()}
              </span>
              <span
                className={`text-xs px-2 py-1 rounded-full ${
                  rec.matchStatus === "verified"
                    ? "bg-green-500/20 text-green-400"
                    : rec.matchStatus === "compromised"
                    ? "bg-red-500/20 text-red-400"
                    : "bg-yellow-500/20 text-yellow-300"
                }`}
              >
                {rec.matchStatus.toUpperCase()}
              </span>
            </div>

            <div className="flex gap-4">
              {/* Evidence Preview */}
              <img
                src={rec.dataUrl}
                alt="Evidence"
                className="w-20 h-20 object-cover rounded border border-border"
              />

              <div className="text-sm text-muted-foreground flex-1">
                <p><strong>Device:</strong> {rec.device}</p>
                <p><strong>Browser:</strong> {rec.browser}</p>
                <p><strong>Resolution:</strong> {rec.resolution}</p>
                {rec.location ? (
                  <p>
                    <strong>GPS:</strong> {rec.location.lat.toFixed(5)}, {rec.location.lng.toFixed(5)}
                  </p>
                ) : (
                  <p><strong>GPS:</strong> Not available</p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
