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
import { useSetRecoilState } from "recoil";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { authAPI } from "@/lib/api";
import { userState, tokenState } from "@/store/authState";
import Cookies from "js-cookie";
import { ShoppingBag, AlertCircle } from "lucide-react";
var authSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
});
export function LoginPage() {
    var _this = this;
    var navigate = useNavigate();
    var setUser = useSetRecoilState(userState);
    var setToken = useSetRecoilState(tokenState);
    var _a = useState(true), isLogin = _a[0], setIsLogin = _a[1];
    var _b = useState(""), email = _b[0], setEmail = _b[1];
    var _c = useState(""), password = _c[0], setPassword = _c[1];
    var _d = useState({}), errors = _d[0], setErrors = _d[1];
    var _e = useState(""), apiError = _e[0], setApiError = _e[1];
    var _f = useState(false), isLoading = _f[0], setIsLoading = _f[1];
    var validateForm = function () {
        try {
            authSchema.parse({ email: email, password: password });
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
        var response, _a, _b, user, token, needsOnboarding, error_1, message;
        var _c, _d, _e;
        return __generator(this, function (_f) {
            switch (_f.label) {
                case 0:
                    e.preventDefault();
                    setApiError("");
                    if (!validateForm())
                        return [2 /*return*/];
                    setIsLoading(true);
                    _f.label = 1;
                case 1:
                    _f.trys.push([1, 6, 7, 8]);
                    if (!isLogin) return [3 /*break*/, 3];
                    return [4 /*yield*/, authAPI.login(email, password)];
                case 2:
                    _a = _f.sent();
                    return [3 /*break*/, 5];
                case 3: return [4 /*yield*/, authAPI.signup(email, password)];
                case 4:
                    _a = _f.sent();
                    _f.label = 5;
                case 5:
                    response = _a;
                    if (response.data.success) {
                        _b = response.data.data, user = _b.user, token = _b.token;
                        // Save token to cookies
                        Cookies.set("token", token, { expires: 30 });
                        // Update Recoil state
                        setToken(token);
                        setUser(user);
                        needsOnboarding = !user.firstName || !((_c = user.shippingAddress) === null || _c === void 0 ? void 0 : _c.addressLine1);
                        if (needsOnboarding) {
                            navigate("/onboarding");
                        }
                        else {
                            navigate("/dashboard");
                        }
                    }
                    return [3 /*break*/, 8];
                case 6:
                    error_1 = _f.sent();
                    message = ((_e = (_d = error_1.response) === null || _d === void 0 ? void 0 : _d.data) === null || _e === void 0 ? void 0 : _e.message) || "An error occurred. Please try again.";
                    setApiError(message);
                    return [3 /*break*/, 8];
                case 7:
                    setIsLoading(false);
                    return [7 /*endfinally*/];
                case 8: return [2 /*return*/];
            }
        });
    }); };
    return (_jsx("div", { className: "min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center px-4", children: _jsxs("div", { className: "w-full max-w-md", children: [_jsxs("div", { className: "text-center mb-8", children: [_jsxs("div", { className: "inline-flex items-center gap-2 mb-4", children: [_jsx(ShoppingBag, { className: "h-10 w-10 text-indigo-600" }), _jsx("span", { className: "text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent", children: "The Fashion Bot" })] }), _jsx("p", { className: "text-gray-600", children: isLogin ? "Welcome back!" : "Create your account" })] }), _jsxs("div", { className: "bg-white rounded-2xl shadow-xl border border-gray-200 p-8", children: [_jsxs("div", { className: "flex gap-2 mb-6", children: [_jsx(Button, { variant: isLogin ? "default" : "ghost", className: "flex-1 ".concat(isLogin ? "bg-indigo-600 hover:bg-indigo-700" : ""), onClick: function () {
                                        setIsLogin(true);
                                        setErrors({});
                                        setApiError("");
                                    }, children: "Login" }), _jsx(Button, { variant: !isLogin ? "default" : "ghost", className: "flex-1 ".concat(!isLogin ? "bg-indigo-600 hover:bg-indigo-700" : ""), onClick: function () {
                                        setIsLogin(false);
                                        setErrors({});
                                        setApiError("");
                                    }, children: "Sign Up" })] }), _jsxs("form", { onSubmit: handleSubmit, className: "space-y-4", children: [_jsxs("div", { children: [_jsx("label", { htmlFor: "email", className: "block text-sm font-medium text-gray-700 mb-1", children: "Email" }), _jsx("input", { id: "email", type: "email", value: email, onChange: function (e) { return setEmail(e.target.value); }, className: "w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ".concat(errors.email ? "border-red-500" : "border-gray-300"), placeholder: "you@example.com" }), errors.email && (_jsx("p", { className: "text-red-500 text-sm mt-1", children: errors.email }))] }), _jsxs("div", { children: [_jsx("label", { htmlFor: "password", className: "block text-sm font-medium text-gray-700 mb-1", children: "Password" }), _jsx("input", { id: "password", type: "password", value: password, onChange: function (e) { return setPassword(e.target.value); }, className: "w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ".concat(errors.password ? "border-red-500" : "border-gray-300"), placeholder: "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022" }), errors.password && (_jsx("p", { className: "text-red-500 text-sm mt-1", children: errors.password }))] }), apiError && (_jsxs("div", { className: "flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg", children: [_jsx(AlertCircle, { className: "h-5 w-5 text-red-600" }), _jsx("p", { className: "text-red-600 text-sm", children: apiError })] })), _jsx(Button, { type: "submit", className: "w-full bg-indigo-600 hover:bg-indigo-700 py-6 text-lg", disabled: isLoading, children: isLoading ? "Please wait..." : isLogin ? "Login" : "Create Account" })] }), !isLogin && (_jsx("p", { className: "text-center text-sm text-gray-600 mt-4", children: "After signup, you'll complete a one-time setup to save your details." }))] }), _jsx("div", { className: "text-center mt-6", children: _jsx("button", { onClick: function () { return navigate("/"); }, className: "text-indigo-600 hover:text-indigo-700 text-sm font-medium", children: "Back to Home" }) })] }) }));
}
