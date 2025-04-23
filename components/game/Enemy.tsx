"use client"

import { useState, useEffect } from "react"
import { ENEMY_TYPES, BOSS_TYPES } from "./EnemyTypes"

interface EnemyProps {
  x: number
  y: number
  health: number
  maxHealth: number
  enemyType?: string
  size?: number
}

export default function Enemy({ x, y, health, maxHealth, enemyType = "coffee_cup", size = 32 }: EnemyProps) {
  const [loaded, setLoaded] = useState(false)

  // Determine if this is a boss
  const isBoss = Object.keys(BOSS_TYPES).includes(enemyType)

  // Get the enemy data from our types
  const enemyData = ENEMY_TYPES[enemyType] ||
    BOSS_TYPES[enemyType] || { sprite: "/assets/enemies/coffee-cup-baddie.png", name: "Unknown Enemy" }

  // Handle image loading
  useEffect(() => {
    const img = new Image()
    img.src = enemyData.sprite
    img.onload = () => setLoaded(true)
  }, [enemyData.sprite])

  if (health <= 0) return null

  return (
    <div className="w-full h-full flex items-center justify-center pointer-events-none relative">
      {/* Health bar */}
      <div className="absolute -top-2 left-0 w-full h-1 bg-gray-200 rounded-full overflow-hidden">
        <div
          className={`h-full ${isBoss ? "bg-purple-500" : "bg-red-500"}`}
          style={{ width: `${(health / maxHealth) * 100}%` }}
        />
      </div>

      {/* Enemy sprite */}
      {loaded ? (
        <div
          className={`w-full h-full bg-no-repeat bg-center bg-contain ${isBoss ? "scale-125" : ""}`}
          style={{
            backgroundImage: `url(${enemyData.sprite})`,
            width: isBoss ? size * 1.5 : size,
            height: isBoss ? size * 1.5 : size,
          }}
          title={enemyData.name}
        />
      ) : (
        <div
          className={`${isBoss ? "bg-purple-700" : "bg-red-600"} rounded-full`}
          style={{
            width: isBoss ? size * 1.2 : size * 0.75,
            height: isBoss ? size * 1.2 : size * 0.75,
            opacity: health / maxHealth,
          }}
        />
      )}

      {/* Boss indicator */}
      {isBoss && (
        <div className="absolute -top-6 left-0 w-full text-center">
          <span className="bg-purple-700 text-white text-xs px-1 py-0.5 rounded">BOSS</span>
        </div>
      )}
    </div>
  )
}
