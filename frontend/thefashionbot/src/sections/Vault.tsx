import { SectionShell } from "@/components/ui/SectionShell"
import { SplitHeading } from "@/components/ui/SplitHeading"
import { Reveal } from "@/components/ui/Reveal"
import { Panel } from "@/components/ui/Panel"
import { VAULT } from "@/lib/site"

export function Vault() {
  return (
    <SectionShell id="vault" index="06" label="The Vault" meta="What is held, and why">
      <div className="grid gap-y-14 lg:grid-cols-12 lg:gap-x-10">
        <div className="lg:col-span-5">
          <SplitHeading
            className="text-[clamp(2.25rem,4.4vw,4.25rem)]"
            lines={[
              "One loadout.",
              <>
                Yours to{" "}
                <span className="counter font-normal tracking-normal">
                  change.
                </span>
              </>,
            ]}
          />
        </div>
        <div className="lg:col-span-6 lg:col-start-7">
          <Reveal delay={0.1}>
            <p className="max-w-lg text-base leading-relaxed text-dim">
              The bot needs your checkout details to fill a checkout. They are
              held against your account, used only for runs you start yourself,
              and editable from Settings at any point.
            </p>
          </Reveal>
        </div>
      </div>

      <div className="mt-16 grid gap-px bg-line sm:grid-cols-3">
        {VAULT.map((item, i) => (
          <Reveal key={item.title} delay={i * 0.08} className="h-full">
            <Panel className="h-full border-0 p-8">
              <p className="mono-label text-signal">
                {String(i + 1).padStart(2, "0")}
              </p>
              <h3 className="display mt-5 text-xl">{item.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-dim">
                {item.body}
              </p>
            </Panel>
          </Reveal>
        ))}
      </div>

      <Reveal delay={0.1}>
        <p className="mono-sm mt-10 max-w-2xl leading-relaxed text-faint">
          The bot only ever opens the URL you hand it. It does not browse, it
          does not choose items for you, and no run starts without you starting
          it.
        </p>
      </Reveal>
    </SectionShell>
  )
}
