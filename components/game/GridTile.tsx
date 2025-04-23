"use client"

export interface PathPoint {
  x: number
  y: number
}

interface GridTileProps {
  x: number
  y: number
  isPath: boolean
  isTower: boolean
  isCastle?: boolean
  editMode?: boolean
  onToggle: (x: number, y: number) => void
}

export default function GridTile({
  x,
  y,
  isPath,
  isTower,
  isCastle = false,
  editMode = false,
  onToggle,
}: GridTileProps) {
  // Use transparent background with visible borders for better map visibility
  return (
    <div
      className={`w-full h-full border border-gray-400 border-opacity-30 transition-colors duration-100
        ${isPath ? "bg-yellow-500 bg-opacity-70" : "bg-transparent"} 
        ${isTower ? "bg-blue-600 bg-opacity-70" : ""}
        ${isCastle ? "bg-green-600 bg-opacity-70" : ""}
        ${editMode ? "cursor-pointer hover:bg-white hover:bg-opacity-20" : ""}`}
      onClick={() => onToggle(x, y)}
      title={`Tile (${x},${y})`}
    />
  )
}
