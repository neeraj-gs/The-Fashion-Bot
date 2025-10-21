import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useNavigate, useLocation } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { Button } from "@/components/ui/button";
import { isAuthenticatedState } from "@/store/authState";
import { ShoppingBag } from "lucide-react";
export function Navbar() {
    var navigate = useNavigate();
    var location = useLocation();
    var isAuthenticated = useRecoilValue(isAuthenticatedState);
    // Hide navbar on certain pages
    var hideNavbar = ["/login", "/onboarding", "/dashboard", "/checkout", "/settings"].includes(location.pathname);
    if (hideNavbar) {
        return null;
    }
    return (_jsx("nav", { className: "border-b border-gray-200 bg-white/80 backdrop-blur-sm sticky top-0 z-50", children: _jsx("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8", children: _jsxs("div", { className: "flex justify-between items-center h-16", children: [_jsxs("button", { onClick: function () { return navigate("/"); }, className: "flex items-center gap-2 cursor-pointer", children: [_jsx(ShoppingBag, { className: "h-8 w-8 text-indigo-600" }), _jsx("span", { className: "text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent", children: "The Fashion Bot" })] }), _jsx("div", { className: "flex items-center gap-3", children: isAuthenticated ? (_jsx(Button, { onClick: function () { return navigate("/dashboard"); }, className: "bg-indigo-600 hover:bg-indigo-700 font-medium", children: "Dashboard" })) : (_jsxs(_Fragment, { children: [_jsx(Button, { variant: "ghost", className: "font-medium", onClick: function () { return navigate("/login"); }, children: "Login" }), _jsx(Button, { className: "bg-indigo-600 hover:bg-indigo-700 font-medium", onClick: function () { return navigate("/login"); }, children: "Sign Up" })] })) })] }) }) }));
}
