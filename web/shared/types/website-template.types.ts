// Website template creation types

export interface CreateWebsiteFromTemplatesCommand {
  restaurantId: string
  websiteName: string
  subdomain: string
  description?: string
  pageTemplates: PageTemplateRequest[]
  menuId?: string // For MenuPage template
}

export interface PageTemplateRequest {
  templateType: 'FrontPage' | 'MenuPage' | 'AboutPage' | 'ContactPage' | 'Blank'
  customTitle?: string
  customSlug?: string
}

export interface CreateWebsiteFromTemplatesResult {
  websiteId: string
  websiteName: string
  subdomain: string
  createdPages: CreatedPageResult[]
}

export interface CreatedPageResult {
  pageId: string
  title: string
  slug: string
  templateType: string
}

