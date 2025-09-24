import { HeroSectionType } from '@shared'
import { HeroSectionBackgroundImage } from './HeroSectionBackgroundImage'
import { HeroSectionImageRight } from './HeroSectionImageRight'

export interface HeroSectionProps {
  title: string
  description: string
  backgroundColor?: string
  textColor?: string
  backgroundOverlayColor?: string
  backgroundImageUrl?: string
  imageUrl?: string
  imageAlt?: string
  buttonText?: string
  buttonUrl?: string
  buttonTextColor?: string
  buttonBackgroundColor?: string
  type: HeroSectionType
  className?: string
  isEditing?: boolean
  onUpdate?: (field: string, value: string) => void
  onTypeChange?: (type: HeroSectionType) => void
}

export const HeroSection = ({
  title,
  description,
  backgroundColor,
  textColor,
  backgroundOverlayColor,
  backgroundImageUrl,
  imageUrl,
  imageAlt,
  buttonText,
  buttonUrl,
  buttonTextColor,
  buttonBackgroundColor,
  type,
  className,
  isEditing,
  onUpdate,
  onTypeChange,
}: HeroSectionProps) => {
  const props = {
    title,
    description,
    backgroundColor,
    textColor,
    backgroundOverlayColor,
    backgroundImageUrl,
    imageUrl,
    imageAlt,
    buttonText,
    buttonUrl,
    buttonTextColor,
    buttonBackgroundColor,
    className,
    isEditing,
    onUpdate,
    onTypeChange,
  }

  if (type === HeroSectionType.BackgroundImage) return <HeroSectionBackgroundImage {...props} />
  if (type === HeroSectionType.ImageRight) return <HeroSectionImageRight {...props} />
  return null
}