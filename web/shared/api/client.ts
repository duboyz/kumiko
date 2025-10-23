import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from 'axios'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5158'

if (process.env.NODE_ENV === 'production' && !process.env.NEXT_PUBLIC_API_URL) {
  console.error('NEXT_PUBLIC_API_URL environment variable is required in production')
}

interface FailedRequest {
  resolve: (value?: unknown) => void
  reject: (reason?: unknown) => void
  config: InternalAxiosRequestConfig
}

let isRefreshing = false
let failedQueue: FailedRequest[] = []

const processQueue = (error: AxiosError | null) => {
  failedQueue.forEach(prom => {
    if (error) prom.reject(error)
    else apiClient(prom.config).then(prom.resolve).catch(prom.reject)
  })

  failedQueue = []
}

export const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
})

apiClient.interceptors.request.use(
  config => config,
  error => Promise.reject(error)
)

apiClient.interceptors.response.use(
  response => {
    // Check if cookies are actually being set by the browser
    if (response.config.url?.includes('/api/auth/login') || response.config.url?.includes('/api/auth/register')) {
      console.log('🔍 Checking if cookies are set after login...')

      // Check if cookies exist in document.cookie (only non-HttpOnly cookies)
      console.log('Document cookies:', document.cookie)

      // Check if we can make authenticated requests
      setTimeout(async () => {
        try {
          const testResponse = await apiClient.get('/api/auth/me')
          console.log('✅ Authentication test successful - cookies are working!')
        } catch (error) {
          console.log('❌ Authentication test failed - cookies not working:', error)
        }
      }, 1000)
    }

    return response
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean
    }

    if (!originalRequest) return Promise.reject(error)

    // Don't try to refresh for auth endpoints
    const isAuthEndpoint = originalRequest.url?.includes('/api/auth/')

    if (error.response?.status === 401 && !originalRequest._retry && !isAuthEndpoint) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject, config: originalRequest })
        })
      }

      originalRequest._retry = true
      isRefreshing = true

      try {
        await apiClient.post('/api/auth/refresh')
        processQueue(null)
        return apiClient(originalRequest)
      } catch (refreshError) {
        processQueue(refreshError as AxiosError)

        // Clear all storage on auth failure
        if (typeof window !== 'undefined') {
          localStorage.removeItem('location-storage')
          sessionStorage.clear()

          // Only redirect to login if we're not already on the login page
          if (!window.location.pathname.includes('/login')) {
            window.location.href = '/login'
          }
        }

        return Promise.reject(refreshError)
      } finally {
        isRefreshing = false
      }
    }

    return Promise.reject(error)
  }
)

// Public API client for endpoints that don't require authentication
export const publicApiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: false, // Don't send credentials for public endpoints
  headers: {
    'Content-Type': 'application/json',
  },
})

export default apiClient
