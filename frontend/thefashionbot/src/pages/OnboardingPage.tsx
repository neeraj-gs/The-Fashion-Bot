import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useRecoilState } from "recoil"
import { AnimatePresence, motion } from "motion/react"
import { AlertCircle, ArrowLeft, ArrowRight, Check, Loader2 } from "lucide-react"
import { AppBar } from "@/components/chrome/AppBar"
import { Button } from "@/components/ui/Button"
import { Field, SelectField } from "@/components/ui/Field"
import { Eyebrow } from "@/components/ui/Eyebrow"
import { PaymentCard } from "@/components/ui/PaymentCard"
import { userAPI } from "@/lib/api"
import { userState } from "@/store/authState"
import { COUNTRIES, US_STATES, formatCardNumber } from "@/lib/geo"
import { EASE_OUT_EXPO } from "@/lib/motion"
import { cn } from "@/lib/utils"

const STAGES = [
  { step: 1, label: "Identity", hint: "Who the order is for" },
  { step: 2, label: "Shipping", hint: "Where it lands" },
  { step: 3, label: "Payment", hint: "What clears it" },
]

export function OnboardingPage() {
  const navigate = useNavigate()
  const [user, setUser] = useRecoilState(userState)

  const [step, setStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [apiError, setApiError] = useState("")
  const [cvvFocused, setCvvFocused] = useState(false)

  const [formData, setFormData] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    phone: user?.phone || "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    zipCode: "",
    country: "USA",
    cardNumber: "",
    cardHolderName: "",
    expiryMonth: "",
    expiryYear: "",
    cvv: "",
    sameAsShipping: true,
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const updateField = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    setErrors((prev) => ({ ...prev, [field]: "" }))
  }

  const validateStep = (currentStep: number) => {
    const stepErrors: Record<string, string> = {}

    if (currentStep === 1) {
      if (!formData.firstName) stepErrors.firstName = "First name is required"
      if (!formData.lastName) stepErrors.lastName = "Last name is required"
      if (!formData.phone || formData.phone.length < 10)
        stepErrors.phone = "A reachable phone number is required"
    }

    if (currentStep === 2) {
      if (!formData.addressLine1) stepErrors.addressLine1 = "Address is required"
      if (!formData.city) stepErrors.city = "City is required"
      if (!formData.state) stepErrors.state = "State is required"
      if (!formData.zipCode || formData.zipCode.length < 5)
        stepErrors.zipCode = "A valid ZIP code is required"
    }

    if (currentStep === 3) {
      if (!formData.cardNumber || formData.cardNumber.length < 13)
        stepErrors.cardNumber = "A valid card number is required"
      if (!formData.cardHolderName)
        stepErrors.cardHolderName = "Cardholder name is required"
      if (!/^(0[1-9]|1[0-2])$/.test(formData.expiryMonth))
        stepErrors.expiryMonth = "Month must be 01 to 12"
      if (!/^\d{2}$/.test(formData.expiryYear))
        stepErrors.expiryYear = "Two digits"
      if (!/^\d{3,4}$/.test(formData.cvv)) stepErrors.cvv = "Three or four digits"
    }

    setErrors(stepErrors)
    return Object.keys(stepErrors).length === 0
  }

  const handleNext = () => {
    if (validateStep(step)) setStep(step + 1)
  }

  const handleSubmit = async () => {
    if (!validateStep(3)) return

    setIsLoading(true)
    setApiError("")

    const address = {
      addressLine1: formData.addressLine1,
      addressLine2: formData.addressLine2,
      city: formData.city,
      state: formData.state,
      zipCode: formData.zipCode,
      country: formData.country,
    }

    try {
      const response = await userAPI.updateDetails({
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone,
        shippingAddress: address,
        paymentDetails: {
          cardNumber: formData.cardNumber,
          cardHolderName: formData.cardHolderName,
          expiryMonth: formData.expiryMonth,
          expiryYear: formData.expiryYear,
          cvv: formData.cvv,
          sameAsShipping: formData.sameAsShipping,
          billingAddress: formData.sameAsShipping ? address : undefined,
        },
      })

      if (response.data.success) {
        setUser(response.data.data.user)
        navigate("/dashboard")
      }
    } catch (error: unknown) {
      const message =
        (error as { response?: { data?: { message?: string } } })?.response?.data
          ?.message ?? "Could not save your loadout. Try that again."
      setApiError(message)
    } finally {
      setIsLoading(false)
    }
  }

  const stage = STAGES[step - 1]

  return (
    <div className="min-h-svh bg-canvas">
      <AppBar minimal />

      <div className="mx-auto grid w-full max-w-[1280px] gap-12 px-6 py-14 lg:grid-cols-[15rem_1fr] lg:gap-16 lg:px-10 lg:py-20">
        {/* --- stage rail --- */}
        <aside>
          <div className="lg:sticky lg:top-28">
            <Eyebrow index="00">Build your loadout</Eyebrow>

            <ol className="mt-8 border-t border-line">
              {STAGES.map((item) => {
                const done = item.step < step
                const active = item.step === step
                return (
                  <li
                    key={item.step}
                    className="flex items-start gap-4 border-b border-line py-5"
                  >
                    <span
                      className={cn(
                        "mt-0.5 grid size-6 shrink-0 place-items-center border font-mono text-[10px] transition-colors duration-500",
                        done && "border-jade bg-jade text-void",
                        active && "border-signal bg-signal text-[#170502]",
                        !done && !active && "border-line text-faint"
                      )}
                    >
                      {done ? <Check className="size-3.5" /> : item.step}
                    </span>
                    <div className="min-w-0">
                      <p
                        className={cn(
                          "font-mono text-[11px] uppercase tracking-[0.16em] transition-colors duration-500",
                          active ? "text-bone" : "text-mute"
                        )}
                      >
                        {item.label}
                      </p>
                      <p className="mt-1 text-xs text-faint">{item.hint}</p>
                    </div>
                  </li>
                )
              })}
            </ol>

            <p className="mono-sm mt-7 leading-relaxed text-faint">
              Saved once. Editable from Settings whenever you want.
            </p>
          </div>
        </aside>

        {/* --- the step --- */}
        <main>
          <div className="flex items-baseline gap-6">
            <span className="display text-[clamp(3.5rem,9vw,7rem)] leading-none text-signal">
              {String(step).padStart(2, "0")}
            </span>
            <div>
              <h1 className="display text-3xl sm:text-4xl">{stage.label}</h1>
              <p className="mt-2 text-sm text-dim">{stage.hint}</p>
            </div>
          </div>

          <div
            aria-hidden
            className="mt-9 h-px w-full overflow-hidden bg-line"
          >
            <motion.div
              className="h-full origin-left bg-signal"
              initial={false}
              animate={{ scaleX: step / STAGES.length }}
              transition={{ duration: 0.8, ease: EASE_OUT_EXPO }}
            />
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.45, ease: EASE_OUT_EXPO }}
              className="mt-10"
            >
              {step === 1 && (
                <div className="max-w-xl space-y-6">
                  <div className="grid gap-6 sm:grid-cols-2">
                    <Field
                      label="First name"
                      required
                      autoComplete="given-name"
                      value={formData.firstName}
                      onChange={(e) => updateField("firstName", e.target.value)}
                      error={errors.firstName}
                      placeholder="Alex"
                    />
                    <Field
                      label="Last name"
                      required
                      autoComplete="family-name"
                      value={formData.lastName}
                      onChange={(e) => updateField("lastName", e.target.value)}
                      error={errors.lastName}
                      placeholder="Mercer"
                    />
                  </div>
                  <Field
                    label="Phone"
                    type="tel"
                    required
                    autoComplete="tel"
                    value={formData.phone}
                    onChange={(e) => updateField("phone", e.target.value)}
                    error={errors.phone}
                    hint="Stores use this for delivery updates"
                    placeholder="5551234567"
                  />
                </div>
              )}

              {step === 2 && (
                <div className="max-w-xl space-y-6">
                  <Field
                    label="Address line 1"
                    required
                    autoComplete="address-line1"
                    value={formData.addressLine1}
                    onChange={(e) => updateField("addressLine1", e.target.value)}
                    error={errors.addressLine1}
                    placeholder="123 Main Street"
                  />
                  <Field
                    label="Address line 2"
                    autoComplete="address-line2"
                    value={formData.addressLine2}
                    onChange={(e) => updateField("addressLine2", e.target.value)}
                    aside="Optional"
                    placeholder="Apt 4B"
                  />
                  <div className="grid gap-6 sm:grid-cols-2">
                    <Field
                      label="City"
                      required
                      autoComplete="address-level2"
                      value={formData.city}
                      onChange={(e) => updateField("city", e.target.value)}
                      error={errors.city}
                      placeholder="New York"
                    />
                    <SelectField
                      label="State"
                      required
                      autoComplete="address-level1"
                      value={formData.state}
                      onChange={(e) => updateField("state", e.target.value)}
                      error={errors.state}
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
                      required
                      autoComplete="postal-code"
                      value={formData.zipCode}
                      onChange={(e) => updateField("zipCode", e.target.value)}
                      error={errors.zipCode}
                      placeholder="10001"
                    />
                    <SelectField
                      label="Country"
                      required
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

              {step === 3 && (
                <div className="grid gap-12 lg:grid-cols-[1fr_20rem] lg:items-start">
                  <div className="space-y-6">
                    <Field
                      label="Card number"
                      required
                      inputMode="numeric"
                      autoComplete="cc-number"
                      maxLength={19}
                      value={formatCardNumber(formData.cardNumber)}
                      onChange={(e) =>
                        updateField(
                          "cardNumber",
                          e.target.value.replace(/\D/g, "").slice(0, 16)
                        )
                      }
                      error={errors.cardNumber}
                      placeholder="4242 4242 4242 4242"
                    />
                    <Field
                      label="Cardholder name"
                      required
                      autoComplete="cc-name"
                      value={formData.cardHolderName}
                      onChange={(e) =>
                        updateField("cardHolderName", e.target.value)
                      }
                      error={errors.cardHolderName}
                      placeholder="ALEX MERCER"
                    />
                    <div className="grid grid-cols-3 gap-4">
                      <Field
                        label="Month"
                        required
                        inputMode="numeric"
                        autoComplete="cc-exp-month"
                        maxLength={2}
                        value={formData.expiryMonth}
                        onChange={(e) =>
                          updateField(
                            "expiryMonth",
                            e.target.value.replace(/\D/g, "")
                          )
                        }
                        error={errors.expiryMonth}
                        placeholder="MM"
                      />
                      <Field
                        label="Year"
                        required
                        inputMode="numeric"
                        autoComplete="cc-exp-year"
                        maxLength={2}
                        value={formData.expiryYear}
                        onChange={(e) =>
                          updateField(
                            "expiryYear",
                            e.target.value.replace(/\D/g, "")
                          )
                        }
                        error={errors.expiryYear}
                        placeholder="YY"
                      />
                      <Field
                        label="CVV"
                        required
                        inputMode="numeric"
                        autoComplete="cc-csc"
                        maxLength={4}
                        value={formData.cvv}
                        onChange={(e) =>
                          updateField("cvv", e.target.value.replace(/\D/g, ""))
                        }
                        onFocus={() => setCvvFocused(true)}
                        onBlur={() => setCvvFocused(false)}
                        error={errors.cvv}
                        placeholder="123"
                      />
                    </div>

                    <label className="flex cursor-pointer items-center gap-3 pt-1">
                      <input
                        type="checkbox"
                        checked={formData.sameAsShipping}
                        onChange={(e) =>
                          updateField("sameAsShipping", e.target.checked)
                        }
                        className="size-4 accent-[#ff3d18]"
                      />
                      <span className="text-sm text-dim">
                        Billing address is the same as shipping
                      </span>
                    </label>
                  </div>

                  <div className="lg:sticky lg:top-28">
                    <PaymentCard
                      number={formData.cardNumber}
                      holder={formData.cardHolderName}
                      month={formData.expiryMonth}
                      year={formData.expiryYear}
                      cvv={formData.cvv}
                      flipped={cvvFocused}
                    />
                    <p className="mono-sm mt-4 leading-relaxed text-faint">
                      This is what the bot will type into the checkout.
                    </p>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {apiError && (
            <div
              role="alert"
              className="mt-8 flex max-w-xl items-start gap-3 border border-signal/40 bg-signal-wash px-4 py-3.5"
            >
              <AlertCircle className="mt-px size-4 shrink-0 text-signal" />
              <p className="mono-sm leading-relaxed text-signal">{apiError}</p>
            </div>
          )}

          <div className="mt-12 flex flex-col gap-3 sm:flex-row">
            {step > 1 && (
              <Button
                variant="outline"
                size="lg"
                onClick={() => setStep(step - 1)}
                disabled={isLoading}
                className="group"
              >
                <ArrowLeft className="size-4 transition-transform duration-300 group-hover:-translate-x-1" />
                Back
              </Button>
            )}

            {step < 3 ? (
              <Button size="lg" onClick={handleNext} className="group sm:min-w-52">
                Continue
                <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Button>
            ) : (
              <Button
                size="lg"
                onClick={handleSubmit}
                disabled={isLoading}
                className="group sm:min-w-52"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    Saving
                  </>
                ) : (
                  <>
                    Lock in the loadout
                    <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </>
                )}
              </Button>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
