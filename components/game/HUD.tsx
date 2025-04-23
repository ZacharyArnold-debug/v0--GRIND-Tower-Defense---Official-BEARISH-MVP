"use client"

import type React from "react"
import dynamic from "next/dynamic"
import { useWallet } from "@/components/hooks/useWallet"
import { Coins } from "lucide-react"

// Import TokenBalance with SSR disabled
const TokenBalance = dynamic(() => import("@/components/TokenBalance").then((mod) => mod.TokenBalance), {
  ssr: false,
})

interface HUDProps {
  score: number
  baseHealth: number
  onStart: () => void
  isRunning: boolean
  waveNumber: number
  isWaveActive: boolean
}

export const HUD: React.FC<HUDProps> = ({ score, baseHealth, onStart, isRunning, waveNumber, isWaveActive }) => {
  const { balance } = useWallet()

  return (
    <div className="flex items-center justify-between p-4 bg-gray-800 text-white text-sm md:text-base">
      <div className="flex items-center space-x-4">
        <button
          className="px-4 py-2 bg-green-500 hover:bg-green-600 rounded disabled:opacity-50"
          onClick={onStart}
          disabled={isWaveActive}
        >
          {isWaveActive ? `Wave ${waveNumber} in progress...` : `Start Wave ${waveNumber}`}
        </button>
        <TokenBalance />
        <div className="flex items-center font-mono">
          <Coins size={16} className="mr-1 text-yellow-400" />
          <span>{balance.toLocaleString()} $GRIND</span>
        </div>
      </div>
      <div className="flex items-center space-x-4">
        <span>
          Wave: <strong>{waveNumber}</strong>
        </span>
        <span>
          Score: <strong>{score}</strong>
        </span>
        <span>
          Castle Health: <strong>{baseHealth}</strong>
        </span>
      </div>
    </div>
  )
}
