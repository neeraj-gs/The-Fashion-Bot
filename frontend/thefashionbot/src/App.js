import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { RecoilRoot } from "recoil";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { Features } from "@/components/Features";
import { HowItWorks } from "@/components/HowItWorks";
import { LoginPage } from "@/pages/LoginPage";
import { OnboardingPage } from "@/pages/OnboardingPage";
import { DashboardPage } from "@/pages/DashboardPage";
import { CheckoutPage } from "@/pages/CheckoutPage";
import { SettingsPage } from "@/pages/SettingsPage";
import { ProtectedRoute } from "@/components/ProtectedRoute";
function LandingPage() {
    return (_jsxs("div", { className: "min-h-screen bg-white", children: [_jsx(Navbar, {}), _jsx(Hero, {}), _jsx(Features, {}), _jsx(HowItWorks, {})] }));
}
function App() {
    return (_jsx(RecoilRoot, { children: _jsx(Router, { children: _jsxs(Routes, { children: [_jsx(Route, { path: "/", element: _jsx(LandingPage, {}) }), _jsx(Route, { path: "/login", element: _jsx(LoginPage, {}) }), _jsx(Route, { path: "/onboarding", element: _jsx(ProtectedRoute, { requireOnboarding: false, children: _jsx(OnboardingPage, {}) }) }), _jsx(Route, { path: "/dashboard", element: _jsx(ProtectedRoute, { children: _jsx(DashboardPage, {}) }) }), _jsx(Route, { path: "/checkout", element: _jsx(ProtectedRoute, { children: _jsx(CheckoutPage, {}) }) }), _jsx(Route, { path: "/settings", element: _jsx(ProtectedRoute, { children: _jsx(SettingsPage, {}) }) }), _jsx(Route, { path: "*", element: _jsx(Navigate, { to: "/", replace: true }) })] }) }) }));
}
export default App;
