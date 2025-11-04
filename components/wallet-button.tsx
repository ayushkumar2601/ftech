"use client"

import { useWeb3 } from "@/context/web3-context"
import { useState } from "react"

export default function WalletButton() {
  const { account, isConnected, isLoading, error, connectMetaMask } = useWeb3()
  const [showError, setShowError] = useState(false)

  const handleConnect = async () => {
    try {
      await connectMetaMask()
      setShowError(false)
    } catch (err) {
      setShowError(true)
    }
  }

  const displayAccount = account ? `${account.slice(0, 6)}...${account.slice(-4)}` : null

  return (
    <div className="flex items-center gap-3">
      {error && showError && (
        <div className="hidden sm:block text-xs text-destructive bg-destructive/10 px-3 py-1 rounded-full">{error}</div>
      )}
      {isConnected && displayAccount ? (
        <button
          disabled
          className="px-4 py-2 text-sm rounded-full bg-gradient-to-r from-accent to-primary text-accent-foreground font-medium glow-effect transition-all opacity-80 cursor-default"
        >
          {displayAccount}
        </button>
      ) : (
        <button
          onClick={handleConnect}
          disabled={isLoading}
          className="px-4 py-2 text-sm rounded-full bg-gradient-to-r from-accent to-primary text-accent-foreground hover:shadow-lg font-medium glow-effect transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? "Connecting..." : "Connect Wallet"}
        </button>
      )}
    </div>
  )
}
