'use client'

import { HeroSectionType } from '@shared'
import { HeroImageRight } from './HeroImageRight'
import { HeroBackgroundImage } from './HeroBackgroundImage'

interface HeroSectionProps {
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
  className?: string
  isEditing?: boolean
  onUpdate?: (field: string, value: string) => void
  onTypeChange?: (type: HeroSectionType) => void
}

export function HeroSection({
  title,
  description,
  imageUrl,
  imageAlt,
  backgroundColor,
  textColor,
  backgroundOverlayColor,
  backgroundImageUrl,
  buttonText,
  buttonUrl,
  buttonTextColor,
  buttonBackgroundColor,
  type,
  className = '',
  isEditing,
  onUpdate,
  onTypeChange
}: HeroSectionProps) {
  if (type === HeroSectionType.ImageRight) {
    return (
      <HeroImageRight
        title={title}
        description={description}
        imageUrl={imageUrl}
        imageAlt={imageAlt}
        backgroundColor={backgroundColor}
        textColor={textColor}
        buttonText={buttonText}
        buttonUrl={buttonUrl}
        buttonTextColor={buttonTextColor}
        buttonBackgroundColor={buttonBackgroundColor}
        type={type}
        className={className}
        isEditing={isEditing}
        onUpdate={onUpdate}
        onTypeChange={onTypeChange}
      />
    )
  }

  return (
    <HeroBackgroundImage
      title={title}
      description={description}
      backgroundColor={backgroundColor}
      textColor={textColor}
      backgroundOverlayColor={backgroundOverlayColor}
      backgroundImageUrl={backgroundImageUrl}
      buttonText={buttonText}
      buttonUrl={buttonUrl}
      buttonTextColor={buttonTextColor}
      buttonBackgroundColor={buttonBackgroundColor}
      type={type}
      className={className}
      isEditing={isEditing}
      onUpdate={onUpdate}
      onTypeChange={onTypeChange}
    />
  )
}