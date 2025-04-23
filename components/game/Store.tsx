"use client"

import { useState, useEffect } from "react"
import { useWallet } from "@solana/wallet-adapter-react"
import { Connection, PublicKey, Transaction } from "@solana/web3.js"
import { createTransferInstruction } from "@solana/spl-token"
import { toast } from "react-hot-toast"
import { GRIND_SPL_MINT, GRIND_ERC20_ADDRESS, ERC20_ABI } from "@/utils/token"

// Define tower types and their costs
export interface TowerType {
  id: string
  name: string
  description: string
  cost: number
  damage: number
  range: number
  fireRate: number
  image: string
}

// Game treasury addresses - replace with actual addresses
const SOLANA_TREASURY = "GRiNDTrEaSuRyXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
const ETH_TREASURY = "0xGRiNDTrEaSuRyXXXXXXXXXXXXXXXXXXXXXXXXXXXX"

// Available tower types
const TOWER_TYPES: TowerType[] = [
  {
    id: "basic",
    name: "Basic Tower",
    description: "Standard defense tower with balanced stats",
    cost: 100,
    damage: 10,
    range: 3,
    fireRate: 1000,
    image: "/assets/towers/basic.png",
  },
  {
    id: "sniper",
    name: "Sniper Tower",
    description: "Long range tower with high damage but slow fire rate",
    cost: 250,
    damage: 25,
    range: 5,
    fireRate: 2000,
    image: "/assets/towers/sniper.png",
  },
  {
    id: "rapid",
    name: "Rapid Tower",
    description: "Fast firing tower with low damage but high rate of fire",
    cost: 200,
    damage: 5,
    range: 2,
    fireRate: 500,
    image: "/assets/towers/rapid.png",
  },
]

interface StoreProps {
  onPurchase: (tower: TowerType) => void
}

export default function Store({ onPurchase }: StoreProps) {
  const { publicKey, sendTransaction } = useWallet()
  const [ethereumAddress, setEthereumAddress] = useState<string | null>(null)
  const [isClient, setIsClient] = useState(false)
  const [purchasingId, setPurchasingId] = useState<string | null>(null)

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

  const isWalletConnected = !!publicKey || !!ethereumAddress

  // Buy tower function
  const buyTower = async (tower: TowerType) => {
    if (!isWalletConnected) {
      toast.error("Please connect your wallet first")
      return
    }

    setPurchasingId(tower.id)

    try {
      toast.loading(`Purchasing ${tower.name}...`)

      if (publicKey) {
        // Solana transaction
        await handleSolanaTransaction(tower)
      } else if (ethereumAddress) {
        // Ethereum transaction
        await handleEthereumTransaction(tower)
      }

      // On success
      toast.dismiss()
      toast.success(`${tower.name} purchased successfully!`)
      onPurchase(tower)
    } catch (error) {
      console.error("Purchase error:", error)
      toast.dismiss()
      toast.error(`Purchase failed: ${(error as Error).message}`)
    } finally {
      setPurchasingId(null)
    }
  }

  // Handle Solana transaction
  const handleSolanaTransaction = async (tower: TowerType) => {
    if (!publicKey) throw new Error("Solana wallet not connected")

    // Create connection to Solana network
    const connection = new Connection("https://api.devnet.solana.com", "confirmed")

    // Get the token account
    const fromTokenAccount = await connection.getParsedTokenAccountsByOwner(publicKey, {
      mint: new PublicKey(GRIND_SPL_MINT),
    })

    if (fromTokenAccount.value.length === 0) {
      throw new Error("You don't have any $GRIND tokens")
    }

    // Create transfer instruction
    const transferInstruction = createTransferInstruction(
      new PublicKey(fromTokenAccount.value[0].pubkey),
      new PublicKey(SOLANA_TREASURY),
      publicKey,
      tower.cost * 1_000_000_000, // Convert to lamports (assuming 9 decimals)
      [],
      undefined,
    )

    // Create and send transaction
    const transaction = new Transaction().add(transferInstruction)
    const signature = await sendTransaction(transaction, connection)

    // Wait for confirmation
    await connection.confirmTransaction(signature, "confirmed")
    return signature
  }

  // Handle Ethereum transaction
  const handleEthereumTransaction = async (tower: TowerType) => {
    if (!ethereumAddress || !window.ethereum || !window.ethers) {
      throw new Error("Ethereum wallet not connected")
    }

    // Create provider and signer
    const provider = new window.ethers.providers.Web3Provider(window.ethereum)
    const signer = provider.getSigner()

    // Create contract instance
    const tokenContract = new window.ethers.Contract(GRIND_ERC20_ADDRESS, ERC20_ABI, signer)

    // Convert cost to wei (assuming 18 decimals)
    const cost = window.ethers.utils.parseUnits(tower.cost.toString(), 18)

    // Send transaction
    const tx = await tokenContract.transfer(ETH_TREASURY, cost)

    // Wait for confirmation
    await tx.wait()
    return tx.hash
  }

  if (!isClient) {
    return null
  }

  return (
    <div className="bg-gray-800 p-4 rounded-lg">
      <h2 className="text-xl font-bold text-white mb-4">Tower Store</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {TOWER_TYPES.map((tower) => (
          <div key={tower.id} className="bg-gray-700 rounded-lg p-4 flex flex-col">
            <div className="flex items-center mb-2">
              <div className="w-12 h-12 bg-blue-500 rounded-full mr-3 flex items-center justify-center">
                <span className="text-xl">🗼</span>
              </div>
              <div>
                <h3 className="font-bold text-white">{tower.name}</h3>
                <p className="text-green-400">{tower.cost} $GRIND</p>
              </div>
            </div>
            <p className="text-gray-300 text-sm mb-3">{tower.description}</p>
            <div className="text-xs text-gray-400 mb-3">
              <div>Damage: {tower.damage}</div>
              <div>Range: {tower.range}</div>
              <div>Fire Rate: {1000 / tower.fireRate} shots/sec</div>
            </div>
            <button
              className={`mt-auto px-4 py-2 rounded ${
                isWalletConnected ? "bg-green-500 hover:bg-green-600" : "bg-gray-500 cursor-not-allowed"
              } text-white font-medium ${purchasingId === tower.id ? "opacity-50" : ""}`}
              onClick={() => buyTower(tower)}
              disabled={!isWalletConnected || purchasingId !== null}
            >
              {purchasingId === tower.id ? "Processing..." : isWalletConnected ? "Buy Tower" : "Connect Wallet"}
            </button>
          </div>
        ))}
      </div>
      {!isWalletConnected && (
        <p className="text-yellow-400 text-sm mt-4">
          Connect your Solana or Ethereum wallet to purchase towers with $GRIND tokens
        </p>
      )}
    </div>
  )
}
