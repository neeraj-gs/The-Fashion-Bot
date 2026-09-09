import { motion } from "motion/react"
import { AlertCircle, ArrowRight, Check, Loader2, RotateCcw } from "lucide-react"
import { Button } from "@/components/ui/Button"
import { Eyebrow } from "@/components/ui/Eyebrow"
import { StatusDot } from "@/components/ui/StatusDot"
import { GateStage } from "@/three/GateStage"
import {
  formatElapsed,
  useRunTimeline,
  type RunOutcome,
  type RunStage,
  type StageState,
} from "@/components/runtheatre/useRunTimeline"
import { RUN_NO } from "@/lib/site"
import { EASE_OUT_EXPO } from "@/lib/motion"
import { cn } from "@/lib/utils"

const STATE_TONE: Record<StageState, string> = {
  queued: "text-faint",
  working: "text-bone",
  done: "text-dim",
  failed: "text-signal",
}

function StageMark({ state }: { state: StageState }) {
  if (state === "done") {
    return (
      <span className="grid size-5 place-items-center border border-jade/60 text-jade">
        <Check className="size-3" />
      </span>
    )
  }
  if (state === "working") {
    return (
      <span className="grid size-5 place-items-center border border-signal text-signal">
        <Loader2 className="size-3 animate-spin" />
      </span>
    )
  }
  if (state === "failed") {
    return (
      <span className="grid size-5 place-items-center border border-signal bg-signal-wash text-signal">
        <AlertCircle className="size-3" />
      </span>
    )
  }
  return <span className="grid size-5 place-items-center border border-line" />
}

/**
 * Full-screen theatre for a run in progress. Replaces what used to be a spinner
 * in a modal with four decorative pulsing dots.
 */
export function RunTheatre({
  stages,
  running,
  outcome,
  message,
  laneName,
  onRetry,
  onDone,
}: {
  stages: RunStage[]
  running: boolean
  outcome: RunOutcome
  message: string
  laneName: string
  onRetry: () => void
  onDone: () => void
}) {
  const { elapsed, stateFor } = useRunTimeline(stages, running, outcome)
  const settled = outcome !== null

  return (
    <motion.div
      className="fixed inset-0 z-50 bg-canvas"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, ease: EASE_OUT_EXPO }}
      role="dialog"
      aria-modal="true"
      aria-label="Run in progress"
    >
      <div className="grid h-full lg:grid-cols-[minmax(0,28rem)_1fr]">
        {/* --- the log --- */}
        <div className="relative z-10 flex h-full flex-col overflow-y-auto border-line bg-canvas p-7 sm:px-10 sm:py-8 lg:border-r">
          <div className="flex items-center justify-between gap-4">
            <Eyebrow index="RUN">{laneName}</Eyebrow>
            <p className="mono-label flex items-center gap-2 text-faint">
              <StatusDot
                tone={outcome === "error" ? "down" : outcome ? "idle" : "live"}
              />
              {RUN_NO}
            </p>
          </div>

          <p
            className="display mt-7 text-[clamp(2.5rem,7vw,4rem)] tabular-nums"
            aria-live="off"
          >
            {formatElapsed(elapsed)}
          </p>
          <p className="mono-label mt-2 text-faint">Elapsed</p>

          <ol className="mt-8 border-t border-line">
            {stages.map((stage, i) => {
              const state = stateFor(i)
              return (
                <li
                  key={stage.id}
                  className="flex items-center gap-4 border-b border-line py-3"
                >
                  <StageMark state={state} />
                  <span
                    className={cn(
                      "font-mono text-xs uppercase tracking-[0.14em] transition-colors duration-500",
                      STATE_TONE[state]
                    )}
                  >
                    {stage.label}
                  </span>
                  {state === "working" && (
                    <span className="mono-label ml-auto text-signal">Working</span>
                  )}
                </li>
              )
            })}
          </ol>

          {/* The honest caveat: the backend returns one result, not a stream. */}
          <p className="mono-sm mt-5 leading-relaxed text-faint">
            Stage timing is estimated. The bot reports the final outcome, not
            per-stage progress, so treat the highlighted stage as a guide.
          </p>

          <div className="mt-auto pt-8">
            {settled && (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: EASE_OUT_EXPO }}
              >
                <div
                  className={cn(
                    "border p-6",
                    outcome === "success"
                      ? "border-jade/40 bg-jade-wash"
                      : "border-signal/40 bg-signal-wash"
                  )}
                  role="alert"
                >
                  <p
                    className={cn(
                      "mono-label",
                      outcome === "success" ? "text-jade" : "text-signal"
                    )}
                  >
                    {outcome === "success" ? "Order confirmed" : "Run stopped"}
                  </p>
                  <p className="mt-3 text-sm leading-relaxed text-bone">
                    {message}
                  </p>
                </div>

                <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                  <Button onClick={onRetry} variant="outline" className="group">
                    <RotateCcw className="size-4" />
                    {outcome === "success" ? "Another run" : "Try again"}
                  </Button>
                  <Button onClick={onDone} className="group">
                    Control room
                    <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </Button>
                </div>
              </motion.div>
            )}
          </div>
        </div>

        {/* --- the gate, staged close --- */}
        <div className="relative hidden lg:block">
          <GateStage runNo={RUN_NO} mode="theatre" className="size-full" />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-gradient-to-r from-canvas via-transparent to-transparent"
          />
        </div>
      </div>
    </motion.div>
  )
}
