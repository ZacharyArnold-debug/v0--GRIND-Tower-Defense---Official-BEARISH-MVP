export interface PathPoint {
  x: number
  y: number
}
export interface EnemyType {
  id: number
  x: number
  y: number
  health: number
}
export interface TowerType {
  x: number
  y: number
}
export interface ProjectileType {
  id: number
  x: number
  y: number
  targetX: number
  targetY: number
}
