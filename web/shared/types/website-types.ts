// Website types
export interface WebsiteDto {
  id: string;
  name: string;
  subdomain: string;
  description?: string;
  isPublished: boolean;
  restaurantId: string;
  restaurantName: string;
}

export interface CreateWebsiteCommand {
  name: string;
  subdomain: string;
  description?: string;
}

export interface CreateWebsiteResult {
  websiteId: string;
}

export interface GetRestaurantWebsitesResult {
  websites: WebsiteDto[];
}

// Hero Section types
export enum HeroSectionType {
  ImageRight = 'ImageRight',
  BackgroundImage = 'BackgroundImage'
}

export interface HeroSectionDto {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
  imageAlt?: string;
  backgroundColor?: string;
  textColor?: string;
  backgroundOverlayColor?: string;
  backgroundImageUrl?: string;
  buttonText?: string;
  buttonUrl?: string;
  buttonTextColor?: string;
  buttonBackgroundColor?: string;
  type: HeroSectionType;
}

// Website Page types
export interface WebsitePageDto {
  id: string;
  slug: string;
  title: string;
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string;
  subdomain: string;
  websiteId: string;
  sections: WebsiteSectionDto[];
}

// Website Section types
export interface WebsiteSectionDto {
  id: string;
  sortOrder: number;
  websitePageId: string;
  heroSection?: HeroSectionDto;
  restaurantMenuSection?: RestaurantMenuSectionDto;
}

export interface RestaurantMenuSectionDto {
  id: string;
  restaurantMenuId: string;
  allowOrdering: boolean;
}