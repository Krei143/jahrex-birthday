'use client'

import { useEffect, useRef } from 'react'

interface ConfettiEffectProps {
  active: boolean
}

export default function ConfettiEffect({ active }: ConfettiEffectProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!active || !canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    interface Confetti {
      x: number
      y: number
      r: number
      d: number
      color: string
      tilt: number
      tiltAngleIncrement: number
      tiltAngle: number
    }

    const confetti: Confetti[] = []
    const confettiCount = 150
    const colors = ['#ff69b4', '#00ffff', '#ffff00', '#00ff00', '#ff00ff', '#ffffff', '#ffa500']

    for (let i = 0; i < confettiCount; i++) {
      confetti.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height - canvas.height,
        r: Math.random() * 6 + 4,
        d: Math.random() * confettiCount,
        color: colors[Math.floor(Math.random() * colors.length)],
        tilt: Math.floor(Math.random() * 10) - 10,
        tiltAngleIncrement: Math.random() * 0.07 + 0.05,
        tiltAngle: 0,
      })
    }

    let animationId: number

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      for (let i = 0; i < confettiCount; i++) {
        const c = confetti[i]
        ctx.beginPath()
        ctx.lineWidth = c.r / 2
        ctx.strokeStyle = c.color
        ctx.moveTo(c.x + c.tilt + c.r / 4, c.y)
        ctx.lineTo(c.x + c.tilt, c.y + c.tilt + c.r / 4)
        ctx.stroke()

        c.tiltAngle += c.tiltAngleIncrement
        c.y += (Math.cos(c.d) + 3 + c.r / 2) / 2
        c.tilt = Math.sin(c.tiltAngle - i / 3) * 15

        if (c.y > canvas.height) {
          confetti[i] = {
            x: Math.random() * canvas.width,
            y: -20,
            r: c.r,
            d: c.d,
            color: c.color,
            tilt: c.tilt,
            tiltAngle: c.tiltAngle,
            tiltAngleIncrement: c.tiltAngleIncrement,
          }
        }
      }

      animationId = requestAnimationFrame(draw)
    }

    draw()

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId)
      }
    }
  }, [active])

  if (!active) return null

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none z-20"
      style={{ mixBlendMode: 'screen' }}
    />
  )
}
