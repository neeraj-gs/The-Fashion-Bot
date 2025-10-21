import axios from 'axios';
import Cookies from 'js-cookie';
var API_BASE_URL = 'http://localhost:3000/api';
export var api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true,
});
// Request interceptor to add auth token
api.interceptors.request.use(function (config) {
    var token = Cookies.get('token');
    if (token) {
        config.headers.Authorization = "Bearer ".concat(token);
    }
    return config;
}, function (error) {
    return Promise.reject(error);
});
// Response interceptor to handle errors
api.interceptors.response.use(function (response) { return response; }, function (error) {
    var _a;
    if (((_a = error.response) === null || _a === void 0 ? void 0 : _a.status) === 401) {
        // Token expired or invalid
        Cookies.remove('token');
        window.location.href = '/login';
    }
    return Promise.reject(error);
});
// API methods
export var authAPI = {
    signup: function (email, password) {
        return api.post('/auth/signup', { email: email, password: password });
    },
    login: function (email, password) {
        return api.post('/auth/login', { email: email, password: password });
    },
    getCurrentUser: function () { return api.get('/auth/me'); },
};
export var userAPI = {
    updateDetails: function (data) { return api.put('/user/details', data); },
    getDetails: function () { return api.get('/user/details'); },
};
export var automationAPI = {
    startAutomation: function (storeName, orderData) {
        return api.post('/automation/start', { storeName: storeName, orderData: orderData });
    },
};
export default api;
