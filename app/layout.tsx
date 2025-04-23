import type React from "react"
import { WalletProviders } from "./providers"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import Script from "next/script"
import { Toaster } from "react-hot-toast"

export const metadata = {
  title: "$GRIND Tower Defense",
  description: "A tower defense game with blockchain integration",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <Script src="https://cdn.ethers.io/lib/ethers-5.2.umd.min.js" strategy="beforeInteractive" />
      </head>
      <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <WalletProviders>
            <Toaster position="top-right" />
            {children}
          </WalletProviders>
        </ThemeProvider>
      </body>
    </html>
  )
}
