declare module '@mediapipe/hands' {
  export interface Results {
    multiHandLandmarks?: Array<Array<{ x: number; y: number; z: number }>>
    multiHandedness?: Array<{ label: string; score: number }>
  }

  export interface HandsOptions {
    locateFile?: (file: string) => string
  }

  export class Hands {
    constructor(options: HandsOptions)
    setOptions(options: {
      maxNumHands?: number
      modelComplexity?: number
      minDetectionConfidence?: number
      minTrackingConfidence?: number
    }): void
    onResults(callback: (results: Results) => void): void
    send(input: { image: HTMLVideoElement | HTMLImageElement }): Promise<void>
    initialize(): Promise<void>
    close(): void
  }
}

declare module '@mediapipe/camera_utils' {
  export interface CameraOptions {
    onFrame: () => Promise<void>
    width?: number
    height?: number
  }

  export class Camera {
    constructor(videoElement: HTMLVideoElement, options: CameraOptions)
    start(): Promise<void>
    stop(): void
  }
}
