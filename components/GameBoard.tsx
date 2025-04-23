"use client"
import { useState, useEffect } from "react"
import GridTile, { type PathPoint } from "./GridTile"
import Tower, { type TowerConfig, DEFAULT_TOWER_CONFIG } from "./Tower"
import Projectile from "./Projectile"
import { toast } from "react-hot-toast"

interface GameBoardProps {
  cols?: number
  rows?: number
}

interface TowerPosition extends PathPoint {
  config: TowerConfig
}

interface ActiveProjectile {
  id: number
  startX: number
  startY: number
  targetX: number
  targetY: number
}

export default function GameBoard({ cols = 12, rows = 10 }: GameBoardProps) {
  const [pathPoints, setPathPoints] = useState<PathPoint[]>([])
  const [editMode, setEditMode] = useState(false)
  const [towers, setTowers] = useState<TowerPosition[]>([])
  const [projectiles, setProjectiles] = useState<ActiveProjectile[]>([])
  const [nextProjectileId, setNextProjectileId] = useState(0)
  const [gameStatus, setGameStatus] = useState<"idle" | "editing" | "playing">("idle")
  const [castlePosition, setCastlePosition] = useState<PathPoint | null>(null)

  // Load saved path from localStorage on initial render
  useEffect(() => {
    const savedPath = localStorage.getItem("towerDefensePath")
    if (savedPath) {
      try {
        setPathPoints(JSON.parse(savedPath))
      } catch (e) {
        console.error("Failed to load saved path:", e)
      }
    }
  }, [])

  function togglePoint(x: number, y: number) {
    const exists = pathPoints.find((p) => p.x === x && p.y === y)
    if (exists) {
      setPathPoints(pathPoints.filter((p) => p.x !== x || p.y !== y))
    } else {
      setPathPoints([...pathPoints, { x, y }])
    }
  }

  const isPath = (x: number, y: number) => pathPoints.some((p) => p.x === x && p.y === y)

  const canPlaceTower = (x: number, y: number) => {
    return !isPath(x, y) && !towers.some((t) => t.x === x && t.y === y)
  }

  // Update the handleTileClick function to check for tower placement
  const handleTileClick = (x: number, y: number) => {
    if (editMode) {
      togglePoint(x, y)
    } else if (canPlaceTower(x, y)) {
      setTowers([...towers, { x, y, config: DEFAULT_TOWER_CONFIG }])
    }
  }

  const handleTowerFire = (tower: TowerPosition, target: PathPoint) => {
    const newProjectile: ActiveProjectile = {
      id: nextProjectileId,
      startX: tower.x,
      startY: tower.y,
      targetX: target.x,
      targetY: target.y,
    }
    setProjectiles([...projectiles, newProjectile])
    setNextProjectileId(nextProjectileId + 1)
  }

  const handleProjectileHit = (projectileId: number) => {
    setProjectiles(projectiles.filter((p) => p.id !== projectileId))
  }

  const savePath = () => {
    localStorage.setItem("towerDefensePath", JSON.stringify(pathPoints))
    setEditMode(false)
    setGameStatus("playing")
  }

  const startEditMode = () => {
    setEditMode(true)
    setGameStatus("editing")
    // Clear towers when entering edit mode
    setTowers([])
  }

  const resetGame = () => {
    setTowers([])
    setProjectiles([])
    setNextProjectileId(0)
    setGameStatus("idle")
  }

  // Add a new function to handle saving the path and auto-placing a tower
  function savePathAndAutoPlaceTower() {
    if (pathPoints.length < 2) {
      toast.error("Please create a path with at least 2 points!")
      return
    }

    // Save the path
    localStorage.setItem("towerDefensePath", JSON.stringify(pathPoints))

    // Get the last point in the path
    const lastPoint = pathPoints[pathPoints.length - 1]

    // Calculate position for tower (one tile to the right of the last path point)
    const towerX = lastPoint.x + 1
    const towerY = lastPoint.y

    // Check if the position is valid (within grid and not on path)
    const isValidPosition =
      towerX < cols &&
      !pathPoints.some((p) => p.x === towerX && p.y === towerY) &&
      !towers.some((t) => t.x === towerX && t.y === towerY)

    // Exit edit mode
    setEditMode(false)
    setGameStatus("playing")

    // Place the castle at the end of the path
    const castlePoint = lastPoint
    setCastlePosition(castlePoint)

    // Place tower if position is valid
    if (isValidPosition) {
      setTowers([...towers, { x: towerX, y: towerY, config: DEFAULT_TOWER_CONFIG }])
      toast.success("Tower automatically placed next to the path end!")
    } else {
      toast.info("Could not auto-place tower - position is invalid or outside grid")
    }
  }

  return (
    <div className="relative">
      <div className="mb-4 space-x-2">
        {!editMode ? (
          <>
            <button
              onClick={startEditMode}
              className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            >
              Edit Path
            </button>
            <button onClick={resetGame} className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition">
              Reset Game
            </button>
          </>
        ) : (
          <>
            <button
              onClick={savePath}
              className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition"
            >
              Save Path
            </button>
            <button
              onClick={savePathAndAutoPlaceTower}
              className="px-3 py-1 bg-purple-600 text-white rounded hover:bg-purple-700 transition"
            >
              Save Path & Auto-Place Tower
            </button>
            <span className="text-sm text-gray-600">Click on tiles to create a path</span>
          </>
        )}
      </div>

      <div className="inline-block relative border-2 border-gray-400 bg-white">
        {Array.from({ length: rows }).map((_, y) => (
          <div key={y} className="flex">
            {Array.from({ length: cols }).map((_, x) => (
              <GridTile
                key={`${x},${y}`}
                x={x}
                y={y}
                isPath={isPath(x, y)}
                isTower={towers.some((t) => t.x === x && t.y === y)}
                editMode={editMode}
                onToggle={() => handleTileClick(x, y)}
              />
            ))}
          </div>
        ))}

        {towers.map((tower, index) => (
          <Tower
            key={`tower-${index}`}
            x={tower.x}
            y={tower.y}
            config={tower.config}
            onFire={(target) => handleTowerFire(tower, target)}
          />
        ))}

        {projectiles.map((projectile) => (
          <Projectile
            key={projectile.id}
            startX={projectile.startX}
            startY={projectile.startY}
            targetX={projectile.targetX}
            targetY={projectile.targetY}
            speed={5}
            onHit={() => handleProjectileHit(projectile.id)}
          />
        ))}
      </div>

      <div className="mt-4">
        <div className="text-sm">
          {!editMode && (
            <p>
              {towers.length === 0 ? "Click on any non-path tile to place a tower" : `Towers placed: ${towers.length}`}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
