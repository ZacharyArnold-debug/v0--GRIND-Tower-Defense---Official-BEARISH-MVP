"use client"

import { Progress } from "@/components/ui/progress"
import { Trophy, Star } from "lucide-react"

interface LevelProgressBarProps {
  currentWave: number
  maxWaves?: number
}

export default function LevelProgressBar({ currentWave, maxWaves = 50 }: LevelProgressBarProps) {
  // Calculate progress percentage
  const progressPercentage = Math.min(100, (currentWave / maxWaves) * 100)

  // Determine milestone markers
  const milestones = [
    { wave: 5, label: "Boss 1", icon: <Trophy className="h-4 w-4 text-yellow-500" /> },
    { wave: 10, label: "Boss 2", icon: <Trophy className="h-4 w-4 text-yellow-500" /> },
    { wave: 15, label: "Boss 3", icon: <Trophy className="h-4 w-4 text-yellow-500" /> },
    { wave: 20, label: "Boss 4", icon: <Trophy className="h-4 w-4 text-yellow-500" /> },
    { wave: 25, label: "Boss 5", icon: <Trophy className="h-4 w-4 text-yellow-500" /> },
    { wave: 30, label: "Boss 6", icon: <Trophy className="h-4 w-4 text-yellow-500" /> },
    { wave: 35, label: "Boss 7", icon: <Trophy className="h-4 w-4 text-yellow-500" /> },
    { wave: 40, label: "Boss 8", icon: <Trophy className="h-4 w-4 text-yellow-500" /> },
    { wave: 45, label: "Boss 9", icon: <Trophy className="h-4 w-4 text-yellow-500" /> },
    { wave: 50, label: "Final Boss", icon: <Star className="h-4 w-4 text-yellow-500" /> },
  ]

  return (
    <div className="w-full bg-gray-800 p-4 rounded-lg">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-white font-medium">Game Progress</h3>
        <div className="text-gray-300 text-sm">
          Wave <span className="font-bold text-white">{currentWave}</span> of {maxWaves}
        </div>
      </div>

      <div className="relative pt-6 pb-8">
        <Progress value={progressPercentage} className="h-3" />

        {/* Milestone markers */}
        {milestones.map((milestone) => (
          <div
            key={milestone.wave}
            className={`absolute bottom-0 transform -translate-x-1/2 ${
              currentWave >= milestone.wave ? "text-yellow-500" : "text-gray-500"
            }`}
            style={{ left: `${(milestone.wave / maxWaves) * 100}%` }}
          >
            <div className="flex flex-col items-center">
              <div className="mb-1">{milestone.icon}</div>
              <div className={`text-xs ${currentWave >= milestone.wave ? "text-yellow-500" : "text-gray-500"}`}>
                {milestone.label}
              </div>
            </div>
          </div>
        ))}

        {/* Current position marker */}
        <div
          className="absolute bottom-full transform -translate-x-1/2 mb-1"
          style={{ left: `${progressPercentage}%` }}
        >
          <div className="w-4 h-4 bg-green-500 rounded-full animate-pulse" />
        </div>
      </div>
    </div>
  )
}
