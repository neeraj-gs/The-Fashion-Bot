/**
 * The composed still. Shown while the WebGL bundle streams in, and shown
 * permanently when there is no WebGL or the visitor asked for reduced motion.
 * Pure SVG, so it costs nothing and always renders.
 */
export function GatePoster({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 800 620"
      role="img"
      aria-label="A conveyor of product panels running through a lit capture gate, with a receipt spooling out beneath it."
      className={className}
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <radialGradient id="gp-haze" cx="50%" cy="46%" r="42%">
          <stop offset="0%" stopColor="#ff3d18" stopOpacity="0.34" />
          <stop offset="60%" stopColor="#ff3d18" stopOpacity="0.07" />
          <stop offset="100%" stopColor="#ff3d18" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="gp-panel" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#3a3129" />
          <stop offset="100%" stopColor="#1a1713" />
        </linearGradient>
        <linearGradient id="gp-fog" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0b0b0c" stopOpacity="1" />
          <stop offset="45%" stopColor="#0b0b0c" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="gp-tape" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#e6e1d6" />
          <stop offset="100%" stopColor="#8d8a82" />
        </linearGradient>
      </defs>

      <rect width="800" height="620" fill="#0b0b0c" />
      <ellipse cx="400" cy="290" rx="330" ry="250" fill="url(#gp-haze)" />

      {/* Lane rails converging into the fog. */}
      <path d="M250 560 L370 210" stroke="#ede9e0" strokeOpacity="0.13" strokeWidth="1.5" />
      <path d="M550 560 L430 210" stroke="#ede9e0" strokeOpacity="0.13" strokeWidth="1.5" />

      {/* Panels receding up the lane. */}
      {[
        { x: 352, y: 214, w: 44, h: 60, o: 0.35 },
        { x: 414, y: 232, w: 56, h: 76, o: 0.5 },
        { x: 316, y: 262, w: 72, h: 98, o: 0.68 },
        { x: 452, y: 306, w: 96, h: 130, o: 0.85 },
      ].map((p) => (
        <g key={p.x} opacity={p.o}>
          <rect x={p.x} y={p.y} width={p.w} height={p.h} fill="url(#gp-panel)" />
          <rect
            x={p.x}
            y={p.y}
            width={p.w}
            height={p.h}
            fill="none"
            stroke="#ede9e0"
            strokeOpacity="0.16"
          />
        </g>
      ))}

      {/* The gate. */}
      <g>
        <rect x="212" y="176" width="376" height="256" fill="none" stroke="#191a1d" strokeWidth="12" />
        <rect x="222" y="186" width="356" height="236" fill="none" stroke="#ff3d18" strokeWidth="2.5" />
        {[
          [212, 176, 1, 1],
          [588, 176, -1, 1],
          [212, 432, 1, -1],
          [588, 432, -1, -1],
        ].map(([x, y, sx, sy], i) => (
          <g key={i} stroke="#ede9e0" strokeWidth="3">
            <line x1={x} y1={y} x2={x + sx * 34} y2={y} />
            <line x1={x} y1={y} x2={x} y2={y + sy * 34} />
          </g>
        ))}
      </g>

      {/* The captured panel, held in the reticle. */}
      <g>
        <rect x="352" y="238" width="96" height="132" fill="url(#gp-panel)" />
        <rect x="352" y="238" width="96" height="132" fill="#ff3d18" fillOpacity="0.22" />
        {[
          [338, 224, 1, 1],
          [462, 224, -1, 1],
          [338, 384, 1, -1],
          [462, 384, -1, -1],
        ].map(([x, y, sx, sy], i) => (
          <g key={i} stroke="#ff3d18" strokeWidth="2.5">
            <line x1={x} y1={y} x2={x + sx * 22} y2={y} />
            <line x1={x} y1={y} x2={x} y2={y + sy * 22} />
          </g>
        ))}
      </g>

      {/* The receipt spooling out below, curling at the end. */}
      <path
        d="M362 440 L362 540 Q362 592 408 588 Q446 584 436 552"
        fill="none"
        stroke="url(#gp-tape)"
        strokeWidth="52"
        strokeLinecap="butt"
        opacity="0.92"
      />
      {[456, 474, 492, 510].map((y) => (
        <line
          key={y}
          x1="344"
          y1={y}
          x2="380"
          y2={y}
          stroke="#1a1a1a"
          strokeOpacity="0.55"
          strokeWidth="3"
        />
      ))}

      <rect width="800" height="240" fill="url(#gp-fog)" />
    </svg>
  )
}
