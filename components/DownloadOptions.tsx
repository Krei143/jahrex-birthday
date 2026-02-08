'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Download, X, ImageIcon, Video } from 'lucide-react'

interface DownloadOptionsProps {
  onClose: () => void
}

export default function DownloadOptions({ onClose }: DownloadOptionsProps) {
  const [isRecording, setIsRecording] = useState(false)
  const [recordedChunks, setRecordedChunks] = useState<Blob[]>([])

  const downloadImage = (quality: 'low' | 'medium' | 'high') => {
    const canvas = document.querySelector('canvas')
    if (!canvas) return

    let scale = 1
    switch (quality) {
      case 'low':
        scale = 1
        break
      case 'medium':
        scale = 2
        break
      case 'high':
        scale = 4
        break
    }

    // Create a temporary high-res canvas
    const tempCanvas = document.createElement('canvas')
    tempCanvas.width = canvas.width * scale
    tempCanvas.height = canvas.height * scale
    const ctx = tempCanvas.getContext('2d')
    if (!ctx) return

    ctx.scale(scale, scale)
    ctx.drawImage(canvas, 0, 0)

    const link = document.createElement('a')
    link.download = `jahrex-birthday-${quality}-${Date.now()}.png`
    link.href = tempCanvas.toDataURL('image/png')
    link.click()

    onClose()
  }

  const startRecording = async () => {
    const canvas = document.querySelector('canvas')
    if (!canvas) return

    const stream = canvas.captureStream(30)
    const mediaRecorder = new MediaRecorder(stream, {
      mimeType: 'video/webm;codecs=vp9',
    })

    const chunks: Blob[] = []
    mediaRecorder.ondataavailable = (e) => {
      if (e.data.size > 0) {
        chunks.push(e.data)
      }
    }

    mediaRecorder.onstop = () => {
      const blob = new Blob(chunks, { type: 'video/webm' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.download = `jahrex-birthday-${Date.now()}.webm`
      link.href = url
      link.click()
      URL.revokeObjectURL(url)
      setIsRecording(false)
      onClose()
    }

    mediaRecorder.start()
    setIsRecording(true)
    setRecordedChunks(chunks)

    // Auto-stop after 10 seconds
    setTimeout(() => {
      if (mediaRecorder.state === 'recording') {
        mediaRecorder.stop()
      }
    }, 10000)
  }

  const stopRecording = () => {
    const canvas = document.querySelector('canvas')
    if (!canvas) return

    const stream = canvas.captureStream()
    stream.getTracks().forEach((track) => track.stop())
  }

  return (
    <div className="absolute inset-0 z-40 bg-black/60 backdrop-blur-sm flex items-center justify-center">
      <Card className="max-w-md w-full mx-4 bg-black/90 backdrop-blur-xl border-white/20 text-white">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold">Download Options</h3>
            <Button onClick={onClose} variant="ghost" size="icon" className="hover:bg-white/10">
              <X className="h-5 w-5" />
            </Button>
          </div>

          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                <ImageIcon className="w-4 h-4" />
                Download as Image
              </h4>
              <div className="grid grid-cols-3 gap-2">
                <Button
                  onClick={() => downloadImage('low')}
                  variant="outline"
                  className="bg-white/5 hover:bg-white/10 border-white/20"
                >
                  Low
                  <span className="text-xs text-gray-400 ml-1">(1x)</span>
                </Button>
                <Button
                  onClick={() => downloadImage('medium')}
                  variant="outline"
                  className="bg-white/5 hover:bg-white/10 border-white/20"
                >
                  Medium
                  <span className="text-xs text-gray-400 ml-1">(2x)</span>
                </Button>
                <Button
                  onClick={() => downloadImage('high')}
                  variant="outline"
                  className="bg-white/5 hover:bg-white/10 border-white/20"
                >
                  High
                  <span className="text-xs text-gray-400 ml-1">(4x)</span>
                </Button>
              </div>
            </div>

            <div className="pt-4 border-t border-white/10">
              <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                <Video className="w-4 h-4" />
                Record Video (10 seconds)
              </h4>
              {!isRecording ? (
                <Button
                  onClick={startRecording}
                  className="w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600"
                >
                  Start Recording
                </Button>
              ) : (
                <div className="space-y-2">
                  <div className="flex items-center justify-center gap-2 text-red-500">
                    <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                    <span className="font-semibold">Recording...</span>
                  </div>
                  <Button onClick={stopRecording} variant="outline" className="w-full border-red-500 text-red-500 bg-transparent">
                    Stop Recording
                  </Button>
                </div>
              )}
            </div>

            <p className="text-xs text-gray-400 text-center pt-2">
              Capture this special moment and keep it forever! 💝
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
