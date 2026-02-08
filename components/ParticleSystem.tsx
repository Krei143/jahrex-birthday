'use client'

import { useRef, useMemo, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { GestureData } from '@/types/gesture'

interface ParticleSystemProps {
  gesture: GestureData
  color: string
}

export default function ParticleSystem({ gesture, color }: ParticleSystemProps) {
  const particlesRef = useRef<THREE.Points>(null)
  const targetPositionsRef = useRef<Float32Array | null>(null)
  const velocitiesRef = useRef<Float32Array | null>(null)

  // Generate particles based on pattern
  const { positions, particleCount } = useMemo(() => {
    let positions: Float32Array
    let count = 0

    switch (gesture.fingers) {
      case 1: {
        // "Happy Birthday Babi" text pattern
        positions = generateTextParticles('Happy Birthday Babi')
        count = positions.length / 3
        break
      }
      case 2: {
        // Sphere
        count = 5000
        positions = new Float32Array(count * 3)
        for (let i = 0; i < count; i++) {
          const theta = Math.random() * Math.PI * 2
          const phi = Math.acos(2 * Math.random() - 1)
          const radius = 3 + Math.random() * 0.5
          positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta)
          positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta)
          positions[i * 3 + 2] = radius * Math.cos(phi)
        }
        break
      }
      case 3: {
        // Heart shape
        count = 8000
        positions = new Float32Array(count * 3)
        for (let i = 0; i < count; i++) {
          const t = (i / count) * Math.PI * 2
          const u = Math.random() * Math.PI * 2
          const r = Math.random() * 2
          const x = r * (16 * Math.sin(t) ** 3)
          const y = r * (13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t))
          const z = r * Math.sin(u) * 2
          positions[i * 3] = x * 0.15
          positions[i * 3 + 1] = y * 0.15
          positions[i * 3 + 2] = z * 0.3
        }
        break
      }
      case 4: {
        // Spiral
        count = 6000
        positions = new Float32Array(count * 3)
        for (let i = 0; i < count; i++) {
          const t = (i / count) * Math.PI * 10
          const radius = t * 0.3
          positions[i * 3] = radius * Math.cos(t)
          positions[i * 3 + 1] = t * 0.5 - 5
          positions[i * 3 + 2] = radius * Math.sin(t)
        }
        break
      }
      case 5: {
        // Galaxy explosion
        count = 10000
        positions = new Float32Array(count * 3)
        for (let i = 0; i < count; i++) {
          const radius = Math.random() * 8
          const theta = Math.random() * Math.PI * 2
          const phi = Math.random() * Math.PI
          const spiral = theta + radius * 0.5
          positions[i * 3] = radius * Math.cos(spiral) * Math.sin(phi)
          positions[i * 3 + 1] = (Math.random() - 0.5) * 3
          positions[i * 3 + 2] = radius * Math.sin(spiral) * Math.sin(phi)
        }
        break
      }
      default: {
        // Random particles
        count = 3000
        positions = new Float32Array(count * 3)
        for (let i = 0; i < count; i++) {
          positions[i * 3] = (Math.random() - 0.5) * 10
          positions[i * 3 + 1] = (Math.random() - 0.5) * 10
          positions[i * 3 + 2] = (Math.random() - 0.5) * 10
        }
      }
    }

    return { positions, particleCount: count }
  }, [gesture.fingers])

  // Initialize velocities and target positions
  useEffect(() => {
    if (!velocitiesRef.current || velocitiesRef.current.length !== particleCount * 3) {
      velocitiesRef.current = new Float32Array(particleCount * 3)
      for (let i = 0; i < particleCount * 3; i++) {
        velocitiesRef.current[i] = (Math.random() - 0.5) * 0.02
      }
    }
    targetPositionsRef.current = new Float32Array(positions)
  }, [positions, particleCount])

  // Create geometry and material
  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    return geo
  }, [positions])

  const material = useMemo(() => {
    return new THREE.PointsMaterial({
      size: 0.05,
      color: new THREE.Color(color),
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    })
  }, [color])

  // Animation loop
  useFrame((state) => {
    if (!particlesRef.current || !targetPositionsRef.current || !velocitiesRef.current) return

    const positions = particlesRef.current.geometry.attributes.position.array as Float32Array
    const time = state.clock.elapsedTime

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3

      if (gesture.isOpen) {
        // Expand particles
        const dx = positions[i3] - 0
        const dy = positions[i3 + 1] - 0
        const dz = positions[i3 + 2] - 0
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz) || 1

        velocitiesRef.current[i3] += (dx / dist) * 0.001
        velocitiesRef.current[i3 + 1] += (dy / dist) * 0.001
        velocitiesRef.current[i3 + 2] += (dz / dist) * 0.001
      } else {
        // Contract towards center
        velocitiesRef.current[i3] -= positions[i3] * 0.001
        velocitiesRef.current[i3 + 1] -= positions[i3 + 1] * 0.001
        velocitiesRef.current[i3 + 2] -= positions[i3 + 2] * 0.001
      }

      // Apply velocities
      positions[i3] += velocitiesRef.current[i3]
      positions[i3 + 1] += velocitiesRef.current[i3 + 1]
      positions[i3 + 2] += velocitiesRef.current[i3 + 2]

      // Smooth transition to target positions
      const target = targetPositionsRef.current
      positions[i3] += (target[i3] * gesture.scale - positions[i3]) * 0.05
      positions[i3 + 1] += (target[i3 + 1] * gesture.scale - positions[i3 + 1]) * 0.05
      positions[i3 + 2] += (target[i3 + 2] * gesture.scale - positions[i3 + 2]) * 0.05

      // Add wave effect
      positions[i3 + 1] += Math.sin(time + i * 0.01) * 0.02

      // Damping
      velocitiesRef.current[i3] *= 0.98
      velocitiesRef.current[i3 + 1] *= 0.98
      velocitiesRef.current[i3 + 2] *= 0.98
    }

    particlesRef.current.geometry.attributes.position.needsUpdate = true
    particlesRef.current.rotation.y = time * 0.1
  })

  return <points ref={particlesRef} geometry={geometry} material={material} />
}

// Helper function to generate text particles
function generateTextParticles(text: string): Float32Array {
  const particles: number[] = []
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  if (!ctx) return new Float32Array(0)

  canvas.width = 1024
  canvas.height = 256
  ctx.fillStyle = 'black'
  ctx.fillRect(0, 0, canvas.width, canvas.height)
  ctx.fillStyle = 'white'
  ctx.font = 'bold 60px Arial'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(text, canvas.width / 2, canvas.height / 2)

  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
  const data = imageData.data

  // Sample pixels to create particles
  for (let y = 0; y < canvas.height; y += 3) {
    for (let x = 0; x < canvas.width; x += 3) {
      const index = (y * canvas.width + x) * 4
      const brightness = data[index]

      if (brightness > 128) {
        const px = (x / canvas.width - 0.5) * 15
        const py = -(y / canvas.height - 0.5) * 4
        const pz = (Math.random() - 0.5) * 2

        particles.push(px, py, pz)
      }
    }
  }

  return new Float32Array(particles)
}
