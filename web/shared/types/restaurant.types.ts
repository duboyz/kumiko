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
}

export interface CreateRestaurantResult extends RestaurantBaseDto {}

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
