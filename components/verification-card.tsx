
"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  computeSHA256,
  formatFileSize,
  isValidFileType,
} from "@/lib/file-hashing";
import { useWeb3 } from "@/context/web3-context";
import { useBlockchain } from "@/context/blockchain-context";
import { useToast } from "@/components/toast-provider";
import dynamic from "next/dynamic";
import { generateEvidencePDF } from "@/lib/pdf-generator";

const CameraCapture = dynamic(() => import("@/components/CameraCapture"), {
  ssr: false,
});

interface VerificationResult {
  localHash: string;
  blockchainHash: string | null;
  isVerified: boolean;
  timestamp: number;
  matchStatus: "verified" | "compromised" | "not-found";
}

interface CaptureRecord {
  id: string;
  dataUrl: string;
  capturedAt: number;
  matchStatus: string;
  browser: string;
  device: string;
  resolution: string;
  location?: {
    lat: number;
    lng: number;
  };
}

const LOCAL_CAPTURE_KEY = "captured-evidence";

export default function VerificationCard() {
  const { isConnected } = useWeb3();
  const { verifyHash } = useBlockchain();
  const { addToast } = useToast();

  const [verificationFile, setVerificationFile] = useState<File | null>(null);
  const [verificationResult, setVerificationResult] = useState<VerificationResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [cameraOpen, setCameraOpen] = useState(false);
  const [latestCapture, setLatestCapture] = useState<CaptureRecord | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const stored = localStorage.getItem(LOCAL_CAPTURE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored) as CaptureRecord[];
      if (parsed.length > 0) setLatestCapture(parsed[0]);
    }
  }, []);

  const saveCaptureToStorage = (rec: CaptureRecord) => {
    const all = JSON.parse(localStorage.getItem(LOCAL_CAPTURE_KEY) || "[]") as CaptureRecord[];
    all.unshift(rec);
    localStorage.setItem(LOCAL_CAPTURE_KEY, JSON.stringify(all.slice(0, 10)));
  };

  const handleFile = async (file: File) => {
    setError(null);
    if (!isValidFileType(file)) {
      const msg = "Invalid file type. Supported: PDF, TXT, JSON, XML";
      setError(msg);
      addToast(msg, "error");
      return;
    }
    setVerificationFile(file);
    addToast(`File selected: ${file.name}`, "info");
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.currentTarget.files;
    if (files && files[0]) handleFile(files[0]);
  };

  const performVerification = async () => {
    if (!verificationFile) return;
    setIsVerifying(true);
    setError(null);

    try {
      const localHash = await computeSHA256(verificationFile);

      if (!isConnected) {
        setError("Please connect your wallet to verify files");
        setIsVerifying(false);
        addToast("Please connect wallet to verify", "error");
        return;
      }

      const result = await verifyHash(localHash);

      const verification: VerificationResult = {
        localHash,
        blockchainHash: result.blockchainHash,
        isVerified: result.isVerified,
        timestamp: Date.now(),
        matchStatus: result.matchStatus,
      };

      setVerificationResult(verification);

      if (result.matchStatus === "verified") {
        addToast("✅ Verified — No Tampering Detected", "success");
      } else if (result.matchStatus === "compromised") {
        addToast("❌ Tampering Detected — Capture Evidence", "error");
      } else {
        addToast("⚠️ Document Not Found — Capture Evidence", "error");
      }

      setCameraOpen(true);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Verification failed";
      setError(msg);
      addToast(msg, "error");
    } finally {
      setIsVerifying(false);
    }
  };

  const handleClear = () => {
    setVerificationFile(null);
    setVerificationResult(null);
    setError(null);
    setCameraOpen(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleCapture = async (
    dataUrl: string,
    videoResolution?: { width: number; height: number }
  ) => {
    if (!verificationResult) return;

    const browser = navigator.userAgent;
    const device = navigator.platform;

    const resolution = videoResolution
      ? `${videoResolution.width}x${videoResolution.height}`
      : "Unknown";

    let location = undefined;
    try {
      const pos = await new Promise<GeolocationPosition>((resolve, reject) =>
        navigator.geolocation.getCurrentPosition(resolve, reject, { enableHighAccuracy: true })
      );
      location = { lat: pos.coords.latitude, lng: pos.coords.longitude };
    } catch {}

    const rec: CaptureRecord = {
      id: `${verificationResult.localHash}-${Date.now()}`,
      dataUrl,
      capturedAt: Date.now(),
      matchStatus: verificationResult.matchStatus,
      browser,
      device,
      resolution,
      location,
    };

    saveCaptureToStorage(rec);
    setLatestCapture(rec);
    addToast("✅ Evidence Captured with Metadata", "success");
    setCameraOpen(false);
  };

  const handleDeleteLatest = () => {
    if (!latestCapture) return;
    const all = JSON.parse(localStorage.getItem(LOCAL_CAPTURE_KEY) || "[]") as CaptureRecord[];
    const filtered = all.filter((c) => c.id !== latestCapture.id);
    localStorage.setItem(LOCAL_CAPTURE_KEY, JSON.stringify(filtered));
    setLatestCapture(null);
    addToast("🗑️ Deleted Evidence", "info");
  };

  return (
    <div className="w-full max-w-md mx-auto text-white">
      {/* Upload Section */}
      <div className="glass-effect rounded-2xl p-8 border border-gray-700">
        {!verificationFile ? (
          <div className="flex flex-col items-center gap-4">
            <span className="text-3xl">🔍</span>
            <h3 className="font-semibold text-lg">Verify Evidence</h3>
            <p className="text-sm text-gray-400 text-center">
              Upload a file to verify authenticity.
            </p>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg"
            >
              Select File
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleInputChange}
              className="hidden"
              accept=".pdf,.txt,.json,.xml"
            />
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            <div>
              <p className="text-sm text-gray-400">File:</p>
              <p className="text-sm font-medium">{verificationFile.name}</p>
              <p className="text-xs text-gray-500">{formatFileSize(verificationFile.size)}</p>
            </div>

            <button
              onClick={performVerification}
              disabled={isVerifying}
              className="w-full bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg"
            >
              {isVerifying ? "Verifying..." : "Start Verification"}
            </button>

            <button
              onClick={handleClear}
              className="w-full border border-gray-600 px-4 py-2 rounded-lg hover:bg-gray-800"
            >
              Clear
            </button>
          </div>
        )}
      </div>

      {/* Verification Result
      {verificationResult && (
        <div className="mt-4 p-4 border rounded-lg bg-gray-800 border-gray-700">
          <p className="text-sm mb-2">
            Status:
            <span
              className={
                verificationResult.matchStatus === "verified"
                  ? "text-green-400"
                  : "text-red-400"
              }
            >
              {" "}{verificationResult.matchStatus}
            </span>
          </p>
          <p className="text-xs text-gray-400">
            Verified at {new Date(verificationResult.timestamp).toLocaleString()}
          </p>
        </div>
      )} */}

{verificationResult && (
  <div className="mt-6 rounded-xl border border-gray-700 bg-gradient-to-br from-gray-800 to-gray-900 p-5 shadow-lg animate-in fade-in duration-300">
    <div className="flex items-center justify-between">
      <h3 className="text-lg font-semibold text-white">Verification Result</h3>

      <span
        className={`px-3 py-1 rounded-full text-xs font-medium border 
          ${
            verificationResult.matchStatus === "verified"
              ? "bg-green-500/20 text-green-400 border-green-500/40"
              : verificationResult.matchStatus === "compromised"
              ? "bg-red-500/20 text-red-400 border-red-500/40"
              : "bg-yellow-500/20 text-yellow-400 border-yellow-500/40"
          }`}
      >
        {verificationResult.matchStatus.toUpperCase()}
      </span>
    </div>

    <div className="mt-4 space-y-3 text-sm">
      <div className="flex justify-between">
        <span className="text-gray-400">Local File Hash:</span>
        <span className="font-mono text-gray-200 truncate max-w-[180px]">{verificationResult.localHash}</span>
      </div>

      <div className="flex justify-between">
        <span className="text-gray-400">Blockchain Hash:</span>
        <span className="font-mono text-gray-200 truncate max-w-[180px]">
          {verificationResult.blockchainHash || "— Not on chain —"}
        </span>
      </div>

      <div className="flex justify-between">
        <span className="text-gray-400">Status Meaning:</span>
        <span className="text-gray-200">
          {verificationResult.matchStatus === "verified"
            ? "✅ Authentic • No tampering detected"
            : verificationResult.matchStatus === "compromised"
            ? "❌ Evidence has been altered"
            : "⚠️ Not found on blockchain"}
        </span>
      </div>

      <div className="flex justify-between">
        <span className="text-gray-400">Verified At:</span>
        <span className="text-gray-200">
          {new Date(verificationResult.timestamp).toLocaleString()}
        </span>
      </div>
    </div>

    {/* Highlighted Banner */}
    {verificationResult.matchStatus !== "verified" && (
      <div className="mt-4 rounded-lg border border-red-600/30 bg-red-600/10 px-4 py-3 text-sm text-red-300">
        Evidence mismatch detected — camera capture required for forensic chain-of-custody.
      </div>
    )}
  </div>
)}



      {/* Camera Capture */}
      {cameraOpen && (
        <div className="mt-6 p-4">
          <p className="text-sm mb-2 font-semibold">Capturing Evidence...</p>
          <CameraCapture onCapture={handleCapture} />
        </div>
      )}

      {/* Show Captured Evidence */}
      {latestCapture && !cameraOpen && (
        <div className="mt-4">
          <p className="text-sm font-semibold mb-2">Captured Evidence</p>

          <img
            src={latestCapture.dataUrl}
            className="w-full rounded-lg object-contain max-h-[400px]"
          />

          <div className="text-xs text-gray-300 mt-3 space-y-1">
            <p><strong>Device:</strong> {latestCapture.device}</p>
            <p><strong>Browser:</strong> {latestCapture.browser}</p>
            <p><strong>Camera Resolution:</strong> {latestCapture.resolution}</p>
            {latestCapture.location && (
              <p><strong>GPS:</strong> {latestCapture.location.lat.toFixed(6)}, {latestCapture.location.lng.toFixed(6)}</p>
            )}
          </div>

          <button
            onClick={handleDeleteLatest}
            className="mt-2 w-full bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg text-xs"
          >
            Delete Evidence
          </button>
        </div>
      )}

      {/* Download PDF */}
      {/* {verificationResult && latestCapture && (
        <button
          onClick={() =>
            generateEvidencePDF({
              fileName: verificationFile?.name || "unknown",
              fileSize: formatFileSize(verificationFile?.size || 0),
              localHash: verificationResult.localHash,
              blockchainHash: verificationResult.blockchainHash,
              matchStatus: verificationResult.matchStatus,
              verifiedAt: new Date(verificationResult.timestamp).toLocaleString(),
              capturedImage: latestCapture.dataUrl,
            })
          }
          className="mt-4 w-full bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg"
        >
          Download Evidence Report
        </button>
      )} */}
      {verificationResult && latestCapture && (
  <button
    onClick={() =>
      generateEvidencePDF({
        fileName: verificationFile?.name || "unknown",
        fileSize: formatFileSize(verificationFile?.size || 0),
        localHash: verificationResult.localHash,
        blockchainHash: verificationResult.blockchainHash,
        matchStatus: verificationResult.matchStatus,
        verifiedAt: new Date(verificationResult.timestamp).toLocaleString(),

        // ✅ Add metadata here
        browser: latestCapture.browser,
        device: latestCapture.device,
        resolution: latestCapture.resolution,
        location: latestCapture.location,
        
        capturedImage: latestCapture.dataUrl,
      })
    }
    className="mt-4 w-full bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg"
  >
    Download Evidence Report
  </button>
)}


      {/* Errors */}
      {error && (
        <div className="mt-4 p-3 bg-red-600/20 border border-red-600/40 rounded-lg">
          <p className="text-sm text-red-400">{error}</p>
        </div>
      )}
    </div>
  );
}