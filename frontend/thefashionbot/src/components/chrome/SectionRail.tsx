import { useMemo } from "react"
import { SECTIONS } from "@/lib/site"
import { useActiveSection, useScrollToId } from "@/lib/hooks"

/**
 * The fixed spine down the left edge: a numbered index of the page that tracks
 * where you are. Hidden below lg, where the top bar's menu takes over.
 */
export function SectionRail() {
  const ids = useMemo(() => SECTIONS.map((s) => s.id), [])
  const active = useActiveSection(ids)
  const scrollToId = useScrollToId()

  return (
    <nav
      aria-label="Page sections"
      className="fixed inset-y-0 left-0 z-40 hidden w-14 flex-col items-center border-r border-line bg-canvas/60 pt-20 backdrop-blur-sm lg:flex"
    >
      <ul className="flex flex-col items-center gap-1">
        {SECTIONS.map((section) => {
          const isActive = active === section.id
          return (
            <li key={section.id}>
              <button
                onClick={() => scrollToId(section.id)}
                aria-current={isActive ? "true" : undefined}
                className="group flex w-14 flex-col items-center gap-2 py-3"
              >
                <span
                  className={
                    "font-mono text-[10px] tracking-[0.1em] transition-colors duration-500 " +
                    (isActive
                      ? "text-signal"
                      : "text-faint group-hover:text-mute")
                  }
                >
                  {section.index}
                </span>

                <span
                  className={
                    "font-mono text-[10px] uppercase tracking-[0.22em] [writing-mode:vertical-rl] transition-colors duration-500 " +
                    (isActive ? "text-bone" : "text-faint group-hover:text-mute")
                  }
                >
                  {section.rail}
                </span>

                <span
                  aria-hidden
                  className={
                    "h-px transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] " +
                    (isActive ? "w-6 bg-signal" : "w-2.5 bg-line-strong")
                  }
                />
              </button>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
