'use client'

import { useEffect, useRef } from 'react'

interface AudioManagerProps {
  pattern: number
}

export default function AudioManager({ pattern }: AudioManagerProps) {
  const audioContextRef = useRef<AudioContext | null>(null)
  const hasPlayedRef = useRef(false)

  useEffect(() => {
    if (pattern === 1 && !hasPlayedRef.current) {
      playBirthdayTune()
      hasPlayedRef.current = true
    } else if (pattern !== 1) {
      hasPlayedRef.current = false
    }
  }, [pattern])

  const playBirthdayTune = () => {
    if (typeof window === 'undefined') return

    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext
      const audioContext = new AudioContext()
      audioContextRef.current = audioContext

      // Happy Birthday melody (simplified)
      const notes = [
        { freq: 262, duration: 0.4 }, // C
        { freq: 262, duration: 0.2 }, // C
        { freq: 294, duration: 0.6 }, // D
        { freq: 262, duration: 0.6 }, // C
        { freq: 349, duration: 0.6 }, // F
        { freq: 330, duration: 1.2 }, // E
        { freq: 262, duration: 0.4 }, // C
        { freq: 262, duration: 0.2 }, // C
        { freq: 294, duration: 0.6 }, // D
        { freq: 262, duration: 0.6 }, // C
        { freq: 392, duration: 0.6 }, // G
        { freq: 349, duration: 1.2 }, // F
      ]

      let startTime = audioContext.currentTime
      notes.forEach((note) => {
        const oscillator = audioContext.createOscillator()
        const gainNode = audioContext.createGain()

        oscillator.connect(gainNode)
        gainNode.connect(audioContext.destination)

        oscillator.frequency.value = note.freq
        oscillator.type = 'sine'

        gainNode.gain.setValueAtTime(0.3, startTime)
        gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + note.duration)

        oscillator.start(startTime)
        oscillator.stop(startTime + note.duration)

        startTime += note.duration + 0.1
      })
    } catch (error) {
      console.log('Audio playback not supported')
    }
  }

  return null
}
