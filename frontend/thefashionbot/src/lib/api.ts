import axios from 'axios'
import Cookies from 'js-cookie'

const API_BASE_URL = 'http://localhost:3000/api'

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
})

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = Cookies.get('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      Cookies.remove('token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// API methods
export const authAPI = {
  signup: (email: string, password: string) =>
    api.post('/auth/signup', { email, password }),

  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }),

  getCurrentUser: () => api.get('/auth/me'),
}

export const userAPI = {
  updateDetails: (data: any) => api.put('/user/details', data),

  getDetails: () => api.get('/user/details'),
}

export const automationAPI = {
  startAutomation: (storeName: string, orderData: any) =>
    api.post('/automation/start', { storeName, orderData }),
}

export default api
