import * as SecureStore from 'expo-secure-store'

const TOKEN_KEY = 'access_token'
const REFRESH_TOKEN_KEY = 'refresh_token'
const EXPIRES_AT_KEY = 'expires_at'
const SELECTED_LOCATION_KEY = 'selected_location'

export const storageService = {
  async saveTokens(accessToken: string, refreshToken: string, expiresAt: string): Promise<void> {
    await Promise.all([
      SecureStore.setItemAsync(TOKEN_KEY, accessToken),
      SecureStore.setItemAsync(REFRESH_TOKEN_KEY, refreshToken),
      SecureStore.setItemAsync(EXPIRES_AT_KEY, expiresAt),
    ])
  },

  async getAccessToken(): Promise<string | null> {
    return await SecureStore.getItemAsync(TOKEN_KEY)
  },

  async getRefreshToken(): Promise<string | null> {
    return await SecureStore.getItemAsync(REFRESH_TOKEN_KEY)
  },

  async getExpiresAt(): Promise<string | null> {
    return await SecureStore.getItemAsync(EXPIRES_AT_KEY)
  },

  async clearTokens(): Promise<void> {
    await Promise.all([
      SecureStore.deleteItemAsync(TOKEN_KEY),
      SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY),
      SecureStore.deleteItemAsync(EXPIRES_AT_KEY),
    ])
  },

  async saveSelectedLocation(locationId: string): Promise<void> {
    await SecureStore.setItemAsync(SELECTED_LOCATION_KEY, locationId)
  },

  async getSelectedLocation(): Promise<string | null> {
    return await SecureStore.getItemAsync(SELECTED_LOCATION_KEY)
  },

  async clearSelectedLocation(): Promise<void> {
    await SecureStore.deleteItemAsync(SELECTED_LOCATION_KEY)
  },
}
