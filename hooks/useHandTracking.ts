'use client'

import { useEffect, useRef, useState } from 'react'

interface HandGesture {
  openness: number
  isOpen: boolean
}

export function useHandTracking(enabled: boolean) {
  const [fingerCount, setFingerCount] = useState<number | null>(null)
  const [handGesture, setHandGesture] = useState<HandGesture | undefined>()
  const videoRef = useRef<HTMLVideoElement>(null)
  const handsRef = useRef<any>(null)
  const cameraRef = useRef<any>(null)

  useEffect(() => {
    if (!enabled) {
      // Stop camera when disabled
      if (cameraRef.current) {
        cameraRef.current.stop()
      }
      if (handsRef.current) {
        handsRef.current.close()
      }
      setFingerCount(null)
      setHandGesture(undefined)
      return
    }

    let mounted = true

    const initializeHandTracking = async () => {
      try {
        // Dynamically import MediaPipe
        const { Hands } = await import('@mediapipe/hands')
        const { Camera } = await import('@mediapipe/camera_utils')

        if (!mounted || !videoRef.current) return

        // Initialize MediaPipe Hands
        const hands = new Hands({
          locateFile: (file) => {
            return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`
          },
        })

        hands.setOptions({
          maxNumHands: 1,
          modelComplexity: 1,
          minDetectionConfidence: 0.5,
          minTrackingConfidence: 0.5,
        })

        hands.onResults(onResults)

        // Initialize camera
        if (videoRef.current) {
          const camera = new Camera(videoRef.current, {
            onFrame: async () => {
              if (videoRef.current && mounted) {
                await hands.send({ image: videoRef.current })
              }
            },
            width: 640,
            height: 480,
          })

          camera.start()
          handsRef.current = hands
          cameraRef.current = camera
        }
      } catch (error) {
        console.error('[v0] Hand tracking initialization error:', error)
      }
    }

    const onResults = (results: any) => {
      if (!mounted) return

      if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
        const landmarks = results.multiHandLandmarks[0]
        
        // Count extended fingers
        const count = countFingers(landmarks)
        setFingerCount(count)
        
        // Calculate hand openness
        const openness = calculateHandOpenness(landmarks)
        setHandGesture({
          openness,
          isOpen: openness > 0.6,
        })
      } else {
        setFingerCount(null)
        setHandGesture(undefined)
      }
    }

    initializeHandTracking()

    return () => {
      mounted = false
      if (cameraRef.current) {
        cameraRef.current.stop()
      }
      if (handsRef.current) {
        handsRef.current.close()
      }
    }
  }, [enabled])

  return { fingerCount, handGesture, videoRef }
}

function countFingers(landmarks: any[]): number {
  let count = 0
  
  // Thumb
  if (landmarks[4].x < landmarks[3].x) {
    count++
  }
  
  // Other fingers
  const fingerTips = [8, 12, 16, 20]
  const fingerPips = [6, 10, 14, 18]
  
  for (let i = 0; i < fingerTips.length; i++) {
    if (landmarks[fingerTips[i]].y < landmarks[fingerPips[i]].y) {
      count++
    }
  }
  
  return count
}

function calculateHandOpenness(landmarks: any[]): number {
  // Calculate average distance between fingertips and palm center
  const palmCenter = landmarks[0]
  const fingerTips = [4, 8, 12, 16, 20]
  
  let totalDistance = 0
  for (const tip of fingerTips) {
    const dx = landmarks[tip].x - palmCenter.x
    const dy = landmarks[tip].y - palmCenter.y
    totalDistance += Math.sqrt(dx * dx + dy * dy)
  }
  
  const avgDistance = totalDistance / fingerTips.length
  
  // Normalize to 0-1 range (adjust these values based on testing)
  return Math.min(Math.max((avgDistance - 0.1) / 0.2, 0), 1)
}
