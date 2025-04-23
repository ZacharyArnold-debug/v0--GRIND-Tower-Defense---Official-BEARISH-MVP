"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { toast } from "react-hot-toast"
import { Play, Pause, SkipForward } from "lucide-react"
import { ENEMY_TYPES, BOSS_TYPES } from "./EnemyTypes"

interface WaveSystemProps {
  currentWave: number
  isWaveActive: boolean
  onStartWave: () => void
  onSkipWave?: () => void
  enemiesRemaining: number
  totalEnemies: number
  score: number
  isBossWave: boolean
}

export default function WaveSystem({
  currentWave,
  isWaveActive,
  onStartWave,
  onSkipWave,
  enemiesRemaining,
  totalEnemies,
  score,
  isBossWave,
}: WaveSystemProps) {
  const [countdown, setCountdown] = useState<number | null>(null)
  const [wavePreview, setWavePreview] = useState<string[]>([])

  // Generate preview of enemies in the next wave
  useEffect(() => {
    if (!isWaveActive) {
      // Generate a preview of what enemies will appear in the next wave
      const preview: string[] = []

      // Add regular enemies based on wave number
      if (currentWave <= 5) {
        preview.push("coffee_cup")
      } else if (currentWave <= 10) {
        preview.push("coffee_cup", "iced_coffee")
      } else if (currentWave <= 15) {
        preview.push("coffee_cup", "iced_coffee", "coffee_bag")
      } else {
        preview.push("coffee_cup", "iced_coffee", "coffee_bag", "flying_press", "fire_baddie")
      }

      // Add boss for every 5th wave
      if (currentWave % 5 === 0) {
        // Determine which boss based on wave number
        if (currentWave === 5) preview.push("espresso_overlord")
        else if (currentWave === 10) preview.push("mocha_monarch")
        else if (currentWave === 15) preview.push("cappuccino_colossus")
        else if (currentWave === 20) preview.push("latte_leviathan")
        else if (currentWave === 25) preview.push("drip_dreadnought")
        else if (currentWave === 30) preview.push("bean_behemoth")
        else if (currentWave === 35) preview.push("frosted_fiend")
        else if (currentWave === 40) preview.push("plague_percolator")
        else if (currentWave === 45) preview.push("grindmaster")
        else if (currentWave === 50) preview.push("grindfather")
      }

      setWavePreview(preview)
    }
  }, [currentWave, isWaveActive])

  // Handle countdown before wave starts
  useEffect(() => {
    if (countdown !== null) {
      if (countdown > 0) {
        const timer = setTimeout(() => {
          setCountdown(countdown - 1)
        }, 1000)
        return () => clearTimeout(timer)
      } else {
        onStartWave()
        setCountdown(null)
      }
    }
  }, [countdown, onStartWave])

  const startCountdown = () => {
    setCountdown(3)
    toast.success("Wave starting in 3...")
  }

  // Calculate progress percentage
  const progressPercentage =
    totalEnemies > 0 ? Math.max(0, Math.min(100, ((totalEnemies - enemiesRemaining) / totalEnemies) * 100)) : 0

  return (
    <div className="bg-gray-800 rounded-lg p-4 mb-4">
      <div className="flex flex-col md:flex-row justify-between items-center mb-4">
        <div className="flex items-center mb-2 md:mb-0">
          <div className={`text-2xl font-bold ${isBossWave ? "text-red-400" : "text-white"}`}>
            {isBossWave ? "BOSS WAVE" : "Wave"} {currentWave}
          </div>
          {isBossWave && (
            <div className="ml-2 bg-red-600 text-white text-xs px-2 py-1 rounded-full animate-pulse">BOSS INCOMING</div>
          )}
        </div>

        <div className="flex space-x-2">
          {!isWaveActive ? (
            <Button onClick={startCountdown} className="bg-green-600 hover:bg-green-700" disabled={countdown !== null}>
              <Play className="mr-1 h-4 w-4" />
              {countdown !== null ? `Starting in ${countdown}...` : `Start Wave ${currentWave}`}
            </Button>
          ) : (
            <>
              <Button disabled className="bg-yellow-600">
                <Pause className="mr-1 h-4 w-4" />
                Wave in Progress
              </Button>
              {onSkipWave && (
                <Button onClick={onSkipWave} variant="outline" className="border-yellow-600 text-yellow-600">
                  <SkipForward className="mr-1 h-4 w-4" />
                  Skip
                </Button>
              )}
            </>
          )}
        </div>
      </div>

      {/* Wave progress bar */}
      <div className="mb-4">
        <div className="flex justify-between text-sm text-gray-300 mb-1">
          <span>Progress</span>
          <span>
            {totalEnemies - enemiesRemaining}/{totalEnemies} enemies defeated
          </span>
        </div>
        <Progress value={progressPercentage} className="h-2" />
      </div>

      {/* Wave preview */}
      {!isWaveActive && (
        <div className="mt-4">
          <h3 className="text-sm font-medium text-gray-300 mb-2">Upcoming enemies:</h3>
          <div className="flex flex-wrap gap-2">
            {wavePreview.map((enemyType, index) => {
              const enemy = ENEMY_TYPES[enemyType] || BOSS_TYPES[enemyType]
              return (
                <div
                  key={`${enemyType}-${index}`}
                  className={`flex items-center px-2 py-1 rounded ${
                    enemyType in BOSS_TYPES ? "bg-red-900" : "bg-gray-700"
                  }`}
                  title={enemy?.name || enemyType}
                >
                  <div className="w-6 h-6 mr-1 relative">
                    <div
                      className="w-full h-full bg-contain bg-center bg-no-repeat"
                      style={{ backgroundImage: `url(${enemy?.sprite || "/placeholder.svg"})` }}
                    />
                  </div>
                  <span className="text-xs">{enemy?.name || enemyType}</span>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
