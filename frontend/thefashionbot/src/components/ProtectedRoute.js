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
import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useRecoilState, useRecoilValue } from "recoil";
import { userState, tokenState, isOnboardedState } from "@/store/authState";
import { authAPI } from "@/lib/api";
import { Loader2 } from "lucide-react";
export function ProtectedRoute(_a) {
    var _this = this;
    var children = _a.children, _b = _a.requireOnboarding, requireOnboarding = _b === void 0 ? true : _b;
    var location = useLocation();
    var _c = useRecoilState(userState), user = _c[0], setUser = _c[1];
    var token = useRecoilValue(tokenState);
    var isOnboarded = useRecoilValue(isOnboardedState);
    var _d = useState(true), isLoading = _d[0], setIsLoading = _d[1];
    useEffect(function () {
        var fetchUser = function () { return __awaiter(_this, void 0, void 0, function () {
            var response, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(token && !user)) return [3 /*break*/, 4];
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, authAPI.getCurrentUser()];
                    case 2:
                        response = _a.sent();
                        if (response.data.success) {
                            setUser(response.data.data.user);
                        }
                        return [3 /*break*/, 4];
                    case 3:
                        error_1 = _a.sent();
                        console.error("Failed to fetch user:", error_1);
                        return [3 /*break*/, 4];
                    case 4:
                        setIsLoading(false);
                        return [2 /*return*/];
                }
            });
        }); };
        fetchUser();
    }, [token, user, setUser]);
    if (isLoading) {
        return (_jsx("div", { className: "min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50", children: _jsxs("div", { className: "text-center", children: [_jsx(Loader2, { className: "h-12 w-12 text-indigo-600 animate-spin mx-auto mb-4" }), _jsx("p", { className: "text-gray-600", children: "Loading..." })] }) }));
    }
    // Not authenticated - redirect to login
    if (!token || !user) {
        return _jsx(Navigate, { to: "/login", state: { from: location }, replace: true });
    }
    // Authenticated but not onboarded - redirect to onboarding
    if (requireOnboarding && !isOnboarded && location.pathname !== "/onboarding") {
        return _jsx(Navigate, { to: "/onboarding", replace: true });
    }
    // Authenticated and onboarded (or onboarding not required) - render children
    return _jsx(_Fragment, { children: children });
}
