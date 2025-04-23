export interface EnemyType {
  id: string
  name: string
  sprite: string
  health: number
  speed: number
  damage: number
  reward: number
  description: string
}

// Define enemy types with their properties
export const ENEMY_TYPES: Record<string, EnemyType> = {
  coffee_cup: {
    id: "coffee_cup",
    name: "Coffee Cup",
    sprite: "/assets/enemies/coffee-cup-baddie.png",
    health: 10,
    speed: 1,
    damage: 1,
    reward: 10,
    description: "Basic enemy that follows the path",
  },
  iced_coffee: {
    id: "iced_coffee",
    name: "Iced Coffee",
    sprite: "/assets/enemies/iced-coffee-baddie.png",
    health: 15,
    speed: 1.2,
    damage: 1,
    reward: 15,
    description: "Faster than regular coffee cup",
  },
  coffee_bag: {
    id: "coffee_bag",
    name: "Coffee Bag",
    sprite: "/assets/enemies/coffee-bag-baddie.png",
    health: 30,
    speed: 0.7,
    damage: 2,
    reward: 25,
    description: "Tankier enemy with more health",
  },
  flying_press: {
    id: "flying_press",
    name: "Flying French Press",
    sprite: "/assets/enemies/flying-french-press.png",
    health: 20,
    speed: 1.5,
    damage: 1,
    reward: 20,
    description: "Flying enemy that moves quickly",
  },
  fire_baddie: {
    id: "fire_baddie",
    name: "Fire Baddie",
    sprite: "/assets/enemies/fire-baddie.png",
    health: 25,
    speed: 1,
    damage: 2,
    reward: 25,
    description: "Resistant to fire damage",
  },
}

// Boss enemies
export const BOSS_TYPES: Record<string, EnemyType> = {
  // In the BOSS_TYPES object, reduce all health values by 75%

  // For the Level 1 boss (espresso_overlord)
  espresso_overlord: {
    id: "espresso_overlord",
    name: "Espresso Overlord",
    sprite: "/assets/bosses/espresso-overlord.png",
    health: 25, // Reduced from 100 to 25 (75% reduction)
    speed: 0.5,
    damage: 5,
    reward: 100,
    description: "Level 5 Boss - Powerful fire attacks",
  },

  // For the Level 2 boss (mocha_monarch)
  mocha_monarch: {
    id: "mocha_monarch",
    name: "Mocha Monarch",
    sprite: "/assets/bosses/mocha-monarch.png",
    health: 50, // Reduced from 200 to 50 (75% reduction)
    speed: 0.6,
    damage: 7,
    reward: 200,
    description: "Level 10 Boss - Magical attacks",
  },
  cappuccino_colossus: {
    id: "cappuccino_colossus",
    name: "Cappuccino Colossus",
    sprite: "/assets/bosses/cappuccino-colossus.png",
    health: 87, // Reduced from 350 to 87 (75% reduction)
    speed: 0.4,
    damage: 10,
    reward: 350,
    description: "Level 15 Boss - Heavy armor",
  },
  latte_leviathan: {
    id: "latte_leviathan",
    name: "Latte Leviathan",
    sprite: "/assets/bosses/latte-leviathan.png",
    health: 125, // Reduced from 500 to 125 (75% reduction)
    speed: 0.7,
    damage: 15,
    reward: 500,
    description: "Level 20 Boss - Final boss with devastating attacks",
  },
  drip_dreadnought: {
    id: "drip_dreadnought",
    name: "Drip Dreadnought",
    sprite: "/assets/bosses/drip-dreadnought.png",
    health: 162, // Reduced from 650 to 162 (75% reduction)
    speed: 0.5,
    damage: 18,
    reward: 650,
    description: "Level 25 Boss - Steam-powered robot with area attacks",
  },
  bean_behemoth: {
    id: "bean_behemoth",
    name: "Bean Behemoth",
    sprite: "/assets/bosses/bean-behemoth.png",
    health: 200, // Reduced from 800 to 200 (75% reduction)
    speed: 0.4,
    damage: 22,
    reward: 800,
    description: "Level 30 Boss - Massive brute with devastating melee attacks",
  },
  frosted_fiend: {
    id: "frosted_fiend",
    name: "Frosted Fiend",
    sprite: "/assets/bosses/frosted-fiend.png",
    health: 237, // Reduced from 950 to 237 (75% reduction)
    speed: 0.6,
    damage: 25,
    reward: 950,
    description: "Level 35 Boss - Ice-based attacks that slow towers",
  },
  plague_percolator: {
    id: "plague_percolator",
    name: "Plague Percolator",
    sprite: "/assets/bosses/plague-percolator.png",
    health: 275, // Reduced from 1100 to 275 (75% reduction)
    speed: 0.5,
    damage: 30,
    reward: 1100,
    description: "Level 40 Boss - Undead barista with poison attacks",
  },
  grindmaster: {
    id: "grindmaster",
    name: "Grindmaster",
    sprite: "/assets/bosses/grindmaster.png",
    health: 325, // Reduced from 1300 to 325 (75% reduction)
    speed: 0.6,
    damage: 35,
    reward: 1300,
    description: "Level 45 Boss - Master of coffee arts with powerful abilities",
  },
  grindfather: {
    id: "grindfather",
    name: "The Grindfather",
    sprite: "/assets/bosses/grindfather.png",
    health: 375, // Reduced from 1500 to 375 (75% reduction)
    speed: 0.5,
    damage: 40,
    reward: 1500,
    description: "Level 50 Boss - Final boss with devastating coffee-based attacks",
  },
}
