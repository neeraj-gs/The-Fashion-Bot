import { cn } from "@/lib/utils"

export interface SegmentedOption<T extends string> {
  value: T
  label: string
  disabled?: boolean
}

/**
 * A hairline segmented control. Used for login/signup, garment size and the
 * settings tabs — anywhere a native select would have read as a form rather
 * than an instrument. Arrow keys move between options.
 */
export function Segmented<T extends string>({
  options,
  value,
  onChange,
  label,
  className,
}: {
  options: SegmentedOption<T>[]
  value: T | ""
  onChange: (value: T) => void
  label: string
  className?: string
}) {
  const enabled = options.filter((o) => !o.disabled)

  const move = (dir: 1 | -1) => {
    if (enabled.length === 0) return
    const at = enabled.findIndex((o) => o.value === value)
    const next = enabled[(at + dir + enabled.length) % enabled.length]
    onChange(next.value)
  }

  return (
    <div
      role="radiogroup"
      aria-label={label}
      className={cn("flex flex-wrap border border-line bg-void", className)}
      onKeyDown={(e) => {
        if (e.key === "ArrowRight" || e.key === "ArrowDown") {
          e.preventDefault()
          move(1)
        } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
          e.preventDefault()
          move(-1)
        }
      }}
    >
      {options.map((option) => {
        const selected = option.value === value
        const isFirstEnabled = enabled.length > 0 && enabled[0].value === option.value
        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={selected}
            disabled={option.disabled}
            tabIndex={selected || (!value && isFirstEnabled) ? 0 : -1}
            onClick={() => onChange(option.value)}
            className={cn(
              "min-w-14 flex-1 border-r border-line px-4 py-3 last:border-r-0",
              "font-mono text-[11px] uppercase tracking-[0.14em]",
              "transition-colors duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]",
              "focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-signal",
              selected
                ? "bg-signal text-[#170502]"
                : "text-mute hover:bg-raised hover:text-bone",
              option.disabled && "pointer-events-none opacity-30"
            )}
          >
            {option.label}
          </button>
        )
      })}
    </div>
  )
}
