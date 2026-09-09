import * as THREE from "three"

/**
 * Every texture in the gate scene is drawn to a canvas at runtime, so the whole
 * hero ships with no image assets at all.
 */

const MONO = '600 20px "JetBrains Mono", ui-monospace, monospace'

/** Muted garment tones for the product panels streaming down the lane. */
const PANEL_TONES = [
  ["#8d7a61", "#4a3f32"],
  ["#7c7469", "#413c35"],
  ["#96604b", "#4d3128"],
  ["#6f6a60", "#3a3732"],
  ["#7d6b7a", "#42383f"],
  ["#a08a6c", "#544737"],
]

function ctx2d(w: number, h: number) {
  const canvas = document.createElement("canvas")
  canvas.width = w
  canvas.height = h
  const c = canvas.getContext("2d")
  if (!c) throw new Error("2D canvas context unavailable")
  return { canvas, c }
}

function finish(canvas: HTMLCanvasElement, srgb = true) {
  const tex = new THREE.CanvasTexture(canvas)
  if (srgb) tex.colorSpace = THREE.SRGBColorSpace
  tex.anisotropy = 4
  tex.needsUpdate = true
  return tex
}

/** A product card: image plate, a couple of text hairlines, a price block. */
export function makePanelTexture(variant: number): THREE.CanvasTexture {
  const W = 256
  const H = 358
  const { canvas, c } = ctx2d(W, H)
  const [light, dark] = PANEL_TONES[variant % PANEL_TONES.length]

  c.fillStyle = "#1c1c20"
  c.fillRect(0, 0, W, H)

  // The garment plate.
  const plate = c.createLinearGradient(0, 18, W, 250)
  plate.addColorStop(0, light)
  plate.addColorStop(1, dark)
  c.fillStyle = plate
  c.fillRect(16, 16, W - 32, 232)

  // A suggestion of a silhouette inside the plate.
  c.globalAlpha = 0.24
  c.fillStyle = "#EDE9E0"
  c.beginPath()
  c.moveTo(W / 2 - 44, 92)
  c.lineTo(W / 2 - 16, 74)
  c.lineTo(W / 2 + 16, 74)
  c.lineTo(W / 2 + 44, 92)
  c.lineTo(W / 2 + 30, 122)
  c.lineTo(W / 2 + 34, 226)
  c.lineTo(W / 2 - 34, 226)
  c.lineTo(W / 2 - 30, 122)
  c.closePath()
  c.fill()
  c.globalAlpha = 1

  // Metadata hairlines.
  c.fillStyle = "#6d685f"
  c.fillRect(16, 268, 150, 5)
  c.fillRect(16, 286, 96, 5)

  // Price block.
  c.fillStyle = "#98928a"
  c.fillRect(16, 314, 58, 12)

  // Card edge.
  c.strokeStyle = "rgba(237,233,224,0.3)"
  c.lineWidth = 2
  c.strokeRect(1, 1, W - 2, H - 2)

  return finish(canvas)
}

/** Soft radial falloff. Tinted per use and blended additively to fake bloom. */
export function makeGlowTexture(): THREE.CanvasTexture {
  const S = 128
  const { canvas, c } = ctx2d(S, S)
  const g = c.createRadialGradient(S / 2, S / 2, 0, S / 2, S / 2, S / 2)
  g.addColorStop(0, "rgba(255,255,255,1)")
  g.addColorStop(0.22, "rgba(255,255,255,0.55)")
  g.addColorStop(0.55, "rgba(255,255,255,0.13)")
  g.addColorStop(1, "rgba(255,255,255,0)")
  c.fillStyle = g
  c.fillRect(0, 0, S, S)
  return finish(canvas, false)
}

/** A single soft dot for the drifting motes. */
export function makeDotTexture(): THREE.CanvasTexture {
  const S = 64
  const { canvas, c } = ctx2d(S, S)
  const g = c.createRadialGradient(S / 2, S / 2, 0, S / 2, S / 2, S / 2)
  g.addColorStop(0, "rgba(255,255,255,0.9)")
  g.addColorStop(0.5, "rgba(255,255,255,0.18)")
  g.addColorStop(1, "rgba(255,255,255,0)")
  c.fillStyle = g
  c.fillRect(0, 0, S, S)
  return finish(canvas, false)
}

/**
 * The receipt tape. Drawn tall and tiled vertically so it can scroll forever;
 * redrawn whenever a new capture starts a new run block.
 */
export function makeReceiptTexture(runNo: string): THREE.CanvasTexture {
  const W = 320
  const H = 1024
  const { canvas, c } = ctx2d(W, H)

  c.fillStyle = "#e6e1d6"
  c.fillRect(0, 0, W, H)

  // Paper tooth, so the tape is not a flat swatch.
  c.globalAlpha = 0.05
  for (let i = 0; i < 900; i++) {
    c.fillStyle = Math.random() > 0.5 ? "#000" : "#fff"
    c.fillRect(Math.random() * W, Math.random() * H, 2, 2)
  }
  c.globalAlpha = 1

  c.font = MONO
  c.textBaseline = "top"

  const lines: [string, string][] = [
    ["#1a1a1a", "THE FASHION BOT"],
    ["#6b6862", "RUN " + runNo],
    ["rule", ""],
    ["#1a1a1a", "> OPEN LANE"],
    ["#1a1a1a", "> RESOLVE ITEM"],
    ["#1a1a1a", "> SIZE HELD"],
    ["#1a1a1a", "> ADD TO CART"],
    ["#1a1a1a", "> FILL SHIPPING"],
    ["#1a1a1a", "> FILL PAYMENT"],
    ["#1a1a1a", "> CONFIRM ORDER"],
    ["rule", ""],
    ["#c2310f", "CAPTURED"],
    ["#6b6862", "ELAPSED 00:27.4"],
    ["rule", ""],
  ]

  // Two identical blocks fill the tile so the scroll never shows a seam.
  const blockH = H / 2
  for (let block = 0; block < 2; block++) {
    let y = block * blockH + 22
    for (const [tone, text] of lines) {
      if (tone === "rule") {
        c.fillStyle = "#a8a49a"
        for (let x = 18; x < W - 18; x += 10) c.fillRect(x, y + 10, 5, 2)
        y += 30
        continue
      }
      c.fillStyle = tone
      c.fillText(text, 18, y)
      y += 30
    }
  }

  const tex = finish(canvas)
  tex.wrapS = THREE.RepeatWrapping
  tex.wrapT = THREE.RepeatWrapping
  return tex
}
