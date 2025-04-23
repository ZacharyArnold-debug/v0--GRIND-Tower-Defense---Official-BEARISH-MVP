"use client"
import { useEffect, useState } from "react"
import type { PathPoint } from "./GridTile"

interface EnemyProps {
  path: PathPoint[]
  speed: number
  health: number
  onReachEnd: () => void
  onDeath: () => void
}

export default function Enemy({ path, speed, health, onReachEnd, onDeath }: EnemyProps) {
  const [position, setPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 })
  const [currentHealth, setCurrentHealth] = useState(health)
  const [pathIndex, setPathIndex] = useState(0)
  const [isActive, setIsActive] = useState(true)

  useEffect(() => {
    if (!path.length || pathIndex >= path.length) {
      return
    }

    // Set initial position
    if (pathIndex === 0) {
      setPosition({ x: path[0].x, y: path[0].y })
    }

    const moveToNextPoint = () => {
      if (pathIndex >= path.length - 1) {
        setIsActive(false)
        onReachEnd()
        return
      }

      const currentPoint = path[pathIndex]
      const nextPoint = path[pathIndex + 1]

      // Calculate distance and time to next point
      const distance = Math.sqrt(Math.pow(nextPoint.x - currentPoint.x, 2) + Math.pow(nextPoint.y - currentPoint.y, 2))

      const duration = (distance * 1000) / speed
      const startTime = Date.now()

      const animate = () => {
        if (!isActive) return

        const elapsed = Date.now() - startTime
        const progress = Math.min(elapsed / duration, 1)

        if (progress < 1) {
          setPosition({
            x: currentPoint.x + (nextPoint.x - currentPoint.x) * progress,
            y: currentPoint.y + (nextPoint.y - currentPoint.y) * progress,
          })
          requestAnimationFrame(animate)
        } else {
          setPathIndex(pathIndex + 1)
        }
      }

      requestAnimationFrame(animate)
    }

    moveToNextPoint()
  }, [path, pathIndex, speed, isActive, onReachEnd])

  useEffect(() => {
    if (currentHealth <= 0) {
      setIsActive(false)
      onDeath()
    }
  }, [currentHealth, onDeath])

  if (!isActive) return null

  return (
    <div
      className="absolute w-6 h-6 bg-green-600 rounded-full flex items-center justify-center"
      style={{
        left: `${position.x * 32}px`,
        top: `${position.y * 32}px`,
        transform: "translate(0%, 0%)",
        zIndex: 5,
      }}
    >
      <div className="text-white text-xs font-bold">{currentHealth}</div>
      <div className="absolute -top-2 w-full h-1 bg-gray-200 rounded-full overflow-hidden">
        <div className="h-full bg-red-500" style={{ width: `${(currentHealth / health) * 100}%` }} />
      </div>
    </div>
  )
}
