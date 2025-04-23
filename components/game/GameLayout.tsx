"use client"

import type { ReactNode } from "react"
import ShopPanel from "./ShopPanel"
import type { TowerConfig } from "./ShopPanel"
import { useGameContext } from "./GameContext"

interface GameLayoutProps {
  children: ReactNode
  onBuyTower?: (tower: TowerConfig) => void
}

export default function GameLayout({ children, onBuyTower }: GameLayoutProps) {
  const { addTower } = useGameContext()

  const handleBuyTower = (tower: TowerConfig) => {
    // Add tower to game context
    addTower(tower)

    // Call parent callback
    if (onBuyTower) {
      onBuyTower(tower)
    }
  }

  return (
    <div className="flex flex-col md:flex-row gap-4 w-full max-w-screen-xl mx-auto">
      <div className="md:flex-grow">{children}</div>
      <div className="w-full md:w-64 flex-shrink-0">
        <ShopPanel onBuy={handleBuyTower} />
      </div>
    </div>
  )
}
