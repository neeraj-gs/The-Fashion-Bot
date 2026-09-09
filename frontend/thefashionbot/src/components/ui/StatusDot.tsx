import { cn } from "@/lib/utils"

type Tone = "live" | "idle" | "warn" | "down"

const TONE: Record<Tone, string> = {
  live: "text-jade",
  idle: "text-faint",
  warn: "text-warn",
  down: "text-signal",
}

export function StatusDot({
  tone = "live",
  pulse = true,
  className,
}: {
  tone?: Tone
  pulse?: boolean
  className?: string
}) {
  return (
    <span
      aria-hidden
      className={cn(
        "inline-block size-1.5 rounded-full bg-current",
        TONE[tone],
        pulse && tone === "live" && "pulse-dot",
        className
      )}
    />
  )
}
