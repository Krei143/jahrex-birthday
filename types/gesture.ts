export interface GestureData {
  fingers: number
  scale: number
  isOpen: boolean
  handPosition?: { x: number; y: number; z: number }
}

export interface ParticlePattern {
  name: string
  fingers: number
  description: string
}
