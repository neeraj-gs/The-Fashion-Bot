import { useMemo, useRef } from "react"
import { useFrame } from "@react-three/fiber"
import * as THREE from "three"
import { makePanelTexture } from "@/three/textures"
import { HOLD, LANE, type GateRuntime } from "@/three/runtime"

const VARIANTS = 6
const FLASH_TIME = 0.55

/**
 * The conveyor: product panels streaming down the lane toward the gate. When
 * one crosses the gate plane it flares vermilion, gets marked as taken, and
 * carries on past the camera dimmed.
 */
export function Panels({
  runtime,
  count,
}: {
  runtime: GateRuntime
  count: number
}) {
  const textures = useMemo(
    () => Array.from({ length: VARIANTS }, (_, i) => makePanelTexture(i)),
    []
  )

  const panels = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        offset: (LANE.loop / count) * i,
        // Alternate off the centre line so the lane reads as a belt, not a queue.
        x: (i % 2 === 0 ? -1 : 1) * (0.34 + ((i * 7) % 5) * 0.13),
        tilt: (((i * 37) % 10) - 5) * 0.016,
        swayPhase: (i * 1.37) % (Math.PI * 2),
        texture: textures[i % textures.length],
      })),
    [count, textures]
  )

  const meshes = useRef<(THREE.Mesh | null)[]>([])
  const prevZ = useRef<number[]>(Array(count).fill(-999))
  const takenAt = useRef<number[]>(Array(count).fill(-999))

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    // Frozen at a composed pose when reduced motion is on.
    const travel = runtime.reduced ? 11 : t * LANE.speed

    for (let i = 0; i < panels.length; i++) {
      const mesh = meshes.current[i]
      if (!mesh) continue

      const p = panels[i]
      const d = (travel + p.offset) % LANE.loop
      const z = LANE.startZ + d

      // The panel wrapped back to the far end: it is a fresh one again.
      if (z < prevZ.current[i]) takenAt.current[i] = -999

      const sway = runtime.reduced ? 0 : Math.sin(t * 0.6 + p.swayPhase) * 0.07
      const bob = runtime.reduced ? 0 : Math.sin(t * 0.9 + p.swayPhase) * 0.05

      mesh.position.set(p.x + sway, LANE.panelY + bob, z)
      mesh.rotation.set(p.tilt * 0.5, -0.2 + p.tilt, p.tilt)

      // --- capture: the first untaken panel to cross the gate plane wins ---
      const crossed = prevZ.current[i] < LANE.gateZ && z >= LANE.gateZ
      const holdExpired = t - runtime.capture.at > HOLD
      if (crossed && takenAt.current[i] < 0 && holdExpired && !runtime.reduced) {
        takenAt.current[i] = t
        runtime.capture.index = i
        runtime.capture.at = t
        runtime.capture.active = true
        runtime.captures += 1
        runtime.flash = 1
      }

      // Keep the reticle glued to the panel it locked on to.
      if (runtime.capture.index === i && t - runtime.capture.at <= HOLD) {
        runtime.capture.x = mesh.position.x
        runtime.capture.y = mesh.position.y
        runtime.capture.z = mesh.position.z
      }

      // --- material response ---
      const material = mesh.material as THREE.MeshStandardMaterial
      const since = t - takenAt.current[i]
      const taken = takenAt.current[i] > 0

      if (taken && since < FLASH_TIME) {
        const k = 1 - since / FLASH_TIME
        material.emissive.setHex(0xff3d18)
        material.emissiveIntensity = 2.6 * k * k
      } else if (taken) {
        // Taken panels carry a faint vermilion afterglow. A jade tint here read
        // as a green panel and fought the palette.
        material.emissive.setHex(0xff3d18)
        material.emissiveIntensity = 0.07
      } else {
        material.emissiveIntensity = 0
      }

      // Dissolve into the fog at the far end, and out of frame at the near end.
      const farFade = THREE.MathUtils.smoothstep(z, LANE.startZ, LANE.startZ + 9)
      const nearFade = 1 - THREE.MathUtils.smoothstep(z, 0.5, 3)
      material.opacity = farFade * nearFade
      mesh.visible = material.opacity > 0.01
    }

    for (let i = 0; i < panels.length; i++) {
      const mesh = meshes.current[i]
      if (mesh) prevZ.current[i] = mesh.position.z
    }

    if (runtime.capture.active && t - runtime.capture.at > HOLD) {
      runtime.capture.active = false
    }
  })

  return (
    <group>
      {panels.map((panel, i) => (
        <mesh
          key={i}
          ref={(el) => {
            meshes.current[i] = el
          }}
          castShadow={false}
        >
          <planeGeometry args={[LANE.panelW, LANE.panelH]} />
          <meshStandardMaterial
            map={panel.texture}
            transparent
            roughness={0.82}
            metalness={0.05}
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}
    </group>
  )
}
