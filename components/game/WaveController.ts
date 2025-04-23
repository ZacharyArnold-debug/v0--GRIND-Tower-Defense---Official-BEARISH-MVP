import { ENEMY_TYPES, BOSS_TYPES } from "./EnemyTypes"
import type { PathPoint } from "./GridTile"

export interface SpawnedEnemy {
  id: number
  x: number
  y: number
  health: number
  maxHealth: number
  enemyType: string
  pathIndex: number
  speed: number
  damage: number
  reward: number
}

export interface WaveConfig {
  level: number
  regularEnemyCount: number
  hasBoss: boolean
  bossType?: string
  enemyTypes: string[]
  baseReward: number
  bossReward: number
  totalEnemies: number
}

export class WaveController {
  private nextEnemyId = 0
  private activeEnemies: SpawnedEnemy[] = []
  private spawnQueue: { enemyType: string; delay: number }[] = []
  private spawnTimer: NodeJS.Timeout | null = null
  private path: PathPoint[] = []
  private currentLevel = 1
  private currentWaveConfig: WaveConfig | null = null
  private onEnemySpawned: (enemy: SpawnedEnemy) => void
  private onWaveCompleted: (config: WaveConfig) => void
  private onAllEnemiesDead: () => void
  private totalEnemiesInWave = 0
  private enemiesDefeated = 0
  private enemiesLeaked = 0
  private bossSpawned = false
  private isWaveActive = false

  constructor(
    path: PathPoint[],
    onEnemySpawned: (enemy: SpawnedEnemy) => void,
    onWaveCompleted: (config: WaveConfig) => void,
    onAllEnemiesDead: () => void,
  ) {
    // Make a deep copy of the path to avoid reference issues
    this.path = path && path.length > 0 ? JSON.parse(JSON.stringify(path)) : []
    this.onEnemySpawned = onEnemySpawned
    this.onWaveCompleted = onWaveCompleted
    this.onAllEnemiesDead = onAllEnemiesDead
  }

  public startLevel(level: number): void {
    // Validate path before starting
    if (!this.path || this.path.length < 2) {
      console.error("Cannot start level: path is invalid or too short", this.path)
      return
    }

    console.log(`Starting level ${level} with path length: ${this.path.length}`)

    // Set wave as active
    this.isWaveActive = true

    // Reset state for new wave
    this.currentLevel = level
    this.clearSpawnQueue()
    this.activeEnemies = [] // Reset active enemies
    this.enemiesDefeated = 0
    this.enemiesLeaked = 0
    this.bossSpawned = false

    // Generate wave configuration
    this.currentWaveConfig = this.generateWaveConfig(level)
    this.totalEnemiesInWave = this.currentWaveConfig.totalEnemies
    console.log(`Wave ${level} config:`, this.currentWaveConfig)

    // Add regular enemies to spawn queue
    for (let i = 0; i < this.currentWaveConfig.regularEnemyCount; i++) {
      // Randomly select an enemy type from the available types for this level
      const enemyType =
        this.currentWaveConfig.enemyTypes[Math.floor(Math.random() * this.currentWaveConfig.enemyTypes.length)]

      // Add some variation to spawn timing
      const delay = 1000 + Math.random() * 500

      this.spawnQueue.push({
        enemyType,
        delay,
      })
    }

    // Start spawning with a small delay to ensure everything is ready
    setTimeout(() => {
      this.processSpawnQueue()
    }, 100)
  }

  public enemyReachedEnd(enemyId: number): void {
    this.enemiesLeaked++
    this.removeEnemy(enemyId)
    this.checkWaveStatus()
  }

  public enemyKilled(enemyId: number): void {
    this.enemiesDefeated++
    this.removeEnemy(enemyId)
    this.checkWaveStatus()
  }

  private removeEnemy(enemyId: number): void {
    this.activeEnemies = this.activeEnemies.filter((e) => e.id !== enemyId)
  }

  private checkWaveStatus(): void {
    // If wave is not active, don't proceed
    if (!this.isWaveActive) return

    // If no more enemies active and spawn queue is empty, wave is complete
    if (this.activeEnemies.length === 0 && this.spawnQueue.length === 0) {
      const waveConfig = this.currentWaveConfig!

      // If this level has a boss and we haven't spawned it yet, spawn it now
      if (waveConfig.hasBoss && waveConfig.bossType && !this.bossSpawned) {
        console.log(`Spawning boss for level ${this.currentLevel}: ${waveConfig.bossType}`)
        this.spawnBoss(waveConfig.bossType)
        this.bossSpawned = true
        return
      }

      // Otherwise, wave is complete
      console.log(`Wave ${this.currentLevel} completed!`)

      // Mark wave as inactive before calling callbacks
      this.isWaveActive = false

      // Call wave completed callback
      this.onWaveCompleted(waveConfig)

      // Small delay before notifying that all enemies are dead
      setTimeout(() => {
        this.onAllEnemiesDead()
      }, 1000)
    }
  }

  private spawnBoss(bossType: string): void {
    if (this.path.length === 0) {
      console.error("Cannot spawn boss: path is empty")
      return
    }

    const startPoint = this.path[0]
    const bossData = BOSS_TYPES[bossType]

    if (!bossData) {
      console.error(`Boss type not found: ${bossType}`)
      return
    }

    const boss: SpawnedEnemy = {
      id: this.nextEnemyId++,
      x: startPoint.x,
      y: startPoint.y,
      health: bossData.health,
      maxHealth: bossData.health,
      enemyType: bossType,
      pathIndex: 0,
      speed: bossData.speed,
      damage: bossData.damage,
      reward: bossData.reward,
    }

    this.activeEnemies.push(boss)
    this.onEnemySpawned(boss)
  }

  private processSpawnQueue(): void {
    // If wave is not active, don't proceed
    if (!this.isWaveActive) return

    if (this.spawnQueue.length === 0) {
      this.checkWaveStatus()
      return
    }

    const nextSpawn = this.spawnQueue.shift()
    if (!nextSpawn) return

    try {
      // Spawn the enemy
      this.spawnEnemy(nextSpawn.enemyType)

      // Schedule next spawn
      this.spawnTimer = setTimeout(() => {
        this.processSpawnQueue()
      }, nextSpawn.delay)
    } catch (error) {
      console.error("Error processing spawn queue:", error)
      // Continue with next enemy to avoid getting stuck
      this.processSpawnQueue()
    }
  }

  private spawnEnemy(enemyType: string): void {
    try {
      if (!this.path || this.path.length === 0) {
        console.error("Cannot spawn enemy: path is empty")
        return
      }

      const startPoint = this.path[0]
      if (!startPoint) {
        console.error("Invalid start point in path")
        return
      }

      const enemyData = ENEMY_TYPES[enemyType]

      if (!enemyData) {
        console.error(`Enemy type not found: ${enemyType}`)
        return
      }

      const enemy: SpawnedEnemy = {
        id: this.nextEnemyId++,
        x: startPoint.x,
        y: startPoint.y,
        health: enemyData.health,
        maxHealth: enemyData.health,
        enemyType: enemyType,
        pathIndex: 0,
        speed: enemyData.speed,
        damage: enemyData.damage,
        reward: enemyData.reward,
      }

      this.activeEnemies.push(enemy)
      this.onEnemySpawned(enemy)
    } catch (error) {
      console.error("Error spawning enemy:", error)
    }
  }

  private generateWaveConfig(level: number): WaveConfig {
    // Determine which enemy types are available for this level
    const availableEnemyTypes: string[] = ["coffee_cup"]

    if (level >= 3) availableEnemyTypes.push("iced_coffee")
    if (level >= 5) availableEnemyTypes.push("coffee_bag")
    if (level >= 7) availableEnemyTypes.push("flying_press")
    if (level >= 10) availableEnemyTypes.push("fire_baddie")

    // Determine boss type based on level
    let bossType: string | undefined
    const hasBoss = level % 5 === 0

    if (hasBoss) {
      if (level <= 10) bossType = "espresso_overlord"
      else if (level <= 20) bossType = "mocha_monarch"
      else if (level <= 30) bossType = "cappuccino_colossus"
      else if (level <= 40) bossType = "latte_leviathan"
      else if (level <= 50) bossType = "drip_dreadnought"
      else bossType = "grindfather"
    }

    // Calculate number of enemies based on level
    const regularEnemyCount = Math.min(20, 4 + Math.floor(level / 2))

    // Calculate rewards
    const baseReward = level * 50
    const bossReward = hasBoss ? level * 100 : 0

    // Calculate total enemies (including boss)
    const totalEnemies = regularEnemyCount + (hasBoss ? 1 : 0)

    return {
      level,
      regularEnemyCount,
      hasBoss,
      bossType,
      enemyTypes: availableEnemyTypes,
      baseReward,
      bossReward,
      totalEnemies,
    }
  }

  public clearSpawnQueue(): void {
    this.spawnQueue = []
    if (this.spawnTimer) {
      clearTimeout(this.spawnTimer)
      this.spawnTimer = null
    }
  }

  public reset(): void {
    this.isWaveActive = false
    this.clearSpawnQueue()
    this.activeEnemies = []
    this.nextEnemyId = 0
    this.enemiesDefeated = 0
    this.enemiesLeaked = 0
    this.bossSpawned = false
    this.totalEnemiesInWave = 0
    this.currentWaveConfig = null
  }

  public setPath(path: PathPoint[]): void {
    if (!path || path.length === 0) {
      console.warn("Attempted to set empty path")
      return
    }

    try {
      // Make a deep copy to ensure we don't have reference issues
      this.path = JSON.parse(JSON.stringify(path))
      console.log("Path updated:", this.path.length, "points")
    } catch (error) {
      console.error("Error updating path:", error)
    }
  }

  public getActiveEnemies(): SpawnedEnemy[] {
    return [...this.activeEnemies]
  }

  public getEnemiesDefeated(): number {
    return this.enemiesDefeated
  }

  public getEnemiesLeaked(): number {
    return this.enemiesLeaked
  }

  public getTotalEnemies(): number {
    return this.totalEnemiesInWave
  }

  public getEnemiesRemaining(): number {
    return this.totalEnemiesInWave - this.enemiesDefeated - this.enemiesLeaked
  }

  public getCurrentWaveConfig(): WaveConfig | null {
    return this.currentWaveConfig
  }

  public skipWave(): void {
    // If wave is not active, don't proceed
    if (!this.isWaveActive) return

    // Clear any remaining enemies and spawn queue
    this.activeEnemies = []
    this.clearSpawnQueue()

    // If boss hasn't spawned yet and this is a boss wave, spawn it
    if (this.currentWaveConfig?.hasBoss && !this.bossSpawned) {
      if (this.currentWaveConfig.bossType) {
        this.spawnBoss(this.currentWaveConfig.bossType)
        this.bossSpawned = true
      }
    } else {
      // Otherwise, complete the wave
      if (this.currentWaveConfig) {
        // Mark wave as inactive before calling callbacks
        this.isWaveActive = false

        this.onWaveCompleted(this.currentWaveConfig)
        setTimeout(() => {
          this.onAllEnemiesDead()
        }, 1000)
      }
    }
  }

  // Check if a wave is currently active
  public isWaveInProgress(): boolean {
    return this.isWaveActive
  }
}
