import { CreateRestaurantCommand } from './restaurant.types'
import { ResponseBusinessDetails } from './search.types'
import { ParsedMenuStructure } from './menu-structure.types'

export enum OnboardingStep {
  Business = 'business',
  Confirmation = 'confirmation',
  Menu = 'menu',
  Website = 'website',
}

export interface OnboardingState {
  currentStep: OnboardingStep
  selectedBusiness: ResponseBusinessDetails | null
  restaurantData: Partial<CreateRestaurantCommand> | null
  menuData: ParsedMenuStructure | null
  websiteData: {
    subdomain: string
    name: string
  } | null
  isCompleted: boolean
}

export interface OnboardingBusinessData {
  business: ResponseBusinessDetails
  confirmedData: {
    address: string
    city: string
    phone: string
    businessHours: string
  }
}

export interface OnboardingMenuData {
  imageFile: File
  parsedStructure: ParsedMenuStructure
}

export interface OnboardingWebsiteData {
  subdomain: string
  name: string
  description?: string
}

export interface AutoGenerateWebsiteCommand {
  restaurantId: string
  subdomain: string
  name: string
  description?: string
  includeMenuPage?: boolean
}

export interface AutoGenerateWebsiteResult {
  websiteId: string
  subdomain: string
  pagesCreated: string[]
}
