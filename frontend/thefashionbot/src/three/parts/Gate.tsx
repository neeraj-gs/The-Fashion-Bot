import { useMemo, useRef } from "react"
import { useFrame } from "@react-three/fiber"
import * as THREE from "three"
import { makeGlowTexture } from "@/three/textures"
import type { GateRuntime } from "@/three/runtime"

const W = 4.4
const H = 3.0
const CY = 0.95
const BAR = 0.1
const DEPTH = 0.26
const FLOOR_Y = -1.9

const SIGNAL = "#ff3d18"

/** The four bars of the frame, plus the posts that stand it on the lane. */
function Frame() {
  return (
    <group>
      {(
        [
          [[0, CY + H / 2, 0], [W + 2 * BAR, BAR, DEPTH]],
          [[0, CY - H / 2, 0], [W + 2 * BAR, BAR, DEPTH]],
          [[-(W / 2 + BAR / 2), CY, 0], [BAR, H, DEPTH]],
          [[W / 2 + BAR / 2, CY, 0], [BAR, H, DEPTH]],
        ] as [number[], number[]][]
      ).map(([pos, size], i) => (
        <mesh key={i} position={pos as [number, number, number]}>
          <boxGeometry args={size as [number, number, number]} />
          <meshStandardMaterial color="#191a1d" roughness={0.34} metalness={0.72} />
        </mesh>
      ))}

      {[-1, 1].map((side) => (
        <mesh
          key={side}
          position={[side * (W / 2 + BAR / 2), (CY - H / 2 + FLOOR_Y) / 2, 0]}
        >
          <boxGeometry args={[BAR * 0.7, CY - H / 2 - FLOOR_Y, DEPTH * 0.7]} />
          <meshStandardMaterial color="#141518" roughness={0.4} metalness={0.68} />
        </mesh>
      ))}
    </group>
  )
}

/** Small bone brackets at the corners — the same corner treatment as the cards. */
function Brackets() {
  const L = 0.42
  const T = 0.035
  const x = W / 2 + BAR
  const y = H / 2

  return (
    <group>
      {([[-1, 1], [1, 1], [-1, -1], [1, -1]] as [number, number][]).map(
        ([sx, sy], i) => (
          <group key={i} position={[sx * x, CY + sy * y, DEPTH / 2 + 0.01]}>
            <mesh position={[(-sx * L) / 2, 0, 0]}>
              <boxGeometry args={[L, T, T]} />
              <meshBasicMaterial color="#ede9e0" />
            </mesh>
            <mesh position={[0, (-sy * L) / 2, 0]}>
              <boxGeometry args={[T, L, T]} />
              <meshBasicMaterial color="#ede9e0" />
            </mesh>
          </group>
        )
      )}
    </group>
  )
}

export function Gate({ runtime }: { runtime: GateRuntime }) {
  const glow = useMemo(() => makeGlowTexture(), [])
  const strips = useRef<THREE.Group>(null)
  const haze = useRef<THREE.Mesh>(null)
  const flare = useRef<THREE.Mesh>(null)
  const light = useRef<THREE.PointLight>(null)

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    const f = runtime.flash
    // A slow breath at rest, a hard spike on capture.
    const idle = runtime.reduced ? 1.1 : 1.0 + Math.sin(t * 1.5) * 0.16
    const intensity = idle + f * 6

    if (strips.current) {
      for (const child of strips.current.children) {
        const material = (child as THREE.Mesh).material as THREE.MeshStandardMaterial
        material.emissiveIntensity = intensity
      }
    }

    if (haze.current) {
      const material = haze.current.material as THREE.MeshBasicMaterial
      material.opacity = 0.035 + f * 0.26
    }

    if (flare.current) {
      const material = flare.current.material as THREE.MeshBasicMaterial
      material.opacity = f * 0.72
      const s = 1 + f * 0.5
      flare.current.scale.set(s, s, 1)
    }

    if (light.current) light.current.intensity = 2.6 + f * 30
  })

  const inset = BAR / 2 + 0.02
  const strip = 0.028

  return (
    <group>
      <Frame />
      <Brackets />

      {/* Emissive lining just inside the frame — the gate's own light. */}
      <group ref={strips}>
        {(
          [
            [[0, CY + H / 2 - inset, DEPTH / 2], [W, strip, strip]],
            [[0, CY - H / 2 + inset, DEPTH / 2], [W, strip, strip]],
            [[-(W / 2 - inset), CY, DEPTH / 2], [strip, H, strip]],
            [[W / 2 - inset, CY, DEPTH / 2], [strip, H, strip]],
          ] as [number[], number[]][]
        ).map(([pos, size], i) => (
          <mesh key={i} position={pos as [number, number, number]}>
            <boxGeometry args={size as [number, number, number]} />
            <meshStandardMaterial
              color={SIGNAL}
              emissive={SIGNAL}
              emissiveIntensity={1}
              toneMapped={false}
            />
          </mesh>
        ))}
      </group>

      {/* The aperture haze: what the gate's light does to the air inside it. */}
      <mesh ref={haze} position={[0, CY, -0.01]}>
        <planeGeometry args={[W, H]} />
        <meshBasicMaterial
          map={glow}
          color={SIGNAL}
          transparent
          opacity={0.07}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          toneMapped={false}
        />
      </mesh>

      {/* Capture flare, standing in for a bloom pass. */}
      <mesh ref={flare} position={[0, CY, 0.05]}>
        <planeGeometry args={[W * 2.1, H * 2.1]} />
        <meshBasicMaterial
          map={glow}
          color={SIGNAL}
          transparent
          opacity={0}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          toneMapped={false}
        />
      </mesh>

      <pointLight
        ref={light}
        position={[0, CY, 0.5]}
        color={SIGNAL}
        intensity={2.6}
        distance={7}
        decay={2}
      />
    </group>
  )
}
