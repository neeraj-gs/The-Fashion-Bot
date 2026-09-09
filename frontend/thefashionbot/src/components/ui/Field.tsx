import * as React from "react"
import { ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

const CONTROL = [
  "w-full h-12 bg-void border border-line px-4",
  "font-mono text-sm text-bone tracking-[0.02em]",
  "placeholder:text-faint placeholder:tracking-[0.08em]",
  "transition-colors duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]",
  "hover:border-line-strong",
  "focus:border-signal focus:outline-none",
  "disabled:opacity-40 disabled:pointer-events-none",
].join(" ")

function Label({
  htmlFor,
  children,
  required,
  aside,
}: {
  htmlFor: string
  children: React.ReactNode
  required?: boolean
  aside?: React.ReactNode
}) {
  return (
    <label htmlFor={htmlFor} className="mb-2 flex items-baseline justify-between gap-4">
      <span className="mono-label">
        {children}
        {required && <span className="text-signal"> *</span>}
      </span>
      {aside && <span className="mono-label text-faint">{aside}</span>}
    </label>
  )
}

function Foot({ error, hint }: { error?: string; hint?: string }) {
  if (error) {
    return (
      <p role="alert" className="mono-sm mt-2 text-signal">
        {error}
      </p>
    )
  }
  if (hint) return <p className="mono-sm mt-2 text-faint">{hint}</p>
  return null
}

export interface FieldProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> {
  label: string
  error?: string
  hint?: string
  aside?: React.ReactNode
  icon?: React.ReactNode
  wrapClassName?: string
}

export const Field = React.forwardRef<HTMLInputElement, FieldProps>(
  (
    { label, error, hint, aside, icon, id, required, className, wrapClassName, ...props },
    ref
  ) => {
    const autoId = React.useId()
    const fieldId = id ?? autoId

    return (
      <div className={wrapClassName}>
        <Label htmlFor={fieldId} required={required} aside={aside}>
          {label}
        </Label>
        <div className="relative">
          {icon && (
            <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-faint">
              {icon}
            </span>
          )}
          <input
            ref={ref}
            id={fieldId}
            required={required}
            aria-invalid={error ? true : undefined}
            className={cn(
              CONTROL,
              icon && "pl-11",
              error && "border-signal/70",
              className
            )}
            {...props}
          />
        </div>
        <Foot error={error} hint={hint} />
      </div>
    )
  }
)
Field.displayName = "Field"

export interface SelectFieldProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string
  error?: string
  hint?: string
  wrapClassName?: string
}

export const SelectField = React.forwardRef<HTMLSelectElement, SelectFieldProps>(
  (
    { label, error, hint, id, required, className, wrapClassName, children, ...props },
    ref
  ) => {
    const autoId = React.useId()
    const fieldId = id ?? autoId

    return (
      <div className={wrapClassName}>
        <Label htmlFor={fieldId} required={required}>
          {label}
        </Label>
        <div className="relative">
          <select
            ref={ref}
            id={fieldId}
            required={required}
            aria-invalid={error ? true : undefined}
            className={cn(
              CONTROL,
              "cursor-pointer appearance-none pr-11",
              error && "border-signal/70",
              className
            )}
            {...props}
          >
            {children}
          </select>
          <ChevronDown
            aria-hidden
            className="pointer-events-none absolute right-4 top-1/2 size-4 -translate-y-1/2 text-mute"
          />
        </div>
        <Foot error={error} hint={hint} />
      </div>
    )
  }
)
SelectField.displayName = "SelectField"
