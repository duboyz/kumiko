import { HeroSectionType } from './website.types'
import { TextAlignment } from './section.types'

/**
 * Page Template Types
 *
 * Defines reusable page templates for quick website setup
 */

export interface PageTemplateSection {
  type: 'hero' | 'text' | 'menu'
  order: number
  config: HeroSectionConfig | TextSectionConfig | MenuSectionConfig
}

export interface HeroSectionConfig {
  type: HeroSectionType
  title: string
  description: string
  buttonText?: string
  buttonUrl?: string
  backgroundColor?: string
  textColor?: string
}

export interface TextSectionConfig {
  title: string
  text: string
  alignText: TextAlignment
}

export interface MenuSectionConfig {
  allowOrdering: boolean
  menuId?: string
}

export interface PageTemplate {
  id: string
  name: string
  description: string
  slug: string
  sections: PageTemplateSection[]
  seoTitle: string
  seoDescription: string
  previewImage?: string
}

export type PageTemplateId = 'frontpage' | 'menu' | 'about'
