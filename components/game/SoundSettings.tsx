"use client"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Volume2, VolumeX } from "lucide-react"
import { useSoundEffects } from "@/hooks/useSoundEffects"

export default function SoundSettings() {
  const { isMuted, setMuted, volume, setVolume, playSound } = useSoundEffects()

  const handleVolumeChange = (value: number[]) => {
    setVolume(value[0])
    playSound("BUTTON_CLICK", { volume: 0.3 })
  }

  const toggleMute = () => {
    if (!isMuted) {
      playSound("BUTTON_CLICK", { volume: 0.3 })
    }
    setMuted(!isMuted)
  }

  return (
    <div className="flex items-center space-x-4 bg-gray-800 p-2 rounded-lg">
      <Button variant="ghost" size="icon" onClick={toggleMute} className="text-white hover:bg-gray-700">
        {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
      </Button>

      <div className="w-24">
        <Slider
          value={[isMuted ? 0 : volume]}
          min={0}
          max={1}
          step={0.01}
          onValueChange={handleVolumeChange}
          disabled={isMuted}
          className={isMuted ? "opacity-50" : ""}
        />
      </div>
    </div>
  )
}
