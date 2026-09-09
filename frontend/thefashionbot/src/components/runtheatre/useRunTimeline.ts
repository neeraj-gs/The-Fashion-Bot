import { useEffect, useRef, useState } from "react"

export type StageState = "queued" | "working" | "done" | "failed"

export interface RunStage {
  id: string
  label: string
}

/** The stages the automation actually performs, in order. */
export function buildStages(needsSize: boolean): RunStage[] {
  return [
    { id: "lane", label: "Open the lane" },
    { id: "resolve", label: "Resolve the product" },
    ...(needsSize ? [{ id: "size", label: "Select the size" }] : []),
    { id: "cart", label: "Add to cart" },
    { id: "shipping", label: "Fill shipping" },
    { id: "payment", label: "Fill payment" },
    { id: "confirm", label: "Confirm the order" },
  ]
}

/** How long each stage is expected to take, before the last one holds. */
const CADENCE_MS = 2600

export type RunOutcome = "success" | "error" | null

/**
 * Drives the theatre's stage display.
 *
 * The automation endpoint is a single blocking request that returns only a
 * final result — there is no per-stage stream. So the highlighted stage here is
 * an ESTIMATE based on expected timing, and the UI says so plainly. Only the
 * outcome and the elapsed clock are real. The last stage holds as "working" for
 * as long as the request takes, rather than inventing a completion it cannot
 * know about.
 */
export function useRunTimeline(
  stages: RunStage[],
  running: boolean,
  outcome: RunOutcome
) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [elapsed, setElapsed] = useState(0)
  const startedAt = useRef(0)

  useEffect(() => {
    if (!running) return

    startedAt.current = performance.now()
    setActiveIndex(0)
    setElapsed(0)

    let frame = 0
    const tick = () => {
      const ms = performance.now() - startedAt.current
      setElapsed(ms)
      setActiveIndex(Math.min(stages.length - 1, Math.floor(ms / CADENCE_MS)))
      frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)

    return () => cancelAnimationFrame(frame)
  }, [running, stages.length])

  const stateFor = (index: number): StageState => {
    if (outcome === "success") return "done"
    if (outcome === "error") {
      if (index < activeIndex) return "done"
      if (index === activeIndex) return "failed"
      return "queued"
    }
    if (!running) return "queued"
    if (index < activeIndex) return "done"
    if (index === activeIndex) return "working"
    return "queued"
  }

  return { activeIndex, elapsed, stateFor }
}

/** mm:ss.t — the clock the theatre counts on. */
export function formatElapsed(ms: number): string {
  const total = Math.max(0, ms)
  const minutes = Math.floor(total / 60000)
  const seconds = Math.floor((total % 60000) / 1000)
  const tenths = Math.floor((total % 1000) / 100)
  return (
    String(minutes).padStart(2, "0") +
    ":" +
    String(seconds).padStart(2, "0") +
    "." +
    tenths
  )
}
