import { SectionShell } from "@/components/ui/SectionShell"
import { SplitHeading } from "@/components/ui/SplitHeading"
import { Reveal } from "@/components/ui/Reveal"
import { StatusDot } from "@/components/ui/StatusDot"
import { LANES } from "@/lib/site"

export function Lanes() {
  return (
    <SectionShell
      id="lanes"
      index="05"
      label="The Lanes"
      meta="Two live, three in build"
    >
      <div className="grid gap-y-14 lg:grid-cols-12 lg:gap-x-10">
        <div className="lg:col-span-5">
          <SplitHeading
            className="text-[clamp(2.25rem,4.4vw,4.25rem)]"
            lines={[
              "Every store is",
              <>
                its own{" "}
                <span className="counter font-normal tracking-normal">
                  machine.
                </span>
              </>,
            ]}
          />
        </div>
        <div className="lg:col-span-6 lg:col-start-7">
          <Reveal delay={0.1}>
            <p className="max-w-lg text-base leading-relaxed text-dim">
              A lane is a store the bot knows how to drive: where the size
              selector sits, what the cart does, which button confirms. Building
              one takes care, so they arrive one at a time rather than all at
              once.
            </p>
          </Reveal>
        </div>
      </div>

      <div className="mt-16 border-t border-line">
        {LANES.map((lane, i) => {
          const live = lane.status === "live"
          return (
            <Reveal key={lane.name} delay={i * 0.05}>
              <div
                className={
                  "group grid grid-cols-[2.5rem_1fr_auto] items-center gap-x-5 border-b border-line py-7 transition-colors duration-500 sm:grid-cols-[3.5rem_1fr_1fr_auto] sm:gap-x-8 " +
                  (live ? "hover:bg-surface" : "opacity-55")
                }
              >
                <span className="mono-label text-faint">
                  {String(i + 1).padStart(2, "0")}
                </span>

                <div>
                  <h3 className="display text-xl sm:text-2xl">{lane.name}</h3>
                  <p className="mono-sm mt-1.5 text-faint">{lane.domain}</p>
                </div>

                <p className="col-span-3 text-sm text-dim sm:col-span-1 sm:col-start-3">
                  {lane.note}
                </p>

                <span
                  className={
                    "mono-label col-start-3 row-start-1 flex items-center gap-2 justify-self-end border px-3 py-1.5 sm:col-start-4 " +
                    (live
                      ? "border-jade/40 text-jade"
                      : "border-line text-faint")
                  }
                >
                  <StatusDot tone={live ? "live" : "idle"} />
                  {live ? "Live" : "In build"}
                </span>
              </div>
            </Reveal>
          )
        })}
      </div>
    </SectionShell>
  )
}
