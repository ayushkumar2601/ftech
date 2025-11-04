"use client"

import type React from "react"
import { createContext, useContext, useState } from "react"
import { useWeb3 } from "./web3-context"
import { getProvider } from "@/lib/web3-utils"
import { anchorHashToBlockchain, verifyHashOnBlockchain } from "@/lib/blockchain-service"

interface BlockchainContextType {
  isAnchoring: boolean
  anchorError: string | null
  anchorTx: string | null
  anchorHash: (evidenceId: string, fileHash: string, uploaderAddress: string) => Promise<void>
  verifyHash: (fileHash: string) => Promise<{
    isVerified: boolean
    blockchainHash: string | null
    localHash: string
    matchStatus: "verified" | "compromised" | "not-found"
  }>
}

const BlockchainContext = createContext<BlockchainContextType | undefined>(undefined)

export function BlockchainProvider({ children }: { children: React.ReactNode }) {
  const { isConnected } = useWeb3()
  const [isAnchoring, setIsAnchoring] = useState(false)
  const [anchorError, setAnchorError] = useState<string | null>(null)
  const [anchorTx, setAnchorTx] = useState<string | null>(null)

  const anchorHash = async (evidenceId: string, fileHash: string, uploaderAddress: string) => {
    if (!isConnected) {
      setAnchorError("Wallet not connected")
      return
    }

    setIsAnchoring(true)
    setAnchorError(null)
    setAnchorTx(null)

    try {
      const provider = await getProvider()
      const result = await anchorHashToBlockchain(evidenceId, fileHash, uploaderAddress, provider)
      setAnchorTx(result.txHash)
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : "Failed to anchor hash"
      setAnchorError(errorMsg)
      console.error("[v0] Anchoring error:", error)
      throw error
    } finally {
      setIsAnchoring(false)
    }
  }

  const verifyHash = async (
    fileHash: string,
  ): Promise<{
    isVerified: boolean
    blockchainHash: string | null
    localHash: string
    matchStatus: "verified" | "compromised" | "not-found"
  }> => {
    if (!isConnected) {
      setAnchorError("Wallet not connected")
      return {
        isVerified: false,
        blockchainHash: null,
        localHash: fileHash,
        matchStatus: "not-found",
      }
    }

    try {
      const provider = await getProvider()
      const result = await verifyHashOnBlockchain(fileHash, provider)
      return result
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : "Failed to verify hash"
      setAnchorError(errorMsg)
      return {
        isVerified: false,
        blockchainHash: null,
        localHash: fileHash,
        matchStatus: "not-found",
      }
    }
  }

  return (
    <BlockchainContext.Provider
      value={{
        isAnchoring,
        anchorError,
        anchorTx,
        anchorHash,
        verifyHash,
      }}
    >
      {children}
    </BlockchainContext.Provider>
  )
}

export function useBlockchain() {
  const context = useContext(BlockchainContext)
  if (context === undefined) {
    throw new Error("useBlockchain must be used within BlockchainProvider")
  }
  return context
}
