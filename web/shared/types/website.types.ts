// Website types
import { TextAlignment } from './section.types'
export interface WebsiteDto {
  id: string
  name: string
  subdomain: string
  description?: string
  isPublished: boolean
  restaurantId: string
  restaurantName: string
}

export interface CreateWebsiteCommand {
  name: string
  subdomain: string
  description?: string
  entityId?: string
  entityType?: string
}

export interface CreateWebsiteResult {
  websiteId: string
}

export interface GetRestaurantWebsitesResult {
  websites: WebsiteDto[]
}

// Hero Section types
export enum HeroSectionType {
  ImageRight = 'ImageRight',
  BackgroundImage = 'BackgroundImage',
}

export interface HeroSectionDto {
  id: string
  title: string
  description: string
  imageUrl?: string
  imageAlt?: string
  backgroundColor?: string
  textColor?: string
  backgroundOverlayColor?: string
  backgroundImageUrl?: string
  buttonText?: string
  buttonUrl?: string
  buttonTextColor?: string
  buttonBackgroundColor?: string
  type: HeroSectionType
}

// Text Section types
export interface TextSectionDto {
  id: string
  title?: string
  text?: string
  alignText: TextAlignment
  textColor?: string
}

// Website Page types
export interface WebsitePageDto {
  id: string
  slug: string
  title: string
  seoTitle?: string
  seoDescription?: string
  seoKeywords?: string
  subdomain: string
  websiteId: string
  sections: WebsiteSectionDto[]
}

// Website Section types
export interface WebsiteSectionDto {
  id: string
  sortOrder: number
  websitePageId: string
  heroSection?: HeroSectionDto
  textSection?: TextSectionDto
  restaurantMenuSection?: RestaurantMenuSectionDto
}

export interface RestaurantMenuSectionDto {
  id: string
  restaurantMenuId: string
  allowOrdering: boolean
}

// Public website types
export interface GetWebsiteBySubdomainQuery {
  subdomain: string
}

export interface GetWebsiteBySubdomainResult {
  id: string
  name: string
  subdomain: string
  description?: string
  isPublished: boolean
  type: string
  pages: PublicWebsitePageDto[]
}

export interface PublicWebsitePageDto {
  id: string
  title: string
  slug: string
  sections: PublicWebsiteSectionDto[]
}

export interface PublicWebsiteSectionDto {
  id: string
  sortOrder: number
  heroSection?: PublicHeroSectionDto
  textSection?: PublicTextSectionDto
  restaurantMenuSection?: PublicRestaurantMenuSectionDto
}

export interface PublicHeroSectionDto {
  id: string
  title: string
  description: string
  imageUrl?: string
  imageAlt?: string
  backgroundColor?: string
  textColor?: string
  backgroundOverlayColor?: string
  backgroundImageUrl?: string
  buttonText?: string
  buttonUrl?: string
  buttonTextColor?: string
  buttonBackgroundColor?: string
  type: string
}

export interface PublicTextSectionDto {
  id: string
  title?: string
  text?: string
  alignText: string
  textColor?: string
}

export interface PublicRestaurantMenuSectionDto {
  id: string
  restaurantMenuId: string
  allowOrdering: boolean
}

// Update website types
export interface UpdateWebsiteCommand {
  name?: string
  description?: string
  isPublished?: boolean
}

export interface UpdateWebsiteResult {
  websiteId: string
  isPublished: boolean
}
