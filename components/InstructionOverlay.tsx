'use client'

import { Card, CardContent } from '@/components/ui/card'

export default function InstructionOverlay() {
  return (
    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 pointer-events-none">
      <Card className="bg-black/60 backdrop-blur-md border-white/20">
        <CardContent className="p-3 px-6">
          <p className="text-white text-sm font-medium text-center">
            Show your hand to the camera and try different finger gestures! 👋
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
