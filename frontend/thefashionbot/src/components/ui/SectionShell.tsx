import { Eyebrow } from "@/components/ui/Eyebrow"
import { cn } from "@/lib/utils"

/**
 * Every landing section is a numbered plate in the same manual: a full-bleed
 * hairline rule, the section index on the left, a channel readout on the right.
 */
export function SectionShell({
  id,
  index,
  label,
  meta,
  children,
  className,
  contentClassName,
}: {
  id: string
  index: string
  label: string
  meta?: string
  children: React.ReactNode
  className?: string
  contentClassName?: string
}) {
  return (
    <section
      id={id}
      aria-labelledby={id + "-label"}
      className={cn("relative border-t border-line", className)}
    >
      <div className="mx-auto w-full max-w-[1560px] px-6 lg:px-16">
        <div className="flex items-center justify-between gap-6 py-5">
          <Eyebrow index={index} className="shrink-0">
            <span id={id + "-label"}>{label}</span>
          </Eyebrow>
          <div aria-hidden className="h-px flex-1 bg-line" />
          {meta && <p className="mono-label shrink-0 text-faint">{meta}</p>}
        </div>

        <div className={cn("pb-24 pt-8 lg:pb-36 lg:pt-14", contentClassName)}>
          {children}
        </div>
      </div>
    </section>
  )
}
