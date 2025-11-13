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

export type GetRestaurantWebsitesResult = WebsiteDto[]

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

// Text and Image Section types
export interface TextAndImageSectionDto {
  id: string
  title?: string
  content?: string
  buttonText?: string
  buttonUrl?: string
  imageUrl?: string
  imageAlt?: string
  textColor?: string
  buttonColor?: string
  buttonTextColor?: string
  alignment: TextAlignment
  imageOnLeft: boolean
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
  textAndImageSection?: TextAndImageSectionDto
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
  businessHours?: string | null
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

// Page Template types
export enum PageTemplate {
  FrontPage = 'FrontPage',
  MenuPage = 'MenuPage',
  AboutPage = 'AboutPage',
  ContactPage = 'ContactPage',
  Blank = 'Blank',
}

export interface CreatePageFromTemplateCommand {
  websiteId: string
  template: PageTemplate
  customTitle?: string
  customSlug?: string
  restaurantMenuId?: string // For MenuPage template
}

export interface CreatePageFromTemplateResult {
  pageId: string
  title: string
  slug: string
}
