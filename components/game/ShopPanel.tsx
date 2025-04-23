"\"use client"

import { useState } from "react"
import { useWallet } from "@/components/hooks/useWallet"
import { Coins, Zap, Target, Clock } from "lucide-react"
import { toast } from "react-hot-toast"
import { TOWER_TYPES } from "./TowerTypes"

export interface TowerConfig {
  id: string
  name: string
  description: string
  cost: number
  damage: number
  range: number
  fireRate: number
  image: string
}

export interface TowerType {
  id: string
  name: string
  description: string
  sprite: string
  cost: number
  damage: number
  range: number
  fireRate: number
  icon: string
  special?: string
}

interface ShopPanelProps {
  ownedTowers: string[]
  onBuyTower: (tower: TowerType) => void
}

export default function ShopPanel({ ownedTowers, onBuyTower }: ShopPanelProps) {
  const { balance } = useWallet()
  const [selectedTower, setSelectedTower] = useState<TowerType | null>(null)

  const handleBuy = (tower: TowerType) => {
    if (ownedTowers.includes(tower.id)) {
      toast.info(`You already own ${tower.name}`)
      return
    }

    if (balance >= tower.cost) {
      onBuyTower(tower)
      toast.success(`Purchased ${tower.name}!`)
    } else {
      toast.error("Not enough $GRIND")
    }
  }

  return (
    <div className="w-64 bg-gray-800 text-white p-4 rounded-lg flex flex-col h-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Tower Shop</h2>
        <div className="flex items-center text-yellow-400">
          <Coins size={16} className="mr-1" />
          <span className="font-mono">{balance.toLocaleString()}</span>
        </div>
      </div>

      <div className="space-y-3 flex-grow overflow-auto">
        {TOWER_TYPES.map((tower) => (
          <div
            key={tower.id}
            className={`bg-gray-700 rounded-lg p-3 cursor-pointer transition-all ${
              selectedTower?.id === tower.id ? "ring-2 ring-green-400" : ""
            } ${ownedTowers.includes(tower.id) ? "border border-green-500" : ""}`}
            onClick={() => setSelectedTower(tower)}
          >
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gray-600 rounded-full flex items-center justify-center mr-3 text-xl">
                {tower.icon}
              </div>
              <div>
                <h3 className="font-medium">{tower.name}</h3>
                <div className="text-green-400 text-sm">{tower.cost} $GRIND</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedTower && (
        <div className="mt-4 border-t border-gray-600 pt-4">
          <h3 className="font-bold mb-2">{selectedTower.name}</h3>
          <p className="text-sm text-gray-300 mb-3">{selectedTower.description}</p>

          <div className="grid grid-cols-3 gap-2 text-xs mb-4">
            <div className="flex flex-col items-center bg-gray-700 p-2 rounded">
              <Zap size={16} className="mb-1 text-yellow-400" />
              <span className="text-gray-300">Damage</span>
              <span className="font-bold">{selectedTower.damage}</span>
            </div>
            <div className="flex flex-col items-center bg-gray-700 p-2 rounded">
              <Target size={16} className="mb-1 text-blue-400" />
              <span className="text-gray-300">Range</span>
              <span className="font-bold">{selectedTower.range}</span>
            </div>
            <div className="flex flex-col items-center bg-gray-700 p-2 rounded">
              <Clock size={16} className="mb-1 text-purple-400" />
              <span className="text-gray-300">Rate</span>
              <span className="font-bold">{(1000 / selectedTower.fireRate).toFixed(1)}/s</span>
            </div>
          </div>

          {ownedTowers.includes(selectedTower.id) ? (
            <div className="w-full py-2 bg-green-600 rounded-md font-medium text-center">Owned</div>
          ) : (
            <button
              className={`w-full py-2 rounded-md font-medium transition-colors ${
                balance < selectedTower.cost
                  ? "bg-gray-600 opacity-50 cursor-not-allowed"
                  : "bg-green-600 hover:bg-green-700"
              }`}
              onClick={() => handleBuy(selectedTower)}
              disabled={balance < selectedTower.cost}
            >
              {balance < selectedTower.cost ? "Insufficient $GRIND" : `Buy for ${selectedTower.cost} $GRIND`}
            </button>
          )}
        </div>
      )}
    </div>
  )
}
