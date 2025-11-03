import React, { createContext, useContext, useEffect, useState } from 'react'
import { authService } from '@/services/auth.service'
import { storageService } from '@/services/storage.service'
import { restaurantService } from '@/services/restaurant.service'
import { notificationService } from '@/services/notification.service'
import { UserRestaurantDto } from '@/types/restaurant.types'

interface AuthContextType {
  isAuthenticated: boolean
  isLoading: boolean
  selectedLocationId: string | null
  selectedLocation: UserRestaurantDto | null
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  selectLocation: (locationId: string) => Promise<void>
  clearLocation: () => Promise<void>
  checkAuth: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [selectedLocationId, setSelectedLocationId] = useState<string | null>(null)
  const [selectedLocation, setSelectedLocation] = useState<UserRestaurantDto | null>(null)

  const loadSelectedLocation = async () => {
    if (!selectedLocationId) return

    try {
      const result = await restaurantService.getUserRestaurants()
      const location = result.restaurants.find(
        (r) => r.restaurant.id === selectedLocationId
      )
      setSelectedLocation(location || null)
    } catch (error) {
      setSelectedLocation(null)
    }
  }

  const checkAuth = async () => {
    try {
      const authenticated = await authService.isAuthenticated()
      setIsAuthenticated(authenticated)

      if (authenticated) {
        const locationId = await storageService.getSelectedLocation()
        setSelectedLocationId(locationId)
      }
    } catch (error) {
      setIsAuthenticated(false)
      setSelectedLocationId(null)
      setSelectedLocation(null)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    checkAuth()
  }, [])

  useEffect(() => {
    if (selectedLocationId) {
      loadSelectedLocation()
    } else {
      setSelectedLocation(null)
    }
  }, [selectedLocationId])

  const login = async (email: string, password: string) => {
    await authService.login(email, password)
    setIsAuthenticated(true)
  }

  const logout = async () => {
    await authService.logout()
    setIsAuthenticated(false)
    setSelectedLocationId(null)
    setSelectedLocation(null)
  }

  const selectLocation = async (locationId: string) => {
    await storageService.saveSelectedLocation(locationId)
    setSelectedLocationId(locationId)

    // Register device for push notifications
    await notificationService.registerForRestaurant(locationId)
  }

  const clearLocation = async () => {
    await storageService.clearSelectedLocation()
    setSelectedLocationId(null)
    setSelectedLocation(null)
  }

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isLoading,
        selectedLocationId,
        selectedLocation,
        login,
        logout,
        selectLocation,
        clearLocation,
        checkAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
