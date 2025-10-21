import { useNavigate, useLocation } from "react-router-dom"
import { useRecoilValue } from "recoil"
import { Button } from "@/components/ui/button"
import { isAuthenticatedState } from "@/store/authState"
import { ShoppingBag } from "lucide-react"

export function Navbar() {
  const navigate = useNavigate()
  const location = useLocation()
  const isAuthenticated = useRecoilValue(isAuthenticatedState)

  // Hide navbar on certain pages
  const hideNavbar = ["/login", "/onboarding", "/dashboard", "/checkout", "/settings"].includes(
    location.pathname
  )

  if (hideNavbar) {
    return null
  }

  return (
    <nav className="border-b border-gray-200 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Title */}
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 cursor-pointer"
          >
            <ShoppingBag className="h-8 w-8 text-indigo-600" />
            <span className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              The Fashion Bot
            </span>
          </button>

          {/* Auth Buttons */}
          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <Button
                onClick={() => navigate("/dashboard")}
                className="bg-indigo-600 hover:bg-indigo-700 font-medium"
              >
                Dashboard
              </Button>
            ) : (
              <>
                <Button
                  variant="ghost"
                  className="font-medium"
                  onClick={() => navigate("/login")}
                >
                  Login
                </Button>
                <Button
                  className="bg-indigo-600 hover:bg-indigo-700 font-medium"
                  onClick={() => navigate("/login")}
                >
                  Sign Up
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
