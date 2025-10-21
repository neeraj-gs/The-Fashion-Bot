import { useEffect, useState } from "react"
import { Navigate, useLocation } from "react-router-dom"
import { useRecoilState, useRecoilValue } from "recoil"
import { userState, tokenState, isOnboardedState } from "@/store/authState"
import { authAPI } from "@/lib/api"
import { Loader2 } from "lucide-react"

interface ProtectedRouteProps {
  children: React.ReactNode
  requireOnboarding?: boolean
}

export function ProtectedRoute({
  children,
  requireOnboarding = true,
}: ProtectedRouteProps) {
  const location = useLocation()
  const [user, setUser] = useRecoilState(userState)
  const token = useRecoilValue(tokenState)
  const isOnboarded = useRecoilValue(isOnboardedState)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchUser = async () => {
      if (token && !user) {
        try {
          const response = await authAPI.getCurrentUser()
          if (response.data.success) {
            setUser(response.data.data.user)
          }
        } catch (error) {
          console.error("Failed to fetch user:", error)
        }
      }
      setIsLoading(false)
    }

    fetchUser()
  }, [token, user, setUser])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50">
        <div className="text-center">
          <Loader2 className="h-12 w-12 text-indigo-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  // Not authenticated - redirect to login
  if (!token || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  // Authenticated but not onboarded - redirect to onboarding
  if (requireOnboarding && !isOnboarded && location.pathname !== "/onboarding") {
    return <Navigate to="/onboarding" replace />
  }

  // Authenticated and onboarded (or onboarding not required) - render children
  return <>{children}</>
}
