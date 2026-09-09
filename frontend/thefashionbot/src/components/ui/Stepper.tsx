import { Minus, Plus } from "lucide-react"

/** Quantity control. A number input dressed as a piece of hardware. */
export function Stepper({
  value,
  onChange,
  min = 1,
  max = 10,
  label,
}: {
  value: number
  onChange: (next: number) => void
  min?: number
  max?: number
  label: string
}) {
  const clamp = (n: number) => Math.min(max, Math.max(min, n))

  return (
    <div className="flex h-12 w-full items-stretch border border-line bg-void">
      <button
        type="button"
        aria-label={"Decrease " + label}
        disabled={value <= min}
        onClick={() => onChange(clamp(value - 1))}
        className="grid w-12 place-items-center border-r border-line text-mute transition-colors hover:bg-raised hover:text-bone disabled:pointer-events-none disabled:opacity-30"
      >
        <Minus className="size-4" />
      </button>

      <input
        type="number"
        aria-label={label}
        value={value}
        min={min}
        max={max}
        onChange={(e) => onChange(clamp(parseInt(e.target.value, 10) || min))}
        className="flex-1 bg-transparent text-center font-mono text-lg text-bone focus:outline-none"
      />

      <button
        type="button"
        aria-label={"Increase " + label}
        disabled={value >= max}
        onClick={() => onChange(clamp(value + 1))}
        className="grid w-12 place-items-center border-l border-line text-mute transition-colors hover:bg-raised hover:text-bone disabled:pointer-events-none disabled:opacity-30"
      >
        <Plus className="size-4" />
      </button>
    </div>
  )
}
