import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import { RecoilRoot } from "recoil"
import { LandingPage } from "@/pages/LandingPage"
import { LoginPage } from "@/pages/LoginPage"
import { OnboardingPage } from "@/pages/OnboardingPage"
import { DashboardPage } from "@/pages/DashboardPage"
import { CheckoutPage } from "@/pages/CheckoutPage"
import { SettingsPage } from "@/pages/SettingsPage"
import { ProtectedRoute } from "@/components/ProtectedRoute"

function App() {
  return (
    <RecoilRoot>
      <Router>
        <Routes>
          {/* Public */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />

          {/* Protected */}
          <Route
            path="/onboarding"
            element={
              <ProtectedRoute requireOnboarding={false}>
                <OnboardingPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/checkout"
            element={
              <ProtectedRoute>
                <CheckoutPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <SettingsPage />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </RecoilRoot>
  )
}

export default App
