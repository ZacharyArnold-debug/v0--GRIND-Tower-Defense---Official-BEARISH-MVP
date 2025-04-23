"use client"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default function PlayerNameDialog() {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState("")

  useEffect(() => {
    // Check if player name is already set
    const playerName = localStorage.getItem("playerName")
    if (!playerName) {
      setOpen(true)
    }
  }, [])

  const handleSave = () => {
    if (name.trim()) {
      localStorage.setItem("playerName", name.trim())
      setOpen(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Welcome to Tower Defense!</DialogTitle>
          <DialogDescription>Enter your name to appear on the leaderboard when you play.</DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <Input
            placeholder="Your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full"
            maxLength={15}
          />
        </div>
        <DialogFooter>
          <Button onClick={handleSave} disabled={!name.trim()}>
            Save & Play
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
