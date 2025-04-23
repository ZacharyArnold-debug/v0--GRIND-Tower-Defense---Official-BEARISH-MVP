"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu, X } from "lucide-react"

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen)
  }

  return (
    <header className="bg-gray-900 text-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="text-xl font-bold text-green-400">
            $GRIND Tower Defense
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link href="/" className="hover:text-green-400 transition-colors">
              Home
            </Link>
            <Link href="/game" className="hover:text-green-400 transition-colors">
              Game
            </Link>
            <Link href="/leaderboard" className="hover:text-green-400 transition-colors">
              Leaderboard
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <button className="md:hidden" onClick={toggleMobileMenu}>
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className="md:hidden py-4 space-y-4">
            <Link href="/" className="block hover:text-green-400 transition-colors" onClick={toggleMobileMenu}>
              Home
            </Link>
            <Link href="/game" className="block hover:text-green-400 transition-colors" onClick={toggleMobileMenu}>
              Game
            </Link>
            <Link
              href="/leaderboard"
              className="block hover:text-green-400 transition-colors"
              onClick={toggleMobileMenu}
            >
              Leaderboard
            </Link>
          </nav>
        )}
      </div>
    </header>
  )
}
