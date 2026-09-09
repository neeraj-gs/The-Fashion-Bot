import { SectionShell } from "@/components/ui/SectionShell"
import { SplitHeading } from "@/components/ui/SplitHeading"
import { Reveal } from "@/components/ui/Reveal"
import { LOADOUT } from "@/lib/site"

export function Loadout() {
  return (
    <SectionShell
      id="loadout"
      index="04"
      label="The Loadout"
      meta="Saved once, used everywhere"
    >
      <div className="grid gap-y-14 lg:grid-cols-12 lg:gap-x-10">
        <div className="lg:col-span-5">
          <SplitHeading
            className="text-[clamp(2.25rem,4.4vw,4.25rem)]"
            lines={[
              "Fill it in once.",
              <>
                Then{" "}
                <span className="counter font-normal tracking-normal">
                  never again.
                </span>
              </>,
            ]}
          />
        </div>
        <div className="lg:col-span-6 lg:col-start-7">
          <Reveal delay={0.1}>
            <p className="max-w-lg text-base leading-relaxed text-dim">
              Your loadout is the set of details every checkout asks for, kept in
              one place: who you are, where it ships, and what pays for it. Three
              short steps, and the bot never has to ask you again.
            </p>
          </Reveal>
        </div>
      </div>

      {/* A hairline table rather than a grid of cards — closer to a spec sheet. */}
      <div className="mt-16 grid border-t border-line sm:grid-cols-2 lg:grid-cols-3">
        {LOADOUT.map((item, i) => (
          <Reveal key={item.title} delay={(i % 3) * 0.07}>
            <div className="group h-full border-b border-line px-0 py-9 transition-colors duration-500 sm:px-7 sm:[&:nth-child(n)]:border-l">
              <p className="mono-label text-faint transition-colors duration-500 group-hover:text-signal">
                {String(i + 1).padStart(2, "0")}
              </p>
              <h3 className="display mt-5 text-xl">{item.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-dim">{item.body}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </SectionShell>
  )
}
