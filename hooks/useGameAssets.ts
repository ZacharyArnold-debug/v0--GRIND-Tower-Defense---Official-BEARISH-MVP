"use client"

import { useState, useEffect } from "react"
import { loadGameAssets, preloadImages, type GameAsset, type AssetType } from "@/lib/loadAssets"

export function useGameAssets() {
  const [assets, setAssets] = useState<Record<AssetType, GameAsset[]> | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    async function loadAssets() {
      try {
        setLoading(true)
        const loadedAssets = await loadGameAssets()

        // Preload all images
        const allAssets = Object.values(loadedAssets).flat()
        await preloadImages(allAssets)

        setAssets(loadedAssets)
        setLoading(false)
      } catch (err) {
        console.error("Failed to load game assets:", err)
        setError(err instanceof Error ? err : new Error("Unknown error loading assets"))
        setLoading(false)
      }
    }

    loadAssets()
  }, [])

  // Helper function to get asset by name
  const getAssetByName = (name: string): GameAsset | undefined => {
    if (!assets) return undefined

    for (const type in assets) {
      const found = assets[type as AssetType].find((asset) => asset.name.toLowerCase() === name.toLowerCase())
      if (found) return found
    }

    return undefined
  }

  // Helper function to get asset URL by name
  const getAssetUrl = (name: string): string | undefined => {
    return getAssetByName(name)?.src
  }

  return {
    assets,
    loading,
    error,
    getAssetByName,
    getAssetUrl,
  }
}
