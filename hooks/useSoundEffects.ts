"use client"

import { useEffect, useState } from "react"
import soundManager, { type SoundEffectType } from "@/utils/SoundManager"

export function useSoundEffects() {
  const [isMuted, setIsMuted] = useState(false)
  const [volume, setVolume] = useState(0.5)
  const [isReady, setIsReady] = useState(false)
  const [isClient, setIsClient] = useState(false)

  // Check if we're on the client side
  useEffect(() => {
    setIsClient(true)
  }, [])

  // Initialize sound system
  useEffect(() => {
    if (!isClient) return

    // This will ensure the audio context is ready after user interaction
    const handleUserInteraction = () => {
      soundManager.resumeAudioContext()
      setIsReady(true)

      // Remove event listeners after initialization
      document.removeEventListener("click", handleUserInteraction)
      document.removeEventListener("touchstart", handleUserInteraction)
      document.removeEventListener("keydown", handleUserInteraction)
    }

    document.addEventListener("click", handleUserInteraction)
    document.addEventListener("touchstart", handleUserInteraction)
    document.addEventListener("keydown", handleUserInteraction)

    return () => {
      document.removeEventListener("click", handleUserInteraction)
      document.removeEventListener("touchstart", handleUserInteraction)
      document.removeEventListener("keydown", handleUserInteraction)
    }
  }, [isClient])

  // Update sound manager when mute state changes
  useEffect(() => {
    if (isClient) {
      soundManager.setMuted(isMuted)
    }
  }, [isMuted, isClient])

  // Update sound manager when volume changes
  useEffect(() => {
    if (isClient) {
      soundManager.setVolume(volume)
    }
  }, [volume, isClient])

  // Play a sound effect
  const playSound = (
    soundType: SoundEffectType,
    options?: {
      volume?: number
      loop?: boolean
      playbackRate?: number
      pan?: number
    },
  ) => {
    if (!isClient) return null
    return soundManager.playSound(soundType, options)
  }

  // Stop a specific sound
  const stopSound = (id: string) => {
    if (!isClient) return
    soundManager.stopSound(id)
  }

  // Stop all sounds
  const stopAllSounds = () => {
    if (!isClient) return
    soundManager.stopAllSounds()
  }

  // Preload sounds
  const preloadSounds = (soundTypes: SoundEffectType[]) => {
    if (!isClient) return
    soundManager.preloadSounds(soundTypes)
  }

  return {
    playSound,
    stopSound,
    stopAllSounds,
    preloadSounds,
    setMuted: setIsMuted,
    isMuted,
    setVolume,
    volume,
    isReady,
  }
}
