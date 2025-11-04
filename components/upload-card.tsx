"use client"

import type React from "react"
import { useState, useRef } from "react"
import { computeSHA256, formatFileSize, isValidFileType, generateEvidenceId } from "@/lib/file-hashing"
import { useWeb3 } from "@/context/web3-context"
import { useBlockchain } from "@/context/blockchain-context"
import { useToast } from "@/components/toast-provider"
import { hashAlreadyExists } from "@/lib/blockchain-service"
import { getProvider } from "@/lib/web3-utils"

interface UploadedFile {
  file: File
  hash: string
  evidenceId: string
  timestamp: number
}

export default function UploadCard() {
  const { isConnected, account } = useWeb3()
  const { isAnchoring, anchorError, anchorTx, anchorHash } = useBlockchain()
  const { addToast } = useToast()
  const [uploadedFile, setUploadedFile] = useState<UploadedFile | null>(null)
  const [isHashing, setIsHashing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFile = async (file: File) => {
    setError(null)

    if (!isValidFileType(file)) {
      const errorMsg = "Invalid file type. Supported: PDF, TXT, JSON, XML"
      setError(errorMsg)
      addToast(errorMsg, "error")
      return
    }

    if (file.size > 50 * 1024 * 1024) {
      const errorMsg = "File size exceeds 50MB limit"
      setError(errorMsg)
      addToast(errorMsg, "error")
      return
    }

    setIsHashing(true)

    try {
      const hash = await computeSHA256(file)
      const evidenceId = generateEvidenceId()
      setUploadedFile({
        file,
        hash,
        evidenceId,
        timestamp: Date.now(),
      })
      addToast(`File ${file.name} hashed successfully`, "info")
    } catch (err) {
      const errorMsg = "Failed to compute file hash"
      setError(errorMsg)
      addToast(errorMsg, "error")
      console.error("[v0] Hashing error:", err)
    } finally {
      setIsHashing(false)
    }
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    const files = e.dataTransfer.files
    if (files && files[0]) {
      handleFile(files[0])
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.currentTarget.files
    if (files && files[0]) {
      handleFile(files[0])
    }
  }

  const handleClear = () => {
    setUploadedFile(null)
    setError(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleUploadToBlockchain = async () => {
    if (!uploadedFile || !account) return

    try {
      setError(null)
      const provider = await getProvider()
      const duplicate = await hashAlreadyExists(uploadedFile.hash, provider)

      if (duplicate) {
        const errorMsg = "File already recorded on blockchain. Prevent duplicate uploads."
        setError(errorMsg)
        addToast(errorMsg, "error")
        return
      }

      await anchorHash(uploadedFile.evidenceId, uploadedFile.hash, account)
      addToast("File anchored to blockchain successfully", "success")
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Failed to upload to blockchain"
      setError(errorMsg)
      addToast(errorMsg, "error")
    }
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <div
        className={`glass-effect rounded-2xl p-8 transition-all duration-300 ${
          dragActive ? "border-accent border-2 bg-accent/5" : "border border-border"
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        {/* Upload Section */}
        {!uploadedFile ? (
          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-accent to-primary flex items-center justify-center glow-effect">
              <span className="text-2xl">📄</span>
            </div>

            <div className="text-center">
              <h3 className="text-lg font-semibold text-foreground mb-1">Upload Evidence File</h3>
              <p className="text-sm text-muted-foreground">Drag and drop your file or click to browse</p>
            </div>

            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full px-4 py-2 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isHashing || !isConnected || isAnchoring}
            >
              {isHashing ? "Computing Hash..." : "Select File"}
            </button>

            <p className="text-xs text-muted-foreground text-center">Supported: PDF, TXT, JSON, XML (Max 50MB)</p>

            {!isConnected && <p className="text-xs text-destructive text-center">Please connect your wallet first</p>}

            <input
              ref={fileInputRef}
              type="file"
              onChange={handleInputChange}
              className="hidden"
              accept=".pdf,.txt,.json,.xml"
              disabled={isHashing || !isConnected || isAnchoring}
            />
          </div>
        ) : (
          /* Hash Display Section */
          <div className="flex flex-col gap-4">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1">
                <p className="text-sm text-muted-foreground mb-1">File</p>
                <p className="text-sm font-medium text-foreground truncate">{uploadedFile.file.name}</p>
                <p className="text-xs text-muted-foreground mt-1">{formatFileSize(uploadedFile.file.size)}</p>
              </div>
              <button
                onClick={handleClear}
                className="text-2xl opacity-60 hover:opacity-100 transition-opacity disabled:opacity-30"
                disabled={isAnchoring}
              >
                ✕
              </button>
            </div>

            <div className="border border-border rounded-lg p-3 bg-muted/20">
              <p className="text-xs text-muted-foreground mb-2">Evidence ID</p>
              <p className="text-xs font-mono text-foreground select-all">{uploadedFile.evidenceId}</p>
            </div>

            <div className="border border-border rounded-lg p-3 bg-muted/20">
              <p className="text-xs text-muted-foreground mb-2">SHA-256 Hash</p>
              <p className="text-xs font-mono text-foreground break-all select-all">{uploadedFile.hash}</p>
            </div>

            {!anchorTx ? (
              <button
                onClick={handleUploadToBlockchain}
                disabled={isAnchoring || !isConnected}
                className="w-full px-4 py-2 rounded-lg bg-gradient-to-r from-accent to-primary text-accent-foreground font-medium hover:shadow-lg glow-effect transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isAnchoring ? "Anchoring..." : "Upload to Blockchain"}
              </button>
            ) : (
              <div className="w-full p-3 rounded-lg bg-green-500/10 border border-green-500/30">
                <p className="text-sm text-green-600 dark:text-green-400 mb-2">Successfully anchored!</p>
                <p className="text-xs font-mono text-foreground break-all select-all">{anchorTx}</p>
              </div>
            )}

            <button
              onClick={handleClear}
              className="w-full px-4 py-2 rounded-lg border border-border hover:border-accent text-foreground transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isAnchoring}
            >
              Clear
            </button>
          </div>
        )}
      </div>

      {/* Error Display */}
      {(error || anchorError) && (
        <div className="mt-4 p-3 rounded-lg bg-destructive/10 border border-destructive/30">
          <p className="text-sm text-destructive">{error || anchorError}</p>
        </div>
      )}
    </div>
  )
}
