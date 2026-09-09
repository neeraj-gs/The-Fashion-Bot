import { SectionShell } from "@/components/ui/SectionShell"
import { SplitHeading } from "@/components/ui/SplitHeading"
import { Reveal } from "@/components/ui/Reveal"
import { ODDS } from "@/lib/site"

export function Odds() {
  return (
    <SectionShell
      id="odds"
      index="02"
      label="The Odds"
      meta="Why manual checkout loses"
    >
      <div className="grid gap-y-16 lg:grid-cols-12 lg:gap-x-10">
        <div className="lg:col-span-5">
          <SplitHeading
            className="text-[clamp(2.25rem,4.4vw,4.25rem)]"
            lines={[
              "Checkout is a",
              "typing contest",
              <>
                <span className="counter font-normal tracking-normal">
                  you lose.
                </span>
              </>,
            ]}
          />

          <Reveal delay={0.15}>
            <p className="mt-8 max-w-md text-base leading-relaxed text-dim">
              Not because you are slow. Because the checkout was never built for
              a drop, and every field it asks for is time the stock does not
              have.
            </p>
          </Reveal>
        </div>

        <div className="lg:col-span-6 lg:col-start-7">
          {ODDS.map((item, i) => (
            <Reveal key={item.title} delay={i * 0.08}>
              <div className="grid grid-cols-[4.5rem_1fr] gap-6 border-t border-line py-9 sm:grid-cols-[7rem_1fr] sm:gap-10">
                <span className="display text-[2.75rem] leading-none text-signal sm:text-6xl">
                  {item.figure}
                </span>
                <div>
                  <h3 className="display text-xl sm:text-2xl">{item.title}</h3>
                  <p className="mt-3.5 text-sm leading-relaxed text-dim">
                    {item.body}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </SectionShell>
  )
}
