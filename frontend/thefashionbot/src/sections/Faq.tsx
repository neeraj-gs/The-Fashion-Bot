import { useId, useState } from "react"
import { AnimatePresence, motion } from "motion/react"
import { Plus } from "lucide-react"
import { SectionShell } from "@/components/ui/SectionShell"
import { SplitHeading } from "@/components/ui/SplitHeading"
import { Reveal } from "@/components/ui/Reveal"
import { FAQ } from "@/lib/site"
import { EASE_OUT_EXPO } from "@/lib/motion"

export function Faq() {
  const [open, setOpen] = useState<number | null>(0)
  const base = useId()

  return (
    <SectionShell
      id="questions"
      index="07"
      label="Questions"
      meta="Answered plainly"
    >
      <div className="grid gap-y-14 lg:grid-cols-12 lg:gap-x-10">
        <div className="lg:col-span-4">
          <div className="lg:sticky lg:top-28">
            <SplitHeading
              className="text-[clamp(2.25rem,4.4vw,4.25rem)]"
              lines={[
                "Before you",
                <>
                  hand it a{" "}
                  <span className="counter font-normal tracking-normal">
                    link.
                  </span>
                </>,
              ]}
            />
          </div>
        </div>

        <div className="lg:col-span-7 lg:col-start-6">
          <div className="border-t border-line">
            {FAQ.map((item, i) => {
              const isOpen = open === i
              const panelId = base + "-panel-" + i

              return (
                <Reveal key={item.q} delay={i * 0.04}>
                  <div className="border-b border-line">
                    <h3>
                      <button
                        onClick={() => setOpen(isOpen ? null : i)}
                        aria-expanded={isOpen}
                        aria-controls={panelId}
                        className="group flex w-full items-start gap-6 py-7 text-left"
                      >
                        <span className="mono-label pt-1.5 text-faint transition-colors duration-300 group-hover:text-signal">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <span
                          className={
                            "display flex-1 text-lg transition-colors duration-300 sm:text-xl " +
                            (isOpen ? "text-bone" : "text-dim group-hover:text-bone")
                          }
                        >
                          {item.q}
                        </span>
                        <Plus
                          aria-hidden
                          className={
                            "mt-1 size-4 shrink-0 transition-[transform,color] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] " +
                            (isOpen
                              ? "rotate-45 text-signal"
                              : "text-mute group-hover:text-bone")
                          }
                        />
                      </button>
                    </h3>

                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          id={panelId}
                          key="panel"
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.5, ease: EASE_OUT_EXPO }}
                          className="overflow-hidden"
                        >
                          <p className="max-w-2xl pb-8 pl-11 pr-8 text-sm leading-relaxed text-dim">
                            {item.a}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </Reveal>
              )
            })}
          </div>
        </div>
      </div>
    </SectionShell>
  )
}
