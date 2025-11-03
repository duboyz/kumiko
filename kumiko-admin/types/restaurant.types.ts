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
  currency: string
  businessHours?: string | null
  isOpenNow?: boolean | null
  description?: string | null
}

export interface UserRestaurantDto {
  restaurant: RestaurantBaseDto
  role: string
}

export interface GetUserRestaurantsResult {
  restaurants: UserRestaurantDto[]
}

export interface GetUserRestaurantsQuery {
  roles?: string[] | null
}
