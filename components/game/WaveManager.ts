import { ENEMY_TYPES, BOSS_TYPES, type EnemyType } from "./EnemyTypes"

export interface Wave {
  id: number
  enemies: {
    type: string
    count: number
    delay: number // Delay between spawns in ms
  }[]
  bossType?: string
  reward: number
}

// Generate waves with increasing difficulty
export function generateWaves(count = 50): Wave[] {
  const waves: Wave[] = []

  for (let i = 1; i <= count; i++) {
    const wave: Wave = {
      id: i,
      enemies: [],
      reward: i * 50,
    }

    // Add regular enemies
    if (i <= 5) {
      // Early waves - mostly coffee cups
      wave.enemies.push({
        type: "coffee_cup",
        count: i + 2,
        delay: 1000,
      })
    } else if (i <= 10) {
      // Mid waves - mix of coffee cups and iced coffee
      wave.enemies.push({
        type: "coffee_cup",
        count: Math.floor(i * 0.7),
        delay: 1000,
      })
      wave.enemies.push({
        type: "iced_coffee",
        count: Math.floor(i * 0.5),
        delay: 1200,
      })
    } else if (i <= 15) {
      // Later waves - mix of all enemy types
      wave.enemies.push({
        type: "coffee_cup",
        count: Math.floor(i * 0.5),
        delay: 900,
      })
      wave.enemies.push({
        type: "iced_coffee",
        count: Math.floor(i * 0.6),
        delay: 1000,
      })
      wave.enemies.push({
        type: "coffee_bag",
        count: Math.floor(i * 0.3),
        delay: 1500,
      })
      wave.enemies.push({
        type: "flying_press",
        count: Math.floor(i * 0.2),
        delay: 800,
      })
    } else if (i <= 25) {
      // Mid-game waves
      wave.enemies.push({
        type: "coffee_cup",
        count: Math.floor(i * 0.4),
        delay: 800,
      })
      wave.enemies.push({
        type: "iced_coffee",
        count: Math.floor(i * 0.5),
        delay: 900,
      })
      wave.enemies.push({
        type: "coffee_bag",
        count: Math.floor(i * 0.4),
        delay: 1300,
      })
      wave.enemies.push({
        type: "flying_press",
        count: Math.floor(i * 0.4),
        delay: 700,
      })
      wave.enemies.push({
        type: "fire_baddie",
        count: Math.floor(i * 0.2),
        delay: 1500,
      })
    } else {
      // Late-game waves - all enemy types with increased numbers
      wave.enemies.push({
        type: "coffee_cup",
        count: Math.floor(i * 0.3),
        delay: 700,
      })
      wave.enemies.push({
        type: "iced_coffee",
        count: Math.floor(i * 0.4),
        delay: 800,
      })
      wave.enemies.push({
        type: "coffee_bag",
        count: Math.floor(i * 0.5),
        delay: 1100,
      })
      wave.enemies.push({
        type: "flying_press",
        count: Math.floor(i * 0.5),
        delay: 600,
      })
      wave.enemies.push({
        type: "fire_baddie",
        count: Math.floor(i * 0.4),
        delay: 1200,
      })
    }

    // Add boss every 5 waves
    if (i % 5 === 0) {
      switch (i) {
        case 5:
          wave.bossType = "espresso_overlord"
          break
        case 10:
          wave.bossType = "mocha_monarch"
          break
        case 15:
          wave.bossType = "cappuccino_colossus"
          break
        case 20:
          wave.bossType = "latte_leviathan"
          break
        case 25:
          wave.bossType = "drip_dreadnought"
          break
        case 30:
          wave.bossType = "bean_behemoth"
          break
        case 35:
          wave.bossType = "frosted_fiend"
          break
        case 40:
          wave.bossType = "plague_percolator"
          break
        case 45:
          wave.bossType = "grindmaster"
          break
        case 50:
          wave.bossType = "grindfather"
          break
      }
    }

    waves.push(wave)
  }

  return waves
}

// Get enemy data by type
export function getEnemyData(type: string): EnemyType {
  return ENEMY_TYPES[type] || BOSS_TYPES[type] || ENEMY_TYPES.coffee_cup
}
