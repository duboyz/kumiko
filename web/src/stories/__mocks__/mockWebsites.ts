import type { WebsiteDto, WebsitePageDto } from '@shared/types'

/**
 * Mock Websites
 */
export const mockWebsites: WebsiteDto[] = [
  {
    id: 'website-1',
    name: 'Main Website',
    subdomain: 'bella-vista',
    description: 'Our primary restaurant website',
    isPublished: true,
    restaurantId: 'restaurant-1',
    restaurantName: 'Bella Vista Restaurant',
  },
  {
    id: 'website-2',
    name: 'Catering Site',
    subdomain: 'bella-vista-catering',
    description: 'Website for catering services',
    isPublished: false,
    restaurantId: 'restaurant-1',
    restaurantName: 'Bella Vista Restaurant',
  },
  {
    id: 'website-3',
    name: 'Events Portal',
    subdomain: 'bella-vista-events',
    description: 'Special events and private bookings',
    isPublished: true,
    restaurantId: 'restaurant-1',
    restaurantName: 'Bella Vista Restaurant',
  },
]

/**
 * Mock Website Pages
 */
export const mockWebsitePages: WebsitePageDto[] = [
  {
    id: 'page-1',
    slug: 'home',
    title: 'Home',
    seoTitle: 'Welcome to Bella Vista',
    seoDescription: 'Experience fine dining at its best',
    subdomain: 'bella-vista',
    websiteId: 'website-1',
    sections: [],
  },
  {
    id: 'page-2',
    slug: 'menu',
    title: 'Menu',
    seoTitle: 'Our Menu',
    seoDescription: 'Explore our delicious offerings',
    subdomain: 'bella-vista',
    websiteId: 'website-1',
    sections: [],
  },
  {
    id: 'page-3',
    slug: 'about',
    title: 'About Us',
    seoTitle: 'About Bella Vista',
    seoDescription: 'Learn about our story and passion',
    subdomain: 'bella-vista',
    websiteId: 'website-1',
    sections: [],
  },
]

export const singleWebsite = [mockWebsites[0]]
export const emptyWebsites: WebsiteDto[] = []
