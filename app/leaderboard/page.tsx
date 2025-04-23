import Header from "@/components/layout/Header"
import Footer from "@/components/layout/Footer"
import Leaderboard from "@/components/game/Leaderboard"

export const metadata = {
  title: "Leaderboard - $GRIND Tower Defense",
  description: "View the top players in $GRIND Tower Defense",
}

export default function LeaderboardPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow bg-gray-100 dark:bg-gray-900 py-8 px-4">
        <div className="container mx-auto">
          <h1 className="text-3xl font-bold mb-6 text-center">$GRIND Tower Defense Leaderboard</h1>
          <Leaderboard />
        </div>
      </main>
      <Footer />
    </div>
  )
}
