"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface MapConfig {
  id: string
  name: string
  thumbnail: string
  image: string
  tileSize: number
  width: number
  height: number
}

interface MapSelectorProps {
  onSelectMap: (map: MapConfig) => void
}

export default function MapSelector({ onSelectMap }: MapSelectorProps) {
  const [maps, setMaps] = useState<MapConfig[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchMaps() {
      try {
        const response = await fetch("/config/maps.json")
        if (!response.ok) {
          throw new Error(`Failed to fetch maps: ${response.status}`)
        }
        const data = await response.json()
        setMaps(data)
      } catch (err) {
        console.error("Error loading maps:", err)
        setError("Failed to load maps. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    fetchMaps()
  }, [])

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center p-8 text-red-500">
        <p>{error}</p>
        <Button onClick={() => window.location.reload()} className="mt-4">
          Retry
        </Button>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6 text-center">Select a Map</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {maps.map((map) => (
          <Card key={map.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            <div className="aspect-video relative">
              <img
                src={map.thumbnail || `/placeholder.svg?height=200&width=400&query=${map.name}`}
                alt={map.name}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
            <CardContent className="p-4">
              <h3 className="text-xl font-semibold">{map.name}</h3>
              <p className="text-sm text-gray-500">
                {map.width}x{map.height} grid • {map.tileSize}px tiles
              </p>
            </CardContent>
            <CardFooter className="p-4 pt-0 flex justify-end">
              <Button onClick={() => onSelectMap(map)} className="bg-green-600 hover:bg-green-700">
                Load Map
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}
