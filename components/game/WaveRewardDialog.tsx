"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Coins, Award, TrendingUp } from "lucide-react"
import confetti from "canvas-confetti"
import { useSoundEffects } from "@/hooks/useSoundEffects"

interface WaveRewardDialogProps {
  waveNumber: number
  isOpen: boolean
  onClose: () => void
  baseReward: number
  bonusReward?: number
  isBossWave: boolean
}

export default function WaveRewardDialog({
  waveNumber,
  isOpen,
  onClose,
  baseReward,
  bonusReward = 0,
  isBossWave,
}: WaveRewardDialogProps) {
  const [showConfetti, setShowConfetti] = useState(false)
  const totalReward = baseReward + bonusReward
  const { playSound } = useSoundEffects()

  // Trigger confetti effect when dialog opens
  useEffect(() => {
    if (isOpen && isBossWave) {
      setShowConfetti(true)

      // Play victory sound for boss wave
      playSound("VICTORY", { volume: 0.6 })

      // Fire confetti
      const duration = 3 * 1000
      const animationEnd = Date.now() + duration
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 9999 }

      const randomInRange = (min: number, max: number) => {
        return Math.random() * (max - min) + min
      }

      const interval: any = setInterval(() => {
        const timeLeft = animationEnd - Date.now()

        if (timeLeft <= 0) {
          return clearInterval(interval)
        }

        const particleCount = 50 * (timeLeft / duration)

        // Since particles fall down, start a bit higher than random
        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
        })
        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
        })
      }, 250)

      return () => {
        clearInterval(interval)
      }
    } else if (isOpen) {
      // Play regular wave complete sound
      playSound("WAVE_COMPLETE", { volume: 0.5 })
    }
  }, [isOpen, isBossWave, playSound])

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          // Ensure we call onClose to properly transition to the next wave
          onClose()
        }
      }}
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl">
            {isBossWave ? "Boss Wave Completed! 🎉" : "Wave Completed! 🎉"}
          </DialogTitle>
        </DialogHeader>

        <div className="py-6">
          <div className="text-center mb-6">
            <div className="text-4xl font-bold mb-2">Wave {waveNumber}</div>
            <p className="text-gray-500">You've successfully defended against the enemy attack!</p>
          </div>

          <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 mb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="flex items-center">
                <Coins className="mr-2 h-5 w-5 text-yellow-500" />
                Base Reward:
              </span>
              <span className="font-bold">{baseReward} $GRIND</span>
            </div>

            {bonusReward > 0 && (
              <div className="flex justify-between items-center mb-2">
                <span className="flex items-center">
                  <Award className="mr-2 h-5 w-5 text-purple-500" />
                  {isBossWave ? "Boss Bonus:" : "Perfect Defense Bonus:"}
                </span>
                <span className="font-bold text-purple-500">+{bonusReward} $GRIND</span>
              </div>
            )}

            <div className="border-t border-gray-200 dark:border-gray-700 my-2"></div>

            <div className="flex justify-between items-center text-lg">
              <span className="flex items-center font-medium">
                <TrendingUp className="mr-2 h-5 w-5 text-green-500" />
                Total:
              </span>
              <span className="font-bold text-green-500">{totalReward} $GRIND</span>
            </div>
          </div>

          {isBossWave && (
            <div className="bg-yellow-100 dark:bg-yellow-900 border-l-4 border-yellow-500 p-4 rounded">
              <div className="flex">
                <div className="flex-shrink-0">
                  <Award className="h-5 w-5 text-yellow-500" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-yellow-700 dark:text-yellow-200">
                    <span className="font-bold">Boss defeated!</span> You've unlocked new tower upgrades.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button onClick={onClose} className="w-full bg-green-600 hover:bg-green-700">
            Continue to Wave {waveNumber + 1}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
