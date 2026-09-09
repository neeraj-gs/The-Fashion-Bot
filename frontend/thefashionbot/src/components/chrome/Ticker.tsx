import { TICKER } from "@/lib/site"

function Run({ ariaHidden }: { ariaHidden?: boolean }) {
  return (
    <div
      aria-hidden={ariaHidden}
      className="flex shrink-0 items-center gap-10 pr-10"
    >
      {TICKER.map((item) => (
        <span key={item} className="flex shrink-0 items-center gap-10">
          <span className="mono-label whitespace-nowrap text-mute">{item}</span>
          <span aria-hidden className="text-[8px] text-signal">
            &#9670;
          </span>
        </span>
      ))}
    </div>
  )
}

/** The strip that runs beneath the hero. Two identical runs, translated -50%. */
export function Ticker() {
  return (
    <div className="relative overflow-hidden border-y border-line bg-void py-3.5">
      <div className="marquee-track flex w-max">
        <Run />
        <Run ariaHidden />
      </div>

      {/* Fade the strip into the page at both ends. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-void to-transparent"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-void to-transparent"
      />
    </div>
  )
}
