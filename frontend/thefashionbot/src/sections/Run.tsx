import { useRef } from "react"
import { motion, useScroll } from "motion/react"
import { SectionShell } from "@/components/ui/SectionShell"
import { SplitHeading } from "@/components/ui/SplitHeading"
import { Reveal } from "@/components/ui/Reveal"
import { RUN_STAGES } from "@/lib/site"

export function Run() {
  const track = useRef<HTMLDivElement>(null)

  // The spine fills as the stages pass the reading line.
  const { scrollYProgress } = useScroll({
    target: track,
    offset: ["start 70%", "end 85%"],
  })

  return (
    <SectionShell id="run" index="03" label="The Run" meta="Link in, order out">
      <div className="grid gap-y-16 lg:grid-cols-12 lg:gap-x-10">
        <div className="lg:col-span-4">
          <div className="lg:sticky lg:top-28">
            <SplitHeading
              className="text-[clamp(2.25rem,4.4vw,4.25rem)]"
              lines={[
                "Four stages",
                "between a link",
                <>
                  and{" "}
                  <span className="counter font-normal tracking-normal">
                    an order.
                  </span>
                </>,
              ]}
            />
            <Reveal delay={0.15}>
              <p className="mt-8 max-w-sm text-base leading-relaxed text-dim">
                You do the first one. The bot does the other three, in a real
                browser session, at a speed a person cannot type at.
              </p>
            </Reveal>
          </div>
        </div>

        <div ref={track} className="relative lg:col-span-7 lg:col-start-6">
          {/* The spine, and the vermilion fill that tracks your scroll. */}
          <div
            aria-hidden
            className="absolute left-0 top-0 hidden h-full w-px bg-line sm:block"
          >
            <motion.div
              className="h-full w-px origin-top bg-signal"
              style={{ scaleY: scrollYProgress }}
            />
          </div>

          <ol className="sm:pl-10">
            {RUN_STAGES.map((stage, i) => (
              <li key={stage.step}>
                <Reveal delay={i * 0.06}>
                  <div className="relative border-t border-line py-9">
                    <span
                      aria-hidden
                      className="absolute -left-10 top-[3.15rem] hidden h-px w-6 bg-line sm:block"
                    />

                    <div className="flex flex-wrap items-baseline gap-x-5 gap-y-2">
                      <span className="font-mono text-xs tracking-[0.2em] text-signal">
                        {stage.step}
                      </span>
                      <h3 className="display text-2xl sm:text-3xl">
                        {stage.title}
                      </h3>
                      <span className="mono-label ml-auto border border-line px-2.5 py-1 text-faint">
                        {stage.tag}
                      </span>
                    </div>

                    <p className="mt-4 max-w-xl text-sm leading-relaxed text-dim">
                      {stage.body}
                    </p>
                  </div>
                </Reveal>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </SectionShell>
  )
}
