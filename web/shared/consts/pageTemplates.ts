import { PageTemplate } from '../types/pageTemplates.types'
import { HeroSectionType } from '../types/website.types'
import { TextAlignment } from '../types/section.types'
import { CreatePageSectionCommand } from '../types/page.types'

/**
 * Page Templates
 *
 * Pre-configured page templates for quick website setup
 */

export const PAGE_TEMPLATES: PageTemplate[] = [
  {
    id: 'frontpage',
    name: 'Front Page',
    description: 'A beautiful homepage with hero section and welcome message',
    slug: 'home',
    seoTitle: 'Welcome to {restaurantName}',
    seoDescription: 'Experience exceptional dining at {restaurantName}',
    previewImage: '/templates/frontpage-preview.png',
    sections: [
      {
        type: 'hero',
        order: 0,
        config: {
          type: HeroSectionType.BackgroundImage,
          title: 'Welcome to {restaurantName}',
          description: 'Experience exceptional cuisine in an unforgettable atmosphere',
          buttonText: 'View Our Menu',
          buttonUrl: '/menu',
          backgroundColor: '#000000',
          textColor: '#FFFFFF',
        },
      },
      {
        type: 'text',
        order: 1,
        config: {
          title: 'Our Story',
          text: 'Welcome to {restaurantName}, where passion meets flavor. We are dedicated to providing an exceptional dining experience with locally sourced ingredients and expertly crafted dishes.',
          alignText: TextAlignment.Center,
        },
      },
    ],
  },
  {
    id: 'menu',
    name: 'Menu Page',
    description: 'Display your restaurant menu with ordering options',
    slug: 'menu',
    seoTitle: 'Menu - {restaurantName}',
    seoDescription: 'Explore our delicious menu at {restaurantName}',
    previewImage: '/templates/menu-preview.png',
    sections: [
      {
        type: 'hero',
        order: 0,
        config: {
          type: HeroSectionType.ImageRight,
          title: 'Our Menu',
          description:
            'Discover our carefully curated selection of dishes, prepared fresh daily with the finest ingredients',
          backgroundColor: '#F8F9FA',
          textColor: '#1A1A1A',
        },
      },
      {
        type: 'menu',
        order: 1,
        config: {
          allowOrdering: true,
          menuId: undefined, // Will be set when user selects a menu
        },
      },
    ],
  },
  {
    id: 'about',
    name: 'About Page',
    description: 'Tell your story and connect with your customers',
    slug: 'about',
    seoTitle: 'About Us - {restaurantName}',
    seoDescription: 'Learn about our story, values, and the team at {restaurantName}',
    previewImage: '/templates/about-preview.png',
    sections: [
      {
        type: 'hero',
        order: 0,
        config: {
          type: HeroSectionType.ImageRight,
          title: 'Our Story',
          description: 'Crafting memorable dining experiences since {year}',
          backgroundColor: '#FFFFFF',
          textColor: '#1A1A1A',
        },
      },
      {
        type: 'text',
        order: 1,
        config: {
          title: 'Who We Are',
          text: '{restaurantName} was founded with a simple vision: to create a space where great food brings people together. Our team of passionate chefs and dedicated staff work tirelessly to ensure every visit is special.\n\nWe believe in using locally sourced, seasonal ingredients to create dishes that celebrate both tradition and innovation. From our kitchen to your table, every detail is carefully considered to provide you with an exceptional dining experience.',
          alignText: TextAlignment.Left,
        },
      },
      {
        type: 'text',
        order: 2,
        config: {
          title: 'Our Values',
          text: '• Quality First: We never compromise on ingredients or preparation\n• Sustainability: Supporting local farmers and sustainable practices\n• Community: Creating a welcoming space for everyone\n• Excellence: Continuously improving and innovating',
          alignText: TextAlignment.Left,
        },
      },
      {
        type: 'text',
        order: 3,
        config: {
          title: 'Visit Us',
          text: "We look forward to welcoming you to {restaurantName}. Whether it's a casual dinner, special celebration, or business lunch, we're here to make it memorable.\n\nReservations are recommended, especially for weekends and special occasions.",
          alignText: TextAlignment.Center,
        },
      },
    ],
  },
]

/**
 * Get a template by ID
 */
export const getTemplateById = (id: string): PageTemplate | undefined => {
  return PAGE_TEMPLATES.find(template => template.id === id)
}

/**
 * Replace placeholder text in template
 */
export const replaceTemplatePlaceholders = (
  template: PageTemplate,
  replacements: { restaurantName: string; year?: string }
): PageTemplate => {
  const { restaurantName, year = new Date().getFullYear().toString() } = replacements

  const replaceInString = (text: string): string => {
    return text.replace(/{restaurantName}/g, restaurantName).replace(/{year}/g, year)
  }

  const processedSections = template.sections.map(section => {
    let processedConfig = { ...section.config }

    if ('title' in processedConfig && processedConfig.title) {
      processedConfig.title = replaceInString(processedConfig.title)
    }
    if ('description' in processedConfig && processedConfig.description) {
      processedConfig.description = replaceInString(processedConfig.description)
    }
    if ('text' in processedConfig && processedConfig.text) {
      processedConfig.text = replaceInString(processedConfig.text)
    }
    if ('buttonText' in processedConfig && processedConfig.buttonText) {
      processedConfig.buttonText = replaceInString(processedConfig.buttonText)
    }

    return {
      ...section,
      config: processedConfig,
    }
  })

  return {
    ...template,
    seoTitle: replaceInString(template.seoTitle),
    seoDescription: replaceInString(template.seoDescription),
    sections: processedSections,
  }
}

/**
 * Convert template sections to API format
 */
export const convertTemplateToApiSections = (template: PageTemplate): CreatePageSectionCommand[] => {
  return template.sections.map(section => ({
    type: section.type,
    order: section.order,
    config: convertSectionConfigToApi(section.config),
  }))
}

/**
 * Convert section config to API format
 */
const convertSectionConfigToApi = (config: any): Record<string, any> => {
  // Convert enum values to strings for API
  const apiConfig: Record<string, any> = {}
  
  for (const [key, value] of Object.entries(config)) {
    if (typeof value === 'object' && value !== null && 'toString' in value) {
      // Handle enum values
      apiConfig[key] = value.toString()
    } else {
      apiConfig[key] = value
    }
  }
  
  return apiConfig
}
