"use client"

import Sprite from "./Sprite"

// Define frame sequences for each tower type
const PONS_FRAMES = [
  "/assets/towers/pons-tower/frame1.png",
  "/assets/towers/pons-tower/frame2.png",
  "/assets/towers/pons-tower/frame3.png",
]

const GRIND_HAMSTER_FRAMES = [
  "/assets/towers/grind_hamster-tower/frame1.png",
  "/assets/towers/grind_hamster-tower/frame2.png",
  "/assets/towers/grind_hamster-tower/frame3.png",
]

const BEARISH_BEAR_FRAMES = [
  "/assets/towers/bearish_bear-tower/frame1.png",
  "/assets/towers/bearish_bear-tower/frame2.png",
  "/assets/towers/bearish_bear-tower/frame3.png",
]

// Add these new frame arrays for the single-frame towers
const FIRE_FRAMES = ["/assets/towers/fire-tower.png"]

const LIGHTNING_FRAMES = ["/assets/towers/lightning-tower.png"]

const WINTER_FRAMES = ["/assets/towers/winter-tower.png"]

// Frame rates for each tower type (ms)
const PONS_FRAME_RATE = 250
const HAMSTER_FRAME_RATE = 300
const BEAR_FRAME_RATE = 200

// Export individual tower sprite components
export function PonsTowerSprite({ size = 64, isAttacking = false }) {
  return (
    <Sprite
      frames={PONS_FRAMES}
      frameRate={PONS_FRAME_RATE}
      width={size}
      height={size}
      alt="Pons Tower"
      isPlaying={isAttacking}
      className="tower-sprite"
    />
  )
}

export function GrindHamsterTowerSprite({ size = 64, isAttacking = false }) {
  return (
    <Sprite
      frames={GRIND_HAMSTER_FRAMES}
      frameRate={HAMSTER_FRAME_RATE}
      width={size}
      height={size}
      alt="$GRIND Hamster Tower"
      isPlaying={isAttacking}
      className="tower-sprite"
    />
  )
}

export function BearishBearTowerSprite({ size = 64, isAttacking = false }) {
  return (
    <Sprite
      frames={BEARISH_BEAR_FRAMES}
      frameRate={BEAR_FRAME_RATE}
      width={size}
      height={size}
      alt="Chill Bearish Bear Tower"
      isPlaying={isAttacking}
      className="tower-sprite"
    />
  )
}

// Add these new sprite components
export function FireTowerSprite({ size = 64, isAttacking = false }) {
  return (
    <Sprite
      frames={FIRE_FRAMES}
      frameRate={200} // Not really used since there's only one frame
      width={size}
      height={size}
      alt="Fire Tower"
      isPlaying={isAttacking}
      className="tower-sprite"
    />
  )
}

export function LightningTowerSprite({ size = 64, isAttacking = false }) {
  return (
    <Sprite
      frames={LIGHTNING_FRAMES}
      frameRate={200} // Not really used since there's only one frame
      width={size}
      height={size}
      alt="Lightning Tower"
      isPlaying={isAttacking}
      className="tower-sprite"
    />
  )
}

export function WinterTowerSprite({ size = 64, isAttacking = false }) {
  return (
    <Sprite
      frames={WINTER_FRAMES}
      frameRate={200} // Not really used since there's only one frame
      width={size}
      height={size}
      alt="Winter Tower"
      isPlaying={isAttacking}
      className="tower-sprite"
    />
  )
}

interface AnimatedTowerProps {
  type: "pons" | "grind_hamster" | "bearish_bear" | "fire" | "lightning" | "winter"
  size?: number
  isAttacking?: boolean
}

// Update the AnimatedTower component to include the new tower types
export default function AnimatedTower({ type, size = 64, isAttacking = false }: AnimatedTowerProps) {
  switch (type) {
    case "pons":
      return <PonsTowerSprite size={size} isAttacking={isAttacking} />
    case "grind_hamster":
      return <GrindHamsterTowerSprite size={size} isAttacking={isAttacking} />
    case "bearish_bear":
      return <BearishBearTowerSprite size={size} isAttacking={isAttacking} />
    case "fire":
      return <FireTowerSprite size={size} isAttacking={isAttacking} />
    case "lightning":
      return <LightningTowerSprite size={size} isAttacking={isAttacking} />
    case "winter":
      return <WinterTowerSprite size={size} isAttacking={isAttacking} />
    default:
      // For non-animated towers, return null or a placeholder
      return null
  }
}
