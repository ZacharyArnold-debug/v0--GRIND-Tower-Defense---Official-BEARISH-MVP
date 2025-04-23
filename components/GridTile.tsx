"use client"

export interface PathPoint {
  x: number
  y: number
}

interface GridTileProps {
  x: number
  y: number
  isPath: boolean
  isTower?: boolean
  editMode: boolean
  onToggle: (x: number, y: number) => void
}

export default function GridTile({ x, y, isPath, isTower = false, editMode, onToggle }: GridTileProps) {
  return (
    <div
      className={`w-8 h-8 border border-gray-300 flex items-center justify-center 
        ${isPath ? "bg-red-500" : isTower ? "bg-blue-500" : "bg-gray-100"} 
        ${editMode ? "cursor-pointer hover:bg-red-300" : ""}`}
      onClick={() => editMode && onToggle(x, y)}
    />
  )
}
