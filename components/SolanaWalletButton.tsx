"use client"

import { useState, useEffect } from "react"
import { useWallet } from "@solana/wallet-adapter-react"
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui"

export function SolanaWalletButton() {
  const { publicKey, connected } = useWallet()
  const [isClient, setIsClient] = useState(false)

  // Only render on client side
  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) {
    return null
  }

  return (
    <div className="flex flex-col items-center">
      <WalletMultiButton className="bg-purple-600 hover:bg-purple-700" />
      {connected && publicKey && (
        <p className="text-xs mt-1">
          Connected: {publicKey.toString().slice(0, 4)}...{publicKey.toString().slice(-4)}
        </p>
      )}
    </div>
  )
}
