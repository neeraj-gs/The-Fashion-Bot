import { atom, selector } from 'recoil';
import Cookies from 'js-cookie';
export var userState = atom({
    key: 'userState',
    default: null,
});
export var tokenState = atom({
    key: 'tokenState',
    default: Cookies.get('token') || null,
});
export var isAuthenticatedState = selector({
    key: 'isAuthenticatedState',
    get: function (_a) {
        var get = _a.get;
        var user = get(userState);
        var token = get(tokenState);
        return !!user && !!token;
    },
});
export var isOnboardedState = selector({
    key: 'isOnboardedState',
    get: function (_a) {
        var _b, _c, _d, _e, _f;
        var get = _a.get;
        var user = get(userState);
        if (!user)
            return false;
        // Check if user has completed onboarding (has basic details)
        return !!(user.firstName &&
            user.lastName &&
            user.phone &&
            ((_b = user.shippingAddress) === null || _b === void 0 ? void 0 : _b.addressLine1) &&
            ((_c = user.shippingAddress) === null || _c === void 0 ? void 0 : _c.city) &&
            ((_d = user.shippingAddress) === null || _d === void 0 ? void 0 : _d.state) &&
            ((_e = user.shippingAddress) === null || _e === void 0 ? void 0 : _e.zipCode) &&
            ((_f = user.paymentDetails) === null || _f === void 0 ? void 0 : _f.cardNumber));
    },
});
