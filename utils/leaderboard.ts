interface LeaderboardEntry {
  rank: number
  name: string
  score: number
  level: number
  date: string
}

// Save a new score to the leaderboard
export function saveScore(name: string, score: number, level: number): void {
  try {
    // Get existing leaderboard
    const savedData = localStorage.getItem("towerDefenseLeaderboard")
    let entries: LeaderboardEntry[] = savedData ? JSON.parse(savedData) : []

    // Add new entry
    const newEntry: LeaderboardEntry = {
      rank: 0, // Will be calculated below
      name,
      score,
      level,
      date: new Date().toLocaleDateString(),
    }

    // Add to entries and sort by score
    entries.push(newEntry)
    entries.sort((a, b) => b.score - a.score)

    // Limit to top 10 and update ranks
    entries = entries.slice(0, 10)
    entries.forEach((entry, index) => {
      entry.rank = index + 1
    })

    // Save back to localStorage
    localStorage.setItem("towerDefenseLeaderboard", JSON.stringify(entries))

    return entries
  } catch (error) {
    console.error("Error saving score:", error)
  }
}

// Get the current leaderboard
export function getLeaderboard(): LeaderboardEntry[] {
  try {
    const savedData = localStorage.getItem("towerDefenseLeaderboard")
    return savedData ? JSON.parse(savedData) : []
  } catch (error) {
    console.error("Error getting leaderboard:", error)
    return []
  }
}
