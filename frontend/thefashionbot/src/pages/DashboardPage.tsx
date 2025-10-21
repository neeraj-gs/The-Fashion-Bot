import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useRecoilValue } from "recoil"
import { userState } from "@/store/authState"
import { Button } from "@/components/ui/button"
import { ShoppingCart, Settings, Sparkles, User, MapPin, CreditCard } from "lucide-react"

export function DashboardPage() {
  const navigate = useNavigate()
  const user = useRecoilValue(userState)
  const [showCheckoutModal, setShowCheckoutModal] = useState(false)

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2">
                Welcome back, {user.firstName || "there"}!
              </h1>
              <p className="text-indigo-100 text-lg">
                Your personal fashion bot is ready to shop for you.
              </p>
            </div>
            <Button
              onClick={() => navigate("/settings")}
              variant="outline"
              className="bg-white text-indigo-600 hover:bg-indigo-50 border-0"
            >
              <Settings className="h-5 w-5 mr-2" />
              Settings
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Quick Action Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8 mb-8">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-100 text-indigo-700 text-sm font-medium mb-6">
              <Sparkles className="h-4 w-4" />
              <span>Ready to Shop</span>
            </div>

            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Start Your Automated Checkout
            </h2>
            <p className="text-gray-600 text-lg mb-8 max-w-2xl mx-auto">
              Just paste a product link and let our bot handle the rest. Your saved details will be used for instant checkout.
            </p>

            <Button
              size="lg"
              onClick={() => setShowCheckoutModal(true)}
              className="bg-indigo-600 hover:bg-indigo-700 text-lg px-12 py-6"
            >
              <ShoppingCart className="h-6 w-6 mr-2" />
              Start Checkout
            </Button>
          </div>
        </div>

        {/* User Information Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Basic Info */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-indigo-100 flex items-center justify-center">
                <User className="h-6 w-6 text-indigo-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Basic Info</h3>
            </div>
            <div className="space-y-2 text-sm">
              <p className="text-gray-600">
                <span className="font-medium text-gray-900">Name:</span>{" "}
                {user.firstName} {user.lastName}
              </p>
              <p className="text-gray-600">
                <span className="font-medium text-gray-900">Email:</span> {user.email}
              </p>
              <p className="text-gray-600">
                <span className="font-medium text-gray-900">Phone:</span> {user.phone}
              </p>
            </div>
          </div>

          {/* Shipping Info */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
                <MapPin className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Shipping</h3>
            </div>
            <div className="space-y-2 text-sm">
              <p className="text-gray-600">
                {user.shippingAddress?.addressLine1}
              </p>
              {user.shippingAddress?.addressLine2 && (
                <p className="text-gray-600">{user.shippingAddress.addressLine2}</p>
              )}
              <p className="text-gray-600">
                {user.shippingAddress?.city}, {user.shippingAddress?.state}{" "}
                {user.shippingAddress?.zipCode}
              </p>
              <p className="text-gray-600">{user.shippingAddress?.country}</p>
            </div>
          </div>

          {/* Payment Info */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center">
                <CreditCard className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Payment</h3>
            </div>
            <div className="space-y-2 text-sm">
              <p className="text-gray-600">
                <span className="font-medium text-gray-900">Card:</span> ****{" "}
                {user.paymentDetails?.cardNumber?.slice(-4)}
              </p>
              <p className="text-gray-600">
                <span className="font-medium text-gray-900">Name:</span>{" "}
                {user.paymentDetails?.cardHolderName}
              </p>
              <p className="text-gray-600">
                <span className="font-medium text-gray-900">Expires:</span>{" "}
                {user.paymentDetails?.expiryMonth}/{user.paymentDetails?.expiryYear}
              </p>
            </div>
          </div>
        </div>

        {/* Info Banner */}
        <div className="mt-8 bg-indigo-50 border border-indigo-200 rounded-xl p-6">
          <div className="flex items-start gap-3">
            <Sparkles className="h-6 w-6 text-indigo-600 mt-1" />
            <div>
              <h4 className="font-semibold text-indigo-900 mb-1">
                Your information is secure
              </h4>
              <p className="text-indigo-700 text-sm">
                All your data is encrypted and stored securely. We use bank-level security to protect your information. You can update your details anytime from Settings.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Checkout Modal */}
      {showCheckoutModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={() => setShowCheckoutModal(false)}
        >
          <div
            className="bg-white rounded-2xl max-w-md w-full p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Ready to start?
            </h3>
            <p className="text-gray-600 mb-6">
              You'll be able to select a store and paste your product link in the next step.
            </p>
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setShowCheckoutModal(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={() => {
                  setShowCheckoutModal(false)
                  navigate("/checkout")
                }}
                className="flex-1 bg-indigo-600 hover:bg-indigo-700"
              >
                Continue
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
