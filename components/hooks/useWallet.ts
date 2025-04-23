"use client"

import { useState, useEffect } from "react"

export function useWallet() {
  const [balance, setBalance] = useState<number>(0)

  useEffect(() => {
    // Fake delay & balance fetch
    setTimeout(() => {
      setBalance(5237) // stub: 5,237 $GRIND
    }, 300)
  }, [])

  return { balance, setBalance }
}
