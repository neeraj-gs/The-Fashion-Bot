import { useMemo, useRef } from "react"
import { useFrame } from "@react-three/fiber"
import { MeshReflectorMaterial } from "@react-three/drei"
import * as THREE from "three"
import { makeDotTexture } from "@/three/textures"
import { LANE, type GateRuntime } from "@/three/runtime"

export const FLOOR_Y = -1.9

/**
 * The floor. On the high tier it reflects, which is most of what makes the
 * vermilion gate feel like it is lighting a real room.
 */
export function Floor({ reflective }: { reflective: boolean }) {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, FLOOR_Y, -8]}>
      <planeGeometry args={[30, 52]} />
      {reflective ? (
        <MeshReflectorMaterial
          resolution={256}
          mirror={0.55}
          mixBlur={24}
          mixStrength={2.4}
          blur={[300, 90]}
          depthScale={1.1}
          minDepthThreshold={0.4}
          maxDepthThreshold={1.35}
          color="#0a0a0c"
          metalness={0.6}
          roughness={0.88}
        />
      ) : (
        <meshStandardMaterial color="#0a0a0c" roughness={0.9} metalness={0.3} />
      )}
    </mesh>
  )
}

/** Two hairline rails, so the lane reads as a track rather than empty space. */
export function Rails() {
  const length = LANE.loop + 12
  return (
    <group>
      {[-1, 1].map((side) => (
        <mesh
          key={side}
          position={[side * 2.25, FLOOR_Y + 0.012, LANE.startZ + length / 2 - 4]}
          rotation={[-Math.PI / 2, 0, 0]}
        >
          <planeGeometry args={[0.035, length]} />
          <meshBasicMaterial
            color="#ede9e0"
            transparent
            opacity={0.13}
            toneMapped={false}
          />
        </mesh>
      ))}
    </group>
  )
}

/** Slow drifting motes. Cheap atmosphere, and they give the fog something to catch. */
export function Motes({ count, runtime }: { count: number; runtime: GateRuntime }) {
  const texture = useMemo(() => makeDotTexture(), [])
  const points = useRef<THREE.Points>(null)

  const positions = useMemo(() => {
    const array = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      array[i * 3] = (Math.random() - 0.5) * 16
      array[i * 3 + 1] = Math.random() * 6 - 1.6
      array[i * 3 + 2] = LANE.startZ + Math.random() * (LANE.loop + 10)
    }
    return array
  }, [count])

  useFrame(({ clock }) => {
    if (!points.current || runtime.reduced) return
    const t = clock.getElapsedTime()
    points.current.rotation.y = t * 0.008
    points.current.position.y = Math.sin(t * 0.18) * 0.16
  })

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        map={texture}
        size={0.055}
        sizeAttenuation
        transparent
        opacity={0.4}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        color="#ede9e0"
        toneMapped={false}
      />
    </points>
  )
}
