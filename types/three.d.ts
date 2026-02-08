import { Object3D, Points, PointsMaterial, BufferGeometry } from 'three'
import { Object3DNode, MaterialNode } from '@react-three/fiber'

declare module '@react-three/fiber' {
  interface ThreeElements {
    points: Object3DNode<Points, typeof Points>
    pointsMaterial: MaterialNode<PointsMaterial, typeof PointsMaterial>
    bufferGeometry: Object3DNode<BufferGeometry, typeof BufferGeometry>
  }
}
