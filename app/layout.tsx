import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import ThemeProvider from "@/components/theme-provider"
import { Web3Provider } from "@/context/web3-context"
import { BlockchainProvider } from "@/context/blockchain-context"
import { ToastProvider } from "@/components/toast-provider"
import ToastDisplay from "@/components/toast-display"
import "./globals.css"

const _inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "ForeChain - Blockchain Forensic Evidence Platform",
  description: "Trust Through Transparency. Blockchain-powered forensic ledger for secure evidence verification.",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`font-sans antialiased`}>
        <ThemeProvider>
          <Web3Provider>
            <BlockchainProvider>
              <ToastProvider>
                {children}
                <ToastDisplay />
              </ToastProvider>
            </BlockchainProvider>
          </Web3Provider>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  )
}
