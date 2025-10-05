export interface CreateRestaurantCommand {
  name: string
  address: string
  city: string
  state: string
  zip: string
  country: string
  latitude: string
  longitude: string
  googlePlaceId: string
  businessHours?: string | null
  isOpenNow?: boolean | null
}

import { Currency } from './localization.types'

export interface RestaurantBaseDto {
  id: string
  name: string
  googlePlaceId: string
  address: string
  city: string
  state: string
  zip: string
  country: string
  latitude: string
  longitude: string
  currency: Currency
  businessHours?: string | null
  isOpenNow?: boolean | null
}

export interface CreateRestaurantResult extends RestaurantBaseDto { }

export interface UserRestaurantDto {
  restaurant: RestaurantBaseDto
  role: string
}

export interface GetUserRestaurantsResult {
  restaurants: UserRestaurantDto[]
}

export type UserRole = 'Customer' | 'Editor' | 'Admin' | 'Owner'

export interface GetUserRestaurantsParams {
  roles?: UserRole[]
}
