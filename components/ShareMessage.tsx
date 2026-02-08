'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Share2, Copy, Check } from 'lucide-react'

export default function ShareMessage() {
  const [showShare, setShowShare] = useState(false)
  const [copied, setCopied] = useState(false)

  const birthdayMessage = `🎉 Happy Birthday Jahrex! 🎂

I made you a special interactive 3D gift! 
Control magical particles with your hand gestures 🖐️✨

Experience the magic: ${typeof window !== 'undefined' ? window.location.href : ''}

Made with love 💕`

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(birthdayMessage)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.log('Failed to copy')
    }
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Happy Birthday Jahrex! 🎉',
          text: birthdayMessage,
          url: window.location.href,
        })
      } catch (error) {
        console.log('Share cancelled')
      }
    } else {
      setShowShare(true)
    }
  }

  return (
    <>
      <Button
        onClick={handleShare}
        variant="ghost"
        size="icon"
        className="bg-white/10 backdrop-blur-md hover:bg-white/20 text-white"
        title="Share this gift"
      >
        <Share2 className="h-5 w-5" />
      </Button>

      {showShare && (
        <div className="absolute inset-0 z-40 bg-black/60 backdrop-blur-sm flex items-center justify-center">
          <Card className="max-w-md w-full mx-4 bg-black/90 backdrop-blur-xl border-white/20 text-white">
            <CardContent className="p-6">
              <h3 className="text-xl font-bold mb-4">Share This Gift 💕</h3>
              <div className="bg-white/5 border border-white/10 rounded-lg p-4 mb-4">
                <p className="text-sm whitespace-pre-wrap">{birthdayMessage}</p>
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={handleCopy}
                  className="flex-1 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4 mr-2" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 mr-2" />
                      Copy Message
                    </>
                  )}
                </Button>
                <Button onClick={() => setShowShare(false)} variant="outline" className="border-white/20">
                  Close
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  )
}
