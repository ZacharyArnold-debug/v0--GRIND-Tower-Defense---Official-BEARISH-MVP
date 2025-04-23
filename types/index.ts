export interface PathPoint {
  x: number
  y: number
}

export interface Enemy {
  id: number
  x: number
  y: number
  health: number
}

export interface Tower {
  x: number
  y: number
}

export interface Projectile {
  id: number
  x: number
  y: number
  targetX: number
  targetY: number
}
