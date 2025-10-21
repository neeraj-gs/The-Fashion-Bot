var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { automationAPI } from "@/lib/api";
import { userState } from "@/store/authState";
import { ShoppingCart, AlertCircle, CheckCircle, Loader2, Link as LinkIcon, Package, Hash, } from "lucide-react";
var checkoutSchema = z.object({
    store: z.enum(["Stanley", "TonesFashion"], {
        errorMap: function () { return ({ message: "Please select a valid store" }); },
    }),
    productUrl: z.string().url("Please enter a valid URL"),
    quantity: z.number().min(1, "Quantity must be at least 1"),
    size: z.string().optional(),
});
export function CheckoutPage() {
    var _this = this;
    var navigate = useNavigate();
    var user = useRecoilValue(userState);
    var _a = useState(""), store = _a[0], setStore = _a[1];
    var _b = useState(""), productUrl = _b[0], setProductUrl = _b[1];
    var _c = useState(1), quantity = _c[0], setQuantity = _c[1];
    var _d = useState(""), size = _d[0], setSize = _d[1];
    var _e = useState({}), errors = _e[0], setErrors = _e[1];
    var _f = useState(false), isLoading = _f[0], setIsLoading = _f[1];
    var _g = useState("idle"), automationStatus = _g[0], setAutomationStatus = _g[1];
    var _h = useState(""), automationMessage = _h[0], setAutomationMessage = _h[1];
    var validateForm = function () {
        try {
            checkoutSchema.parse({
                store: store,
                productUrl: productUrl,
                quantity: quantity,
                size: store === "TonesFashion" ? size : undefined,
            });
            setErrors({});
            return true;
        }
        catch (error) {
            if (error instanceof z.ZodError) {
                var fieldErrors_1 = {};
                error.errors.forEach(function (err) {
                    if (err.path[0]) {
                        fieldErrors_1[err.path[0]] = err.message;
                    }
                });
                setErrors(fieldErrors_1);
            }
            return false;
        }
    };
    var handleSubmit = function (e) { return __awaiter(_this, void 0, void 0, function () {
        var orderData, response, error_1, message;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    e.preventDefault();
                    // Additional validation for size if Tones Fashion
                    if (store === "TonesFashion" && !size) {
                        setErrors(__assign(__assign({}, errors), { size: "Size is required for Tones Fashion" }));
                        return [2 /*return*/];
                    }
                    if (!validateForm())
                        return [2 /*return*/];
                    setIsLoading(true);
                    setAutomationStatus("loading");
                    setAutomationMessage("Starting automation bot...");
                    _c.label = 1;
                case 1:
                    _c.trys.push([1, 3, 4, 5]);
                    orderData = {
                        productUrl: productUrl,
                        quantity: quantity,
                    };
                    if (store === "TonesFashion") {
                        orderData.size = size;
                    }
                    return [4 /*yield*/, automationAPI.startAutomation(store, orderData)];
                case 2:
                    response = _c.sent();
                    if (response.data.success) {
                        setAutomationStatus("success");
                        setAutomationMessage(response.data.message || "Checkout completed successfully!");
                    }
                    else {
                        setAutomationStatus("error");
                        setAutomationMessage(response.data.message || "Automation failed. Please try again.");
                    }
                    return [3 /*break*/, 5];
                case 3:
                    error_1 = _c.sent();
                    setAutomationStatus("error");
                    message = ((_b = (_a = error_1.response) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.message) || "Failed to start automation. Please try again.";
                    setAutomationMessage(message);
                    return [3 /*break*/, 5];
                case 4:
                    setIsLoading(false);
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    }); };
    var handleReset = function () {
        setStore("");
        setProductUrl("");
        setQuantity(1);
        setSize("");
        setErrors({});
        setAutomationStatus("idle");
        setAutomationMessage("");
    };
    if (!user) {
        return null;
    }
    return (_jsx("div", { className: "min-h-screen bg-gradient-to-b from-gray-50 to-white py-12 px-4", children: _jsxs("div", { className: "max-w-3xl mx-auto", children: [_jsxs("div", { className: "text-center mb-8", children: [_jsxs("div", { className: "inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-100 text-indigo-700 text-sm font-medium mb-4", children: [_jsx(ShoppingCart, { className: "h-4 w-4" }), _jsx("span", { children: "Automated Checkout" })] }), _jsx("h1", { className: "text-4xl font-bold text-gray-900 mb-2", children: "Start Your Order" }), _jsx("p", { className: "text-gray-600", children: "Select a store and paste your product link. We'll handle the rest!" })] }), _jsx("div", { className: "bg-white rounded-2xl shadow-xl border border-gray-200 p-8", children: automationStatus === "idle" || automationStatus === "loading" ? (_jsxs("form", { onSubmit: handleSubmit, className: "space-y-6", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Select Store *" }), _jsxs("select", { value: store, onChange: function (e) {
                                            setStore(e.target.value);
                                            setSize(""); // Reset size when store changes
                                            setErrors(__assign(__assign({}, errors), { store: "" }));
                                        }, className: "w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ".concat(errors.store ? "border-red-500" : "border-gray-300"), disabled: isLoading, children: [_jsx("option", { value: "", children: "Choose a store..." }), _jsx("option", { value: "Stanley", children: "Stanley 1913" }), _jsx("option", { value: "TonesFashion", children: "Tones Fashion" }), _jsx("option", { value: "", disabled: true, children: "Nike (Coming Soon)" }), _jsx("option", { value: "", disabled: true, children: "Adidas (Coming Soon)" }), _jsx("option", { value: "", disabled: true, children: "Supreme (Coming Soon)" })] }), errors.store && (_jsx("p", { className: "text-red-500 text-sm mt-1", children: errors.store }))] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Product URL *" }), _jsxs("div", { className: "relative", children: [_jsx(LinkIcon, { className: "absolute left-3 top-3.5 h-5 w-5 text-gray-400" }), _jsx("input", { type: "url", value: productUrl, onChange: function (e) {
                                                    setProductUrl(e.target.value);
                                                    setErrors(__assign(__assign({}, errors), { productUrl: "" }));
                                                }, className: "w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ".concat(errors.productUrl ? "border-red-500" : "border-gray-300"), placeholder: "https://example.com/product/...", disabled: isLoading })] }), errors.productUrl && (_jsx("p", { className: "text-red-500 text-sm mt-1", children: errors.productUrl })), _jsx("p", { className: "text-gray-500 text-sm mt-1", children: "Copy and paste the full product page URL from the store" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Quantity *" }), _jsxs("div", { className: "relative", children: [_jsx(Hash, { className: "absolute left-3 top-3.5 h-5 w-5 text-gray-400" }), _jsx("input", { type: "number", value: quantity, onChange: function (e) {
                                                    setQuantity(parseInt(e.target.value) || 1);
                                                    setErrors(__assign(__assign({}, errors), { quantity: "" }));
                                                }, min: "1", max: "10", className: "w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ".concat(errors.quantity ? "border-red-500" : "border-gray-300"), disabled: isLoading })] }), errors.quantity && (_jsx("p", { className: "text-red-500 text-sm mt-1", children: errors.quantity }))] }), store === "TonesFashion" && (_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Size *" }), _jsxs("div", { className: "relative", children: [_jsx(Package, { className: "absolute left-3 top-3.5 h-5 w-5 text-gray-400" }), _jsxs("select", { value: size, onChange: function (e) {
                                                    setSize(e.target.value);
                                                    setErrors(__assign(__assign({}, errors), { size: "" }));
                                                }, className: "w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ".concat(errors.size ? "border-red-500" : "border-gray-300"), disabled: isLoading, children: [_jsx("option", { value: "", children: "Select size..." }), _jsx("option", { value: "XS", children: "XS" }), _jsx("option", { value: "S", children: "S" }), _jsx("option", { value: "M", children: "M" }), _jsx("option", { value: "L", children: "L" }), _jsx("option", { value: "XL", children: "XL" }), _jsx("option", { value: "XXL", children: "XXL" })] })] }), errors.size && (_jsx("p", { className: "text-red-500 text-sm mt-1", children: errors.size }))] })), _jsx("div", { className: "bg-indigo-50 border border-indigo-200 rounded-lg p-4", children: _jsxs("p", { className: "text-indigo-900 text-sm", children: [_jsx("span", { className: "font-semibold", children: "Note:" }), " The bot will use your saved shipping and payment details to complete the checkout automatically. Make sure the product is in stock and available."] }) }), _jsxs("div", { className: "flex gap-4", children: [_jsx(Button, { type: "button", variant: "outline", onClick: function () { return navigate("/dashboard"); }, className: "flex-1", disabled: isLoading, children: "Cancel" }), _jsx(Button, { type: "submit", className: "flex-1 bg-indigo-600 hover:bg-indigo-700", disabled: isLoading, children: isLoading ? (_jsxs(_Fragment, { children: [_jsx(Loader2, { className: "h-5 w-5 mr-2 animate-spin" }), "Processing..."] })) : ("Start Automation") })] })] })) : (
                    /* Result Display */
                    _jsx("div", { className: "text-center py-8", children: automationStatus === "success" ? (_jsxs("div", { className: "space-y-4", children: [_jsx("div", { className: "w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4", children: _jsx(CheckCircle, { className: "h-10 w-10 text-green-600" }) }), _jsx("h3", { className: "text-2xl font-bold text-gray-900", children: "Success!" }), _jsx("p", { className: "text-gray-600 max-w-md mx-auto", children: automationMessage }), _jsxs("div", { className: "flex gap-4 justify-center mt-8", children: [_jsx(Button, { onClick: handleReset, className: "bg-indigo-600 hover:bg-indigo-700", children: "Place Another Order" }), _jsx(Button, { variant: "outline", onClick: function () { return navigate("/dashboard"); }, children: "Back to Dashboard" })] })] })) : (_jsxs("div", { className: "space-y-4", children: [_jsx("div", { className: "w-20 h-20 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4", children: _jsx(AlertCircle, { className: "h-10 w-10 text-red-600" }) }), _jsx("h3", { className: "text-2xl font-bold text-gray-900", children: "Automation Failed" }), _jsx("p", { className: "text-gray-600 max-w-md mx-auto", children: automationMessage }), _jsxs("div", { className: "flex gap-4 justify-center mt-8", children: [_jsx(Button, { onClick: handleReset, className: "bg-indigo-600 hover:bg-indigo-700", children: "Try Again" }), _jsx(Button, { variant: "outline", onClick: function () { return navigate("/dashboard"); }, children: "Back to Dashboard" })] })] })) })) }), isLoading && (_jsx("div", { className: "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50", children: _jsxs("div", { className: "bg-white rounded-2xl p-8 max-w-md mx-4 text-center", children: [_jsx(Loader2, { className: "h-16 w-16 text-indigo-600 animate-spin mx-auto mb-4" }), _jsx("h3", { className: "text-xl font-bold text-gray-900 mb-2", children: "Automation in Progress" }), _jsx("p", { className: "text-gray-600", children: "Our bot is working on your checkout. This may take a few moments..." }), _jsxs("div", { className: "mt-6 space-y-2 text-left", children: [_jsxs("div", { className: "flex items-center gap-2 text-sm text-gray-600", children: [_jsx("div", { className: "w-2 h-2 rounded-full bg-indigo-600 animate-pulse" }), _jsx("span", { children: "Navigating to product page" })] }), _jsxs("div", { className: "flex items-center gap-2 text-sm text-gray-600", children: [_jsx("div", { className: "w-2 h-2 rounded-full bg-indigo-600 animate-pulse" }), _jsx("span", { children: "Adding to cart" })] }), _jsxs("div", { className: "flex items-center gap-2 text-sm text-gray-600", children: [_jsx("div", { className: "w-2 h-2 rounded-full bg-indigo-600 animate-pulse" }), _jsx("span", { children: "Filling checkout details" })] }), _jsxs("div", { className: "flex items-center gap-2 text-sm text-gray-600", children: [_jsx("div", { className: "w-2 h-2 rounded-full bg-indigo-600 animate-pulse" }), _jsx("span", { children: "Completing order" })] })] })] }) }))] }) }));
}
