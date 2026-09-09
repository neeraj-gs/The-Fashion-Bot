import { useEffect, useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useRecoilState } from "recoil"
import { AnimatePresence, motion } from "motion/react"
import Cookies from "js-cookie"
import {
  AlertCircle,
  Check,
  CreditCard,
  Eye,
  EyeOff,
  Loader2,
  LogOut,
  MapPin,
  User,
} from "lucide-react"
import { AppBar } from "@/components/chrome/AppBar"
import { Button } from "@/components/ui/Button"
import { Field, SelectField } from "@/components/ui/Field"
import { Eyebrow } from "@/components/ui/Eyebrow"
import { SplitHeading } from "@/components/ui/SplitHeading"
import { userAPI } from "@/lib/api"
import { userState, type User as AppUser } from "@/store/authState"
import { COUNTRIES, US_STATES, formatCardNumber } from "@/lib/geo"
import { EASE_OUT_EXPO } from "@/lib/motion"
import { cn } from "@/lib/utils"

type Tab = "identity" | "shipping" | "payment"

const TABS: { id: Tab; label: string; hint: string; icon: typeof User }[] = [
  { id: "identity", label: "Identity", hint: "Who the order is for", icon: User },
  { id: "shipping", label: "Shipping", hint: "Where it lands", icon: MapPin },
  { id: "payment", label: "Payment", hint: "What clears it", icon: CreditCard },
]

function formFrom(user: AppUser | null) {
  return {
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    phone: user?.phone || "",
    addressLine1: user?.shippingAddress?.addressLine1 || "",
    addressLine2: user?.shippingAddress?.addressLine2 || "",
    city: user?.shippingAddress?.city || "",
    state: user?.shippingAddress?.state || "",
    zipCode: user?.shippingAddress?.zipCode || "",
    country: user?.shippingAddress?.country || "USA",
    cardNumber: user?.paymentDetails?.cardNumber || "",
    cardHolderName: user?.paymentDetails?.cardHolderName || "",
    expiryMonth: user?.paymentDetails?.expiryMonth || "",
    expiryYear: user?.paymentDetails?.expiryYear || "",
    cvv: user?.paymentDetails?.cvv || "",
  }
}

export function SettingsPage() {
  const navigate = useNavigate()
  const [user, setUser] = useRecoilState(userState)

  const [tab, setTab] = useState<Tab>("identity")
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState<{
    type: "success" | "error"
    text: string
  } | null>(null)
  const [revealCard, setRevealCard] = useState(false)

  const saved = useMemo(() => formFrom(user), [user])
  const [formData, setFormData] = useState(saved)

  useEffect(() => {
    setFormData(formFrom(user))
  }, [user])

  const dirty = useMemo(
    () => JSON.stringify(formData) !== JSON.stringify(saved),
    [formData, saved]
  )

  const updateField = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSave = async () => {
    setIsLoading(true)
    setMessage(null)

    try {
      const response = await userAPI.updateDetails({
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone,
        shippingAddress: {
          addressLine1: formData.addressLine1,
          addressLine2: formData.addressLine2,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode,
          country: formData.country,
        },
        paymentDetails: {
          cardNumber: formData.cardNumber,
          cardHolderName: formData.cardHolderName,
          expiryMonth: formData.expiryMonth,
          expiryYear: formData.expiryYear,
          cvv: formData.cvv,
          sameAsShipping: true,
        },
      })

      if (response.data.success) {
        setUser(response.data.data.user)
        setMessage({ type: "success", text: "Loadout updated." })
        window.setTimeout(() => setMessage(null), 3200)
      }
    } catch (error: unknown) {
      const text =
        (error as { response?: { data?: { message?: string } } })?.response?.data
          ?.message ?? "Could not save. Try that again."
      setMessage({ type: "error", text })
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    Cookies.remove("token")
    setUser(null)
    navigate("/login")
  }

  if (!user) return null

  return (
    <div className="min-h-svh bg-canvas pb-28">
      <AppBar current="settings" />

      <main className="mx-auto w-full max-w-[1280px] px-6 py-14 lg:px-10 lg:py-20">
        <div className="flex items-center justify-between gap-6">
          <Eyebrow index="00">Your loadout</Eyebrow>
          <div aria-hidden className="h-px flex-1 bg-line" />
          <p className="mono-label text-faint">{user.email}</p>
        </div>

        <SplitHeading
          as="h1"
          animateOnMount
          className="mt-10 text-[clamp(2.5rem,6.5vw,5rem)]"
          lines={[
            <>
              What the bot{" "}
              <span className="counter font-normal tracking-normal">types.</span>
            </>,
          ]}
        />

        <div className="mt-14 grid gap-12 lg:grid-cols-[15rem_1fr] lg:gap-16">
          {/* --- tab rail --- */}
          <nav aria-label="Loadout sections">
            <div className="lg:sticky lg:top-28">
              <ul className="border-t border-line">
                {TABS.map((item) => {
                  const Icon = item.icon
                  const active = tab === item.id
                  return (
                    <li key={item.id}>
                      <button
                        onClick={() => setTab(item.id)}
                        aria-current={active ? "true" : undefined}
                        className={cn(
                          "flex w-full items-start gap-4 border-b border-line py-5 text-left transition-colors duration-300",
                          active ? "text-bone" : "text-mute hover:text-bone"
                        )}
                      >
                        <Icon
                          className={cn(
                            "mt-0.5 size-4 shrink-0 transition-colors duration-300",
                            active ? "text-signal" : "text-faint"
                          )}
                        />
                        <span className="min-w-0">
                          <span className="block font-mono text-[11px] uppercase tracking-[0.16em]">
                            {item.label}
                          </span>
                          <span className="mt-1 block text-xs text-faint">
                            {item.hint}
                          </span>
                        </span>
                      </button>
                    </li>
                  )
                })}
              </ul>
            </div>
          </nav>

          {/* --- panels --- */}
          <AnimatePresence mode="wait">
            <motion.div
              key={tab}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4, ease: EASE_OUT_EXPO }}
              className="max-w-xl"
            >
              {tab === "identity" && (
                <div className="space-y-6">
                  <div className="grid gap-6 sm:grid-cols-2">
                    <Field
                      label="First name"
                      autoComplete="given-name"
                      value={formData.firstName}
                      onChange={(e) => updateField("firstName", e.target.value)}
                    />
                    <Field
                      label="Last name"
                      autoComplete="family-name"
                      value={formData.lastName}
                      onChange={(e) => updateField("lastName", e.target.value)}
                    />
                  </div>
                  <Field
                    label="Email"
                    value={user.email}
                    readOnly
                    disabled
                    hint="Your email is the account and cannot be changed here"
                  />
                  <Field
                    label="Phone"
                    type="tel"
                    autoComplete="tel"
                    value={formData.phone}
                    onChange={(e) => updateField("phone", e.target.value)}
                  />
                </div>
              )}

              {tab === "shipping" && (
                <div className="space-y-6">
                  <Field
                    label="Address line 1"
                    autoComplete="address-line1"
                    value={formData.addressLine1}
                    onChange={(e) => updateField("addressLine1", e.target.value)}
                  />
                  <Field
                    label="Address line 2"
                    aside="Optional"
                    autoComplete="address-line2"
                    value={formData.addressLine2}
                    onChange={(e) => updateField("addressLine2", e.target.value)}
                  />
                  <div className="grid gap-6 sm:grid-cols-2">
                    <Field
                      label="City"
                      autoComplete="address-level2"
                      value={formData.city}
                      onChange={(e) => updateField("city", e.target.value)}
                    />
                    <SelectField
                      label="State"
                      autoComplete="address-level1"
                      value={formData.state}
                      onChange={(e) => updateField("state", e.target.value)}
                    >
                      <option value="">Select a state</option>
                      {US_STATES.map((s) => (
                        <option key={s.code} value={s.code}>
                          {s.name}
                        </option>
                      ))}
                    </SelectField>
                  </div>
                  <div className="grid gap-6 sm:grid-cols-2">
                    <Field
                      label="ZIP code"
                      autoComplete="postal-code"
                      value={formData.zipCode}
                      onChange={(e) => updateField("zipCode", e.target.value)}
                    />
                    <SelectField
                      label="Country"
                      autoComplete="country"
                      value={formData.country}
                      onChange={(e) => updateField("country", e.target.value)}
                    >
                      {COUNTRIES.map((c) => (
                        <option key={c.code} value={c.code}>
                          {c.name}
                        </option>
                      ))}
                    </SelectField>
                  </div>
                </div>
              )}

              {tab === "payment" && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between gap-4 border border-line bg-surface px-5 py-4">
                    <p className="mono-sm leading-relaxed text-faint">
                      Card details stay hidden until you ask for them.
                    </p>
                    <button
                      type="button"
                      onClick={() => setRevealCard((v) => !v)}
                      className="mono-label flex shrink-0 items-center gap-2 text-mute transition-colors hover:text-bone"
                    >
                      {revealCard ? (
                        <EyeOff className="size-3.5" />
                      ) : (
                        <Eye className="size-3.5" />
                      )}
                      {revealCard ? "Hide" : "Reveal"}
                    </button>
                  </div>

                  <Field
                    label="Card number"
                    type={revealCard ? "text" : "password"}
                    inputMode="numeric"
                    autoComplete="cc-number"
                    maxLength={19}
                    value={
                      revealCard
                        ? formatCardNumber(formData.cardNumber)
                        : formData.cardNumber
                    }
                    onChange={(e) =>
                      updateField(
                        "cardNumber",
                        e.target.value.replace(/\D/g, "").slice(0, 16)
                      )
                    }
                  />
                  <Field
                    label="Cardholder name"
                    autoComplete="cc-name"
                    value={formData.cardHolderName}
                    onChange={(e) => updateField("cardHolderName", e.target.value)}
                  />
                  <div className="grid grid-cols-3 gap-4">
                    <Field
                      label="Month"
                      inputMode="numeric"
                      maxLength={2}
                      value={formData.expiryMonth}
                      onChange={(e) =>
                        updateField("expiryMonth", e.target.value.replace(/\D/g, ""))
                      }
                    />
                    <Field
                      label="Year"
                      inputMode="numeric"
                      maxLength={2}
                      value={formData.expiryYear}
                      onChange={(e) =>
                        updateField("expiryYear", e.target.value.replace(/\D/g, ""))
                      }
                    />
                    <Field
                      label="CVV"
                      type={revealCard ? "text" : "password"}
                      inputMode="numeric"
                      maxLength={4}
                      value={formData.cvv}
                      onChange={(e) =>
                        updateField("cvv", e.target.value.replace(/\D/g, ""))
                      }
                    />
                  </div>
                </div>
              )}

              {/* --- danger zone --- */}
              <div className="mt-16 border-t border-line pt-10">
                <p className="mono-label text-faint">Account</p>
                <div className="mt-5 flex flex-col items-start justify-between gap-5 border border-line bg-surface p-6 sm:flex-row sm:items-center">
                  <div>
                    <p className="font-mono text-xs uppercase tracking-[0.14em] text-bone">
                      Sign out
                    </p>
                    <p className="mt-2 text-sm text-dim">
                      Your loadout stays saved for the next time you sign in.
                    </p>
                  </div>
                  <Button variant="danger" onClick={logout} className="shrink-0">
                    <LogOut className="size-4" />
                    Sign out
                  </Button>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* --- the save bar only exists when there is something to save --- */}
      <AnimatePresence>
        {(dirty || message) && (
          <motion.div
            className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-canvas/95 backdrop-blur-xl"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ duration: 0.45, ease: EASE_OUT_EXPO }}
          >
            <div className="mx-auto flex w-full max-w-[1280px] flex-wrap items-center gap-4 px-6 py-4 lg:px-10">
              {message ? (
                <p
                  role="status"
                  className={cn(
                    "mono-label flex items-center gap-2",
                    message.type === "success" ? "text-jade" : "text-signal"
                  )}
                >
                  {message.type === "success" ? (
                    <Check className="size-4" />
                  ) : (
                    <AlertCircle className="size-4" />
                  )}
                  {message.text}
                </p>
              ) : (
                <p className="mono-label text-mute">Unsaved changes</p>
              )}

              <div className="ml-auto flex gap-3">
                {dirty && (
                  <Button
                    variant="ghost"
                    onClick={() => setFormData(saved)}
                    disabled={isLoading}
                  >
                    Discard
                  </Button>
                )}
                <Button onClick={handleSave} disabled={isLoading || !dirty}>
                  {isLoading ? (
                    <>
                      <Loader2 className="size-4 animate-spin" />
                      Saving
                    </>
                  ) : (
                    "Save loadout"
                  )}
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
