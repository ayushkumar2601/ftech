"use client"

import { useEffect, useState } from "react"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { useWeb3 } from "@/context/web3-context"
import { getProvider } from "@/lib/web3-utils"
import { getAllStoredHashes, getTotalHashCount } from "@/lib/blockchain-service"

interface HashEntry {
  evidenceId: string
  hash: string
  timestamp: number
  uploader: string
  verified: boolean
}

export default function DashboardPage() {
  const { isConnected, account } = useWeb3()
  const [hashes, setHashes] = useState<HashEntry[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [totalCount, setTotalCount] = useState(0)
  const [isRefreshing, setIsRefreshing] = useState(false)

  useEffect(() => {
    if (isConnected) {
      loadHashes()
    }
  }, [isConnected])

  const loadHashes = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const provider = await getProvider()
      const storedHashes = await getAllStoredHashes(provider)
      const total = await getTotalHashCount(provider)

      setHashes(storedHashes)
      setTotalCount(total)
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Failed to load hashes"
      setError(errorMsg)
      console.error("[v0] Error loading hashes:", err)
    } finally {
      setIsLoading(false)
    }
  }

  const refreshHashes = async () => {
    setIsRefreshing(true)
    await loadHashes()
    setIsRefreshing(false)
  }

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  const formatHash = (hash: string) => {
    return `${hash.slice(0, 16)}...${hash.slice(-16)}`
  }

  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleString()
  }

  if (!isConnected) {
    return (
      <main className="min-h-screen bg-background">
        <Header />
        <section className="py-12 md:py-16 px-4">
          <div className="max-w-7xl mx-auto text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Dashboard</h1>
            <div className="glass-effect rounded-2xl p-8 border border-border">
              <p className="text-muted-foreground mb-4">Please connect your wallet to view the dashboard</p>
              <button className="px-6 py-2 rounded-lg bg-gradient-to-r from-accent to-primary text-accent-foreground font-medium hover:shadow-lg glow-effect transition-all">
                Connect Wallet
              </button>
            </div>
          </div>
        </section>
        <Footer />
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-background">
      <Header />

      <section className="py-12 md:py-16 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">Investigation Dashboard</h1>
            <p className="text-muted-foreground">Connected as {formatAddress(account || "")} • Blockchain: Active</p>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="glass-effect rounded-xl p-6 border border-border">
              <p className="text-sm text-muted-foreground mb-2">Total Evidence Records</p>
              <p className="text-3xl font-bold text-foreground">{totalCount}</p>
            </div>

            <div className="glass-effect rounded-xl p-6 border border-border">
              <p className="text-sm text-muted-foreground mb-2">Verified Files</p>
              <p className="text-3xl font-bold text-primary">{hashes.length}</p>
            </div>

            <div className="glass-effect rounded-xl p-6 border border-border">
              <p className="text-sm text-muted-foreground mb-2">Blockchain Status</p>
              <p className="text-3xl font-bold text-accent">Online</p>
            </div>
          </div>

          {/* Table Section */}
          <div className="glass-effect rounded-xl p-6 border border-border">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-foreground">Evidence Ledger</h2>
              <button
                onClick={refreshHashes}
                disabled={isRefreshing || isLoading}
                className="px-4 py-2 rounded-lg border border-border hover:border-accent text-foreground transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isRefreshing ? "Refreshing..." : "Refresh"}
              </button>
            </div>

            {error && (
              <div className="mb-4 p-3 rounded-lg bg-destructive/10 border border-destructive/30">
                <p className="text-sm text-destructive">{error}</p>
              </div>
            )}

            {isLoading ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">Loading evidence from blockchain...</p>
              </div>
            ) : hashes.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No evidence records found. Upload files to get started.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">Evidence ID</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">File Hash</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">Uploader</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">Timestamp</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {hashes.map((entry, index) => (
                      <tr key={index} className="border-b border-border/50 hover:bg-white/5 transition-colors">
                        <td className="py-3 px-4 text-xs font-mono text-foreground">{entry.evidenceId}</td>
                        <td className="py-3 px-4 text-xs font-mono text-foreground">{formatHash(entry.hash)}</td>
                        <td className="py-3 px-4 text-xs text-muted-foreground">{formatAddress(entry.uploader)}</td>
                        <td className="py-3 px-4 text-xs text-muted-foreground">{formatDate(entry.timestamp)}</td>
                        <td className="py-3 px-4">
                          <span
                            className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                              entry.verified
                                ? "bg-green-500/10 text-green-600 dark:text-green-400"
                                : "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400"
                            }`}
                          >
                            {entry.verified ? "✅ Verified" : "⏳ Pending"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Action Links */}
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/#upload"
              className="px-6 py-2 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary font-medium transition-colors text-center"
            >
              Upload Evidence
            </a>
            <a
              href="/#verify"
              className="px-6 py-2 rounded-lg bg-accent/10 hover:bg-accent/20 text-accent font-medium transition-colors text-center"
            >
              Verify File
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
