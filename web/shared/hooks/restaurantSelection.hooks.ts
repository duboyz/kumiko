import { useEffect } from 'react'
import { useUserRestaurants } from './restaurant.hooks'
import { useRestaurantStore } from '../stores/restaurant-store'

export const useRestaurantSelection = () => {
  const { data: userRestaurants, isLoading, error } = useUserRestaurants()
  const { selectedRestaurant, setSelectedRestaurant, clearSelectedRestaurant } = useRestaurantStore()

  useEffect(() => {
    if (!userRestaurants || isLoading) return

    const restaurants = userRestaurants.restaurants

    // If no restaurants, clear selection
    if (restaurants.length === 0) {
      clearSelectedRestaurant()
      return
    }

    // If only one restaurant, auto-select it
    if (restaurants.length === 1) {
      setSelectedRestaurant(restaurants[0])
      return
    }

    // If multiple restaurants and no current selection, don't auto-select
    // User will need to manually choose
    if (!selectedRestaurant) {
      return
    }

    // Verify current selection is still valid
    const currentSelection = restaurants.find(
      r => r.restaurant.id === selectedRestaurant.restaurant.id
    )

    if (!currentSelection) {
      // Current selection is no longer valid, clear it
      clearSelectedRestaurant()
    }
  }, [userRestaurants, isLoading, selectedRestaurant, setSelectedRestaurant, clearSelectedRestaurant])

  return {
    userRestaurants: userRestaurants?.restaurants || [],
    selectedRestaurant,
    setSelectedRestaurant,
    clearSelectedRestaurant,
    isLoading,
    error,
    needsSelection: userRestaurants && userRestaurants.restaurants.length > 1 && !selectedRestaurant,
    hasNoRestaurants: userRestaurants && userRestaurants.restaurants.length === 0
  }
}