import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { UserRestaurantDto, UserHospitalityDto, LocationOption } from '../types'

interface LocationStore {
  selectedLocation: LocationOption | null
  setSelectedLocation: (location: LocationOption | null) => void
  clearSelectedLocation: () => void

  // Helper methods to convert between types
  setSelectedRestaurant: (restaurant: UserRestaurantDto | null) => void
  setSelectedHospitality: (hospitality: UserHospitalityDto | null) => void
}

export const useLocationStore = create<LocationStore>()(
  persist(
    set => ({
      selectedLocation: null,
      setSelectedLocation: location => set({ selectedLocation: location }),
      clearSelectedLocation: () => set({ selectedLocation: null }),

      setSelectedRestaurant: restaurant => {
        if (restaurant) {
          const location: LocationOption = {
            id: restaurant.restaurant.id,
            name: restaurant.restaurant.name,
            type: 'Restaurant',
            address: restaurant.restaurant.address,
            city: restaurant.restaurant.city,
            role: restaurant.role,
            currency: restaurant.restaurant.currency,
            businessHours: restaurant.restaurant.businessHours,
            isOpenNow: restaurant.restaurant.isOpenNow,
            restaurant: restaurant.restaurant,
          }
          set({ selectedLocation: location })
        } else {
          set({ selectedLocation: null })
        }
      },

      setSelectedHospitality: hospitality => {
        if (hospitality) {
          const location: LocationOption = {
            id: hospitality.hospitality.id,
            name: hospitality.hospitality.name,
            type: 'Hospitality',
            address: hospitality.hospitality.address,
            city: hospitality.hospitality.city,
            role: hospitality.role,
            currency: hospitality.hospitality.currency,
            hospitality: hospitality.hospitality,
          }
          set({ selectedLocation: location })
        } else {
          set({ selectedLocation: null })
        }
      },
    }),
    {
      name: 'location-storage',
    }
  )
)

// Maintain backward compatibility
export const useRestaurantStore = useLocationStore
