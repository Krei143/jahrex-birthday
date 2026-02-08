'use client'

import { useState, useEffect, useRef } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Maximize2, Download, Info, X } from 'lucide-react'
import ParticleSystem from '@/components/ParticleSystem'
import HandGestureDetector from '@/components/HandGestureDetector'
import WelcomeScreen from '@/components/WelcomeScreen'
import DownloadOptions from '@/components/DownloadOptions'
import EnhancedControls from '@/components/EnhancedControls'
import ConfettiEffect from '@/components/ConfettiEffect'
import AudioManager from '@/components/AudioManager'
import InstructionOverlay from '@/components/InstructionOverlay'
import ShareMessage from '@/components/ShareMessage'
import { GestureData } from '@/types/gesture'

export default function Home() {
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [selectedColor, setSelectedColor] = useState('#ff69b4')
  const [gesture, setGesture] = useState<GestureData>({ fingers: 0, scale: 1, isOpen: false })
  const [showGuide, setShowGuide] = useState(true)
  const [cameraReady, setCameraReady] = useState(false)
  const [showWelcome, setShowWelcome] = useState(true)
  const [showDownloadOptions, setShowDownloadOptions] = useState(false)
  const canvasRef = useRef<HTMLDivElement>(null)

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen()
      setIsFullscreen(true)
    } else {
      document.exitFullscreen()
      setIsFullscreen(false)
    }
  }

  const handleDownload = () => {
    setShowDownloadOptions(true)
  }

  const getPatternName = (fingers: number) => {
    switch (fingers) {
      case 1:
        return 'Happy Birthday Babi'
      case 2:
        return 'Sphere'
      case 3:
        return 'Heart'
      case 4:
        return 'Spiral'
      case 5:
        return 'Galaxy'
      default:
        return 'Random'
    }
  }

  return (
    <div className="relative w-full h-screen bg-gradient-to-br from-purple-900 via-black to-pink-900 overflow-hidden">
      {/* Welcome Screen */}
      {showWelcome && <WelcomeScreen onStart={() => setShowWelcome(false)} />}

      {/* Download Options Modal */}
      {showDownloadOptions && <DownloadOptions onClose={() => setShowDownloadOptions(false)} />}

      {/* Hand Gesture Detector */}
      <HandGestureDetector onGestureChange={setGesture} onCameraReady={setCameraReady} />

      {/* Enhanced Keyboard Controls */}
      <EnhancedControls onGestureChange={setGesture} />

      {/* Confetti Effect for Birthday Pattern */}
      <ConfettiEffect active={gesture.fingers === 1} />

      {/* Audio Manager */}
      <AudioManager pattern={gesture.fingers} />

      {/* Instruction Overlay */}
      {!showWelcome && cameraReady && gesture.fingers === 0 && <InstructionOverlay />}

      {/* 3D Canvas */}
      <div ref={canvasRef} className="absolute inset-0">
        <Canvas camera={{ position: [0, 0, 10], fov: 75 }}>
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} intensity={1} />
          <ParticleSystem gesture={gesture} color={selectedColor} />
          <OrbitControls enableZoom={true} enablePan={true} />
        </Canvas>
      </div>

      {/* Top Bar */}
      <div className="absolute top-0 left-0 right-0 z-10 p-4 flex items-center justify-between bg-gradient-to-b from-black/60 to-transparent">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold text-white drop-shadow-lg">
            Happy Birthday Jahrex! 🎉
          </h1>
          <div className="px-4 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20">
            <span className="text-white font-medium">
              Pattern: {getPatternName(gesture.fingers)}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            onClick={() => setShowGuide(!showGuide)}
            variant="ghost"
            size="icon"
            className="bg-white/10 backdrop-blur-md hover:bg-white/20 text-white"
          >
            <Info className="h-5 w-5" />
          </Button>
          <Button
            onClick={handleDownload}
            variant="ghost"
            size="icon"
            className="bg-white/10 backdrop-blur-md hover:bg-white/20 text-white"
          >
            <Download className="h-5 w-5" />
          </Button>
          <ShareMessage />
          <Button
            onClick={toggleFullscreen}
            variant="ghost"
            size="icon"
            className="bg-white/10 backdrop-blur-md hover:bg-white/20 text-white"
          >
            <Maximize2 className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Guide Panel */}
      {showGuide && (
        <Card className="absolute top-20 right-4 w-80 z-20 bg-black/80 backdrop-blur-xl border-white/20 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold">Gesture Guide</h3>
              <Button
                onClick={() => setShowGuide(false)}
                variant="ghost"
                size="icon"
                className="h-6 w-6 hover:bg-white/10"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-3 p-2 bg-white/5 rounded-lg">
                <span className="text-2xl">☝️</span>
                <div>
                  <p className="font-semibold">1 Finger</p>
                  <p className="text-xs text-gray-300">Happy Birthday Text</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-2 bg-white/5 rounded-lg">
                <span className="text-2xl">✌️</span>
                <div>
                  <p className="font-semibold">2 Fingers</p>
                  <p className="text-xs text-gray-300">Sphere Pattern</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-2 bg-white/5 rounded-lg">
                <span className="text-2xl">🤟</span>
                <div>
                  <p className="font-semibold">3 Fingers</p>
                  <p className="text-xs text-gray-300">Heart Shape</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-2 bg-white/5 rounded-lg">
                <span className="text-2xl">🖖</span>
                <div>
                  <p className="font-semibold">4 Fingers</p>
                  <p className="text-xs text-gray-300">Spiral Pattern</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-2 bg-white/5 rounded-lg">
                <span className="text-2xl">🖐️</span>
                <div>
                  <p className="font-semibold">5 Fingers (Open)</p>
                  <p className="text-xs text-gray-300">Galaxy Explosion</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-2 bg-white/5 rounded-lg">
                <span className="text-2xl">✊</span>
                <div>
                  <p className="font-semibold">Fist (Close)</p>
                  <p className="text-xs text-gray-300">Contract Particles</p>
                </div>
              </div>
            </div>
            <div className="mt-4 p-3 bg-pink-500/20 rounded-lg border border-pink-500/30">
              <p className="text-xs text-center">
                <strong>Tip:</strong> Move your hand closer/farther to control particle scale!
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Color Picker */}
      <Card className="absolute bottom-4 left-4 z-20 bg-black/80 backdrop-blur-xl border-white/20">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <label className="text-white text-sm font-medium">Color:</label>
            <input
              type="color"
              value={selectedColor}
              onChange={(e) => setSelectedColor(e.target.value)}
              className="w-16 h-10 rounded-lg cursor-pointer border-2 border-white/30"
            />
            <div className="flex gap-2">
              {['#ff69b4', '#00ffff', '#ffff00', '#00ff00', '#ff00ff', '#ffffff'].map((color) => (
                <button
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  className="w-8 h-8 rounded-full border-2 border-white/30 hover:scale-110 transition-transform"
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Status Indicator */}
      <div className="absolute bottom-4 right-4 z-20 flex items-center gap-2 px-4 py-2 bg-black/80 backdrop-blur-xl rounded-full border border-white/20">
        <div className={`w-3 h-3 rounded-full ${cameraReady ? 'bg-green-500' : 'bg-red-500'} animate-pulse`} />
        <span className="text-white text-sm font-medium">
          {cameraReady ? 'Camera Active' : 'Initializing Camera...'}
        </span>
      </div>

      {/* Birthday Message Overlay */}
      <div className="absolute bottom-20 left-1/2 -translate-x-1/2 z-10 text-center pointer-events-none">
        <h2 className="text-4xl md:text-6xl font-bold text-white drop-shadow-2xl animate-pulse">
          Happy Birthday Babi! 💕
        </h2>
        <p className="text-xl md:text-2xl text-pink-300 mt-2 drop-shadow-lg">
          Made with love for Jahrex ✨
        </p>
      </div>
    </div>
  )
}
