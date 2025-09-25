import { Currency } from './localization.types'

// Hospitality types
export interface HospitalityBaseDto {
  id: string
  name: string
  address: string
  city: string
  state: string
  zip: string
  country: string
  description?: string
  currency: Currency
}

export interface UserHospitalityDto {
  hospitality: HospitalityBaseDto
  role: string
}

export interface CreateHospitalityCommand {
  name: string
  address: string
  city: string
  state: string
  zip: string
  country: string
  latitude?: string
  longitude?: string
  googlePlaceId?: string
  description?: string
}

export interface CreateHospitalityResult {
  hospitalityId: string
  name: string
  address: string
  city: string
  state: string
  zip: string
  country: string
  description?: string
}

export interface GetUserHospitalitiesResult {
  hospitalities: UserHospitalityDto[]
}

// Location types for selection
export interface LocationOption {
  id: string
  name: string
  type: 'Restaurant' | 'Hospitality'
  address: string
  city: string
  role: string
  currency: Currency
}
