import { WebsitePageDto } from "./websiteTypes";

// Website Page operation types
export interface CreateWebsitePageCommand {
  slug: string;
  title: string;
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string;
  websiteId: string;
}

export interface CreateWebsitePageResult {
  pageId: string;
}

export interface GetWebsitePagesQuery {
  websiteId: string;
}

export interface GetWebsitePagesResult {
  pages: WebsitePageDto[];
}