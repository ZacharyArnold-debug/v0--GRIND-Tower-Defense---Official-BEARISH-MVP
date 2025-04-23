"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useWallet } from "@solana/wallet-adapter-react"
import { GRIND_SPL_MINT, GRIND_ERC20_ADDRESS, getSplTokenBalance, getErc20Balance } from "@/utils/token"
import type { TowerConfig } from "./ShopPanel"

interface GameContextType {
  balance: number
  ownedTowers: TowerConfig[]
  addTower: (tower: TowerConfig) => void
  isWalletConnected: boolean
}

const GameContext = createContext<GameContextType | undefined>(undefined)

export function useGameContext() {
  const context = useContext(GameContext)
  if (context === undefined) {
    throw new Error("useGameContext must be used within a GameProvider")
  }
  return context
}

interface GameProviderProps {
  children: ReactNode
}

export function GameProvider({ children }: GameProviderProps) {
  const { publicKey } = useWallet()
  const [balance, setBalance] = useState<number>(500) // Default balance for testing
  const [ownedTowers, setOwnedTowers] = useState<TowerConfig[]>([])
  const [ethereumAddress, setEthereumAddress] = useState<string | null>(null)
  const [isClient, setIsClient] = useState(false)

  // Set isClient to true when component mounts
  useEffect(() => {
    setIsClient(true)

    // Check for Ethereum wallet
    const checkEthereumWallet = async () => {
      if (typeof window === "undefined" || !window.ethereum) return

      try {
        const accounts = await window.ethereum.request({ method: "eth_accounts" })
        if (accounts && accounts.length > 0) {
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
        setEthereumAddress(accounts[0])
      } else {
        setEthereumAddress(null)
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
  }, [])

  // Fetch token balance
  useEffect(() => {
    const fetchBalance = async () => {
      if (!isClient) return

      try {
        if (publicKey) {
          // Fetch Solana token balance
          const solanaBalance = await getSplTokenBalance(publicKey, GRIND_SPL_MINT)
          setBalance(solanaBalance)
        } else if (ethereumAddress && window.ethers) {
          // Fetch Ethereum token balance
          const ethereumBalance = await getErc20Balance(ethereumAddress, GRIND_ERC20_ADDRESS)
          setBalance(ethereumBalance)
        } else {
          // Use mock balance for testing
          setBalance(500)
        }
      } catch (error) {
        console.error("Error fetching token balance:", error)
        // Use mock balance as fallback
        setBalance(500)
      }
    }

    fetchBalance()
  }, [publicKey, ethereumAddress, isClient])

  const addTower = (tower: TowerConfig) => {
    setOwnedTowers((prev) => {
      // Check if tower already exists
      if (prev.some((t) => t.id === tower.id)) {
        return prev
      }
      return [...prev, tower]
    })
  }

  const isWalletConnected = !!publicKey || !!ethereumAddress

  const value = {
    balance,
    ownedTowers,
    addTower,
    isWalletConnected,
  }

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>
}
