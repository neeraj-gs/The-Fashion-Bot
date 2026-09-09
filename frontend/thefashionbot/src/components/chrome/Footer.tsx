import { useNavigate } from "react-router-dom"
import { ArrowUp } from "lucide-react"
import { Mark } from "@/components/chrome/Mark"
import { StatusDot } from "@/components/ui/StatusDot"
import { LANES, RUN_NO, SECTIONS } from "@/lib/site"
import { useScrollToId } from "@/lib/hooks"

export function Footer() {
  const navigate = useNavigate()
  const scrollToId = useScrollToId()
  const year = new Date().getFullYear()

  return (
    <footer className="relative border-t border-line bg-void">
      <div className="mx-auto w-full max-w-[1560px] px-6 lg:px-16">
        {/* The wordmark, set as large as the column allows. */}
        <div className="overflow-hidden border-b border-line py-10 lg:py-14">
          <p className="display whitespace-nowrap text-[clamp(2rem,8.4vw,9rem)] leading-[0.82] text-bone/[0.07]">
            THE FASHION BOT
          </p>
        </div>

        <div className="grid gap-12 py-14 lg:grid-cols-4 lg:gap-8">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2.5">
              <Mark />
              <span className="font-display text-sm font-extrabold uppercase tracking-[0.14em] text-bone">
                The Fashion Bot
              </span>
            </div>
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-dim">
              Save your loadout once. Paste a product link. The bot clears the
              checkout while the drop is still there.
            </p>
            <p className="mono-label mt-6 flex items-center gap-2 text-faint">
              <StatusDot tone="live" />
              All lanes up &middot; Run no. {RUN_NO}
            </p>
          </div>

          <nav aria-label="Sections">
            <p className="mono-label mb-5 text-faint">Index</p>
            <ul className="space-y-3">
              {SECTIONS.map((section) => (
                <li key={section.id}>
                  <button
                    onClick={() => scrollToId(section.id)}
                    className="group flex items-center gap-3 text-sm text-dim transition-colors hover:text-bone"
                  >
                    <span className="font-mono text-[10px] text-faint transition-colors group-hover:text-signal">
                      {section.index}
                    </span>
                    {section.label}
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <p className="mono-label mb-5 text-faint">Lanes</p>
            <ul className="space-y-3">
              {LANES.map((lane) => (
                <li
                  key={lane.name}
                  className="flex items-center justify-between gap-4 text-sm text-dim"
                >
                  {lane.name}
                  <span
                    className={
                      "mono-label " +
                      (lane.status === "live" ? "text-jade" : "text-faint")
                    }
                  >
                    {lane.status === "live" ? "Live" : "Soon"}
                  </span>
                </li>
              ))}
            </ul>

            <button
              onClick={() => navigate("/login")}
              className="mono-label mt-8 border-b border-signal pb-1 text-signal transition-colors hover:text-bone hover:border-bone"
            >
              Start a run &rarr;
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-4 border-t border-line py-7 sm:flex-row sm:items-center sm:justify-between">
          <p className="mono-label text-faint">
            &copy; {year} The Fashion Bot &middot; All runs are yours
          </p>
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="mono-label flex items-center gap-2 text-mute transition-colors hover:text-bone"
          >
            Back to top
            <ArrowUp className="size-3.5" />
          </button>
        </div>
      </div>
    </footer>
  )
}
