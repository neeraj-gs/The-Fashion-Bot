import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { UserCircle, Link, Zap, Shield, Clock, CreditCard } from "lucide-react";
var features = [
    {
        icon: UserCircle,
        title: "One-Time Setup",
        description: "Submit your shipping and payment information just once. We securely store it for all future purchases.",
    },
    {
        icon: Link,
        title: "Paste & Purchase",
        description: "Simply paste any product link from your favorite store and we'll handle the entire checkout process.",
    },
    {
        icon: Zap,
        title: "Lightning Fast",
        description: "Complete checkouts in seconds, not minutes. Beat the rush and never miss out on limited items again.",
    },
    {
        icon: Shield,
        title: "Secure & Private",
        description: "Bank-level encryption protects your data. We never store full payment details on our servers.",
    },
    {
        icon: Clock,
        title: "24/7 Availability",
        description: "Shop whenever you want. Our bot works around the clock to complete your purchases instantly.",
    },
    {
        icon: CreditCard,
        title: "Auto-Fill Everything",
        description: "No more repetitive form filling. We automatically complete all shipping and billing information.",
    },
];
export function Features() {
    return (_jsx("section", { className: "py-20 bg-white", children: _jsxs("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8", children: [_jsxs("div", { className: "text-center mb-16", children: [_jsx("h2", { className: "text-4xl font-bold text-gray-900 mb-4", children: "Why Choose The Fashion Bot?" }), _jsx("p", { className: "text-xl text-gray-600 max-w-2xl mx-auto", children: "Experience hassle-free shopping with powerful automation that saves you time and effort." })] }), _jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8", children: features.map(function (feature, index) {
                        var Icon = feature.icon;
                        return (_jsxs("div", { className: "group p-6 rounded-2xl border border-gray-200 hover:border-indigo-300 hover:shadow-lg transition-all duration-300 bg-white", children: [_jsx("div", { className: "w-12 h-12 rounded-xl bg-indigo-100 flex items-center justify-center mb-4 group-hover:bg-indigo-600 transition-colors duration-300", children: _jsx(Icon, { className: "h-6 w-6 text-indigo-600 group-hover:text-white transition-colors duration-300" }) }), _jsx("h3", { className: "text-xl font-semibold text-gray-900 mb-2", children: feature.title }), _jsx("p", { className: "text-gray-600 leading-relaxed", children: feature.description })] }, index));
                    }) })] }) }));
}
