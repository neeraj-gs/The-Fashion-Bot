import type { Variants } from "motion/react"

/** Shared easing curves. Tuples, so they satisfy motion's cubic-bezier type. */
export const EASE_OUT_EXPO: [number, number, number, number] = [0.16, 1, 0.3, 1]
export const EASE_OUT_QUART: [number, number, number, number] = [0.25, 1, 0.5, 1]
export const EASE_IN_OUT_QUART: [number, number, number, number] = [0.76, 0, 0.24, 1]

/** Content rises into place. The house transition. */
export const riseIn: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.85, ease: EASE_OUT_EXPO },
  },
}

/** Same, but for wide blocks that should feel heavier. */
export const riseInSlow: Variants = {
  hidden: { opacity: 0, y: 40 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 1.1, ease: EASE_OUT_EXPO },
  },
}

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.9, ease: EASE_OUT_QUART } },
}

/** A hairline that draws itself from the left. */
export const drawLine: Variants = {
  hidden: { scaleX: 0 },
  show: {
    scaleX: 1,
    transition: { duration: 1.2, ease: EASE_OUT_EXPO },
  },
}

/** Parent that releases children one after another. */
export function stagger(delayChildren = 0, staggerChildren = 0.07): Variants {
  return {
    hidden: {},
    show: { transition: { delayChildren, staggerChildren } },
  }
}

/** Headline lines that clip up from below a mask. */
export const lineUp: Variants = {
  hidden: { y: "110%" },
  show: {
    y: "0%",
    transition: { duration: 1, ease: EASE_OUT_EXPO },
  },
}
