"use client"
import { useEffect, useState } from "react"
import { useSoundEffects } from "@/hooks/useSoundEffects"

interface ProjectileProps {
  proj: {
    id: number
    x: number
    y: number
    targetX: number
    targetY: number
    color?: string
    effect?: string
  }
  onHit: () => void
}

export default function Projectile({ proj, onHit }: ProjectileProps) {
  const [pos, setPos] = useState({ x: proj.x, y: proj.y })
  const [trailElements, setTrailElements] = useState<{ x: number; y: number; opacity: number }[]>([])

  // Default color if none provided
  const projectileColor = proj.color || "#FFD700" // Default gold color

  const { playSound } = useSoundEffects()

  useEffect(() => {
    const start = Date.now()
    const duration = 300

    // For trail effect
    const trailInterval = setInterval(() => {
      if (proj.effect === "fire" || proj.effect === "lightning" || proj.effect === "ice") {
        setTrailElements((prev) => {
          // Add current position to trail
          const newTrail = [
            { x: pos.x, y: pos.y, opacity: 1 },
            ...prev.map((el) => ({ ...el, opacity: el.opacity - 0.2 })),
          ].filter((el) => el.opacity > 0)

          // Limit trail length
          return newTrail.slice(0, 5)
        })
      }
    }, 50)

    function animate() {
      const t = Math.min(1, (Date.now() - start) / duration)
      setPos({
        x: proj.x + (proj.targetX - proj.x) * t,
        y: proj.y + (proj.targetY - proj.y) * t,
      })
      if (t < 1) requestAnimationFrame(animate)
      else {
        // Play hit sound based on projectile effect
        if (proj.effect === "fire") {
          playSound("FIRE_SHOT", { volume: 0.4 })
        } else if (proj.effect === "lightning") {
          playSound("LIGHTNING_SHOT", { volume: 0.4 })
        } else if (proj.effect === "ice") {
          playSound("ICE_SHOT", { volume: 0.4 })
        } else {
          playSound("ENEMY_HIT", { volume: 0.3 })
        }

        onHit()
        clearInterval(trailInterval)
      }
    }

    animate()

    return () => clearInterval(trailInterval)
  }, [proj, onHit, playSound])

  return (
    <>
      {/* Trail effect for special projectiles */}
      {trailElements.map((el, i) => (
        <div
          key={`trail-${i}`}
          className={`absolute rounded-full pointer-events-none ${
            proj.effect === "fire"
              ? "bg-orange-500"
              : proj.effect === "ice"
                ? "bg-blue-300"
                : proj.effect === "lightning"
                  ? "bg-cyan-400"
                  : ""
          }`}
          style={{
            left: `${el.x}px`,
            top: `${el.y}px`,
            transform: "translate(-50%, -50%)",
            width: `${proj.effect === "lightning" ? 3 : 4}px`,
            height: `${proj.effect === "lightning" ? 3 : 4}px`,
            opacity: el.opacity,
          }}
        />
      ))}

      {/* Main projectile */}
      <div
        className="absolute rounded-full pointer-events-none"
        style={{
          left: `${pos.x}px`,
          top: `${pos.y}px`,
          transform: "translate(-50%, -50%)",
          width: "6px",
          height: "6px",
          backgroundColor: projectileColor,
          boxShadow: proj.effect ? `0 0 5px ${projectileColor}` : "none",
        }}
      />
    </>
  )
}
