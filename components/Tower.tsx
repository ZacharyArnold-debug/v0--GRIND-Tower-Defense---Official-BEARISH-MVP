"use client"
import { useEffect, useState } from "react"
import type { PathPoint } from "./GridTile"

export interface TowerConfig {
  range: number
  damage: number
  fireRate: number
  cost: number
}

export const DEFAULT_TOWER_CONFIG: TowerConfig = {
  range: 3,
  damage: 5,
  fireRate: 1000,
  cost: 100,
}

interface TowerProps {
  x: number
  y: number
  config: TowerConfig
  onFire: (target: PathPoint) => void
}

export default function Tower({ x, y, config, onFire }: TowerProps) {
  const [target, setTarget] = useState<PathPoint | null>(null)
  const [lastFireTime, setLastFireTime] = useState<number>(0)

  const findNearestTarget = () => {
    // Simulate finding a target for demonstration
    // In a real game, this would check for nearby enemies
    if (Math.random() > 0.95) {
      return { x: Math.floor(Math.random() * 12), y: Math.floor(Math.random() * 10) }
    }
    return null
  }

  useEffect(() => {
    const interval = setInterval(() => {
      const currentTime = Date.now()
      if (currentTime - lastFireTime >= config.fireRate) {
        const nearestTarget = findNearestTarget()
        if (nearestTarget) {
          setTarget(nearestTarget)
          onFire(nearestTarget)
          setLastFireTime(currentTime)
        }
      }
    }, 100)

    return () => clearInterval(interval)
  }, [config.fireRate, lastFireTime, onFire])

  return (
    <div
      className="absolute w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center"
      style={{
        left: `${x * 32}px`,
        top: `${y * 32}px`,
        transform: "translate(0%, 0%)",
        zIndex: 10,
      }}
    >
      {target && (
        <div
          className="absolute w-1 h-1 bg-red-500 rounded-full"
          style={{
            left: "50%",
            top: "50%",
            transform: `translate(-50%, -50%) rotate(${Math.atan2(target.y - y, target.x - x) * (180 / Math.PI)}deg)`,
          }}
        />
      )}
    </div>
  )
}
