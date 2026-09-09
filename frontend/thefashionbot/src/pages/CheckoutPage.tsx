import { useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useRecoilValue } from "recoil"
import { AnimatePresence, motion } from "motion/react"
import { z } from "zod"
import { AlertCircle, ArrowRight, Link as LinkIcon } from "lucide-react"
import { AppBar } from "@/components/chrome/AppBar"
import { Button } from "@/components/ui/Button"
import { Field } from "@/components/ui/Field"
import { Eyebrow } from "@/components/ui/Eyebrow"
import { Panel } from "@/components/ui/Panel"
import { Segmented } from "@/components/ui/Segmented"
import { Stepper } from "@/components/ui/Stepper"
import { SplitHeading } from "@/components/ui/SplitHeading"
import { StatusDot } from "@/components/ui/StatusDot"
import { RunTheatre } from "@/components/runtheatre/RunTheatre"
import { buildStages, type RunOutcome } from "@/components/runtheatre/useRunTimeline"
import { automationAPI } from "@/lib/api"
import { userState } from "@/store/authState"
import { LANES, SIZES, laneByValue } from "@/lib/site"
import { maskCard } from "@/lib/geo"
import { EASE_OUT_EXPO } from "@/lib/motion"

const urlSchema = z.string().url("That is not a full product URL")

export function CheckoutPage() {
  const navigate = useNavigate()
  const user = useRecoilValue(userState)

  const [store, setStore] = useState("")
  const [productUrl, setProductUrl] = useState("")
  const [quantity, setQuantity] = useState(1)
  const [size, setSize] = useState("")

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [running, setRunning] = useState(false)
  const [outcome, setOutcome] = useState<RunOutcome>(null)
  const [message, setMessage] = useState("")

  const lane = laneByValue(store)
  const stages = useMemo(() => buildStages(Boolean(lane?.needsSize)), [lane])

  const validate = () => {
    const next: Record<string, string> = {}

    if (!store) next.store = "Pick a lane to run"

    const url = urlSchema.safeParse(productUrl)
    if (!url.success) next.productUrl = url.error.issues[0].message

    if (quantity < 1) next.quantity = "At least one"
    if (lane?.needsSize && !size) next.size = "This lane needs a size"

    setErrors(next)
    return Object.keys(next).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    setRunning(true)
    setOutcome(null)
    setMessage("")

    const orderData: { productUrl: string; quantity: number; size?: string } = {
      productUrl,
      quantity,
    }
    if (lane?.needsSize) orderData.size = size

    try {
      const response = await automationAPI.startAutomation(store, orderData)

      if (response.data.success) {
        setOutcome("success")
        setMessage(response.data.message || "Checkout completed.")
      } else {
        setOutcome("error")
        setMessage(response.data.message || "The run did not complete.")
      }
    } catch (error: unknown) {
      const detail =
        (error as { response?: { data?: { message?: string } } })?.response?.data
          ?.message ?? "The run could not be started. Try again."
      setOutcome("error")
      setMessage(detail)
    } finally {
      setRunning(false)
    }
  }

  const reset = () => {
    setOutcome(null)
    setMessage("")
    setRunning(false)
  }

  if (!user) return null

  const theatreOpen = running || outcome !== null

  return (
    <div className="min-h-svh bg-canvas">
      <AppBar current="checkout" />

      <main className="mx-auto w-full max-w-[1560px] px-6 py-14 lg:px-10 lg:py-20">
        <div className="flex items-center justify-between gap-6">
          <Eyebrow index="00">New run</Eyebrow>
          <div aria-hidden className="h-px flex-1 bg-line" />
          <p className="mono-label flex items-center gap-2 text-faint">
            <StatusDot tone="live" />
            Lanes up
          </p>
        </div>

        <SplitHeading
          as="h1"
          animateOnMount
          className="mt-10 max-w-[18ch] text-[clamp(2.5rem,6.5vw,5.5rem)]"
          lines={[
            "Pick a lane.",
            <>
              Hand it a{" "}
              <span className="counter font-normal tracking-normal">link.</span>
            </>,
          ]}
        />

        <form
          onSubmit={handleSubmit}
          className="mt-14 grid gap-14 lg:grid-cols-[1fr_22rem] lg:items-start lg:gap-16"
          noValidate
        >
          <div>
            {/* --- lane --- */}
            <fieldset>
              <legend className="mono-label mb-5 text-mute">
                01 &middot; The lane
                {errors.store && (
                  <span className="ml-3 text-signal">{errors.store}</span>
                )}
              </legend>

              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                {LANES.map((item) => {
                  const live = item.status === "live"
                  const selected = live && store === item.value
                  return (
                    <button
                      key={item.name}
                      type="button"
                      disabled={!live}
                      aria-pressed={selected}
                      onClick={() => {
                        setStore(item.value)
                        setSize("")
                        setErrors((prev) => ({ ...prev, store: "", size: "" }))
                      }}
                      className="text-left disabled:cursor-not-allowed"
                    >
                      <Panel
                        active={selected}
                        interactive={live}
                        className="h-full p-6"
                      >
                        <div className={live ? "" : "opacity-45"}>
                        <div className="flex items-start justify-between gap-3">
                          <h3 className="display text-lg">{item.name}</h3>
                          <span
                            className={
                              "mono-label flex shrink-0 items-center gap-1.5 " +
                              (live ? "text-jade" : "text-faint")
                            }
                          >
                            <StatusDot tone={live ? "live" : "idle"} />
                            {live ? "Live" : "Soon"}
                          </span>
                        </div>
                        <p className="mono-sm mt-2 text-faint">{item.domain}</p>
                        <p className="mt-4 text-xs leading-relaxed text-dim">
                          {item.note}
                        </p>
                        </div>
                      </Panel>
                    </button>
                  )
                })}
              </div>
            </fieldset>

            {/* --- product --- */}
            <fieldset className="mt-12">
              <legend className="mono-label mb-5 text-mute">
                02 &middot; The product
              </legend>

              <Field
                label="Product URL"
                type="url"
                required
                icon={<LinkIcon className="size-4" />}
                value={productUrl}
                onChange={(e) => {
                  setProductUrl(e.target.value.trim())
                  setErrors((prev) => ({ ...prev, productUrl: "" }))
                }}
                error={errors.productUrl}
                hint="The full product page address, copied from the store"
                placeholder="https://store.com/products/..."
                disabled={running}
              />

              <div className="mt-6 grid gap-6 sm:grid-cols-2">
                <div>
                  <p className="mono-label mb-2">Quantity</p>
                  <Stepper
                    label="Quantity"
                    value={quantity}
                    onChange={setQuantity}
                    min={1}
                    max={10}
                  />
                  {errors.quantity && (
                    <p role="alert" className="mono-sm mt-2 text-signal">
                      {errors.quantity}
                    </p>
                  )}
                </div>

                <AnimatePresence mode="wait">
                  {lane?.needsSize && (
                    <motion.div
                      key="size"
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.4, ease: EASE_OUT_EXPO }}
                    >
                      <p className="mono-label mb-2">
                        Size <span className="text-signal">*</span>
                      </p>
                      <Segmented
                        label="Garment size"
                        value={size}
                        onChange={(next) => {
                          setSize(next)
                          setErrors((prev) => ({ ...prev, size: "" }))
                        }}
                        options={SIZES.map((s) => ({ value: s, label: s }))}
                      />
                      {errors.size && (
                        <p role="alert" className="mono-sm mt-2 text-signal">
                          {errors.size}
                        </p>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </fieldset>

            <div className="mt-12 flex flex-col gap-3 sm:flex-row">
              <Button
                type="submit"
                size="lg"
                disabled={running}
                className="group sm:min-w-56"
              >
                Start the run
                <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="lg"
                onClick={() => navigate("/dashboard")}
                disabled={running}
              >
                Cancel
              </Button>
            </div>
          </div>

          {/* --- what the bot will use --- */}
          <aside className="lg:sticky lg:top-28">
            <Panel className="p-7">
              <p className="mono-label text-signal">The loadout in play</p>

              <dl className="mt-7 space-y-3.5">
                {(
                  [
                    [
                      "Name",
                      [user.firstName, user.lastName].filter(Boolean).join(" ") ||
                        "—",
                    ],
                    ["Ships to", user.shippingAddress?.addressLine1 || "—"],
                    [
                      "City",
                      [user.shippingAddress?.city, user.shippingAddress?.state]
                        .filter(Boolean)
                        .join(", ") || "—",
                    ],
                    ["Card", maskCard(user.paymentDetails?.cardNumber ?? "")],
                  ] as [string, string][]
                ).map(([label, value]) => (
                  <div
                    key={label}
                    className="flex items-baseline justify-between gap-4 border-b border-line pb-3.5 last:border-0"
                  >
                    <dt className="mono-label shrink-0 text-faint">{label}</dt>
                    <dd className="truncate text-right font-mono text-xs text-bone">
                      {value}
                    </dd>
                  </div>
                ))}
              </dl>

              <button
                type="button"
                onClick={() => navigate("/settings")}
                className="mono-label mt-7 border-b border-line pb-1 text-mute transition-colors hover:border-bone hover:text-bone"
              >
                Change the loadout &rarr;
              </button>
            </Panel>

            <div className="mt-6 flex items-start gap-3 border border-line bg-surface px-5 py-4">
              <AlertCircle className="mt-px size-4 shrink-0 text-mute" />
              <p className="mono-sm leading-relaxed text-faint">
                The bot places a real order using these details. Make sure the
                item is in stock before you start.
              </p>
            </div>
          </aside>
        </form>
      </main>

      <AnimatePresence>
        {theatreOpen && (
          <RunTheatre
            stages={stages}
            running={running}
            outcome={outcome}
            message={message}
            laneName={lane?.name ?? "Run"}
            onRetry={reset}
            onDone={() => navigate("/dashboard")}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
