// Section management types
export enum TextAlignment {
  Left = 'Left',
  Center = 'Center',
  Right = 'Right'
}
export interface CreateHeroSectionCommand {
  websitePageId: string;
  sortOrder: number;
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
  type: import('./website.types').HeroSectionType;
}

export interface CreateHeroSectionResult {
  sectionId: string;
  heroSectionId: string;
}

// Update Hero Section types
export interface UpdateHeroSectionCommand {
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
  type: string;
}

export interface UpdateHeroSectionResult {
  heroSectionId: string;
}

// Text Section types
export interface CreateTextSectionCommand {
  websitePageId: string;
  sortOrder: number;
  title?: string;
  text?: string;
  alignText: TextAlignment;
  textColor?: string;
}

export interface CreateTextSectionResult {
  sectionId: string;
  textSectionId: string;
}

// Update Text Section types
export interface UpdateTextSectionCommand {
  title?: string;
  text?: string;
  alignText: TextAlignment;
  textColor?: string;
}

export interface UpdateTextSectionResult {
  textSectionId: string;
}