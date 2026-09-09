import { useMemo, useRef } from "react"
import { useFrame } from "@react-three/fiber"
import * as THREE from "three"
import { makeReceiptTexture } from "@/three/textures"
import type { GateRuntime } from "@/three/runtime"

const SEGMENTS = 72
const WIDTH = 0.92

/**
 * Where the tape is at a given point along its length. It runs straight down
 * and toward the camera, then curls back under itself the way a receipt does
 * when nothing catches it.
 */
function tapePath(t: number): { y: number; z: number } {
  const straight = Math.min(t / 0.52, 1)
  let z = 0.12 + straight * 1.05
  let y = -0.6 - straight * 0.78

  if (t > 0.52) {
    const u = (t - 0.52) / 0.48
    const a = u * Math.PI * 1.75
    const r = 0.42
    z += Math.sin(a) * r
    y += -(1 - Math.cos(a)) * r
  }

  return { y, z }
}

/** The curl is fixed, so the geometry is baked once rather than shaded per frame. */
function buildTapeGeometry(): THREE.BufferGeometry {
  const positions: number[] = []
  const uvs: number[] = []
  const indices: number[] = []
  const halfW = WIDTH / 2

  for (let i = 0; i <= SEGMENTS; i++) {
    const t = i / SEGMENTS
    const { y, z } = tapePath(t)
    positions.push(-halfW, y, z, halfW, y, z)
    uvs.push(0, 1 - t, 1, 1 - t)
  }

  for (let i = 0; i < SEGMENTS; i++) {
    const a = i * 2
    indices.push(a, a + 1, a + 2, a + 1, a + 3, a + 2)
  }

  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3))
  geometry.setAttribute("uv", new THREE.Float32BufferAttribute(uvs, 2))
  geometry.setIndex(indices)
  geometry.computeVertexNormals()
  return geometry
}

export function ReceiptTape({
  runtime,
  runNo,
}: {
  runtime: GateRuntime
  runNo: string
}) {
  const geometry = useMemo(() => buildTapeGeometry(), [])
  const texture = useMemo(() => {
    const tex = makeReceiptTexture(runNo)
    tex.repeat.set(1, 2.4)
    return tex
  }, [runNo])

  const mesh = useRef<THREE.Mesh>(null)
  const lastCaptures = useRef(0)
  const jolt = useRef(0)

  useFrame((_, delta) => {
    // A capture feeds a fresh block of tape through.
    if (runtime.captures !== lastCaptures.current) {
      lastCaptures.current = runtime.captures
      jolt.current = 0.55
    }

    const feed = runtime.reduced ? 0 : 0.045 + jolt.current
    texture.offset.y -= feed * delta * 2.2
    jolt.current = Math.max(0, jolt.current - delta * 1.6)

    if (mesh.current) {
      const material = mesh.current.material as THREE.MeshStandardMaterial
      material.emissiveIntensity = 0.1 + runtime.flash * 0.35
    }
  })

  return (
    <group rotation={[0, -0.16, 0]}>
      <mesh ref={mesh} geometry={geometry}>
        <meshStandardMaterial
          map={texture}
          side={THREE.DoubleSide}
          roughness={0.92}
          metalness={0}
          emissive="#e6e1d6"
          emissiveIntensity={0.1}
        />
      </mesh>
    </group>
  )
}
