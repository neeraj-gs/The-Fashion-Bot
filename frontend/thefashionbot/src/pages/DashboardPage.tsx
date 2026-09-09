import { useNavigate } from "react-router-dom"
import { useRecoilValue } from "recoil"
import { ArrowRight, Check, CreditCard, MapPin, User } from "lucide-react"
import { AppBar } from "@/components/chrome/AppBar"
import { Button } from "@/components/ui/Button"
import { Eyebrow } from "@/components/ui/Eyebrow"
import { Panel } from "@/components/ui/Panel"
import { Reveal } from "@/components/ui/Reveal"
import { SplitHeading } from "@/components/ui/SplitHeading"
import { StatusDot } from "@/components/ui/StatusDot"
import { GatePoster } from "@/three/GatePoster"
import { userState } from "@/store/authState"
import { LIVE_LANES, RUN_NO } from "@/lib/site"
import { maskCard } from "@/lib/geo"

export function DashboardPage() {
  const navigate = useNavigate()
  const user = useRecoilValue(userState)

  if (!user) return null

  const shipping = user.shippingAddress
  const payment = user.paymentDetails

  const groups = [
    {
      icon: User,
      label: "Identity",
      ready: Boolean(user.firstName && user.lastName && user.phone),
      rows: [
        ["Name", [user.firstName, user.lastName].filter(Boolean).join(" ") || "—"],
        ["Email", user.email],
        ["Phone", user.phone || "—"],
      ] as [string, string][],
    },
    {
      icon: MapPin,
      label: "Shipping",
      ready: Boolean(shipping?.addressLine1 && shipping?.city && shipping?.zipCode),
      rows: [
        ["Street", shipping?.addressLine1 || "—"],
        [
          "City",
          [shipping?.city, shipping?.state].filter(Boolean).join(", ") || "—",
        ],
        [
          "Post",
          [shipping?.zipCode, shipping?.country].filter(Boolean).join(" · ") || "—",
        ],
      ] as [string, string][],
    },
    {
      icon: CreditCard,
      label: "Payment",
      ready: Boolean(payment?.cardNumber && payment?.expiryMonth),
      rows: [
        ["Card", maskCard(payment?.cardNumber ?? "")],
        ["Holder", payment?.cardHolderName || "—"],
        [
          "Expires",
          payment?.expiryMonth && payment?.expiryYear
            ? payment.expiryMonth + " / " + payment.expiryYear
            : "—",
        ],
      ] as [string, string][],
    },
  ]

  const ready = groups.every((g) => g.ready)

  return (
    <div className="min-h-svh bg-canvas">
      <AppBar current="dashboard" />

      <main className="mx-auto w-full max-w-[1560px] px-6 py-14 lg:px-10 lg:py-20">
        <div className="flex items-center justify-between gap-6">
          <Eyebrow index="00">Control room</Eyebrow>
          <div aria-hidden className="h-px flex-1 bg-line" />
          <p className="mono-label flex items-center gap-2 text-faint">
            <StatusDot tone={ready ? "live" : "warn"} />
            {ready ? "Loadout ready" : "Loadout incomplete"}
          </p>
        </div>

        <SplitHeading
          as="h1"
          animateOnMount
          className="mt-10 text-[clamp(2.5rem,6.5vw,5.5rem)]"
          lines={[
            <>Welcome back, {user.firstName || "there"}.</>,
            <>
              The lane is{" "}
              <span className="counter font-normal tracking-normal">open.</span>
            </>,
          ]}
        />

        {/* --- the one thing this page is for --- */}
        <Reveal delay={0.2}>
          <Panel className="relative mt-14 overflow-hidden">
            <GatePoster className="pointer-events-none absolute inset-y-0 right-0 hidden h-full w-1/2 opacity-25 lg:block" />
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 bg-gradient-to-r from-surface via-surface/85 to-transparent"
            />

            <div className="relative flex flex-col gap-10 p-8 sm:p-12 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-xl">
                <p className="mono-label text-signal">Ready to run</p>
                <h2 className="display mt-5 text-3xl sm:text-4xl">
                  Hand it a link.
                </h2>
                <p className="mt-4 text-sm leading-relaxed text-dim">
                  Pick a lane, paste the product page, and the bot fills the
                  whole checkout with the loadout below. Most runs are done in
                  under thirty seconds.
                </p>
              </div>

              <Button
                size="lg"
                onClick={() => navigate("/checkout")}
                className="group shrink-0"
              >
                Start a run
                <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Button>
            </div>
          </Panel>
        </Reveal>

        {/* --- loadout state --- */}
        <div className="mt-16 flex items-center justify-between gap-6">
          <Eyebrow index="01">Your loadout</Eyebrow>
          <div aria-hidden className="h-px flex-1 bg-line" />
          <button
            onClick={() => navigate("/settings")}
            className="mono-label text-mute transition-colors hover:text-bone"
          >
            Edit &rarr;
          </button>
        </div>

        <div className="mt-8 grid gap-px bg-line md:grid-cols-3">
          {groups.map((group, i) => {
            const Icon = group.icon
            return (
              <Reveal key={group.label} delay={i * 0.08} className="h-full">
                <Panel className="h-full border-0 p-7">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-3">
                      <Icon className="size-4 text-mute" />
                      <span className="mono-label text-bone">{group.label}</span>
                    </span>
                    <span
                      className={
                        "grid size-5 place-items-center border " +
                        (group.ready
                          ? "border-jade text-jade"
                          : "border-warn text-warn")
                      }
                    >
                      {group.ready ? (
                        <Check className="size-3" />
                      ) : (
                        <span className="text-[10px]">!</span>
                      )}
                    </span>
                  </div>

                  <dl className="mt-7 space-y-3.5">
                    {group.rows.map(([label, value]) => (
                      <div
                        key={label}
                        className="flex items-baseline justify-between gap-4 border-b border-line pb-3.5 last:border-0"
                      >
                        <dt className="mono-label shrink-0 text-faint">
                          {label}
                        </dt>
                        <dd className="truncate text-right font-mono text-xs text-bone">
                          {value}
                        </dd>
                      </div>
                    ))}
                  </dl>
                </Panel>
              </Reveal>
            )
          })}
        </div>

        {/* --- readouts --- */}
        <dl className="mt-16 grid grid-cols-2 border-t border-line lg:grid-cols-4">
          {[
            { label: "Lanes live", value: String(LIVE_LANES.length) },
            { label: "Median run", value: "<30s" },
            { label: "Availability", value: "24/7" },
            { label: "Session", value: RUN_NO.slice(0, 6) },
          ].map((stat, i) => (
            <div
              key={stat.label}
              className={
                "py-7 " + (i > 0 ? "lg:border-l lg:border-line lg:pl-8" : "")
              }
            >
              <dt className="mono-label text-faint">{stat.label}</dt>
              <dd className="display mt-2 text-3xl lg:text-4xl">{stat.value}</dd>
            </div>
          ))}
        </dl>
      </main>
    </div>
  )
}
