import { useEffect, useState } from "react"
import { Navigate, useLocation } from "react-router-dom"
import { useRecoilState, useRecoilValue } from "recoil"
import { userState, tokenState, isOnboardedState } from "@/store/authState"
import { authAPI } from "@/lib/api"
import { Mark } from "@/components/chrome/Mark"

interface ProtectedRouteProps {
  children: React.ReactNode
  requireOnboarding?: boolean
}

/** The boot screen while the session is being resolved. */
function Booting() {
  return (
    <div className="grid min-h-svh place-items-center bg-canvas">
      <div className="flex flex-col items-center">
        <div className="relative">
          <Mark className="size-10" />
          <span
            aria-hidden
            className="absolute inset-x-0 top-0 h-px bg-signal scanline"
          />
        </div>
        <p className="mono-label mt-6 text-faint">Resuming session</p>
      </div>
    </div>
  )
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

  if (isLoading) return <Booting />

  if (!token || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  if (requireOnboarding && !isOnboarded && location.pathname !== "/onboarding") {
    return <Navigate to="/onboarding" replace />
  }

  return <>{children}</>
}
