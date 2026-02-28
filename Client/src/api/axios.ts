import axios from 'axios'

// Default to backend port 3000 (matches Server/index.js). Override with VITE_API_URL in .env
const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

const api = axios.create({ baseURL })

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('payout_token')
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (res) => res,
  (err) => {
    const originalRequest = err.config || {}
    const url = originalRequest.url || ''
    const isAuthEndpoint = url.includes('/auth/login') || url.includes('/auth/refresh')

    // Only force logout/redirect for protected endpoints — don't redirect when login itself fails
    if (err.response && (err.response.status === 401 || err.response.status === 403) && !isAuthEndpoint) {
      localStorage.removeItem('payout_token')
      localStorage.removeItem('payout_user')
      window.location.href = '/login'
    }
    return Promise.reject(err)
  }
)

export default api
