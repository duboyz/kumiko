export interface RequestSearchAddress {
  query: string
  country?: string
  limit?: number
}

export interface SearchBusinessCommand {
  request: RequestSearchAddress
}

export interface BusinessLocation {
  lat: number
  lng: number
}

export interface BusinessGeometry {
  location: BusinessLocation
}

export interface BusinessOpeningHours {
  openNow: boolean
  weekdayText: string[]
}

export interface BusinessPhoto {
  photoReference: string
  height: number
  width: number
}

export interface BusinessReview {
  authorName: string
  rating: number
  text: string
  time: number
}

export interface ResponseBusinessDetails {
  placeId: string
  name: string
  formattedAddress: string
  formattedPhoneNumber: string
  internationalPhoneNumber: string
  website: string
  businessStatus: string
  types: string[]
  rating?: number
  userRatingsTotal?: number
  priceLevel?: number
  vicinity: string
  openingHours?: BusinessOpeningHours
  parsedBusinessHours?: string // Parsed and structured business hours in JSON format
  geometry: BusinessGeometry
  photos: BusinessPhoto[]
  reviews: BusinessReview[]
  // Parsed address components
  street: string
  city: string
  state: string
  postalCode: string
  country: string
}

export interface SearchBusinessResult {
  businesses: ResponseBusinessDetails[]
}
