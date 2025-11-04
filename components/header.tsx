"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import WalletButton from "@/components/wallet-button"

export default function Header() {
  const [theme, setTheme] = useState<"light" | "dark">("dark")
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const isDark = document.documentElement.classList.contains("dark")
    setTheme(isDark ? "dark" : "light")
  }, [])

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark"
    setTheme(newTheme)
    const html = document.documentElement
    if (newTheme === "dark") {
      html.classList.add("dark")
    } else {
      html.classList.remove("dark")
    }
    localStorage.setItem("theme", newTheme)
  }

  return (
    <header className="sticky top-0 z-50 glass-effect border-b animate-slide-in-left">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        {/* Logo with Link to Home */}
        <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <div className="w-8 h-8 bg-gradient-to-br from-accent to-primary rounded-lg flex items-center justify-center glow-effect transition-transform hover:scale-110">
            <span className="text-accent-foreground font-bold text-sm">⛓</span>
          </div>
          <span className="font-bold text-lg text-foreground">ForeChain</span>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-8">
          <a href="/#features" className="text-muted-foreground hover:text-foreground transition-colors text-sm">
            Features
          </a>
          <a href="/#upload" className="text-muted-foreground hover:text-foreground transition-colors text-sm">
            Upload
          </a>
          <Link href="/dashboard" className="text-muted-foreground hover:text-foreground transition-colors text-sm">
            Dashboard
          </Link>
        </nav>

        {/* CTA Buttons */}
        <div className="flex items-center gap-3">
          {mounted && (
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full glass-effect glass-effect-hover glow-effect"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? (
                <span className="text-lg transition-transform hover:rotate-12">☀️</span>
              ) : (
                <span className="text-lg transition-transform hover:rotate-12">🌙</span>
              )}
            </button>
          )}
          <button className="px-4 py-2 text-sm rounded-full border border-border hover:border-accent transition-colors text-foreground">
            Sign In
          </button>
          {/* Web3 Wallet Button */}
          <WalletButton />
        </div>
      </div>
    </header>
  )
}
