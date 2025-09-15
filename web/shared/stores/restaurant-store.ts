import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { UserRestaurantDto } from '../types'

interface RestaurantStore {
  selectedRestaurant: UserRestaurantDto | null
  setSelectedRestaurant: (restaurant: UserRestaurantDto | null) => void
  clearSelectedRestaurant: () => void
}

export const useRestaurantStore = create<RestaurantStore>()(
  persist(
    (set) => ({
      selectedRestaurant: null,
      setSelectedRestaurant: (restaurant) => set({ selectedRestaurant: restaurant }),
      clearSelectedRestaurant: () => set({ selectedRestaurant: null })
    }),
    {
      name: 'restaurant-storage'
    }
  )
)