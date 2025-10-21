import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useSetRecoilState } from "recoil"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { authAPI } from "@/lib/api"
import { userState, tokenState } from "@/store/authState"
import Cookies from "js-cookie"
import { ShoppingBag, AlertCircle } from "lucide-react"

const authSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
})

export function LoginPage() {
  const navigate = useNavigate()
  const setUser = useSetRecoilState(userState)
  const setToken = useSetRecoilState(tokenState)

  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({})
  const [apiError, setApiError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const validateForm = () => {
    try {
      authSchema.parse({ email, password })
      setErrors({})
      return true
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors: { email?: string; password?: string } = {}
        error.issues.forEach((err) => {
          if (err.path[0]) {
            fieldErrors[err.path[0] as "email" | "password"] = err.message
          }
        })
        setErrors(fieldErrors)
      }
      return false
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setApiError("")

    if (!validateForm()) return

    setIsLoading(true)

    try {
      const response = isLogin
        ? await authAPI.login(email, password)
        : await authAPI.signup(email, password)

      if (response.data.success) {
        const { user, token } = response.data.data

        // Save token to cookies
        Cookies.set("token", token, { expires: 30 })

        // Update Recoil state
        setToken(token)
        setUser(user)

        // Check if user needs onboarding based on onBoarded flag
        if (!user.onBoarded) {
          navigate("/onboarding")
        } else {
          navigate("/dashboard")
        }
      }
    } catch (error: any) {
      const message =
        error.response?.data?.message || "An error occurred. Please try again."
      setApiError(message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-4">
            <ShoppingBag className="h-10 w-10 text-indigo-600" />
            <span className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              The Fashion Bot
            </span>
          </div>
          <p className="text-gray-600">
            {isLogin ? "Welcome back!" : "Create your account"}
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex gap-2">
              <Button
                type="button"
                variant={isLogin ? "default" : "ghost"}
                className={`flex-1 ${isLogin ? "bg-indigo-600 hover:bg-indigo-700" : ""}`}
                onClick={() => {
                  setIsLogin(true)
                  setErrors({})
                  setApiError("")
                }}
              >
                Login
              </Button>
              <Button
                type="button"
                variant={!isLogin ? "default" : "ghost"}
                className={`flex-1 ${!isLogin ? "bg-indigo-600 hover:bg-indigo-700" : ""}`}
                onClick={() => {
                  setIsLogin(false)
                  setErrors({})
                  setApiError("")
                }}
              >
                Sign Up
              </Button>
            </div>
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                  errors.email ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="you@example.com"
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                  errors.password ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="••••••••"
              />
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password}</p>
              )}
            </div>

            {/* API Error */}
            {apiError && (
              <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                <AlertCircle className="h-5 w-5 text-red-600" />
                <p className="text-red-600 text-sm">{apiError}</p>
              </div>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 py-6 text-lg"
              disabled={isLoading}
            >
              {isLoading ? "Please wait..." : isLogin ? "Login" : "Create Account"}
            </Button>
          </form>

          {/* Additional Info */}
          {!isLogin && (
            <p className="text-center text-sm text-gray-600 mt-4">
              After signup, you'll complete a one-time setup to save your details.
            </p>
          )}
        </div>

        {/* Back to Home */}
        <div className="text-center mt-6">
          <button
            onClick={() => navigate("/")}
            className="text-indigo-600 hover:text-indigo-700 text-sm font-medium"
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  )
}
