import { cardBrand, formatCardNumber } from "@/lib/geo"
import { cn } from "@/lib/utils"

const PLACEHOLDER = "••••••••••••••••"

/**
 * A card rendered in CSS 3D that fills in as the payment step is typed, and
 * turns over when the CVV field takes focus — which is also where the CVV is,
 * on a real card.
 */
export function PaymentCard({
  number,
  holder,
  month,
  year,
  cvv,
  flipped,
  className,
}: {
  number: string
  holder: string
  month: string
  year: string
  cvv: string
  flipped: boolean
  className?: string
}) {
  const digits = number.replace(/\D/g, "")
  const shown = formatCardNumber(digits.padEnd(16, "•").slice(0, 16))
  const brand = digits.length >= 2 ? cardBrand(digits) : "CARD"

  const face =
    "absolute inset-0 border border-line-strong bg-gradient-to-br from-raised via-surface to-void [backface-visibility:hidden]"

  return (
    <div className={cn("[perspective:1600px]", className)} aria-hidden>
      <div
        className={cn(
          "relative aspect-[1.586] w-full transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] [transform-style:preserve-3d]",
          flipped && "[transform:rotateY(180deg)]"
        )}
      >
        {/* --- front --- */}
        <div className={face}>
          <div
            aria-hidden
            className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-signal to-transparent"
          />

          <div className="flex h-full flex-col justify-between p-6">
            <div className="flex items-start justify-between">
              {/* Chip. */}
              <div className="grid h-7 w-10 grid-cols-3 gap-px overflow-hidden border border-line-strong bg-void/60">
                {Array.from({ length: 9 }, (_, i) => (
                  <span key={i} className="bg-mute/25" />
                ))}
              </div>
              <span className="mono-label text-signal">{brand}</span>
            </div>

            <p className="font-mono text-[clamp(0.9rem,3.4vw,1.15rem)] tracking-[0.14em] text-bone">
              {digits ? shown : formatCardNumber(PLACEHOLDER)}
            </p>

            <div className="flex items-end justify-between gap-6">
              <div className="min-w-0">
                <p className="mono-label text-faint">Cardholder</p>
                <p className="mt-1.5 truncate font-mono text-xs uppercase tracking-[0.1em] text-bone">
                  {holder || "YOUR NAME"}
                </p>
              </div>
              <div className="shrink-0 text-right">
                <p className="mono-label text-faint">Expires</p>
                <p className="mt-1.5 font-mono text-xs tracking-[0.1em] text-bone">
                  {(month || "MM") + " / " + (year || "YY")}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* --- back --- */}
        <div className={cn(face, "[transform:rotateY(180deg)]")}>
          <div className="mt-6 h-11 w-full bg-void" />

          <div className="px-6 pt-6">
            <div className="flex items-center justify-end gap-3">
              <span className="mono-label text-faint">CVV</span>
              <span className="grid h-8 min-w-16 place-items-center border border-line-strong bg-bone px-3 font-mono text-sm tracking-[0.2em] text-void">
                {cvv || "•••"}
              </span>
            </div>
            <p className="mono-label mt-6 text-faint">
              The Fashion Bot &middot; loadout
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
