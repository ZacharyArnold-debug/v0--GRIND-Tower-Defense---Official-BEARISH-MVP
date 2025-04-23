"use client"

import { useState, useEffect } from "react"
import { useGameAssets } from "@/hooks/useGameAssets"

interface CastleProps {
  x: number
  y: number
  health: number
  maxHealth: number
  castleType?: string
  size?: number
}

export default function Castle({ x, y, health, maxHealth, castleType = "tree_castle", size = 64 }: CastleProps) {
  const [loaded, setLoaded] = useState(false)
  const { getAssetUrl } = useGameAssets()

  // Default castle image
  const defaultCastleImage = "/assets/castles/tree-castle.png"

  // Try to get the asset URL from our asset system first
  const castleUrl = getAssetUrl(castleType) || defaultCastleImage

  // Handle image loading
  useEffect(() => {
    const img = new Image()
    img.src = castleUrl
    img.onload = () => setLoaded(true)
  }, [castleUrl])

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      {/* Health bar */}
      <div className="absolute -top-4 left-0 w-full h-2 bg-gray-200 rounded-full overflow-hidden">
        <div className="h-full bg-green-500" style={{ width: `${(health / maxHealth) * 100}%` }} />
      </div>

      {/* Castle sprite */}
      {loaded ? (
        <div
          className="w-full h-full bg-no-repeat bg-center bg-contain"
          style={{
            backgroundImage: `url(${castleUrl})`,
            width: size,
            height: size,
          }}
        />
      ) : (
        <div className="w-full h-full bg-gray-500 rounded-lg flex items-center justify-center">
          <span className="text-white">🏰</span>
        </div>
      )}
    </div>
  )
}
