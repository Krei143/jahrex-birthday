'use client'

import { useEffect } from 'react'
import { GestureData } from '@/types/gesture'

interface EnhancedControlsProps {
  onGestureChange: (gesture: GestureData) => void
}

export default function EnhancedControls({ onGestureChange }: EnhancedControlsProps) {
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      const key = e.key
      let fingers = 0

      switch (key) {
        case '1':
          fingers = 1
          break
        case '2':
          fingers = 2
          break
        case '3':
          fingers = 3
          break
        case '4':
          fingers = 4
          break
        case '5':
          fingers = 5
          break
        case ' ':
          // Spacebar toggles open/close
          onGestureChange((prev) => ({
            ...prev,
            isOpen: !prev.isOpen,
          }))
          return
        case '+':
        case '=':
          // Increase scale
          onGestureChange((prev) => ({
            ...prev,
            scale: Math.min(3, prev.scale + 0.1),
          }))
          return
        case '-':
        case '_':
          // Decrease scale
          onGestureChange((prev) => ({
            ...prev,
            scale: Math.max(0.3, prev.scale - 0.1),
          }))
          return
        default:
          return
      }

      if (fingers > 0) {
        onGestureChange({
          fingers,
          scale: 1,
          isOpen: true,
        })
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [onGestureChange])

  return null
}
