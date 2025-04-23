export interface TowerType {
  id: string
  name: string
  description: string
  sprite: string
  cost: number
  damage: number
  range: number // in tiles
  fireRate: number // ms between shots
  icon: string // UI glyph
  special?: string // optional ability text
  projectileColor?: string // hex string
  projectileEffect?: string
}

/* ------------------------------------------------------------------ */
/*  !!!  ALL tower sprites must be named <id>-tower.png               */
/*       and already live in /public/assets/towers/                   */
/* ------------------------------------------------------------------ */

export const TOWER_TYPES: TowerType[] = [
  /* ————————————————————— EXISTING "starter" towers ——————————————————— */
  {
    id: "basic",
    name: "Basic Tower",
    description: "Standard defense tower with balanced stats",
    sprite: "/assets/towers/basic-tower.png",
    cost: 100,
    damage: 10,
    range: 3,
    fireRate: 1000,
    icon: "🗼",
    projectileColor: "#FFD700",
  },
  {
    id: "sniper",
    name: "Sniper Tower",
    description: "High-damage, long-range but slow",
    sprite: "/assets/towers/sniper-tower.png",
    cost: 250,
    damage: 25,
    range: 5,
    fireRate: 2000,
    icon: "🎯",
    projectileColor: "#FF4500",
  },
  {
    id: "rapid",
    name: "Rapid Tower",
    description: "Low damage but fires very fast",
    sprite: "/assets/towers/rapid-tower.png",
    cost: 200,
    damage: 5,
    range: 2,
    fireRate: 500,
    icon: "⚡",
    projectileColor: "#00BFFF",
  },

  /* ——————————————————————— NEW SPECIAL TOWERS ———————————————————— */
  {
    id: "pons",
    name: "Pons",
    description: "Co-founder of $GRIND — caffeinated splash damage!",
    sprite: "/assets/towers/pons-tower/frame1.png",
    cost: 500,
    damage: 40,
    range: 4,
    fireRate: 1800,
    icon: "👑",
    special: "Splash + slow",
    projectileColor: "#8B5CF6", // purple
    projectileEffect: "slow",
  },
  {
    id: "grind_hamster",
    name: "$GRIND Hamster",
    description: "Spins the wheel, unleashing rapid-fire beans.",
    sprite: "/assets/towers/grind_hamster-tower/frame1.png",
    cost: 400,
    damage: 8,
    range: 3,
    fireRate: 300, // super-fast
    icon: "🐹",
    special: "Mini-crit bursts",
    projectileColor: "#34D399", // teal
  },
  {
    id: "bearish_bear",
    name: "Chill Bearish Bear",
    description: "Radiates a bearish aura that slows enemies.",
    sprite: "/assets/towers/bearish_bear-tower/frame1.png",
    cost: 450,
    damage: 15,
    range: 3,
    fireRate: 1200,
    icon: "🐻",
    special: "Aura slow + DoT",
    projectileColor: "#60A5FA", // blue
    projectileEffect: "burn",
  },
  {
    id: "fire",
    name: "Fire Tower",
    description: "Burns enemies with continuous damage over time",
    sprite: "/assets/towers/fire-tower.png",
    cost: 350,
    damage: 12,
    range: 3,
    fireRate: 1500,
    icon: "🔥",
    special: "Burn damage over time",
    projectileColor: "#FF4500", // orange-red
    projectileEffect: "fire",
  },
  {
    id: "lightning",
    name: "Lightning Tower",
    description: "Strikes enemies with chain lightning",
    sprite: "/assets/towers/lightning-tower.png",
    cost: 400,
    damage: 18,
    range: 4,
    fireRate: 1800,
    icon: "⚡",
    special: "Chain lightning effect",
    projectileColor: "#00FFFF", // cyan
    projectileEffect: "lightning",
  },
  {
    id: "winter",
    name: "Winter Tower",
    description: "Slows enemies with freezing attacks",
    sprite: "/assets/towers/winter-tower.png",
    cost: 375,
    damage: 10,
    range: 3,
    fireRate: 1200,
    icon: "❄️",
    special: "Slows enemy movement",
    projectileColor: "#ADD8E6", // light blue
    projectileEffect: "ice",
  },
]

// Castle types for the player's base
export const CASTLE_TYPES = [
  {
    id: "tree_castle",
    name: "Tree Castle",
    sprite: "/assets/castles/tree-castle.png",
    health: 100,
    description: "A magical castle with trees growing on its walls",
  },
]
