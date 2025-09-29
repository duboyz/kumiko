'use client'

import { HeroSectionDto, HeroSectionType } from '@shared'
import { HeroImageRight } from './HeroImageRight'
import { HeroBackgroundImage } from './HeroBackgroundImage'

interface HeroSectionProps {
  section: HeroSectionDto
  className?: string
  isEditing?: boolean
  onUpdate?: (field: string, value: string) => void
  onTypeChange?: (type: HeroSectionType) => void
}

export function HeroSection({
  section,

  className = '',
  isEditing,
  onUpdate,
  onTypeChange,
}: HeroSectionProps) {
  if (section.type === HeroSectionType.ImageRight) {
    return (
      <HeroImageRight
        title={section.title}
        description={section.description}
        imageUrl={section.imageUrl}
        imageAlt={section.imageAlt}
        backgroundColor={section.backgroundColor}
        textColor={section.textColor}
        buttonText={section.buttonText}
        buttonUrl={section.buttonUrl}
        buttonTextColor={section.buttonTextColor}
        buttonBackgroundColor={section.buttonBackgroundColor}
        type={section.type}
        className={className}
        isEditing={isEditing}
        onUpdate={onUpdate}
        onTypeChange={onTypeChange}
      />
    )
  }

  return (
    <HeroBackgroundImage
      title={section.title}
      description={section.description}
      backgroundColor={section.backgroundColor}
      textColor={section.textColor}
      backgroundOverlayColor={section.backgroundOverlayColor}
      backgroundImageUrl={section.backgroundImageUrl}
      buttonText={section.buttonText}
      buttonUrl={section.buttonUrl}
      buttonTextColor={section.buttonTextColor}
      buttonBackgroundColor={section.buttonBackgroundColor}
      type={section.type}
      className={className}
      isEditing={isEditing}
      onUpdate={onUpdate}
      onTypeChange={onTypeChange}
    />
  )
}
