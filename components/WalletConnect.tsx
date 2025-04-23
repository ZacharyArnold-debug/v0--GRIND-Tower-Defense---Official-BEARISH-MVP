"use client"

import { useState, useEffect } from "react"
import { SolanaWalletButton } from "./SolanaWalletButton"
import { EthereumWalletButton } from "./EthereumWalletButton"

export function WalletConnect() {
  const [isClient, setIsClient] = useState(false)

  // Set isClient to true when component mounts
  useEffect(() => {
    setIsClient(true)
  }, [])

  // Don't render anything on the server side
  if (!isClient) {
    return null
  }

  return (
    <div className="flex flex-col sm:flex-row gap-4 items-center">
      <SolanaWalletButton />
      <EthereumWalletButton />
    </div>
  )
}
