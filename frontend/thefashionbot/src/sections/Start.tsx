import { useNavigate } from "react-router-dom"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/Button"
import { Eyebrow } from "@/components/ui/Eyebrow"
import { SplitHeading } from "@/components/ui/SplitHeading"
import { Reveal } from "@/components/ui/Reveal"
import { StatusDot } from "@/components/ui/StatusDot"

export function Start() {
  const navigate = useNavigate()

  return (
    <section
      id="start"
      aria-labelledby="start-label"
      className="grain relative overflow-hidden border-t border-line bg-void"
    >
      {/* A last glow from the gate, sitting under the closing line. */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 size-[46rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-signal/[0.09] blur-[130px]"
      />

      <div className="relative mx-auto w-full max-w-[1560px] px-6 py-28 lg:px-16 lg:py-44">
        <div className="flex items-center justify-between gap-6 pb-14">
          <Eyebrow index="08">
            <span id="start-label">Start</span>
          </Eyebrow>
          <div aria-hidden className="h-px flex-1 bg-line" />
          <p className="mono-label flex items-center gap-2 text-faint">
            <StatusDot tone="live" />
            Lanes open
          </p>
        </div>

        <SplitHeading
          className="max-w-[14ch] text-[clamp(2.75rem,8vw,8rem)]"
          lines={[
            "The next drop",
            "is not waiting",
            <>
              for{" "}
              <span className="counter font-normal tracking-normal">
                your typing.
              </span>
            </>,
          ]}
        />

        <Reveal delay={0.2}>
          <p className="mt-10 max-w-lg text-base leading-relaxed text-dim lg:text-lg">
            Two minutes of setup now, and every checkout after this one is a
            pasted link and thirty seconds of nothing to do.
          </p>
        </Reveal>

        <Reveal delay={0.3}>
          <div className="mt-12 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
            <Button size="lg" onClick={() => navigate("/login")} className="group">
              Build your loadout
              <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Button>
            <Button size="lg" variant="outline" onClick={() => navigate("/login")}>
              I already have an account
            </Button>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
