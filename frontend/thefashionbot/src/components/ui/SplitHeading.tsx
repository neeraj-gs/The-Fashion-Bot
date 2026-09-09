import { motion } from "motion/react"
import { lineUp, stagger } from "@/lib/motion"
import { cn } from "@/lib/utils"

/**
 * The headline treatment: each line sits in its own clipping mask and slides up
 * from beneath it, one after another. Every display heading on the site uses
 * this, which is what makes the page feel like one instrument rather than a
 * stack of components.
 */
export function SplitHeading({
  lines,
  className,
  delay = 0,
  as: Tag = "h2",
  animateOnMount = false,
}: {
  lines: React.ReactNode[]
  className?: string
  delay?: number
  as?: "h1" | "h2" | "h3"
  animateOnMount?: boolean
}) {
  const trigger = animateOnMount
    ? { animate: "show" as const }
    : {
        whileInView: "show" as const,
        viewport: { once: true, margin: "0px 0px -10% 0px" } as const,
      }

  return (
    <Tag className={cn("display", className)}>
      <motion.span
        className="block"
        initial="hidden"
        variants={stagger(delay, 0.09)}
        {...trigger}
      >
        {lines.map((line, i) => (
          // Lines are a fixed authored list, so index keys are stable here.
          <span key={i} className="block overflow-hidden pb-[0.08em]">
            <motion.span className="block" variants={lineUp}>
              {line}
            </motion.span>
          </span>
        ))}
      </motion.span>
    </Tag>
  )
}
