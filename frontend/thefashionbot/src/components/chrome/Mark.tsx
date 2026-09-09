import { cn } from "@/lib/utils"

/**
 * The gate, reduced to a mark: a frame with a captured panel inside it and two
 * ticks showing the lane running through.
 */
export function Mark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      aria-hidden
      className={cn("size-7 shrink-0", className)}
    >
      <rect x="4" y="8.5" width="24" height="15" className="fill-none stroke-signal" strokeWidth="1.75" />
      <rect x="10" y="14" width="12" height="4" className="fill-signal" />
      <rect x="3" y="3.5" width="6" height="1.75" className="fill-bone" />
      <rect x="23" y="26.75" width="6" height="1.75" className="fill-bone" />
    </svg>
  )
}

export function Wordmark({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "font-display text-sm font-extrabold uppercase tracking-[0.14em] text-bone",
        className
      )}
    >
      The Fashion Bot
    </span>
  )
}
