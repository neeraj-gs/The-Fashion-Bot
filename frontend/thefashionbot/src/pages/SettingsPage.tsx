import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useRecoilState } from "recoil"
import { Button } from "@/components/ui/button"
import { userAPI } from "@/lib/api"
import { userState } from "@/store/authState"
import Cookies from "js-cookie"
import {
  User,
  MapPin,
  CreditCard,
  AlertCircle,
  CheckCircle,
  ArrowLeft,
  LogOut,
} from "lucide-react"

export function SettingsPage() {
  const navigate = useNavigate()
  const [user, setUser] = useRecoilState(userState)

  const [activeTab, setActiveTab] = useState<"basic" | "shipping" | "payment">("basic")
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  // Form state
  const [formData, setFormData] = useState({
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
  })

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        phone: user.phone || "",
        addressLine1: user.shippingAddress?.addressLine1 || "",
        addressLine2: user.shippingAddress?.addressLine2 || "",
        city: user.shippingAddress?.city || "",
        state: user.shippingAddress?.state || "",
        zipCode: user.shippingAddress?.zipCode || "",
        country: user.shippingAddress?.country || "USA",
        cardNumber: user.paymentDetails?.cardNumber || "",
        cardHolderName: user.paymentDetails?.cardHolderName || "",
        expiryMonth: user.paymentDetails?.expiryMonth || "",
        expiryYear: user.paymentDetails?.expiryYear || "",
        cvv: user.paymentDetails?.cvv || "",
      })
    }
  }, [user])

  const updateField = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSave = async () => {
    setIsLoading(true)
    setMessage(null)

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
          sameAsShipping: true,
        },
      }

      const response = await userAPI.updateDetails(updateData)

      if (response.data.success) {
        setUser(response.data.data.user)
        setMessage({ type: "success", text: "Settings updated successfully!" })
        setTimeout(() => setMessage(null), 3000)
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Failed to update settings. Please try again."
      setMessage({ type: "error", text: errorMessage })
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = () => {
    Cookies.remove("token")
    setUser(null)
    navigate("/login")
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <button
              onClick={() => navigate("/dashboard")}
              className="flex items-center gap-2 text-indigo-600 hover:text-indigo-700 mb-4"
            >
              <ArrowLeft className="h-5 w-5" />
              <span className="font-medium">Back to Dashboard</span>
            </button>
            <h1 className="text-4xl font-bold text-gray-900">Settings</h1>
            <p className="text-gray-600 mt-2">
              Manage your account details and preferences
            </p>
          </div>
          <Button
            variant="outline"
            onClick={handleLogout}
            className="border-red-300 text-red-600 hover:bg-red-50"
          >
            <LogOut className="h-5 w-5 mr-2" />
            Logout
          </Button>
        </div>

        {/* Message Banner */}
        {message && (
          <div
            className={`flex items-center gap-2 p-4 rounded-lg mb-6 ${
              message.type === "success"
                ? "bg-green-50 border border-green-200"
                : "bg-red-50 border border-red-200"
            }`}
          >
            {message.type === "success" ? (
              <CheckCircle className="h-5 w-5 text-green-600" />
            ) : (
              <AlertCircle className="h-5 w-5 text-red-600" />
            )}
            <p
              className={`text-sm font-medium ${
                message.type === "success" ? "text-green-900" : "text-red-900"
              }`}
            >
              {message.text}
            </p>
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
          {/* Tabs */}
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab("basic")}
              className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 font-medium transition-colors ${
                activeTab === "basic"
                  ? "bg-indigo-50 text-indigo-600 border-b-2 border-indigo-600"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              <User className="h-5 w-5" />
              <span>Basic Info</span>
            </button>
            <button
              onClick={() => setActiveTab("shipping")}
              className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 font-medium transition-colors ${
                activeTab === "shipping"
                  ? "bg-indigo-50 text-indigo-600 border-b-2 border-indigo-600"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              <MapPin className="h-5 w-5" />
              <span>Shipping</span>
            </button>
            <button
              onClick={() => setActiveTab("payment")}
              className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 font-medium transition-colors ${
                activeTab === "payment"
                  ? "bg-indigo-50 text-indigo-600 border-b-2 border-indigo-600"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              <CreditCard className="h-5 w-5" />
              <span>Payment</span>
            </button>
          </div>

          {/* Content */}
          <div className="p-8">
            {/* Basic Info Tab */}
            {activeTab === "basic" && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email (Cannot be changed)
                  </label>
                  <input
                    type="email"
                    value={user.email}
                    disabled
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      First Name
                    </label>
                    <input
                      type="text"
                      value={formData.firstName}
                      onChange={(e) => updateField("firstName", e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Last Name
                    </label>
                    <input
                      type="text"
                      value={formData.lastName}
                      onChange={(e) => updateField("lastName", e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => updateField("phone", e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>
            )}

            {/* Shipping Tab */}
            {activeTab === "shipping" && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Address Line 1
                  </label>
                  <input
                    type="text"
                    value={formData.addressLine1}
                    onChange={(e) => updateField("addressLine1", e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
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
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      City
                    </label>
                    <input
                      type="text"
                      value={formData.city}
                      onChange={(e) => updateField("city", e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      State
                    </label>
                    <select
                      value={formData.state}
                      onChange={(e) => updateField("state", e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="">Select State</option>
                      <option value="AL">Alabama</option>
                      <option value="AK">Alaska</option>
                      <option value="AZ">Arizona</option>
                      <option value="CA">California</option>
                      <option value="FL">Florida</option>
                      <option value="NY">New York</option>
                      <option value="TX">Texas</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      ZIP Code
                    </label>
                    <input
                      type="text"
                      value={formData.zipCode}
                      onChange={(e) => updateField("zipCode", e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Country
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

            {/* Payment Tab */}
            {activeTab === "payment" && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Card Number
                  </label>
                  <input
                    type="text"
                    value={formData.cardNumber}
                    onChange={(e) => updateField("cardNumber", e.target.value.replace(/\s/g, ""))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    maxLength={16}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Cardholder Name
                  </label>
                  <input
                    type="text"
                    value={formData.cardHolderName}
                    onChange={(e) => updateField("cardHolderName", e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Expiry Month
                    </label>
                    <input
                      type="text"
                      value={formData.expiryMonth}
                      onChange={(e) => updateField("expiryMonth", e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="MM"
                      maxLength={2}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Expiry Year
                    </label>
                    <input
                      type="text"
                      value={formData.expiryYear}
                      onChange={(e) => updateField("expiryYear", e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="YY"
                      maxLength={2}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      CVV
                    </label>
                    <input
                      type="text"
                      value={formData.cvv}
                      onChange={(e) => updateField("cvv", e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="123"
                      maxLength={4}
                    />
                  </div>
                </div>

                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                  <p className="text-amber-900 text-sm">
                    <span className="font-semibold">Security Note:</span> Your payment information is encrypted and stored securely. We use industry-standard security measures to protect your data.
                  </p>
                </div>
              </div>
            )}

            {/* Save Button */}
            <div className="mt-8">
              <Button
                onClick={handleSave}
                className="w-full bg-indigo-600 hover:bg-indigo-700 py-6"
                disabled={isLoading}
              >
                {isLoading ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
