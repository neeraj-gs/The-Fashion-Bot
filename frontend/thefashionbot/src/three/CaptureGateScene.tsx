import { useEffect, useMemo, useRef } from "react"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import * as THREE from "three"
import { Panels } from "@/three/parts/Panels"
import { Gate } from "@/three/parts/Gate"
import { Reticle } from "@/three/parts/Reticle"
import { ReceiptTape } from "@/three/parts/ReceiptTape"
import { Floor, Motes, Rails } from "@/three/parts/Environment"
import {
  createGateRuntime,
  LANE,
  type GateRuntime,
  type SceneMode,
  type SceneQuality,
} from "@/three/runtime"

/** Camera positions per mode: the hero looks along the lane, the theatre sits close. */
const FRAMING = {
  // Camera and target share an x, so this translates the view rather than
  // rotating it: the lane simply sits further right, clear of the headline.
  hero: {
    from: new THREE.Vector3(-0.95, 1.5, 9.6),
    to: new THREE.Vector3(-0.95, 2.1, 6.4),
  },
  theatre: {
    from: new THREE.Vector3(0, 1.35, 10.4),
    to: new THREE.Vector3(0, 1.35, 10.4),
  },
}

/**
 * Owns the camera and the per-frame bookkeeping every other part reads:
 * pointer parallax, scroll progress and the decay of the capture flash.
 */
function Rig({ runtime, mode }: { runtime: GateRuntime; mode: SceneMode }) {
  const { camera } = useThree()
  const lookAt = useMemo(
    () => new THREE.Vector3(mode === "hero" ? -0.95 : 0, 0.75, -2),
    [mode]
  )
  const position = useMemo(() => new THREE.Vector3(), [])

  useEffect(() => {
    const onCharge = () => {
      runtime.flash = Math.max(runtime.flash, 0.85)
    }
    window.addEventListener("gate:charge", onCharge)
    return () => window.removeEventListener("gate:charge", onCharge)
  }, [runtime])

  useFrame((state, delta) => {
    const clamped = Math.min(delta, 0.05)

    runtime.flash = Math.max(0, runtime.flash - clamped * 2.3)

    // Pointer is smoothed hard: raw values make the camera feel twitchy.
    runtime.pointer.x += (state.pointer.x - runtime.pointer.x) * 0.045
    runtime.pointer.y += (state.pointer.y - runtime.pointer.y) * 0.045

    if (mode === "hero" && typeof window !== "undefined") {
      const progress = Math.min(1, Math.max(0, window.scrollY / window.innerHeight))
      runtime.scroll += (progress - runtime.scroll) * 0.08
    }

    const framing = FRAMING[mode]
    position.copy(framing.from).lerp(framing.to, runtime.scroll)

    if (!runtime.reduced) {
      position.x += runtime.pointer.x * 0.5
      position.y += -runtime.pointer.y * 0.26
    }

    camera.position.copy(position)
    camera.lookAt(lookAt)
  })

  return null
}

function Scene({
  runtime,
  quality,
  mode,
  runNo,
}: {
  runtime: GateRuntime
  quality: SceneQuality
  mode: SceneMode
  runNo: string
}) {
  return (
    <>
      <fog attach="fog" args={["#0b0b0c", 15, 40]} />

      <ambientLight intensity={0.55} />
      <directionalLight position={[4.5, 6, 7]} intensity={2.1} color="#ede9e0" />
      {/* A cold rim from behind, so the panels have an edge against the fog. */}
      <directionalLight position={[-6, 3.5, -5]} intensity={0.42} color="#8d97a8" />

      <Floor reflective={quality.reflective} />
      <Rails />
      <Motes count={quality.motes} runtime={runtime} />

      <Panels runtime={runtime} count={quality.panels} />

      {/* The gate and its tape stand together on the lane. */}
      <group position={[0, 0, LANE.gateZ]}>
        <Gate runtime={runtime} />
        <ReceiptTape runtime={runtime} runNo={runNo} />
      </group>

      {/* The reticle tracks world-space panel positions, so it stays outside. */}
      <Reticle runtime={runtime} />

      <Rig runtime={runtime} mode={mode} />
    </>
  )
}

export default function CaptureGateScene({
  quality,
  mode = "hero",
  runNo,
  active = true,
  reduced = false,
  className,
}: {
  quality: SceneQuality
  mode?: SceneMode
  runNo: string
  /** False when the hero is off screen — the loop stops entirely. */
  active?: boolean
  reduced?: boolean
  className?: string
}) {
  const runtime = useRef<GateRuntime>(createGateRuntime(reduced))
  runtime.current.reduced = reduced

  return (
    <Canvas
      className={className}
      dpr={quality.dpr}
      frameloop={active ? "always" : "never"}
      camera={{ fov: 38, near: 0.1, far: 70, position: [0.3, 1.5, 9.6] }}
      gl={{
        antialias: true,
        powerPreference: "high-performance",
        alpha: true,
      }}
      onCreated={({ gl }) => {
        gl.toneMapping = THREE.ACESFilmicToneMapping
        gl.toneMappingExposure = 0.95
      }}
    >
      <Scene
        runtime={runtime.current}
        quality={quality}
        mode={mode}
        runNo={runNo}
      />
    </Canvas>
  )
}
