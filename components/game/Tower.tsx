"use client"

import type React from "react"

import { useEffect, useState } from "react"
import type { Enemy } from "@/types"
import { TOWER_TYPES } from "./TowerTypes"
import { useGameAssets } from "@/hooks/useGameAssets"
import AnimatedTower from "./TowerSprites"
import { useSoundEffects } from "@/hooks/useSoundEffects"

interface TowerProps {
  x: number
  y: number
  enemies: Enemy[]
  towerType?: string
  fireRateMs?: number
  size?: number
  level?: number
}

export const Tower: React.FC<TowerProps> = ({
  x,
  y,
  enemies,
  towerType = "basic",
  fireRateMs = 1000,
  size = 32,
  level = 1,
}) => {
  const [cooldown, setCooldown] = useState(0)
  const [loaded, setLoaded] = useState(false)
  const [isAttacking, setIsAttacking] = useState(false)
  const { getAssetUrl } = useGameAssets()
  const { playSound } = useSoundEffects()

  // Get tower data from our types
  const towerData = TOWER_TYPES.find((t) => t.id === towerType) || TOWER_TYPES[0]

  // Try to get the asset URL from our asset system first
  const spriteUrl = getAssetUrl(towerType + "-tower") || towerData.sprite

  // Tower attack radius - must match the visual radius in GameBoard
  const ATTACK_RADIUS = towerData.range || 4

  // Handle image loading for non-animated towers
  useEffect(() => {
    if (!isAnimatedTower(towerType)) {
      const img = new Image()
      img.src = spriteUrl
      img.onload = () => setLoaded(true)
    } else {
      setLoaded(true) // Animated towers don't need this loading state
    }
  }, [spriteUrl, towerType])

  // tick cooldown
  useEffect(() => {
    let timer: NodeJS.Timeout
    if (cooldown > 0) {
      timer = setTimeout(() => setCooldown(cooldown - 100), 100)
    }
    return () => clearTimeout(timer)
  }, [cooldown])

  // auto‐fire
  useEffect(() => {
    if (cooldown <= 0 && enemies.length) {
      // find nearest enemy
      const nearest = enemies.reduce(
        (best, e) => {
          const d = Math.hypot(e.x - x, e.y - y)
          return d < best.dist ? { enemy: e, dist: d } : best
        },
        { enemy: enemies[0], dist: Number.POSITIVE_INFINITY },
      )

      if (nearest.dist <= ATTACK_RADIUS) {
        // Set attacking state for animation
        setIsAttacking(true)

        // Play tower firing sound based on tower type
        if (towerType === "fire") {
          playSound("FIRE_SHOT", { volume: 0.4 })
        } else if (towerType === "lightning") {
          playSound("LIGHTNING_SHOT", { volume: 0.4 })
        } else if (towerType === "winter") {
          playSound("ICE_SHOT", { volume: 0.4 })
        } else {
          playSound("BASIC_SHOT", { volume: 0.3, playbackRate: 1.0 + Math.random() * 0.2 })
        }

        // Reset attacking state after animation completes
        setTimeout(
          () => {
            setIsAttacking(false)
          },
          isAnimatedTower(towerType) ? 900 : 300,
        ) // Longer for animated towers

        // trigger projectile (via parent callback / context)
        document.dispatchEvent(
          new CustomEvent("fireProjectile", {
            detail: {
              from: { x, y },
              to: { x: nearest.enemy.x, y: nearest.enemy.y },
              color: towerData.projectileColor,
              effect: towerData.projectileEffect,
            },
          }),
        )
        setCooldown(fireRateMs)
      }
    }
  }, [cooldown, enemies, x, y, fireRateMs, ATTACK_RADIUS, towerData, towerType, playSound])

  // Helper function to check if tower type is animated
  function isAnimatedTower(type: string): boolean {
    return ["pons", "grind_hamster", "bearish_bear", "fire", "lightning", "winter"].includes(type)
  }

  // Apply level-based styling
  const levelStyles = {
    transform: level > 1 ? `scale(${1 + (level - 1) * 0.1})` : "none",
    filter: level > 1 ? `brightness(${1 + (level - 1) * 0.15})` : "none",
    zIndex: 10 + level,
  }

  return (
    <div className="relative w-full h-full">
      {/* Level indicator */}
      {level > 1 && (
        <div className="absolute -top-3 -right-3 w-5 h-5 bg-yellow-500 rounded-full flex items-center justify-center text-xs font-bold z-20">
          {level}
        </div>
      )}

      {/* Tower sprite */}
      {loaded ? (
        isAnimatedTower(towerType) ? (
          <div style={levelStyles}>
            <AnimatedTower type={towerType} size={size} isAttacking={isAttacking} />
          </div>
        ) : (
          <div
            className="absolute inset-0 bg-no-repeat bg-center bg-contain"
            style={{
              backgroundImage: `url(${spriteUrl})`,
              width: size,
              height: size,
              ...levelStyles,
            }}
            title={towerData.name}
          />
        )
      ) : (
        <div className="absolute inset-0 bg-blue-600 rounded-full" />
      )}

      {/* cooldown overlay */}
      {cooldown > 0 && (
        <div
          className="absolute inset-0 bg-white bg-opacity-50 rounded-full"
          style={{
            clipPath: `circle(${(cooldown / fireRateMs) * 50}% at center)`,
          }}
        />
      )}
    </div>
  )
}
