import { useEffect, useMemo } from 'react'
import { useLocationStore } from '../stores/location-store'
import { useUserRestaurants, useUserHospitalities } from '@shared'
import type { LocationOption } from '@shared'

export const useLocationSelection = () => {
  const {
    selectedLocation,
    setSelectedLocation,
    setSelectedRestaurant,
    setSelectedHospitality,
    clearSelectedLocation
  } = useLocationStore()

  const { data: restaurants, isLoading: restaurantsLoading } = useUserRestaurants()
  const { data: hospitalities, isLoading: hospitalitiesLoading } = useUserHospitalities()

  const isLoading = restaurantsLoading || hospitalitiesLoading

  const userLocations = useMemo(() => {
    const locations: LocationOption[] = []

    // Add restaurants
    if (restaurants?.restaurants) {
      restaurants.restaurants.forEach(restaurant => {
        locations.push({
          id: restaurant.restaurant.id,
          name: restaurant.restaurant.name,
          type: 'Restaurant',
          address: restaurant.restaurant.address,
          city: restaurant.restaurant.city,
          role: restaurant.role
        })
      })
    }

    // Add hospitalities
    if (hospitalities?.hospitalities) {
      hospitalities.hospitalities.forEach(hospitality => {
        locations.push({
          id: hospitality.hospitality.id,
          name: hospitality.hospitality.name,
          type: 'Hospitality',
          address: hospitality.hospitality.address,
          city: hospitality.hospitality.city,
          role: hospitality.role
        })
      })
    }

    return locations
  }, [restaurants, hospitalities])

  const hasNoLocations = !isLoading && userLocations.length === 0

  // Auto-select logic when data is loaded
  useEffect(() => {
    if (isLoading || hasNoLocations) return

    // If no location is selected and there's only one location, auto-select it
    if (!selectedLocation && userLocations.length === 1) {
      setSelectedLocation(userLocations[0])
      return
    }

    // If a location is selected but no longer exists in the user's locations, clear it
    if (selectedLocation) {
      const locationStillExists = userLocations.some(location =>
        location.id === selectedLocation.id && location.type === selectedLocation.type
      )

      if (!locationStillExists) {
        clearSelectedLocation()

        // Auto-select the first available location if there's exactly one
        if (userLocations.length === 1) {
          setSelectedLocation(userLocations[0])
        }
      }
    }
  }, [selectedLocation, userLocations, isLoading, hasNoLocations, setSelectedLocation, clearSelectedLocation])

  return {
    selectedLocation,
    userLocations,
    isLoading,
    hasNoLocations,
    setSelectedLocation,
    setSelectedRestaurant,
    setSelectedHospitality,
    clearSelectedLocation,
    // Backward compatibility
    selectedRestaurant: selectedLocation?.type === 'Restaurant' ? selectedLocation : null,
    userRestaurants: restaurants?.restaurants || []
  }
}