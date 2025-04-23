"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"

export function EthereumWalletButton() {
  const [account, setAccount] = useState<string | null>(null)

  // Simple implementation using window.ethereum directly instead of web3-react
  const connectMetaMask = async () => {
    if (typeof window === "undefined" || !window.ethereum) {
      alert("MetaMask is not installed!")
      return
    }

    try {
      // Request account access
      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" })
      setAccount(accounts[0])
    } catch (error) {
      console.error("Error connecting to MetaMask:", error)
    }
  }

  const disconnectMetaMask = () => {
    setAccount(null)
  }

  return (
    <div className="flex flex-col items-center">
      {!account ? (
        <Button onClick={connectMetaMask} className="bg-blue-600 hover:bg-blue-700">
          Connect MetaMask
        </Button>
      ) : (
        <>
          <Button onClick={disconnectMetaMask} variant="outline">
            Disconnect MetaMask
          </Button>
          <p className="text-xs mt-1">
            Connected: {account.slice(0, 4)}...{account.slice(-4)}
          </p>
        </>
      )}
    </div>
  )
}
