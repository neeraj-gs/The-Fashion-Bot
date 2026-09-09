import { useMemo, useRef } from "react"
import { useFrame } from "@react-three/fiber"
import * as THREE from "three"
import { makeGlowTexture } from "@/three/textures"
import { HOLD, LANE, type GateRuntime } from "@/three/runtime"

const SIGNAL = "#ff3d18"
const HX = LANE.panelW / 2 + 0.14
const HY = LANE.panelH / 2 + 0.14
const ARM = 0.34
const T = 0.026

/**
 * Four corner brackets that snap onto whichever panel the gate just took. They
 * arrive oversized and close onto the panel, which is what sells the lock-on.
 */
export function Reticle({ runtime }: { runtime: GateRuntime }) {
  const group = useRef<THREE.Group>(null)
  const glowTexture = useMemo(() => makeGlowTexture(), [])

  // One shared material, so the whole reticle fades as a single object.
  const material = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: SIGNAL,
        transparent: true,
        opacity: 0,
        toneMapped: false,
        depthWrite: false,
      }),
    []
  )
  const glowMaterial = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        map: glowTexture,
        color: SIGNAL,
        transparent: true,
        opacity: 0,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        toneMapped: false,
      }),
    [glowTexture]
  )

  useFrame(({ clock }) => {
    const g = group.current
    if (!g) return

    const t = clock.getElapsedTime()
    const age = t - runtime.capture.at
    const active = runtime.capture.active && age >= 0 && age <= HOLD

    g.visible = active
    if (!active) {
      material.opacity = 0
      glowMaterial.opacity = 0
      return
    }

    g.position.set(runtime.capture.x, runtime.capture.y, runtime.capture.z + 0.08)

    // Close onto the panel over the first quarter second.
    const k = THREE.MathUtils.clamp(age / 0.26, 0, 1)
    const eased = 1 - Math.pow(1 - k, 3)
    const scale = THREE.MathUtils.lerp(1.45, 1, eased)
    g.scale.setScalar(scale)

    const fadeOut = 1 - THREE.MathUtils.smoothstep(age, HOLD - 0.4, HOLD)
    material.opacity = eased * fadeOut
    glowMaterial.opacity = 0.5 * (1 - eased) * fadeOut + 0.12 * fadeOut
  })

  const corners: [number, number][] = [
    [-1, 1],
    [1, 1],
    [-1, -1],
    [1, -1],
  ]

  return (
    <group ref={group} visible={false}>
      {corners.map(([sx, sy], i) => (
        <group key={i} position={[sx * HX, sy * HY, 0]}>
          <mesh material={material} position={[(-sx * ARM) / 2, 0, 0]}>
            <boxGeometry args={[ARM, T, T]} />
          </mesh>
          <mesh material={material} position={[0, (-sy * ARM) / 2, 0]}>
            <boxGeometry args={[T, ARM, T]} />
          </mesh>
        </group>
      ))}

      {/* Centre ticks. */}
      <mesh material={material} position={[0, 0, 0]}>
        <boxGeometry args={[0.16, T * 0.8, T]} />
      </mesh>
      <mesh material={material} position={[0, 0, 0]}>
        <boxGeometry args={[T * 0.8, 0.16, T]} />
      </mesh>

      <mesh material={glowMaterial} position={[0, 0, -0.02]}>
        <planeGeometry args={[LANE.panelW * 2.4, LANE.panelH * 2]} />
      </mesh>
    </group>
  )
}
