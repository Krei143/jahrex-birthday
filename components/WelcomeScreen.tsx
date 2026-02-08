'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Gift, Hand, Camera } from 'lucide-react'

interface WelcomeScreenProps {
  onStart: () => void
}

export default function WelcomeScreen({ onStart }: WelcomeScreenProps) {
  return (
    <div className="absolute inset-0 z-50 bg-gradient-to-br from-purple-900 via-black to-pink-900 flex items-center justify-center">
      <Card className="max-w-2xl w-full mx-4 bg-black/80 backdrop-blur-xl border-white/20 text-white">
        <CardContent className="p-8">
          <div className="text-center space-y-6">
            <div className="flex justify-center">
              <Gift className="w-20 h-20 text-pink-500 animate-bounce" />
            </div>
            
            <h1 className="text-5xl font-bold bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 bg-clip-text text-transparent">
              Happy Birthday Jahrex!
            </h1>
            
            <p className="text-xl text-gray-300">
              This is a special gift made with love just for you! 💕
            </p>

            <div className="grid md:grid-cols-2 gap-4 my-8">
              <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                <Hand className="w-8 h-8 text-pink-500 mx-auto mb-2" />
                <h3 className="font-semibold mb-2">Hand Gestures</h3>
                <p className="text-sm text-gray-400">
                  Use your hand to control magical 3D particles in real-time
                </p>
              </div>
              
              <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                <Camera className="w-8 h-8 text-purple-500 mx-auto mb-2" />
                <h3 className="font-semibold mb-2">Camera Required</h3>
                <p className="text-sm text-gray-400">
                  Allow camera access to enable gesture recognition
                </p>
              </div>
            </div>

            <div className="bg-pink-500/20 border border-pink-500/30 rounded-lg p-4 text-sm">
              <p className="mb-2 font-semibold">Quick Keyboard Controls (Backup):</p>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>Press <kbd className="px-2 py-1 bg-white/10 rounded">1-5</kbd> for patterns</div>
                <div>Press <kbd className="px-2 py-1 bg-white/10 rounded">Space</kbd> to expand/contract</div>
                <div>Press <kbd className="px-2 py-1 bg-white/10 rounded">+/-</kbd> to scale</div>
              </div>
            </div>

            <Button
              onClick={onStart}
              size="lg"
              className="w-full text-lg bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white"
            >
              Start the Magic! ✨
            </Button>

            <p className="text-xs text-gray-500 mt-4">
              Made with love by your special someone 💖
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
