import axios, { AxiosInstance } from 'axios'
import { storageService } from './storage.service'

const API_BASE_URL = 'https://api.kumiko.no'

class ApiService {
  private client: AxiosInstance

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    })

    this.client.interceptors.request.use(
      async (config) => {
        const token = await storageService.getAccessToken()
        if (token) {
          config.headers.Authorization = `Bearer ${token}`
        }
        return config
      },
      (error) => Promise.reject(error)
    )

    this.client.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (error.response?.status === 401) {
          await storageService.clearTokens()
        }
        return Promise.reject(error)
      }
    )
  }

  getClient(): AxiosInstance {
    return this.client
  }
}

export const apiService = new ApiService()
export const apiClient = apiService.getClient()
