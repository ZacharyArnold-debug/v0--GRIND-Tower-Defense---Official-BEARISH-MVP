import Link from "next/link"
import Header from "@/components/layout/Header"
import Footer from "@/components/layout/Footer"

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main
        className="flex-grow flex items-center justify-center text-white bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Good%20Graphics%20Background%2005%20%28bestest%29-H8GE5Ig7jXZDDrNz753MAxJtFJ0lHe.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="container mx-auto px-4 py-16 text-center">
          <div className="bg-black bg-opacity-50 p-8 rounded-lg backdrop-blur-sm">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-blue-500">
              $GRIND Tower Defense
            </h1>

            <p className="text-xl md:text-2xl mb-10 max-w-2xl mx-auto text-gray-100">
              Draw your path. Build your defense. Survive the grind.
            </p>

            <div className="space-y-6">
              <Link
                href="/game"
                className="inline-block px-8 py-4 bg-green-600 text-white text-lg font-medium rounded-lg shadow-lg hover:bg-green-500 transform hover:scale-105 transition-all duration-200"
              >
                Play Now
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
