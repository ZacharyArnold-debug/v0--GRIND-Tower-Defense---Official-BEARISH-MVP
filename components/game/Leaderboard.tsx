"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

interface LeaderboardEntry {
  rank: number
  name: string
  score: number
  level: number
  date: string
}

// Generate some initial fake entries for the leaderboard
const generateFakeEntries = (): LeaderboardEntry[] => {
  const names = [
    "GrindMaster",
    "CoffeeLord",
    "TowerPro",
    "DefenseKing",
    "WaveCrusher",
    "BeanDefender",
    "EspressoElite",
    "LatteWarrior",
    "MochaMaster",
    "BrewDefender",
  ]
  const today = new Date()

  return names.map((name, i) => ({
    rank: i + 1,
    name,
    score: Math.floor(Math.random() * 5000) + 2000,
    level: Math.floor(Math.random() * 20) + 1,
    date: new Date(today.getTime() - Math.floor(Math.random() * 7) * 86400000).toLocaleDateString(),
  }))
}

export default function Leaderboard() {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Load leaderboard data
  useEffect(() => {
    // In a real implementation, this would fetch from an API
    // For now, we'll use localStorage or generate fake data
    const loadLeaderboard = () => {
      try {
        const savedData = localStorage.getItem("towerDefenseLeaderboard")
        if (savedData) {
          const parsedData = JSON.parse(savedData)
          setEntries(parsedData)
        } else {
          // No saved data, generate fake entries
          setEntries(generateFakeEntries())
        }
      } catch (error) {
        console.error("Error loading leaderboard:", error)
        setEntries(generateFakeEntries())
      } finally {
        setIsLoading(false)
      }
    }

    loadLeaderboard()
  }, [])

  // Refresh the leaderboard with new fake data
  const handleRefresh = () => {
    setIsLoading(true)
    setTimeout(() => {
      const newEntries = generateFakeEntries()
      setEntries(newEntries)
      localStorage.setItem("towerDefenseLeaderboard", JSON.stringify(newEntries))
      setIsLoading(false)
    }, 500)
  }

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Weekly Leaderboard</CardTitle>
        <CardDescription>Apr 18 – Apr 24</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="py-3 px-4 font-medium">#</th>
                    <th className="py-3 px-4 font-medium">Player</th>
                    <th className="py-3 px-4 font-medium text-right">Score</th>
                    <th className="py-3 px-4 font-medium text-right">Level</th>
                    <th className="py-3 px-4 font-medium text-right">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {entries.map((entry) => (
                    <tr
                      key={entry.rank}
                      className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800"
                    >
                      <td className="py-3 px-4 font-medium">
                        {entry.rank <= 3 ? (
                          <span
                            className={`inline-flex items-center justify-center w-6 h-6 rounded-full 
                            ${
                              entry.rank === 1 ? "bg-yellow-400" : entry.rank === 2 ? "bg-gray-300" : "bg-amber-600"
                            } text-white`}
                          >
                            {entry.rank}
                          </span>
                        ) : (
                          entry.rank
                        )}
                      </td>
                      <td className="py-3 px-4">{entry.name}</td>
                      <td className="py-3 px-4 text-right font-mono">{entry.score.toLocaleString()}</td>
                      <td className="py-3 px-4 text-right">{entry.level}</td>
                      <td className="py-3 px-4 text-right text-gray-500">{entry.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-6 flex justify-between items-center">
              <p className="text-sm text-gray-500">Last updated: {new Date().toLocaleString()}</p>
              <Button onClick={handleRefresh} className="bg-green-600 hover:bg-green-700">
                Refresh
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}
