import { useNavigate } from "react-router-dom"
import { motion } from "motion/react"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/Button"
import { Eyebrow } from "@/components/ui/Eyebrow"
import { SplitHeading } from "@/components/ui/SplitHeading"
import { StatusDot } from "@/components/ui/StatusDot"
import { GateStage } from "@/three/GateStage"
import { HERO_STATS, RUN_NO } from "@/lib/site"
import { EASE_OUT_EXPO } from "@/lib/motion"
import { useScrollToId } from "@/lib/hooks"

/** Charging the gate on hover ties the button to the thing it is describing. */
function chargeGate() {
  window.dispatchEvent(new CustomEvent("gate:charge"))
}

export function Hero() {
  const navigate = useNavigate()
  const scrollToId = useScrollToId()

  return (
    <section id="drop" className="relative min-h-svh overflow-hidden">
      {/* The scene bleeds off the right edge and sits behind everything. */}
      <div className="absolute inset-y-0 right-0 w-full lg:w-[64%]">
        <GateStage runNo={RUN_NO} className="size-full" />
      </div>

      {/* Scrims: the headline has to stay readable over a moving scene. */}
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-r from-canvas from-25% via-canvas/85 to-transparent lg:from-22% lg:via-canvas/60"
      />
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-t from-canvas via-transparent to-canvas/70"
      />

      <div className="relative z-10 mx-auto flex min-h-svh w-full max-w-[1560px] flex-col px-6 pt-28 lg:px-16 lg:pt-32">
        <div className="flex flex-1 flex-col justify-center py-10">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, ease: EASE_OUT_EXPO }}
          >
            <Eyebrow index="01">The Drop</Eyebrow>
          </motion.div>

          <SplitHeading
            as="h1"
            animateOnMount
            delay={0.15}
            className="mt-7 max-w-[16ch] text-[clamp(3rem,8.4vw,8.5rem)]"
            lines={[
              "Paste a link.",
              "Skip the form.",
              <>
                Own it in{" "}
                <span className="counter font-normal tracking-normal">
                  thirty seconds.
                </span>
              </>,
            ]}
          />

          <motion.p
            className="mt-9 max-w-xl text-base leading-relaxed text-dim lg:text-lg"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55, duration: 0.9, ease: EASE_OUT_EXPO }}
          >
            The drop clears while you are still typing your postcode. The Fashion
            Bot already has your address, your card and your size — it fills the
            entire checkout the moment you hand it a URL.
          </motion.p>

          <motion.div
            className="mt-11 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.68, duration: 0.9, ease: EASE_OUT_EXPO }}
          >
            <Button
              size="lg"
              onMouseEnter={chargeGate}
              onFocus={chargeGate}
              onClick={() => navigate("/login")}
              className="group"
            >
              Start a run
              <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Button>
            <Button size="lg" variant="outline" onClick={() => scrollToId("run")}>
              See how a run works
            </Button>
          </motion.div>

          <motion.p
            className="mono-label mt-8 flex flex-wrap items-center gap-x-5 gap-y-2 text-faint"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.85, duration: 0.9 }}
          >
            <span className="flex items-center gap-2">
              <StatusDot tone="live" />
              Two lanes live
            </span>
            <span>Setup takes two minutes</span>
            <span>Nothing runs without you</span>
          </motion.p>
        </div>

        {/* Readouts along the bottom of the frame. */}
        <motion.dl
          className="grid grid-cols-2 border-t border-line md:grid-cols-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 1, ease: EASE_OUT_EXPO }}
        >
          {HERO_STATS.map((stat, i) => (
            <div
              key={stat.label}
              className={
                "px-1 py-6 lg:py-8 " +
                (i > 0 ? "md:border-l md:border-line md:pl-8" : "")
              }
            >
              <dt className="mono-label text-faint">{stat.label}</dt>
              <dd className="display mt-2 text-4xl lg:text-5xl">
                {stat.value}
                {stat.unit && (
                  <span className="ml-0.5 font-mono text-base font-medium tracking-normal text-signal">
                    {stat.unit}
                  </span>
                )}
              </dd>
            </div>
          ))}
        </motion.dl>
      </div>
    </section>
  )
}
