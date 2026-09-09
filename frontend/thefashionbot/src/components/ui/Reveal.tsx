import { motion, type Variants } from "motion/react"
import { EASE_OUT_EXPO } from "@/lib/motion"

const VIEWPORT = { once: true, margin: "0px 0px -12% 0px" } as const

function rise(delay: number, distance: number): Variants {
  return {
    hidden: { opacity: 0, y: distance },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.9, ease: EASE_OUT_EXPO, delay },
    },
  }
}

/** Scroll reveal. The single motion wrapper the whole site uses. */
export function Reveal({
  children,
  className,
  delay = 0,
  distance = 24,
}: {
  children: React.ReactNode
  className?: string
  delay?: number
  distance?: number
}) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={VIEWPORT}
      variants={rise(delay, distance)}
    >
      {children}
    </motion.div>
  )
}

/** A hairline rule that draws itself in from the left as it enters. */
export function RuleReveal({ className }: { className?: string }) {
  return (
    <motion.div
      aria-hidden
      className={"h-px origin-left bg-line " + (className ?? "")}
      initial={{ scaleX: 0 }}
      whileInView={{ scaleX: 1 }}
      viewport={VIEWPORT}
      transition={{ duration: 1.2, ease: EASE_OUT_EXPO }}
    />
  )
}
