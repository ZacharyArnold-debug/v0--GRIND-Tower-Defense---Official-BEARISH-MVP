/**
 * Asset types for the tower defense game
 */
export type AssetType = "enemy" | "tower" | "castle" | "boss" | "projectile" | "effect" | "other"

/**
 * Asset interface representing a game asset
 */
export interface GameAsset {
  name: string
  src: string
  type: AssetType
}

/**
 * Raw asset interface before normalization
 */
export interface RawAsset {
  name: string
  src: string
}

/**
 * Normalizes assets by determining their type based on filename patterns
 *
 * @param manifest Array of assets with name and src properties
 * @returns Array of assets with added type property
 */
export function normalizeAssets(manifest: Array<RawAsset>): Array<GameAsset> {
  return manifest.map((asset) => {
    let type: AssetType = "other"
    const lower = asset.name.toLowerCase()

    // Determine asset type based on filename patterns
    if (lower.includes("baddie") || lower.includes("enemy")) {
      type = "enemy"
    } else if (lower.includes("tower")) {
      type = "tower"
    } else if (lower.includes("castle")) {
      type = "castle"
    } else if (
      lower.includes("boss") ||
      lower.includes("overlord") ||
      lower.includes("monarch") ||
      lower.includes("colossus") ||
      lower.includes("leviathan") ||
      lower.includes("behemoth") ||
      lower.includes("fiend") ||
      lower.includes("percolator") ||
      lower.includes("grindmaster") ||
      lower.includes("grindfather") ||
      lower.includes("dreadnought")
    ) {
      type = "boss"
    } else if (lower.includes("projectile")) {
      type = "projectile"
    } else if (lower.includes("effect")) {
      type = "effect"
    }

    return { ...asset, type }
  })
}

/**
 * Loads all game assets and returns them categorized by type
 *
 * @returns Promise resolving to categorized assets
 */
export async function loadGameAssets(): Promise<Record<AssetType, GameAsset[]>> {
  try {
    // In a real implementation, this would fetch from a manifest file or API
    const response = await fetch("/config/assets.json")
    if (!response.ok) {
      throw new Error(`Failed to load assets: ${response.status}`)
    }

    const rawAssets: RawAsset[] = await response.json()
    const normalizedAssets = normalizeAssets(rawAssets)

    // Group assets by type
    const result: Record<AssetType, GameAsset[]> = {
      enemy: [],
      tower: [],
      castle: [],
      boss: [],
      projectile: [],
      effect: [],
      other: [],
    }

    normalizedAssets.forEach((asset) => {
      result[asset.type].push(asset)
    })

    return result
  } catch (error) {
    console.error("Error loading game assets:", error)
    return {
      enemy: [],
      tower: [],
      castle: [],
      boss: [],
      projectile: [],
      effect: [],
      other: [],
    }
  }
}

/**
 * Preloads images to ensure they're cached before being used in the game
 *
 * @param assets Array of assets to preload
 * @returns Promise that resolves when all images are loaded
 */
export function preloadImages(assets: GameAsset[]): Promise<void[]> {
  const promises = assets.map((asset) => {
    return new Promise<void>((resolve, reject) => {
      const img = new Image()
      img.onload = () => resolve()
      img.onerror = () => {
        console.warn(`Failed to preload image: ${asset.src}`)
        resolve() // Resolve anyway to not block the game
      }
      img.src = asset.src
    })
  })

  return Promise.all(promises)
}
