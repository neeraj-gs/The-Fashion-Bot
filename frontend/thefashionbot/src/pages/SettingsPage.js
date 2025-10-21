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
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import { Button } from "@/components/ui/button";
import { userAPI } from "@/lib/api";
import { userState } from "@/store/authState";
import Cookies from "js-cookie";
import { User, MapPin, CreditCard, AlertCircle, CheckCircle, ArrowLeft, LogOut, } from "lucide-react";
export function SettingsPage() {
    var _this = this;
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
    var navigate = useNavigate();
    var _m = useRecoilState(userState), user = _m[0], setUser = _m[1];
    var _o = useState("basic"), activeTab = _o[0], setActiveTab = _o[1];
    var _p = useState(false), isLoading = _p[0], setIsLoading = _p[1];
    var _q = useState(null), message = _q[0], setMessage = _q[1];
    // Form state
    var _r = useState({
        firstName: (user === null || user === void 0 ? void 0 : user.firstName) || "",
        lastName: (user === null || user === void 0 ? void 0 : user.lastName) || "",
        phone: (user === null || user === void 0 ? void 0 : user.phone) || "",
        addressLine1: ((_a = user === null || user === void 0 ? void 0 : user.shippingAddress) === null || _a === void 0 ? void 0 : _a.addressLine1) || "",
        addressLine2: ((_b = user === null || user === void 0 ? void 0 : user.shippingAddress) === null || _b === void 0 ? void 0 : _b.addressLine2) || "",
        city: ((_c = user === null || user === void 0 ? void 0 : user.shippingAddress) === null || _c === void 0 ? void 0 : _c.city) || "",
        state: ((_d = user === null || user === void 0 ? void 0 : user.shippingAddress) === null || _d === void 0 ? void 0 : _d.state) || "",
        zipCode: ((_e = user === null || user === void 0 ? void 0 : user.shippingAddress) === null || _e === void 0 ? void 0 : _e.zipCode) || "",
        country: ((_f = user === null || user === void 0 ? void 0 : user.shippingAddress) === null || _f === void 0 ? void 0 : _f.country) || "USA",
        cardNumber: ((_g = user === null || user === void 0 ? void 0 : user.paymentDetails) === null || _g === void 0 ? void 0 : _g.cardNumber) || "",
        cardHolderName: ((_h = user === null || user === void 0 ? void 0 : user.paymentDetails) === null || _h === void 0 ? void 0 : _h.cardHolderName) || "",
        expiryMonth: ((_j = user === null || user === void 0 ? void 0 : user.paymentDetails) === null || _j === void 0 ? void 0 : _j.expiryMonth) || "",
        expiryYear: ((_k = user === null || user === void 0 ? void 0 : user.paymentDetails) === null || _k === void 0 ? void 0 : _k.expiryYear) || "",
        cvv: ((_l = user === null || user === void 0 ? void 0 : user.paymentDetails) === null || _l === void 0 ? void 0 : _l.cvv) || "",
    }), formData = _r[0], setFormData = _r[1];
    useEffect(function () {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
        if (user) {
            setFormData({
                firstName: user.firstName || "",
                lastName: user.lastName || "",
                phone: user.phone || "",
                addressLine1: ((_a = user.shippingAddress) === null || _a === void 0 ? void 0 : _a.addressLine1) || "",
                addressLine2: ((_b = user.shippingAddress) === null || _b === void 0 ? void 0 : _b.addressLine2) || "",
                city: ((_c = user.shippingAddress) === null || _c === void 0 ? void 0 : _c.city) || "",
                state: ((_d = user.shippingAddress) === null || _d === void 0 ? void 0 : _d.state) || "",
                zipCode: ((_e = user.shippingAddress) === null || _e === void 0 ? void 0 : _e.zipCode) || "",
                country: ((_f = user.shippingAddress) === null || _f === void 0 ? void 0 : _f.country) || "USA",
                cardNumber: ((_g = user.paymentDetails) === null || _g === void 0 ? void 0 : _g.cardNumber) || "",
                cardHolderName: ((_h = user.paymentDetails) === null || _h === void 0 ? void 0 : _h.cardHolderName) || "",
                expiryMonth: ((_j = user.paymentDetails) === null || _j === void 0 ? void 0 : _j.expiryMonth) || "",
                expiryYear: ((_k = user.paymentDetails) === null || _k === void 0 ? void 0 : _k.expiryYear) || "",
                cvv: ((_l = user.paymentDetails) === null || _l === void 0 ? void 0 : _l.cvv) || "",
            });
        }
    }, [user]);
    var updateField = function (field, value) {
        setFormData(function (prev) {
            var _a;
            return (__assign(__assign({}, prev), (_a = {}, _a[field] = value, _a)));
        });
    };
    var handleSave = function () { return __awaiter(_this, void 0, void 0, function () {
        var updateData, response, error_1, errorMessage;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    setIsLoading(true);
                    setMessage(null);
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
                            sameAsShipping: true,
                        },
                    };
                    return [4 /*yield*/, userAPI.updateDetails(updateData)];
                case 2:
                    response = _c.sent();
                    if (response.data.success) {
                        setUser(response.data.data.user);
                        setMessage({ type: "success", text: "Settings updated successfully!" });
                        setTimeout(function () { return setMessage(null); }, 3000);
                    }
                    return [3 /*break*/, 5];
                case 3:
                    error_1 = _c.sent();
                    errorMessage = ((_b = (_a = error_1.response) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.message) || "Failed to update settings. Please try again.";
                    setMessage({ type: "error", text: errorMessage });
                    return [3 /*break*/, 5];
                case 4:
                    setIsLoading(false);
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    }); };
    var handleLogout = function () {
        Cookies.remove("token");
        setUser(null);
        navigate("/login");
    };
    if (!user) {
        return null;
    }
    return (_jsx("div", { className: "min-h-screen bg-gradient-to-b from-gray-50 to-white py-12 px-4", children: _jsxs("div", { className: "max-w-4xl mx-auto", children: [_jsxs("div", { className: "flex items-center justify-between mb-8", children: [_jsxs("div", { children: [_jsxs("button", { onClick: function () { return navigate("/dashboard"); }, className: "flex items-center gap-2 text-indigo-600 hover:text-indigo-700 mb-4", children: [_jsx(ArrowLeft, { className: "h-5 w-5" }), _jsx("span", { className: "font-medium", children: "Back to Dashboard" })] }), _jsx("h1", { className: "text-4xl font-bold text-gray-900", children: "Settings" }), _jsx("p", { className: "text-gray-600 mt-2", children: "Manage your account details and preferences" })] }), _jsxs(Button, { variant: "outline", onClick: handleLogout, className: "border-red-300 text-red-600 hover:bg-red-50", children: [_jsx(LogOut, { className: "h-5 w-5 mr-2" }), "Logout"] })] }), message && (_jsxs("div", { className: "flex items-center gap-2 p-4 rounded-lg mb-6 ".concat(message.type === "success"
                        ? "bg-green-50 border border-green-200"
                        : "bg-red-50 border border-red-200"), children: [message.type === "success" ? (_jsx(CheckCircle, { className: "h-5 w-5 text-green-600" })) : (_jsx(AlertCircle, { className: "h-5 w-5 text-red-600" })), _jsx("p", { className: "text-sm font-medium ".concat(message.type === "success" ? "text-green-900" : "text-red-900"), children: message.text })] })), _jsxs("div", { className: "bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden", children: [_jsxs("div", { className: "flex border-b border-gray-200", children: [_jsxs("button", { onClick: function () { return setActiveTab("basic"); }, className: "flex-1 flex items-center justify-center gap-2 px-6 py-4 font-medium transition-colors ".concat(activeTab === "basic"
                                        ? "bg-indigo-50 text-indigo-600 border-b-2 border-indigo-600"
                                        : "text-gray-600 hover:bg-gray-50"), children: [_jsx(User, { className: "h-5 w-5" }), _jsx("span", { children: "Basic Info" })] }), _jsxs("button", { onClick: function () { return setActiveTab("shipping"); }, className: "flex-1 flex items-center justify-center gap-2 px-6 py-4 font-medium transition-colors ".concat(activeTab === "shipping"
                                        ? "bg-indigo-50 text-indigo-600 border-b-2 border-indigo-600"
                                        : "text-gray-600 hover:bg-gray-50"), children: [_jsx(MapPin, { className: "h-5 w-5" }), _jsx("span", { children: "Shipping" })] }), _jsxs("button", { onClick: function () { return setActiveTab("payment"); }, className: "flex-1 flex items-center justify-center gap-2 px-6 py-4 font-medium transition-colors ".concat(activeTab === "payment"
                                        ? "bg-indigo-50 text-indigo-600 border-b-2 border-indigo-600"
                                        : "text-gray-600 hover:bg-gray-50"), children: [_jsx(CreditCard, { className: "h-5 w-5" }), _jsx("span", { children: "Payment" })] })] }), _jsxs("div", { className: "p-8", children: [activeTab === "basic" && (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Email (Cannot be changed)" }), _jsx("input", { type: "email", value: user.email, disabled: true, className: "w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed" })] }), _jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "First Name" }), _jsx("input", { type: "text", value: formData.firstName, onChange: function (e) { return updateField("firstName", e.target.value); }, className: "w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Last Name" }), _jsx("input", { type: "text", value: formData.lastName, onChange: function (e) { return updateField("lastName", e.target.value); }, className: "w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" })] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Phone Number" }), _jsx("input", { type: "tel", value: formData.phone, onChange: function (e) { return updateField("phone", e.target.value); }, className: "w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" })] })] })), activeTab === "shipping" && (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Address Line 1" }), _jsx("input", { type: "text", value: formData.addressLine1, onChange: function (e) { return updateField("addressLine1", e.target.value); }, className: "w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Address Line 2 (Optional)" }), _jsx("input", { type: "text", value: formData.addressLine2, onChange: function (e) { return updateField("addressLine2", e.target.value); }, className: "w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" })] }), _jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "City" }), _jsx("input", { type: "text", value: formData.city, onChange: function (e) { return updateField("city", e.target.value); }, className: "w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "State" }), _jsxs("select", { value: formData.state, onChange: function (e) { return updateField("state", e.target.value); }, className: "w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500", children: [_jsx("option", { value: "", children: "Select State" }), _jsx("option", { value: "AL", children: "Alabama" }), _jsx("option", { value: "AK", children: "Alaska" }), _jsx("option", { value: "AZ", children: "Arizona" }), _jsx("option", { value: "CA", children: "California" }), _jsx("option", { value: "FL", children: "Florida" }), _jsx("option", { value: "NY", children: "New York" }), _jsx("option", { value: "TX", children: "Texas" })] })] })] }), _jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "ZIP Code" }), _jsx("input", { type: "text", value: formData.zipCode, onChange: function (e) { return updateField("zipCode", e.target.value); }, className: "w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Country" }), _jsxs("select", { value: formData.country, onChange: function (e) { return updateField("country", e.target.value); }, className: "w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500", children: [_jsx("option", { value: "USA", children: "United States" }), _jsx("option", { value: "India", children: "India" }), _jsx("option", { value: "Canada", children: "Canada" }), _jsx("option", { value: "UK", children: "United Kingdom" })] })] })] })] })), activeTab === "payment" && (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Card Number" }), _jsx("input", { type: "text", value: formData.cardNumber, onChange: function (e) { return updateField("cardNumber", e.target.value.replace(/\s/g, "")); }, className: "w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500", maxLength: 16 })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Cardholder Name" }), _jsx("input", { type: "text", value: formData.cardHolderName, onChange: function (e) { return updateField("cardHolderName", e.target.value); }, className: "w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" })] }), _jsxs("div", { className: "grid grid-cols-3 gap-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Expiry Month" }), _jsx("input", { type: "text", value: formData.expiryMonth, onChange: function (e) { return updateField("expiryMonth", e.target.value); }, className: "w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500", placeholder: "MM", maxLength: 2 })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Expiry Year" }), _jsx("input", { type: "text", value: formData.expiryYear, onChange: function (e) { return updateField("expiryYear", e.target.value); }, className: "w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500", placeholder: "YY", maxLength: 2 })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "CVV" }), _jsx("input", { type: "text", value: formData.cvv, onChange: function (e) { return updateField("cvv", e.target.value); }, className: "w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500", placeholder: "123", maxLength: 4 })] })] }), _jsx("div", { className: "bg-amber-50 border border-amber-200 rounded-lg p-4", children: _jsxs("p", { className: "text-amber-900 text-sm", children: [_jsx("span", { className: "font-semibold", children: "Security Note:" }), " Your payment information is encrypted and stored securely. We use industry-standard security measures to protect your data."] }) })] })), _jsx("div", { className: "mt-8", children: _jsx(Button, { onClick: handleSave, className: "w-full bg-indigo-600 hover:bg-indigo-700 py-6", disabled: isLoading, children: isLoading ? "Saving..." : "Save Changes" }) })] })] })] }) }));
}
