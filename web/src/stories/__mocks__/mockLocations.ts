import type { LocationOption } from '@shared/types'
import { Currency } from '@shared/types'

/**
 * Mock Locations (Restaurants and Hospitality)
 */
export const mockLocations: LocationOption[] = [
  {
    id: 'location-1',
    name: 'Bella Vista Restaurant',
    type: 'Restaurant',
    address: '123 Main Street',
    city: 'San Francisco',
    role: 'Owner',
    currency: Currency.USD,
  },
  {
    id: 'location-2',
    name: 'Ocean View Café',
    type: 'Restaurant',
    address: '456 Beach Boulevard',
    city: 'Santa Monica',
    role: 'Manager',
    currency: Currency.USD,
  },
  {
    id: 'location-3',
    name: 'Mountain Lodge',
    type: 'Hospitality',
    address: '789 Alpine Road',
    city: 'Aspen',
    role: 'Owner',
    currency: Currency.USD,
  },
]

export const singleLocation = [mockLocations[0]]
export const emptyLocations: LocationOption[] = []
