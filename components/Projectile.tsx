"use client"
import { useEffect, useState } from "react"

interface ProjectileProps {
  startX: number
  startY: number
  targetX: number
  targetY: number
  speed: number
  onHit: () => void
}

export default function Projectile({ startX, startY, targetX, targetY, speed, onHit }: ProjectileProps) {
  const [position, setPosition] = useState({ x: startX, y: startY })
  const [isActive, setIsActive] = useState(true)

  useEffect(() => {
    const distance = Math.sqrt(Math.pow(targetX - startX, 2) + Math.pow(targetY - startY, 2))
    const duration = (distance * 1000) / speed
    const startTime = Date.now()

    const animate = () => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / duration, 1)

      if (progress < 1) {
        setPosition({
          x: startX + (targetX - startX) * progress,
          y: startY + (targetY - startY) * progress,
        })
        requestAnimationFrame(animate)
      } else {
        setIsActive(false)
        onHit()
      }
    }

    const animationFrame = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(animationFrame)
  }, [startX, startY, targetX, targetY, speed, onHit])

  if (!isActive) return null

  return (
    <div
      className="absolute w-2 h-2 bg-yellow-500 rounded-full"
      style={{
        left: `${position.x * 32}px`,
        top: `${position.y * 32}px`,
        transform: "translate(0%, 0%)",
        zIndex: 20,
      }}
    />
  )
}
