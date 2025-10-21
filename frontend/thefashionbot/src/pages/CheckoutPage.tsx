import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useRecoilValue } from "recoil"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { automationAPI } from "@/lib/api"
import { userState } from "@/store/authState"
import {
  ShoppingCart,
  AlertCircle,
  CheckCircle,
  Loader2,
  Link as LinkIcon,
  Package,
  Hash,
} from "lucide-react"

const checkoutSchema = z.object({
  store: z.enum(["Stanley", "TonesFashion"], {
    errorMap: () => ({ message: "Please select a valid store" }),
  }),
  productUrl: z.string().url("Please enter a valid URL"),
  quantity: z.number().min(1, "Quantity must be at least 1"),
  size: z.string().optional(),
})

export function CheckoutPage() {
  const navigate = useNavigate()
  const user = useRecoilValue(userState)

  const [store, setStore] = useState("")
  const [productUrl, setProductUrl] = useState("")
  const [quantity, setQuantity] = useState(1)
  const [size, setSize] = useState("")

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(false)
  const [automationStatus, setAutomationStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [automationMessage, setAutomationMessage] = useState("")

  const validateForm = () => {
    try {
      checkoutSchema.parse({
        store,
        productUrl,
        quantity,
        size: store === "TonesFashion" ? size : undefined,
      })
      setErrors({})
      return true
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors: Record<string, string> = {}
        error.errors.forEach((err) => {
          if (err.path[0]) {
            fieldErrors[err.path[0] as string] = err.message
          }
        })
        setErrors(fieldErrors)
      }
      return false
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Additional validation for size if Tones Fashion
    if (store === "TonesFashion" && !size) {
      setErrors({ ...errors, size: "Size is required for Tones Fashion" })
      return
    }

    if (!validateForm()) return

    setIsLoading(true)
    setAutomationStatus("loading")
    setAutomationMessage("Starting automation bot...")

    try {
      const orderData: any = {
        productUrl,
        quantity,
      }

      if (store === "TonesFashion") {
        orderData.size = size
      }

      const response = await automationAPI.startAutomation(store, orderData)

      if (response.data.success) {
        setAutomationStatus("success")
        setAutomationMessage(
          response.data.message || "Checkout completed successfully!"
        )
      } else {
        setAutomationStatus("error")
        setAutomationMessage(
          response.data.message || "Automation failed. Please try again."
        )
      }
    } catch (error: any) {
      setAutomationStatus("error")
      const message =
        error.response?.data?.message || "Failed to start automation. Please try again."
      setAutomationMessage(message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleReset = () => {
    setStore("")
    setProductUrl("")
    setQuantity(1)
    setSize("")
    setErrors({})
    setAutomationStatus("idle")
    setAutomationMessage("")
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-100 text-indigo-700 text-sm font-medium mb-4">
            <ShoppingCart className="h-4 w-4" />
            <span>Automated Checkout</span>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Start Your Order
          </h1>
          <p className="text-gray-600">
            Select a store and paste your product link. We'll handle the rest!
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8">
          {automationStatus === "idle" || automationStatus === "loading" ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Store Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Store *
                </label>
                <select
                  value={store}
                  onChange={(e) => {
                    setStore(e.target.value)
                    setSize("") // Reset size when store changes
                    setErrors({ ...errors, store: "" })
                  }}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                    errors.store ? "border-red-500" : "border-gray-300"
                  }`}
                  disabled={isLoading}
                >
                  <option value="">Choose a store...</option>
                  <option value="Stanley">Stanley 1913</option>
                  <option value="TonesFashion">Tones Fashion</option>
                  <option value="" disabled>
                    Nike (Coming Soon)
                  </option>
                  <option value="" disabled>
                    Adidas (Coming Soon)
                  </option>
                  <option value="" disabled>
                    Supreme (Coming Soon)
                  </option>
                </select>
                {errors.store && (
                  <p className="text-red-500 text-sm mt-1">{errors.store}</p>
                )}
              </div>

              {/* Product URL */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Product URL *
                </label>
                <div className="relative">
                  <LinkIcon className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                  <input
                    type="url"
                    value={productUrl}
                    onChange={(e) => {
                      setProductUrl(e.target.value)
                      setErrors({ ...errors, productUrl: "" })
                    }}
                    className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                      errors.productUrl ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="https://example.com/product/..."
                    disabled={isLoading}
                  />
                </div>
                {errors.productUrl && (
                  <p className="text-red-500 text-sm mt-1">{errors.productUrl}</p>
                )}
                <p className="text-gray-500 text-sm mt-1">
                  Copy and paste the full product page URL from the store
                </p>
              </div>

              {/* Quantity */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quantity *
                </label>
                <div className="relative">
                  <Hash className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => {
                      setQuantity(parseInt(e.target.value) || 1)
                      setErrors({ ...errors, quantity: "" })
                    }}
                    min="1"
                    max="10"
                    className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                      errors.quantity ? "border-red-500" : "border-gray-300"
                    }`}
                    disabled={isLoading}
                  />
                </div>
                {errors.quantity && (
                  <p className="text-red-500 text-sm mt-1">{errors.quantity}</p>
                )}
              </div>

              {/* Size (Only for Tones Fashion) */}
              {store === "TonesFashion" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Size *
                  </label>
                  <div className="relative">
                    <Package className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                    <select
                      value={size}
                      onChange={(e) => {
                        setSize(e.target.value)
                        setErrors({ ...errors, size: "" })
                      }}
                      className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                        errors.size ? "border-red-500" : "border-gray-300"
                      }`}
                      disabled={isLoading}
                    >
                      <option value="">Select size...</option>
                      <option value="XS">XS</option>
                      <option value="S">S</option>
                      <option value="M">M</option>
                      <option value="L">L</option>
                      <option value="XL">XL</option>
                      <option value="XXL">XXL</option>
                    </select>
                  </div>
                  {errors.size && (
                    <p className="text-red-500 text-sm mt-1">{errors.size}</p>
                  )}
                </div>
              )}

              {/* Info Box */}
              <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
                <p className="text-indigo-900 text-sm">
                  <span className="font-semibold">Note:</span> The bot will use your saved shipping and payment details to complete the checkout automatically. Make sure the product is in stock and available.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/dashboard")}
                  className="flex-1"
                  disabled={isLoading}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="flex-1 bg-indigo-600 hover:bg-indigo-700"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    "Start Automation"
                  )}
                </Button>
              </div>
            </form>
          ) : (
            /* Result Display */
            <div className="text-center py-8">
              {automationStatus === "success" ? (
                <div className="space-y-4">
                  <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="h-10 w-10 text-green-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">Success!</h3>
                  <p className="text-gray-600 max-w-md mx-auto">
                    {automationMessage}
                  </p>
                  <div className="flex gap-4 justify-center mt-8">
                    <Button
                      onClick={handleReset}
                      className="bg-indigo-600 hover:bg-indigo-700"
                    >
                      Place Another Order
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => navigate("/dashboard")}
                    >
                      Back to Dashboard
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
                    <AlertCircle className="h-10 w-10 text-red-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">
                    Automation Failed
                  </h3>
                  <p className="text-gray-600 max-w-md mx-auto">
                    {automationMessage}
                  </p>
                  <div className="flex gap-4 justify-center mt-8">
                    <Button
                      onClick={handleReset}
                      className="bg-indigo-600 hover:bg-indigo-700"
                    >
                      Try Again
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => navigate("/dashboard")}
                    >
                      Back to Dashboard
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Loading Overlay */}
        {isLoading && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-8 max-w-md mx-4 text-center">
              <Loader2 className="h-16 w-16 text-indigo-600 animate-spin mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Automation in Progress
              </h3>
              <p className="text-gray-600">
                Our bot is working on your checkout. This may take a few moments...
              </p>
              <div className="mt-6 space-y-2 text-left">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <div className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse" />
                  <span>Navigating to product page</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <div className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse" />
                  <span>Adding to cart</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <div className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse" />
                  <span>Filling checkout details</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <div className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse" />
                  <span>Completing order</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
