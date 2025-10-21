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
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { userAPI } from "@/lib/api";
import { userState } from "@/store/authState";
import { AlertCircle, Sparkles, User, MapPin, CreditCard } from "lucide-react";
var onboardingSchema = z.object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    phone: z.string().min(10, "Phone number must be at least 10 digits"),
    addressLine1: z.string().min(1, "Address is required"),
    addressLine2: z.string().optional(),
    city: z.string().min(1, "City is required"),
    state: z.string().min(1, "State is required"),
    zipCode: z.string().min(5, "ZIP code must be at least 5 digits"),
    country: z.string().min(1, "Country is required"),
    cardNumber: z.string().min(13, "Card number must be at least 13 digits"),
    cardHolderName: z.string().min(1, "Cardholder name is required"),
    expiryMonth: z.string().regex(/^(0[1-9]|1[0-2])$/, "Invalid month (01-12)"),
    expiryYear: z.string().regex(/^\d{2}$/, "Invalid year (YY format)"),
    cvv: z.string().regex(/^\d{3,4}$/, "CVV must be 3-4 digits"),
    sameAsShipping: z.boolean(),
});
export function OnboardingPage() {
    var _this = this;
    var navigate = useNavigate();
    var _a = useRecoilState(userState), user = _a[0], setUser = _a[1];
    var _b = useState(1), step = _b[0], setStep = _b[1];
    var _c = useState(false), isLoading = _c[0], setIsLoading = _c[1];
    var _d = useState(""), apiError = _d[0], setApiError = _d[1];
    // Form state
    var _e = useState({
        firstName: (user === null || user === void 0 ? void 0 : user.firstName) || "",
        lastName: (user === null || user === void 0 ? void 0 : user.lastName) || "",
        phone: (user === null || user === void 0 ? void 0 : user.phone) || "",
        addressLine1: "",
        addressLine2: "",
        city: "",
        state: "",
        zipCode: "",
        country: "USA",
        cardNumber: "",
        cardHolderName: "",
        expiryMonth: "",
        expiryYear: "",
        cvv: "",
        sameAsShipping: true,
    }), formData = _e[0], setFormData = _e[1];
    var _f = useState({}), errors = _f[0], setErrors = _f[1];
    var updateField = function (field, value) {
        setFormData(function (prev) {
            var _a;
            return (__assign(__assign({}, prev), (_a = {}, _a[field] = value, _a)));
        });
        // Clear error for this field
        setErrors(function (prev) {
            var _a;
            return (__assign(__assign({}, prev), (_a = {}, _a[field] = "", _a)));
        });
    };
    var validateStep = function (currentStep) {
        var stepErrors = {};
        if (currentStep === 1) {
            if (!formData.firstName)
                stepErrors.firstName = "First name is required";
            if (!formData.lastName)
                stepErrors.lastName = "Last name is required";
            if (!formData.phone || formData.phone.length < 10)
                stepErrors.phone = "Valid phone number is required";
        }
        if (currentStep === 2) {
            if (!formData.addressLine1)
                stepErrors.addressLine1 = "Address is required";
            if (!formData.city)
                stepErrors.city = "City is required";
            if (!formData.state)
                stepErrors.state = "State is required";
            if (!formData.zipCode || formData.zipCode.length < 5)
                stepErrors.zipCode = "Valid ZIP code is required";
        }
        if (currentStep === 3) {
            if (!formData.cardNumber || formData.cardNumber.length < 13)
                stepErrors.cardNumber = "Valid card number is required";
            if (!formData.cardHolderName)
                stepErrors.cardHolderName = "Cardholder name is required";
            if (!/^(0[1-9]|1[0-2])$/.test(formData.expiryMonth))
                stepErrors.expiryMonth = "Invalid month (01-12)";
            if (!/^\d{2}$/.test(formData.expiryYear))
                stepErrors.expiryYear = "Invalid year (YY)";
            if (!/^\d{3,4}$/.test(formData.cvv))
                stepErrors.cvv = "Invalid CVV";
        }
        setErrors(stepErrors);
        return Object.keys(stepErrors).length === 0;
    };
    var handleNext = function () {
        if (validateStep(step)) {
            setStep(step + 1);
        }
    };
    var handleSubmit = function () { return __awaiter(_this, void 0, void 0, function () {
        var updateData, response, error_1, message;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    if (!validateStep(3))
                        return [2 /*return*/];
                    setIsLoading(true);
                    setApiError("");
                    _c.label = 1;
                case 1:
                    _c.trys.push([1, 3, 4, 5]);
                    updateData = {
                        firstName: formData.firstName,
                        lastName: formData.lastName,
                        phone: formData.phone,
                        shippingAddress: {
                            addressLine1: formData.addressLine1,
                            addressLine2: formData.addressLine2,
                            city: formData.city,
                            state: formData.state,
                            zipCode: formData.zipCode,
                            country: formData.country,
                        },
                        paymentDetails: {
                            cardNumber: formData.cardNumber,
                            cardHolderName: formData.cardHolderName,
                            expiryMonth: formData.expiryMonth,
                            expiryYear: formData.expiryYear,
                            cvv: formData.cvv,
                            sameAsShipping: formData.sameAsShipping,
                            billingAddress: formData.sameAsShipping
                                ? {
                                    addressLine1: formData.addressLine1,
                                    addressLine2: formData.addressLine2,
                                    city: formData.city,
                                    state: formData.state,
                                    zipCode: formData.zipCode,
                                    country: formData.country,
                                }
                                : undefined,
                        },
                    };
                    return [4 /*yield*/, userAPI.updateDetails(updateData)];
                case 2:
                    response = _c.sent();
                    if (response.data.success) {
                        setUser(response.data.data.user);
                        navigate("/dashboard");
                    }
                    return [3 /*break*/, 5];
                case 3:
                    error_1 = _c.sent();
                    message = ((_b = (_a = error_1.response) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.message) || "Failed to save details. Please try again.";
                    setApiError(message);
                    return [3 /*break*/, 5];
                case 4:
                    setIsLoading(false);
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    }); };
    return (_jsx("div", { className: "min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-12 px-4", children: _jsxs("div", { className: "max-w-2xl mx-auto", children: [_jsxs("div", { className: "text-center mb-8", children: [_jsxs("div", { className: "inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-100 text-indigo-700 text-sm font-medium mb-4", children: [_jsx(Sparkles, { className: "h-4 w-4" }), _jsx("span", { children: "One-Time Setup" })] }), _jsx("h1", { className: "text-4xl font-bold text-gray-900 mb-2", children: "Complete Your Profile" }), _jsx("p", { className: "text-gray-600", children: "Save your details once and never fill checkout forms again!" })] }), _jsx("div", { className: "flex items-center justify-center gap-2 mb-8", children: [1, 2, 3].map(function (s) { return (_jsxs("div", { className: "flex items-center", children: [_jsx("div", { className: "w-10 h-10 rounded-full flex items-center justify-center font-semibold ".concat(s < step
                                    ? "bg-green-500 text-white"
                                    : s === step
                                        ? "bg-indigo-600 text-white"
                                        : "bg-gray-200 text-gray-500"), children: s < step ? "✓" : s }), s < 3 && (_jsx("div", { className: "w-16 h-1 ".concat(s < step ? "bg-green-500" : "bg-gray-200") }))] }, s)); }) }), _jsxs("div", { className: "bg-white rounded-2xl shadow-xl border border-gray-200 p-8", children: [step === 1 && (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "flex items-center gap-2 text-indigo-600 mb-4", children: [_jsx(User, { className: "h-6 w-6" }), _jsx("h2", { className: "text-2xl font-bold", children: "Basic Details" })] }), _jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "First Name *" }), _jsx("input", { type: "text", value: formData.firstName, onChange: function (e) { return updateField("firstName", e.target.value); }, className: "w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ".concat(errors.firstName ? "border-red-500" : "border-gray-300"), placeholder: "John" }), errors.firstName && (_jsx("p", { className: "text-red-500 text-sm mt-1", children: errors.firstName }))] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Last Name *" }), _jsx("input", { type: "text", value: formData.lastName, onChange: function (e) { return updateField("lastName", e.target.value); }, className: "w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ".concat(errors.lastName ? "border-red-500" : "border-gray-300"), placeholder: "Doe" }), errors.lastName && (_jsx("p", { className: "text-red-500 text-sm mt-1", children: errors.lastName }))] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Phone Number *" }), _jsx("input", { type: "tel", value: formData.phone, onChange: function (e) { return updateField("phone", e.target.value); }, className: "w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ".concat(errors.phone ? "border-red-500" : "border-gray-300"), placeholder: "1234567890" }), errors.phone && (_jsx("p", { className: "text-red-500 text-sm mt-1", children: errors.phone }))] })] })), step === 2 && (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "flex items-center gap-2 text-indigo-600 mb-4", children: [_jsx(MapPin, { className: "h-6 w-6" }), _jsx("h2", { className: "text-2xl font-bold", children: "Shipping Address" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Address Line 1 *" }), _jsx("input", { type: "text", value: formData.addressLine1, onChange: function (e) { return updateField("addressLine1", e.target.value); }, className: "w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ".concat(errors.addressLine1 ? "border-red-500" : "border-gray-300"), placeholder: "123 Main Street" }), errors.addressLine1 && (_jsx("p", { className: "text-red-500 text-sm mt-1", children: errors.addressLine1 }))] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Address Line 2 (Optional)" }), _jsx("input", { type: "text", value: formData.addressLine2, onChange: function (e) { return updateField("addressLine2", e.target.value); }, className: "w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500", placeholder: "Apt 4B" })] }), _jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "City *" }), _jsx("input", { type: "text", value: formData.city, onChange: function (e) { return updateField("city", e.target.value); }, className: "w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ".concat(errors.city ? "border-red-500" : "border-gray-300"), placeholder: "New York" }), errors.city && (_jsx("p", { className: "text-red-500 text-sm mt-1", children: errors.city }))] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "State *" }), _jsxs("select", { value: formData.state, onChange: function (e) { return updateField("state", e.target.value); }, className: "w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ".concat(errors.state ? "border-red-500" : "border-gray-300"), children: [_jsx("option", { value: "", children: "Select State" }), _jsx("option", { value: "AL", children: "Alabama" }), _jsx("option", { value: "AK", children: "Alaska" }), _jsx("option", { value: "AZ", children: "Arizona" }), _jsx("option", { value: "CA", children: "California" }), _jsx("option", { value: "FL", children: "Florida" }), _jsx("option", { value: "NY", children: "New York" }), _jsx("option", { value: "TX", children: "Texas" })] }), errors.state && (_jsx("p", { className: "text-red-500 text-sm mt-1", children: errors.state }))] })] }), _jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "ZIP Code *" }), _jsx("input", { type: "text", value: formData.zipCode, onChange: function (e) { return updateField("zipCode", e.target.value); }, className: "w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ".concat(errors.zipCode ? "border-red-500" : "border-gray-300"), placeholder: "10001" }), errors.zipCode && (_jsx("p", { className: "text-red-500 text-sm mt-1", children: errors.zipCode }))] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Country *" }), _jsxs("select", { value: formData.country, onChange: function (e) { return updateField("country", e.target.value); }, className: "w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500", children: [_jsx("option", { value: "USA", children: "United States" }), _jsx("option", { value: "India", children: "India" }), _jsx("option", { value: "Canada", children: "Canada" }), _jsx("option", { value: "UK", children: "United Kingdom" })] })] })] })] })), step === 3 && (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "flex items-center gap-2 text-indigo-600 mb-4", children: [_jsx(CreditCard, { className: "h-6 w-6" }), _jsx("h2", { className: "text-2xl font-bold", children: "Payment Details" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Card Number *" }), _jsx("input", { type: "text", value: formData.cardNumber, onChange: function (e) { return updateField("cardNumber", e.target.value.replace(/\s/g, "")); }, className: "w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ".concat(errors.cardNumber ? "border-red-500" : "border-gray-300"), placeholder: "1234567890123456", maxLength: 16 }), errors.cardNumber && (_jsx("p", { className: "text-red-500 text-sm mt-1", children: errors.cardNumber }))] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Cardholder Name *" }), _jsx("input", { type: "text", value: formData.cardHolderName, onChange: function (e) { return updateField("cardHolderName", e.target.value); }, className: "w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ".concat(errors.cardHolderName ? "border-red-500" : "border-gray-300"), placeholder: "JOHN DOE" }), errors.cardHolderName && (_jsx("p", { className: "text-red-500 text-sm mt-1", children: errors.cardHolderName }))] }), _jsxs("div", { className: "grid grid-cols-3 gap-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Expiry Month *" }), _jsx("input", { type: "text", value: formData.expiryMonth, onChange: function (e) { return updateField("expiryMonth", e.target.value); }, className: "w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ".concat(errors.expiryMonth ? "border-red-500" : "border-gray-300"), placeholder: "MM", maxLength: 2 }), errors.expiryMonth && (_jsx("p", { className: "text-red-500 text-sm mt-1", children: errors.expiryMonth }))] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Expiry Year *" }), _jsx("input", { type: "text", value: formData.expiryYear, onChange: function (e) { return updateField("expiryYear", e.target.value); }, className: "w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ".concat(errors.expiryYear ? "border-red-500" : "border-gray-300"), placeholder: "YY", maxLength: 2 }), errors.expiryYear && (_jsx("p", { className: "text-red-500 text-sm mt-1", children: errors.expiryYear }))] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "CVV *" }), _jsx("input", { type: "text", value: formData.cvv, onChange: function (e) { return updateField("cvv", e.target.value); }, className: "w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ".concat(errors.cvv ? "border-red-500" : "border-gray-300"), placeholder: "123", maxLength: 4 }), errors.cvv && (_jsx("p", { className: "text-red-500 text-sm mt-1", children: errors.cvv }))] })] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx("input", { type: "checkbox", id: "sameAsShipping", checked: formData.sameAsShipping, onChange: function (e) { return updateField("sameAsShipping", e.target.checked); }, className: "w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500" }), _jsx("label", { htmlFor: "sameAsShipping", className: "text-sm text-gray-700", children: "Billing address same as shipping address" })] })] })), apiError && (_jsxs("div", { className: "flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg mt-4", children: [_jsx(AlertCircle, { className: "h-5 w-5 text-red-600" }), _jsx("p", { className: "text-red-600 text-sm", children: apiError })] })), _jsxs("div", { className: "flex gap-4 mt-8", children: [step > 1 && (_jsx(Button, { variant: "outline", onClick: function () { return setStep(step - 1); }, className: "flex-1", disabled: isLoading, children: "Back" })), step < 3 ? (_jsx(Button, { onClick: handleNext, className: "flex-1 bg-indigo-600 hover:bg-indigo-700", children: "Next" })) : (_jsx(Button, { onClick: handleSubmit, className: "flex-1 bg-indigo-600 hover:bg-indigo-700", disabled: isLoading, children: isLoading ? "Saving..." : "Complete Setup" }))] })] })] }) }));
}
