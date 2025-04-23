"use client"

import { useState, useEffect } from "react"
import { useWallet } from "@solana/wallet-adapter-react"
import {
  GRIND_SPL_MINT,
  GRIND_ERC20_ADDRESS,
  getSplTokenBalance,
  formatTokenBalance,
  getErc20Balance,
} from "@/utils/token"

export function TokenBalance() {
  const { publicKey } = useWallet()
  const [balance, setBalance] = useState<number>(0)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [walletType, setWalletType] = useState<"solana" | "ethereum" | null>(null)
  const [ethereumAddress, setEthereumAddress] = useState<string | null>(null)
  const [isClient, setIsClient] = useState(false)

  // Only run on client-side
  useEffect(() => {
    setIsClient(true)

    // Load ethers.js script dynamically
    const script = document.createElement("script")
    script.src = "https://cdn.ethers.io/lib/ethers-5.2.umd.min.js"
    script.async = true
    document.body.appendChild(script)

    return () => {
      document.body.removeChild(script)
    }
  }, [])

  // Check for Ethereum wallet
  useEffect(() => {
    if (!isClient) return

    const checkEthereumWallet = async () => {
      if (typeof window === "undefined" || !window.ethereum) return

      try {
        const accounts = await window.ethereum.request({ method: "eth_accounts" })
        if (accounts && accounts.length > 0) {
          setWalletType("ethereum")
          setEthereumAddress(accounts[0])
        }
      } catch (error) {
        console.error("Error checking Ethereum wallet:", error)
      }
    }

    checkEthereumWallet()

    // Listen for account changes
    const handleAccountsChanged = (accounts: string[]) => {
      if (accounts.length > 0) {
        setWalletType("ethereum")
        setEthereumAddress(accounts[0])
      } else {
        setWalletType(null)
        setEthereumAddress(null)
        setBalance(0)
      }
    }

    if (window.ethereum) {
      window.ethereum.on("accountsChanged", handleAccountsChanged)
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener("accountsChanged", handleAccountsChanged)
      }
    }
  }, [isClient])

  // Check for Solana wallet
  useEffect(() => {
    if (publicKey) {
      setWalletType("solana")
    }
  }, [publicKey])

  // Fetch token balance based on wallet type
  useEffect(() => {
    if (!isClient) return

    const fetchBalance = async () => {
      setIsLoading(true)
      try {
        if (walletType === "solana" && publicKey) {
          const balance = await getSplTokenBalance(publicKey, GRIND_SPL_MINT)
          setBalance(balance)
        } else if (walletType === "ethereum" && ethereumAddress && window.ethers) {
          const balance = await getErc20Balance(ethereumAddress, GRIND_ERC20_ADDRESS)
          setBalance(balance)
        }
      } catch (error) {
        console.error("Error fetching token balance:", error)
        setBalance(0)
      } finally {
        setIsLoading(false)
      }
    }

    if (walletType) {
      fetchBalance()
    }
  }, [walletType, publicKey, ethereumAddress, isClient])

  if (!isClient || (!walletType && !isLoading)) {
    return null
  }

  return (
    <div className="flex items-center">
      <span className="font-medium mr-1">$GRIND:</span>
      {isLoading ? (
        <span className="text-gray-400">Loading...</span>
      ) : (
        <span className="font-bold">{formatTokenBalance(balance)}</span>
      )}
    </div>
  )
}
