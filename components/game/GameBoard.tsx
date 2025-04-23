"use client"
import { useState, useEffect, useRef } from "react"
import GridTile, { type PathPoint } from "./GridTile"
import Enemy from "./Enemy"
import Projectile from "./Projectile"
import { Tower } from "./Tower"
import { WaveController, type SpawnedEnemy, type WaveConfig } from "./WaveController"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { toast } from "react-hot-toast"
import Castle from "./Castle"
import { CASTLE_TYPES } from "./TowerTypes"
import { saveScore } from "@/utils/leaderboard"
import WaveSystem from "./WaveSystem"
import WaveRewardDialog from "./WaveRewardDialog"
import { useWallet } from "@/components/hooks/useWallet"
import { playSound } from "@/utils/sound"

// Types
interface ProjectileType {
  id: number
  startX: number
  startY: number
  targetId: number
  color?: string
  effect?: string
}

interface GameBoardProps {
  backgroundUrl: string
  cols?: number
  rows?: number
  tileSize?: number
  onBack?: () => void
  ownedTowers?: string[]
  onWaveChange?: (wave: number) => void
}

export default function GameBoard({
  backgroundUrl,
  cols = 12,
  rows = 10,
  tileSize = 64,
  onBack,
  ownedTowers = ["basic"],
  onWaveChange,
}: GameBoardProps) {
  const [pathPoints, setPathPoints] = useState<PathPoint[]>([])
  const [towerPoints, setTowerPoints] = useState<Array<PathPoint & { type?: string }>>([])
  const [selectedTowerType, setSelectedTowerType] = useState<string>("basic")
  const [editMode, setEditMode] = useState(true) // Start in edit mode
  const [running, setRunning] = useState(false)
  const [enemies, setEnemies] = useState<SpawnedEnemy[]>([])
  const [projectiles, setProjectiles] = useState<ProjectileType[]>([])
  const [score, setScore] = useState(0)
  const [imageLoaded, setImageLoaded] = useState(false)
  const [waveNumber, setWaveNumber] = useState(1)
  const [castlePosition, setCastlePosition] = useState<PathPoint | null>(null)
  const [castleHealth, setCastleHealth] = useState(100)
  const [castleMaxHealth, setCastleMaxHealth] = useState(100)
  const [isWaveActive, setIsWaveActive] = useState(false)
  const [showRewardDialog, setShowRewardDialog] = useState(false)
  const [currentWaveConfig, setCurrentWaveConfig] = useState<WaveConfig | null>(null)
  const [enemiesRemaining, setEnemiesRemaining] = useState(0)
  const [totalEnemiesInWave, setTotalEnemiesInWave] = useState(0)
  const { balance, setBalance } = useWallet()

  // Reference to store the wave controller
  const waveControllerRef = useRef<WaveController | null>(null)

  // Initialize wave controller with empty path (will be updated later)
  useEffect(() => {
    const handleEnemySpawned = (enemy: SpawnedEnemy) => {
      setEnemies((prev) => [...prev, enemy])
    }

    const handleWaveCompleted = (config: WaveConfig) => {
      console.log("Wave completed callback triggered")

      // Calculate rewards
      const baseReward = config.baseReward
      const bossReward = config.hasBoss ? config.bossReward : 0
      const perfectDefense = waveControllerRef.current?.getEnemiesLeaked() === 0
      const perfectBonus = perfectDefense ? Math.floor(baseReward * 0.2) : 0

      // Update score and balance
      const totalReward = baseReward + bossReward + perfectBonus
      setScore((prev) => prev + totalReward)
      setBalance((prev) => prev + totalReward)

      // Store current wave config for reward dialog
      setCurrentWaveConfig(config)

      // Show reward dialog
      setShowRewardDialog(true)

      // Update wave number
      setWaveNumber((prev) => {
        const newWave = prev + 1
        if (onWaveChange) onWaveChange(newWave)
        return newWave
      })

      // End wave active state
      setIsWaveActive(false)
    }

    const handleAllEnemiesDead = () => {
      // This is called when all enemies in a wave are dead
      console.log("All enemies dead, ready for next wave")
    }

    // Create wave controller with initial path
    waveControllerRef.current = new WaveController(
      pathPoints,
      handleEnemySpawned,
      handleWaveCompleted,
      handleAllEnemiesDead,
    )

    return () => {
      // Clean up when component unmounts
      if (waveControllerRef.current) {
        waveControllerRef.current.clearSpawnQueue()
        waveControllerRef.current.reset()
      }
    }
  }, [onWaveChange])

  // Update the path in the wave controller when pathPoints changes
  useEffect(() => {
    if (waveControllerRef.current && pathPoints.length > 0) {
      console.log("Updating path in wave controller:", pathPoints.length, "points")
      waveControllerRef.current.setPath([...pathPoints])
    }
  }, [pathPoints])

  // Update enemies remaining count
  useEffect(() => {
    if (waveControllerRef.current) {
      const remaining = waveControllerRef.current.getEnemiesRemaining()
      const total = waveControllerRef.current.getTotalEnemies()
      setEnemiesRemaining(remaining)
      setTotalEnemiesInWave(total)
    }
  }, [enemies])

  // Start wave: seed enemies at first path point
  function startWave() {
    if (pathPoints.length < 2) {
      toast.error("Please create a path with at least 2 points!")
      return
    }

    // Reset enemies and projectiles for the new wave
    setEnemies([])
    setProjectiles([])

    setEditMode(false)
    setIsWaveActive(true)
    setRunning(true)

    // Make sure the wave controller has the latest path
    if (waveControllerRef.current) {
      console.log("Starting wave with path length:", pathPoints.length)

      // Ensure the wave controller has the latest path
      waveControllerRef.current.setPath([...pathPoints])

      // Small delay to ensure path is updated before starting the wave
      setTimeout(() => {
        waveControllerRef.current?.startLevel(waveNumber)
      }, 50)
    } else {
      console.error("Wave controller not initialized")
      toast.error("Error starting wave. Please refresh the page.")
    }
  }

  // Skip current wave (for testing)
  function skipWave() {
    if (waveControllerRef.current) {
      waveControllerRef.current.skipWave()
    }
  }

  const placeCastleAtPathEnd = () => {
    if (pathPoints.length > 0) {
      // Get the last point in the path
      const last = pathPoints[pathPoints.length - 1]
      const castleX = Math.min(cols - 1, last.x + 1)
      setCastlePosition({ x: castleX, y: last.y })

      // Set castle health based on the castle type
      const castleType = CASTLE_TYPES[0] // Using the first castle type for now
      setCastleHealth(castleType.health)
      setCastleMaxHealth(castleType.health)
    }
  }

  // Modify the savePath function to place the castle
  const savePath = () => {
    if (pathPoints.length < 2) {
      toast.error("Please create a path with at least 2 points!")
      return
    }

    localStorage.setItem("towerDefensePath", JSON.stringify(pathPoints))
    setEditMode(false)

    // Place the castle at the end of the path
    placeCastleAtPathEnd()
  }

  // Enemy movement system
  useEffect(() => {
    if (!running || pathPoints.length < 2) return

    const moveInterval = setInterval(() => {
      setEnemies((prevEnemies) => {
        return prevEnemies
          .map((enemy) => {
            // Get current path index
            const currentIndex = enemy.pathIndex

            // If at the end of the path, damage castle and remove enemy
            if (currentIndex >= pathPoints.length - 1) {
              // Calculate damage based on enemy type
              const damage = enemy.damage || (enemy.enemyType.includes("boss") ? 5 : 1)
              setCastleHealth((prev) => Math.max(0, prev - damage))

              // Notify wave controller that enemy reached the end
              if (waveControllerRef.current) {
                waveControllerRef.current.enemyReachedEnd(enemy.id)
              }

              return null
            }

            // Move to the next point in the path
            const nextIndex = currentIndex + 1
            const nextPoint = pathPoints[nextIndex]

            // Calculate speed factor - different enemies move at different speeds
            const speedFactor = enemy.speed || 1

            // Return updated enemy with new position and incremented path index
            return {
              ...enemy,
              x: nextPoint.x,
              y: nextPoint.y,
              pathIndex: nextIndex,
            }
          })
          .filter(Boolean) as SpawnedEnemy[]
      })
    }, 500) // Base movement speed - can be adjusted by enemy speed factor

    return () => clearInterval(moveInterval)
  }, [running, pathPoints])

  // Listen for fireProjectile events from towers
  useEffect(() => {
    const handleFireProjectile = (event: CustomEvent) => {
      const { from, to, color, effect } = event.detail
      const targetEnemy = enemies.find((e) => e.x === to.x && e.y === to.y)

      if (targetEnemy) {
        const newProjectile: ProjectileType = {
          id: Date.now() + Math.random(),
          startX: from.x,
          startY: from.y,
          targetId: targetEnemy.id,
          color,
          effect,
        }
        setProjectiles((prev) => [...prev, newProjectile])
      }
    }

    document.addEventListener("fireProjectile", handleFireProjectile as EventListener)
    return () => {
      document.removeEventListener("fireProjectile", handleFireProjectile as EventListener)
    }
  }, [enemies])

  // Damage useEffect: fire once per new projectile batch
  useEffect(() => {
    if (!projectiles.length) return

    const hitIds = projectiles.map((p) => p.targetId)

    // Process hits after animation delay
    const timer = setTimeout(() => {
      // apply damage & cull dead
      setEnemies((old) =>
        old
          .map((e) => {
            if (hitIds.includes(e.id)) {
              // Award points for hits
              setScore((s) => s + 10)
              return { ...e, health: e.health - 5 }
            }
            return e
          })
          .filter((e) => {
            if (e.health <= 0) {
              // Award points and money for kills
              setScore((s) => s + (e.reward || 20))
              setBalance((b) => b + (e.reward || 20))

              // Notify wave controller that enemy was killed
              if (waveControllerRef.current) {
                waveControllerRef.current.enemyKilled(e.id)
              }
              return false
            }
            return true
          }),
      )

      // clear those shots
      setProjectiles((old) => old.filter((p) => !hitIds.includes(p.targetId)))
    }, 300)

    return () => clearTimeout(timer)
  }, [projectiles])

  // Grid click handler
  function onTileClick(x: number, y: number) {
    if (isWaveActive && !editMode) return // Don't allow tower placement during active waves
    if (running && editMode) return // Don't allow path editing during gameplay

    // Check if this is the castle position
    if (castlePosition && x === castlePosition.x && y === castlePosition.y) {
      return // Can't modify the castle position
    }

    if (editMode) {
      // Path editing mode
      const exists = pathPoints.some((p) => p.x === x && p.y === y)
      setPathPoints(exists ? pathPoints.filter((p) => p.x !== x || p.y !== y) : [...pathPoints, { x, y }])
      // remove any tower if path toggled on it
      setTowerPoints((t) => t.filter((tt) => tt.x !== x || tt.y !== y))

      // Play sound for path editing
      playSound("BUTTON_CLICK", { volume: 0.3 })
    } else {
      // Tower placement mode
      if (pathPoints.some((p) => p.x === x && p.y === y)) return // Can't place on path
      if (!ownedTowers.includes(selectedTowerType)) {
        toast.error(`You don't own the ${selectedTowerType} tower type`)
        return
      }

      const exists = towerPoints.some((t) => t.x === x && t.y === y)
      if (!exists) {
        // Play tower placement sound
        playSound("TOWER_PLACE")
        // Add a new tower with the currently selected tower type
        setTowerPoints([...towerPoints, { x, y, type: selectedTowerType }])
      } else {
        // Remove tower if clicked on existing tower
        setTowerPoints(towerPoints.filter((t) => t.x !== x || t.y !== y))
      }
    }
  }

  // Add game over check when castle health reaches zero
  useEffect(() => {
    if (castleHealth <= 0 && running) {
      toast.error("Game Over! Your castle has been destroyed!")
      setRunning(false)

      // Save score to leaderboard
      const playerName = localStorage.getItem("playerName") || "Player"
      saveScore(playerName, score, waveNumber)

      // Show game over dialog
      toast.success(`Score saved to leaderboard: ${score} points!`, {
        duration: 5000,
      })
    }
  }, [castleHealth, running, score, waveNumber])

  const isPath = (x: number, y: number) => pathPoints.some((p) => p.x === x && p.y === y)
  const isTower = (x: number, y: number) => towerPoints.some((t) => t.x === x && t.y === y)
  const isCastle = (x: number, y: number) => castlePosition !== null && castlePosition.x === x && castlePosition.y === y

  const handleImageLoad = () => {
    setImageLoaded(true)
  }

  // Handle reward dialog close
  const handleRewardDialogClose = () => {
    setShowRewardDialog(false)

    // Ensure we're ready for the next wave
    if (waveControllerRef.current) {
      // Make sure the controller is updated with the latest path
      waveControllerRef.current.setPath([...pathPoints])
    }
  }

  // Check if current wave is a boss wave
  const isBossWave = waveNumber % 5 === 0

  return (
    <div className="flex flex-col space-y-4">
      {/* Back button */}
      {onBack && (
        <Button onClick={onBack} variant="outline" className="self-start flex items-center gap-2">
          <ArrowLeft size={16} />
          Back to Map Selection
        </Button>
      )}

      {/* Wave System UI */}
      {!editMode && (
        <WaveSystem
          currentWave={waveNumber}
          isWaveActive={isWaveActive}
          onStartWave={startWave}
          onSkipWave={skipWave}
          enemiesRemaining={enemiesRemaining}
          totalEnemies={totalEnemiesInWave}
          score={score}
          isBossWave={isBossWave}
        />
      )}

      {/* Game controls */}
      <div className="flex space-x-2">
        {running && !isWaveActive ? (
          <div className="text-green-500 font-medium">Wave completed! Prepare for the next wave.</div>
        ) : running ? (
          <div className="text-yellow-500 font-medium">Wave in progress... Defend your castle!</div>
        ) : (
          <>
            <Button
              onClick={() => setEditMode(true)}
              variant={editMode ? "default" : "outline"}
              className={editMode ? "bg-blue-600 hover:bg-blue-700" : ""}
            >
              Edit Path
            </Button>
            <Button
              onClick={() => setEditMode(false)}
              variant={!editMode ? "default" : "outline"}
              className={!editMode ? "bg-green-600 hover:bg-green-700" : ""}
            >
              Place Towers
            </Button>
            {!running && editMode && (
              <Button onClick={savePath} className="bg-green-600 hover:bg-green-700 text-white">
                Save Path ✅
              </Button>
            )}
          </>
        )}
      </div>

      {/* Tower type selector */}
      {!editMode && !isWaveActive && (
        <div className="flex flex-wrap gap-2">
          {ownedTowers.map((towerId) => (
            <Button
              key={towerId}
              onClick={() => setSelectedTowerType(towerId)}
              variant={selectedTowerType === towerId ? "default" : "outline"}
              className={selectedTowerType === towerId ? "bg-blue-600 hover:bg-blue-700" : ""}
            >
              {towerId.charAt(0).toUpperCase() + towerId.slice(1)} Tower
            </Button>
          ))}
        </div>
      )}

      {/* Game board with map background */}
      <div
        className="relative border-2 border-gray-800 overflow-hidden"
        style={{
          width: `${cols * tileSize}px`,
          height: `${rows * tileSize}px`,
          maxWidth: "100%",
        }}
      >
        {/* Background image */}
        <img
          src={backgroundUrl || "/placeholder.svg"}
          alt="Map background"
          className={`absolute inset-0 w-full h-full object-cover ${imageLoaded ? "opacity-100" : "opacity-0"}`}
          loading="lazy"
          onLoad={handleImageLoad}
        />

        {/* Loading indicator */}
        {!imageLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
          </div>
        )}

        {/* Grid overlay */}
        <div
          className="absolute inset-0 grid"
          style={{
            gridTemplateColumns: `repeat(${cols}, ${tileSize}px)`,
            gridTemplateRows: `repeat(${rows}, ${tileSize}px)`,
          }}
        >
          {Array.from({ length: cols * rows }).map((_, idx) => {
            const x = idx % cols
            const y = Math.floor(idx / cols)
            return (
              <GridTile
                key={`${x}-${y}`}
                x={x}
                y={y}
                isPath={isPath(x, y)}
                isTower={isTower(x, y)}
                isCastle={isCastle(x, y)}
                editMode={editMode}
                onToggle={() => onTileClick(x, y)}
              />
            )
          })}
        </div>

        {/* Enemies */}
        {enemies.map((e) => (
          <div
            key={e.id}
            className="absolute"
            style={{
              left: `${e.x * tileSize}px`,
              top: `${e.y * tileSize}px`,
              width: `${tileSize}px`,
              height: `${tileSize}px`,
            }}
          >
            <Enemy x={e.x} y={e.y} health={e.health} maxHealth={e.maxHealth} enemyType={e.enemyType} />
          </div>
        ))}

        {/* Projectiles */}
        {projectiles.map((p) => {
          const target = enemies.find((e) => e.id === p.targetId)
          const targetX = target ? target.x * tileSize + tileSize / 2 : 0
          const targetY = target ? target.y * tileSize + tileSize / 2 : 0
          const startX = p.startX * tileSize + tileSize / 2
          const startY = p.startY * tileSize + tileSize / 2
          return (
            <Projectile
              key={p.id}
              proj={{
                id: p.id,
                x: startX,
                y: startY,
                targetX: targetX,
                targetY: targetY,
                color: p.color,
                effect: p.effect,
              }}
              onHit={() => {}}
            />
          )
        })}

        {/* Towers with range indicators */}
        {towerPoints.map((t, i) => (
          <div
            key={i}
            className="absolute"
            style={{
              left: `${t.x * tileSize}px`,
              top: `${t.y * tileSize}px`,
              width: `${tileSize}px`,
              height: `${tileSize}px`,
            }}
          >
            {/* Range indicator */}
            {(() => {
              const R = 4 // <— radius in tiles; tweak to taste
              const D = R * 2 + 1 // diameter in tiles
              return (
                <div
                  className="absolute rounded-full pointer-events-none border-2 border-yellow-300 opacity-50"
                  style={{
                    width: `${D * tileSize}px`,
                    height: `${D * tileSize}px`,
                    left: `${-R * tileSize}px`,
                    top: `${-R * tileSize}px`,
                  }}
                />
              )
            })()}
            <Tower x={t.x} y={t.y} enemies={enemies} towerType={t.type || "basic"} />
          </div>
        ))}
        {castlePosition && (
          <div
            className="absolute"
            style={{
              left: `${castlePosition.x * tileSize}px`,
              top: `${castlePosition.y * tileSize}px`,
              width: `${tileSize}px`,
              height: `${tileSize}px`,
              zIndex: 15,
            }}
          >
            <Castle
              x={castlePosition.x}
              y={castlePosition.y}
              health={castleHealth}
              maxHealth={castleMaxHealth}
              castleType="tree_castle"
              size={tileSize}
            />
          </div>
        )}
      </div>

      {/* Game instructions */}
      <div className="text-sm text-gray-600">
        {editMode ? (
          <p>
            Click on tiles to create a path for enemies to follow. Create a continuous path from one edge to another.
          </p>
        ) : isWaveActive ? (
          <p>
            Wave {waveNumber} in progress! Towers will automatically target nearby enemies.
            {isBossWave && " A boss will appear after defeating all regular enemies!"}
          </p>
        ) : (
          <p>
            Select a tower type and click on non-path tiles to place towers. Click "Start Wave {waveNumber}" when ready.
          </p>
        )}
      </div>

      {/* Wave Reward Dialog */}
      {showRewardDialog && currentWaveConfig && (
        <WaveRewardDialog
          waveNumber={waveNumber - 1} // Show the completed wave number
          isOpen={showRewardDialog}
          onClose={handleRewardDialogClose}
          baseReward={currentWaveConfig.baseReward}
          bonusReward={currentWaveConfig.hasBoss ? currentWaveConfig.bossReward : 0}
          isBossWave={currentWaveConfig.hasBoss}
        />
      )}
    </div>
  )
}
