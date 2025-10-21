import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useRecoilState } from "recoil"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { userAPI } from "@/lib/api"
import { userState } from "@/store/authState"
import { AlertCircle, Sparkles, User, MapPin, CreditCard } from "lucide-react"

const onboardingSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  addressLine1: z.string().min(1, "Address is required"),
  addressLine2: z.string().optional(),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  zipCode: z.string().min(5, "ZIP code must be at least 5 digits"),
  country: z.string().min(1, "Country is required"),
  cardNumber: z.string().min(13, "Card number must be at least 13 digits"),
  cardHolderName: z.string().min(1, "Cardholder name is required"),
  expiryMonth: z.string().regex(/^(0[1-9]|1[0-2])$/, "Invalid month (01-12)"),
  expiryYear: z.string().regex(/^\d{2}$/, "Invalid year (YY format)"),
  cvv: z.string().regex(/^\d{3,4}$/, "CVV must be 3-4 digits"),
  sameAsShipping: z.boolean(),
})

export function OnboardingPage() {
  const navigate = useNavigate()
  const [user, setUser] = useRecoilState(userState)

  const [step, setStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [apiError, setApiError] = useState("")

  // Form state
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
    // Clear error for this field
    setErrors((prev) => ({ ...prev, [field]: "" }))
  }

  const validateStep = (currentStep: number) => {
    const stepErrors: Record<string, string> = {}

    if (currentStep === 1) {
      if (!formData.firstName) stepErrors.firstName = "First name is required"
      if (!formData.lastName) stepErrors.lastName = "Last name is required"
      if (!formData.phone || formData.phone.length < 10)
        stepErrors.phone = "Valid phone number is required"
    }

    if (currentStep === 2) {
      if (!formData.addressLine1) stepErrors.addressLine1 = "Address is required"
      if (!formData.city) stepErrors.city = "City is required"
      if (!formData.state) stepErrors.state = "State is required"
      if (!formData.zipCode || formData.zipCode.length < 5)
        stepErrors.zipCode = "Valid ZIP code is required"
    }

    if (currentStep === 3) {
      if (!formData.cardNumber || formData.cardNumber.length < 13)
        stepErrors.cardNumber = "Valid card number is required"
      if (!formData.cardHolderName)
        stepErrors.cardHolderName = "Cardholder name is required"
      if (!/^(0[1-9]|1[0-2])$/.test(formData.expiryMonth))
        stepErrors.expiryMonth = "Invalid month (01-12)"
      if (!/^\d{2}$/.test(formData.expiryYear))
        stepErrors.expiryYear = "Invalid year (YY)"
      if (!/^\d{3,4}$/.test(formData.cvv)) stepErrors.cvv = "Invalid CVV"
    }

    setErrors(stepErrors)
    return Object.keys(stepErrors).length === 0
  }

  const handleNext = () => {
    if (validateStep(step)) {
      setStep(step + 1)
    }
  }

  const handleSubmit = async () => {
    if (!validateStep(3)) return

    setIsLoading(true)
    setApiError("")

    try {
      const updateData = {
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
          sameAsShipping: formData.sameAsShipping,
          billingAddress: formData.sameAsShipping
            ? {
                addressLine1: formData.addressLine1,
                addressLine2: formData.addressLine2,
                city: formData.city,
                state: formData.state,
                zipCode: formData.zipCode,
                country: formData.country,
              }
            : undefined,
        },
      }

      const response = await userAPI.updateDetails(updateData)

      if (response.data.success) {
        setUser(response.data.data.user)
        navigate("/dashboard")
      }
    } catch (error: any) {
      const message =
        error.response?.data?.message || "Failed to save details. Please try again."
      setApiError(message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-100 text-indigo-700 text-sm font-medium mb-4">
            <Sparkles className="h-4 w-4" />
            <span>One-Time Setup</span>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Complete Your Profile
          </h1>
          <p className="text-gray-600">
            Save your details once and never fill checkout forms again!
          </p>
        </div>

        {/* Progress Bar */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                  s < step
                    ? "bg-green-500 text-white"
                    : s === step
                    ? "bg-indigo-600 text-white"
                    : "bg-gray-200 text-gray-500"
                }`}
              >
                {s < step ? "✓" : s}
              </div>
              {s < 3 && (
                <div
                  className={`w-16 h-1 ${
                    s < step ? "bg-green-500" : "bg-gray-200"
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8">
          {/* Step 1: Basic Details */}
          {step === 1 && (
            <div className="space-y-6">
              <div className="flex items-center gap-2 text-indigo-600 mb-4">
                <User className="h-6 w-6" />
                <h2 className="text-2xl font-bold">Basic Details</h2>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    First Name *
                  </label>
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => updateField("firstName", e.target.value)}
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                      errors.firstName ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="John"
                  />
                  {errors.firstName && (
                    <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => updateField("lastName", e.target.value)}
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                      errors.lastName ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="Doe"
                  />
                  {errors.lastName && (
                    <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => updateField("phone", e.target.value)}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                    errors.phone ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="1234567890"
                />
                {errors.phone && (
                  <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
                )}
              </div>
            </div>
          )}

          {/* Step 2: Shipping Address */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="flex items-center gap-2 text-indigo-600 mb-4">
                <MapPin className="h-6 w-6" />
                <h2 className="text-2xl font-bold">Shipping Address</h2>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Address Line 1 *
                </label>
                <input
                  type="text"
                  value={formData.addressLine1}
                  onChange={(e) => updateField("addressLine1", e.target.value)}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                    errors.addressLine1 ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="123 Main Street"
                />
                {errors.addressLine1 && (
                  <p className="text-red-500 text-sm mt-1">{errors.addressLine1}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Address Line 2 (Optional)
                </label>
                <input
                  type="text"
                  value={formData.addressLine2}
                  onChange={(e) => updateField("addressLine2", e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Apt 4B"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    City *
                  </label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => updateField("city", e.target.value)}
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                      errors.city ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="New York"
                  />
                  {errors.city && (
                    <p className="text-red-500 text-sm mt-1">{errors.city}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    State *
                  </label>
                  <select
                    value={formData.state}
                    onChange={(e) => updateField("state", e.target.value)}
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                      errors.state ? "border-red-500" : "border-gray-300"
                    }`}
                  >
                    <option value="">Select State</option>
                    <option value="AL">Alabama</option>
                    <option value="AK">Alaska</option>
                    <option value="AZ">Arizona</option>
                    <option value="CA">California</option>
                    <option value="FL">Florida</option>
                    <option value="NY">New York</option>
                    <option value="TX">Texas</option>
                    {/* Add more states as needed */}
                  </select>
                  {errors.state && (
                    <p className="text-red-500 text-sm mt-1">{errors.state}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    ZIP Code *
                  </label>
                  <input
                    type="text"
                    value={formData.zipCode}
                    onChange={(e) => updateField("zipCode", e.target.value)}
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                      errors.zipCode ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="10001"
                  />
                  {errors.zipCode && (
                    <p className="text-red-500 text-sm mt-1">{errors.zipCode}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Country *
                  </label>
                  <select
                    value={formData.country}
                    onChange={(e) => updateField("country", e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="USA">United States</option>
                    <option value="India">India</option>
                    <option value="Canada">Canada</option>
                    <option value="UK">United Kingdom</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Payment Details */}
          {step === 3 && (
            <div className="space-y-6">
              <div className="flex items-center gap-2 text-indigo-600 mb-4">
                <CreditCard className="h-6 w-6" />
                <h2 className="text-2xl font-bold">Payment Details</h2>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Card Number *
                </label>
                <input
                  type="text"
                  value={formData.cardNumber}
                  onChange={(e) => updateField("cardNumber", e.target.value.replace(/\s/g, ""))}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                    errors.cardNumber ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="1234567890123456"
                  maxLength={16}
                />
                {errors.cardNumber && (
                  <p className="text-red-500 text-sm mt-1">{errors.cardNumber}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Cardholder Name *
                </label>
                <input
                  type="text"
                  value={formData.cardHolderName}
                  onChange={(e) => updateField("cardHolderName", e.target.value)}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                    errors.cardHolderName ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="JOHN DOE"
                />
                {errors.cardHolderName && (
                  <p className="text-red-500 text-sm mt-1">{errors.cardHolderName}</p>
                )}
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Expiry Month *
                  </label>
                  <input
                    type="text"
                    value={formData.expiryMonth}
                    onChange={(e) => updateField("expiryMonth", e.target.value)}
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                      errors.expiryMonth ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="MM"
                    maxLength={2}
                  />
                  {errors.expiryMonth && (
                    <p className="text-red-500 text-sm mt-1">{errors.expiryMonth}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Expiry Year *
                  </label>
                  <input
                    type="text"
                    value={formData.expiryYear}
                    onChange={(e) => updateField("expiryYear", e.target.value)}
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                      errors.expiryYear ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="YY"
                    maxLength={2}
                  />
                  {errors.expiryYear && (
                    <p className="text-red-500 text-sm mt-1">{errors.expiryYear}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    CVV *
                  </label>
                  <input
                    type="text"
                    value={formData.cvv}
                    onChange={(e) => updateField("cvv", e.target.value)}
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                      errors.cvv ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="123"
                    maxLength={4}
                  />
                  {errors.cvv && (
                    <p className="text-red-500 text-sm mt-1">{errors.cvv}</p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="sameAsShipping"
                  checked={formData.sameAsShipping}
                  onChange={(e) => updateField("sameAsShipping", e.target.checked)}
                  className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                />
                <label htmlFor="sameAsShipping" className="text-sm text-gray-700">
                  Billing address same as shipping address
                </label>
              </div>
            </div>
          )}

          {/* API Error */}
          {apiError && (
            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg mt-4">
              <AlertCircle className="h-5 w-5 text-red-600" />
              <p className="text-red-600 text-sm">{apiError}</p>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex gap-4 mt-8">
            {step > 1 && (
              <Button
                variant="outline"
                onClick={() => setStep(step - 1)}
                className="flex-1"
                disabled={isLoading}
              >
                Back
              </Button>
            )}
            {step < 3 ? (
              <Button
                onClick={handleNext}
                className="flex-1 bg-indigo-600 hover:bg-indigo-700"
              >
                Next
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                className="flex-1 bg-indigo-600 hover:bg-indigo-700"
                disabled={isLoading}
              >
                {isLoading ? "Saving..." : "Complete Setup"}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
