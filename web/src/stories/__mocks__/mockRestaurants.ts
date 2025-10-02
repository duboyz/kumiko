import type { UserRestaurantDto } from '@shared/types'
import { Currency } from '@shared/types'

/**
 * Mock User Restaurants
 */
export const mockUserRestaurants: UserRestaurantDto[] = [
  {
    restaurant: {
      id: 'restaurant-1',
      name: 'Bella Vista Restaurant',
      googlePlaceId: 'ChIJplace1',
      address: '123 Main Street',
      city: 'San Francisco',
      state: 'CA',
      zip: '94102',
      country: 'USA',
      latitude: '37.7749',
      longitude: '-122.4194',
      currency: Currency.USD,
    },
    role: 'Owner',
  },
  {
    restaurant: {
      id: 'restaurant-2',
      name: 'Ocean View Café',
      googlePlaceId: 'ChIJplace2',
      address: '456 Beach Boulevard',
      city: 'Santa Monica',
      state: 'CA',
      zip: '90401',
      country: 'USA',
      latitude: '34.0195',
      longitude: '-118.4912',
      currency: Currency.USD,
    },
    role: 'Manager',
  },
]

export const singleRestaurant = [mockUserRestaurants[0]]
export const emptyRestaurants: UserRestaurantDto[] = []
