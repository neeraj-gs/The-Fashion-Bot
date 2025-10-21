import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import { RecoilRoot } from "recoil"
import { Navbar } from "@/components/Navbar"
import { Hero } from "@/components/Hero"
import { Features } from "@/components/Features"
import { HowItWorks } from "@/components/HowItWorks"
import { LoginPage } from "@/pages/LoginPage"
import { OnboardingPage } from "@/pages/OnboardingPage"
import { DashboardPage } from "@/pages/DashboardPage"
import { CheckoutPage } from "@/pages/CheckoutPage"
import { SettingsPage } from "@/pages/SettingsPage"
import { ProtectedRoute } from "@/components/ProtectedRoute"

function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <Hero />
      <Features />
      <HowItWorks />
    </div>
  )
}

function App() {
  return (
    <RecoilRoot>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />

          {/* Protected Routes */}
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

          {/* Catch all - redirect to home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </RecoilRoot>
  )
}

export default App