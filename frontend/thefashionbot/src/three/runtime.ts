/**
 * Shared mutable state for the gate scene.
 *
 * None of this lives in React state: it changes every frame, and re-rendering
 * the tree sixty times a second would cost far more than the scene itself.
 * Parts write to it and read from it inside useFrame.
 */
export interface GateRuntime {
  /** The panel currently being captured, tracked while the reticle holds it. */
  capture: {
    index: number
    at: number
    active: boolean
    x: number
    y: number
    z: number
  }
  /** Spikes to 1 on capture, decays. Drives the gate flare and the light bar. */
  flash: number
  /** Total captures this session. The receipt advances a block on each one. */
  captures: number
  /** Hero scroll progress, 0 at rest to 1 once the hero has left. */
  scroll: number
  /** Smoothed pointer in [-1, 1]. */
  pointer: { x: number; y: number }
  /** Set when the visitor asked for reduced motion; parts hold their pose. */
  reduced: boolean
}

export function createGateRuntime(reduced: boolean): GateRuntime {
  return {
    capture: { index: -1, at: -999, active: false, x: 0, y: 0.95, z: 0 },
    flash: 0,
    captures: 0,
    scroll: 0,
    pointer: { x: 0, y: 0 },
    reduced,
  }
}

/** Geometry of the lane, shared by the parts that have to line up on it. */
export const LANE = {
  loop: 30,
  startZ: -26,
  speed: 2.35,
  gateZ: -2,
  panelY: 0.95,
  panelW: 1.34,
  panelH: 1.88,
}

/** How long the reticle holds a panel after locking on, in seconds. */
export const HOLD = 1.15

/* -------------------------------------------------------------------------- */
/* Quality tiers                                                              */
/*                                                                            */
/* These live here, away from the scene module, so the components that pick a  */
/* tier can import them without pulling three.js into the main bundle.         */
/* -------------------------------------------------------------------------- */

export type SceneMode = "hero" | "theatre"

export interface SceneQuality {
  panels: number
  motes: number
  reflective: boolean
  dpr: [number, number]
}

export const QUALITY: Record<"high" | "low", SceneQuality> = {
  high: { panels: 12, motes: 300, reflective: true, dpr: [1, 1.8] },
  low: { panels: 8, motes: 120, reflective: false, dpr: [1, 1.4] },
}
