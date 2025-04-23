// Simple sound utility for server-side compatibility
export const playSound = (sound: string) => {
  // Only log in browser environment
  if (typeof window !== "undefined") {
    console.log(`Playing sound: ${sound}`)
  }
}
