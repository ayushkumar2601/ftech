"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { detectMetaMask, connectWallet, getCurrentAccount, switchToHardhat } from "@/lib/web3-utils"

interface Web3ContextType {
  account: string | null
  isConnected: boolean
  isLoading: boolean
  error: string | null
  connectMetaMask: () => Promise<void>
  disconnect: () => void
}

const Web3Context = createContext<Web3ContextType | undefined>(undefined)

export function Web3Provider({ children }: { children: React.ReactNode }) {
  const [account, setAccount] = useState<string | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    checkExistingConnection()
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", handleAccountsChanged)
      window.ethereum.on("chainChanged", () => window.location.reload())
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener("accountsChanged", handleAccountsChanged)
      }
    }
  }, [])

  const checkExistingConnection = async () => {
    try {
      const hasMetaMask = await detectMetaMask()
      if (!hasMetaMask) return

      const currentAccount = await getCurrentAccount()
      if (currentAccount) {
        setAccount(currentAccount)
        setIsConnected(true)
      }
    } catch (err) {
      console.error("[v0] Error checking connection:", err)
    }
  }

  const handleAccountsChanged = (accounts: string[]) => {
    if (accounts.length === 0) {
      disconnect()
    } else {
      setAccount(accounts[0])
      setIsConnected(true)
    }
  }

  const connectMetaMask = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const connectedAccount = await connectWallet()
      await switchToHardhat()
      setAccount(connectedAccount)
      setIsConnected(true)
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Failed to connect wallet"
      setError(errorMsg)
      console.error("[v0] Connection error:", err)
    } finally {
      setIsLoading(false)
    }
  }

  const disconnect = () => {
    setAccount(null)
    setIsConnected(false)
    setError(null)
  }

  return (
    <Web3Context.Provider
      value={{
        account,
        isConnected,
        isLoading,
        error,
        connectMetaMask,
        disconnect,
      }}
    >
      {children}
    </Web3Context.Provider>
  )
}

export function useWeb3() {
  const context = useContext(Web3Context)
  if (context === undefined) {
    throw new Error("useWeb3 must be used within Web3Provider")
  }
  return context
}
