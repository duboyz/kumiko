import { WebsitePageDto } from './website.types'

// Website Page operation types
export interface CreateWebsitePageCommand {
  slug: string
  title: string
  seoTitle?: string
  seoDescription?: string
  seoKeywords?: string
  websiteId: string
  templateId?: string
  sections?: CreatePageSectionCommand[]
}

export interface CreatePageSectionCommand {
  type: string
  order: number
  config: Record<string, any>
}

export interface CreateWebsitePageResult {
  pageId: string
}

export interface GetWebsitePagesQuery {
  websiteId: string
}

export interface GetWebsitePagesResult {
  pages: WebsitePageDto[]
}
