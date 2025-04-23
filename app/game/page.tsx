"use client"
import { useState } from "react"
import MapSelector from "@/components/game/MapSelector"
import GameBoard from "@/components/game/GameBoard"
import ShopPanel from "@/components/game/ShopPanel"
import LevelProgressBar from "@/components/game/LevelProgressBar"
import type { TowerType } from "@/components/game/ShopPanel"
import { Toaster } from "react-hot-toast"
import { useWallet } from "@/components/hooks/useWallet"
import PlayerNameDialog from "@/components/game/PlayerNameDialog"

interface MapConfig {
  id: string
  name: string
  thumbnail: string
  image: string
  tileSize: number
  width: number
  height: number
}

export default function GamePage() {
  const [selectedMap, setSelectedMap] = useState<MapConfig | null>(null)
  const [ownedTowers, setOwnedTowers] = useState<string[]>(["basic"]) // Start with basic tower
  const [currentWave, setCurrentWave] = useState(1)
  const { balance, setBalance } = useWallet()

  const handleBuyTower = (tower: TowerType) => {
    if (balance >= tower.cost) {
      setBalance(balance - tower.cost)
      setOwnedTowers([...ownedTowers, tower.id])
    }
  }

  const handleBackToMapSelection = () => {
    setSelectedMap(null)
  }

  const handleWaveChange = (wave: number) => {
    setCurrentWave(wave)
  }

  return (
    <div className="p-4">
      <Toaster position="top-right" />
      <PlayerNameDialog />

      {!selectedMap ? (
        <MapSelector onSelectMap={setSelectedMap} />
      ) : (
        <div className="flex flex-col gap-4 container mx-auto">
          {/* Level Progress Bar */}
          <LevelProgressBar currentWave={currentWave} />

          <div className="flex flex-col md:flex-row gap-4">
            <div className="md:flex-grow">
              <GameBoard
                backgroundUrl={selectedMap.image}
                cols={selectedMap.width}
                rows={selectedMap.height}
                tileSize={selectedMap.tileSize}
                onBack={handleBackToMapSelection}
                ownedTowers={ownedTowers}
                onWaveChange={handleWaveChange}
              />
            </div>
            <div className="w-full md:w-64 flex-shrink-0">
              <ShopPanel ownedTowers={ownedTowers} onBuyTower={handleBuyTower} />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
