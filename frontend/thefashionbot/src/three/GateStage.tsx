import { Suspense, lazy } from "react"
import { GatePoster } from "@/three/GatePoster"
import { QUALITY, type SceneMode } from "@/three/runtime"
import {
  useHasWebGL,
  useInView,
  useMediaQuery,
  usePrefersReducedMotion,
} from "@/lib/hooks"

/**
 * three.js and drei are a large payload, so the whole scene sits behind a lazy
 * boundary: first paint never waits on it, and the poster stands in until it
 * arrives.
 */
const CaptureGateScene = lazy(() => import("@/three/CaptureGateScene"))

export function GateStage({
  runNo,
  mode = "hero",
  className,
  posterClassName,
}: {
  runNo: string
  mode?: SceneMode
  className?: string
  posterClassName?: string
}) {
  const reduced = usePrefersReducedMotion()
  const hasWebGL = useHasWebGL()
  const isDesktop = useMediaQuery("(min-width: 1024px)")

  // Live value, not latched: the loop stops the moment the scene scrolls away.
  const { ref, inView } = useInView<HTMLDivElement>({
    once: false,
    margin: "220px",
  })

  const quality = isDesktop ? QUALITY.high : QUALITY.low
  const poster = <GatePoster className={posterClassName ?? "size-full"} />

  return (
    <div ref={ref} className={className}>
      {hasWebGL === true && !reduced ? (
        <Suspense fallback={poster}>
          <CaptureGateScene
            quality={quality}
            mode={mode}
            runNo={runNo}
            active={inView}
            reduced={reduced}
          />
        </Suspense>
      ) : (
        poster
      )}
    </div>
  )
}
