"use client"

import { useState, useEffect, type CSSProperties } from "react"

interface SpriteProps {
  /** array of image URLs */
  frames: string[]
  /** milliseconds between frames */
  frameRate?: number
  /** any extra styling */
  style?: CSSProperties
  /** alt text for accessibility */
  alt?: string
  /** width in pixels */
  width?: number
  /** height in pixels */
  height?: number
  /** whether animation is playing */
  isPlaying?: boolean
  /** callback when animation completes one cycle */
  onCycleComplete?: () => void
  /** class name for additional styling */
  className?: string
}

export default function Sprite({
  frames,
  frameRate = 200,
  style,
  alt = "",
  width = 64,
  height = 64,
  isPlaying = true,
  onCycleComplete,
  className = "",
}: SpriteProps) {
  const [frameIndex, setFrameIndex] = useState(0)

  useEffect(() => {
    if (!isPlaying || frames.length <= 1) return

    const intervalId = setInterval(() => {
      setFrameIndex((prevIndex) => {
        const nextIndex = (prevIndex + 1) % frames.length
        if (nextIndex === 0 && onCycleComplete) {
          onCycleComplete()
        }
        return nextIndex
      })
    }, frameRate)

    return () => clearInterval(intervalId)
  }, [frames, frameRate, isPlaying, onCycleComplete])

  if (frames.length === 0) return null

  return (
    <div
      className={`relative ${className}`}
      style={{
        width: `${width}px`,
        height: `${height}px`,
        ...style,
      }}
    >
      <img
        src={frames[frameIndex] || "/placeholder.svg"}
        alt={alt}
        className="w-full h-full object-contain"
        style={{ imageRendering: "pixelated" }}
      />
    </div>
  )
}
