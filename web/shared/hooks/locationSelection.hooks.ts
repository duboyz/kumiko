import { useEffect, useMemo } from 'react'
import { useLocationStore } from '../stores/location-store'
import { useUserRestaurants, useUserHospitalities } from '@shared'
import type { LocationOption } from '@shared'
import { Currency } from '../types/localization.types'

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

  // Convert string currency from API to numeric enum
  const convertCurrencyFromApi = (apiCurrency: any): Currency => {
    if (typeof apiCurrency === 'string') {
      switch (apiCurrency) {
        case 'EUR': return Currency.EUR
        case 'USD': return Currency.USD
        case 'GBP': return Currency.GBP
        case 'NOK': return Currency.NOK
        case 'SEK': return Currency.SEK
        case 'ISK': return Currency.ISK
        case 'DKK': return Currency.DKK
        default: return Currency.USD
      }
    }
    return apiCurrency ?? Currency.USD
  }

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
          role: restaurant.role,
          currency: convertCurrencyFromApi(restaurant.restaurant.currency)
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
          role: hospitality.role,
          currency: convertCurrencyFromApi(hospitality.hospitality.currency)
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