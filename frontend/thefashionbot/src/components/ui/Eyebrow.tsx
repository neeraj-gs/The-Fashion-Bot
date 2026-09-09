import { cn } from "@/lib/utils"

/**
 * The mono micro-label that sits above every heading and beside every readout.
 * `index` renders the section numeral in vermilion, the way a manual would.
 */
export function Eyebrow({
  index,
  children,
  className,
}: {
  index?: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <p className={cn("mono-label flex items-center gap-2", className)}>
      {index && <span className="text-signal">{index}</span>}
      {index && <span className="text-faint">·</span>}
      <span>{children}</span>
    </p>
  )
}
