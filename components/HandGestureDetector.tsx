'use client'

import { useEffect, useRef, useState } from 'react'
import { GestureData } from '@/types/gesture'

interface HandGestureDetectorProps {
  onGestureChange: (gesture: GestureData) => void
  onCameraReady: (ready: boolean) => void
}

export default function HandGestureDetector({ onGestureChange, onCameraReady }: HandGestureDetectorProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [handsModule, setHandsModule] = useState<any>(null)

  useEffect(() => {
    let animationId: number
    let hands: any

    const initializeHandTracking = async () => {
      try {
        // Request camera access
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: 640, height: 480 },
        })

        if (videoRef.current) {
          videoRef.current.srcObject = stream
          await videoRef.current.play()
          onCameraReady(true)
        }

        // Load MediaPipe Hands
        const script = document.createElement('script')
        script.src = 'https://cdn.jsdelivr.net/npm/@mediapipe/hands/hands.js'
        document.head.appendChild(script)

        const cameraUtils = document.createElement('script')
        cameraUtils.src = 'https://cdn.jsdelivr.net/npm/@mediapipe/camera_utils/camera_utils.js'
        document.head.appendChild(cameraUtils)

        const drawingUtils = document.createElement('script')
        drawingUtils.src = 'https://cdn.jsdelivr.net/npm/@mediapipe/drawing_utils/drawing_utils.js'
        document.head.appendChild(drawingUtils)

        script.onload = () => {
          setTimeout(() => {
            if ((window as any).Hands) {
              hands = new (window as any).Hands({
                locateFile: (file: string) => {
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
              setHandsModule(hands)

              // Start processing
              const processFrame = async () => {
                if (videoRef.current && hands) {
                  await hands.send({ image: videoRef.current })
                }
                animationId = requestAnimationFrame(processFrame)
              }
              processFrame()
            }
          }, 1000)
        }
      } catch (error) {
        console.error('Error initializing hand tracking:', error)
        onCameraReady(false)
        // Fallback to mouse/touch control
        setupFallbackControls()
      }
    }

    const onResults = (results: any) => {
      if (!canvasRef.current) return

      const canvasCtx = canvasRef.current.getContext('2d')
      if (!canvasCtx) return

      canvasCtx.save()
      canvasCtx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height)
      canvasCtx.drawImage(results.image, 0, 0, canvasRef.current.width, canvasRef.current.height)

      if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
        const landmarks = results.multiHandLandmarks[0]

        // Draw hand landmarks
        if ((window as any).drawConnectors && (window as any).HAND_CONNECTIONS) {
          ;(window as any).drawConnectors(canvasCtx, landmarks, (window as any).HAND_CONNECTIONS, {
            color: '#00FF00',
            lineWidth: 2,
          })
          ;(window as any).drawLandmarks(canvasCtx, landmarks, { color: '#FF0000', lineWidth: 1 })
        }

        // Calculate gesture
        const gesture = calculateGesture(landmarks)
        onGestureChange(gesture)
      }

      canvasCtx.restore()
    }

    const calculateGesture = (landmarks: any[]): GestureData => {
      // Count extended fingers
      let fingers = 0

      // Thumb
      if (landmarks[4].x < landmarks[3].x) fingers++

      // Index finger
      if (landmarks[8].y < landmarks[6].y) fingers++

      // Middle finger
      if (landmarks[12].y < landmarks[10].y) fingers++

      // Ring finger
      if (landmarks[16].y < landmarks[14].y) fingers++

      // Pinky
      if (landmarks[20].y < landmarks[18].y) fingers++

      // Calculate hand openness
      const palmCenter = landmarks[9]
      const fingerTips = [landmarks[4], landmarks[8], landmarks[12], landmarks[16], landmarks[20]]
      const avgDistance =
        fingerTips.reduce((sum, tip) => {
          const dx = tip.x - palmCenter.x
          const dy = tip.y - palmCenter.y
          return sum + Math.sqrt(dx * dx + dy * dy)
        }, 0) / 5

      const isOpen = avgDistance > 0.15

      // Calculate scale based on hand size
      const handWidth = Math.abs(landmarks[5].x - landmarks[17].x)
      const scale = Math.max(0.5, Math.min(2, handWidth * 10))

      return {
        fingers,
        scale,
        isOpen,
        handPosition: {
          x: palmCenter.x,
          y: palmCenter.y,
          z: palmCenter.z,
        },
      }
    }

    const setupFallbackControls = () => {
      // Fallback: cycle through patterns automatically
      let currentFingers = 0
      setInterval(() => {
        currentFingers = (currentFingers % 5) + 1
        onGestureChange({
          fingers: currentFingers,
          scale: 1,
          isOpen: true,
        })
      }, 3000)
    }

    initializeHandTracking()

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId)
      }
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream
        stream.getTracks().forEach((track) => track.stop())
      }
    }
  }, [onGestureChange, onCameraReady])

  return (
    <>
      <video ref={videoRef} className="hidden" />
      <canvas
        ref={canvasRef}
        width={640}
        height={480}
        className="absolute top-4 left-4 w-48 h-36 rounded-lg border-2 border-white/30 bg-black/50 backdrop-blur-sm z-30"
      />
    </>
  )
}
