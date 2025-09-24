import { HeroImageRight } from '@/components/sections/HeroSection/HeroImageRight'
import { HeroSectionType } from '@shared'

interface HeroSectionImageRightProps {
  title: string
  description: string
  imageUrl?: string
  imageAlt?: string
  backgroundColor?: string
  textColor?: string
  buttonText?: string
  buttonUrl?: string
  buttonTextColor?: string
  buttonBackgroundColor?: string
  className?: string
  isEditing?: boolean
  onUpdate?: (field: string, value: string) => void
  onTypeChange?: (type: HeroSectionType) => void
}

export const HeroSectionImageRight = ({
  title,
  description,
  imageUrl,
  imageAlt,
  backgroundColor,
  textColor,
  buttonText,
  buttonUrl,
  buttonTextColor,
  buttonBackgroundColor,
  className,
  isEditing,
  onUpdate,
  onTypeChange,
}: HeroSectionImageRightProps) => {
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
      type={HeroSectionType.ImageRight}
      className={className}
      isEditing={isEditing}
      onUpdate={onUpdate}
      onTypeChange={onTypeChange}
    />
  )
}
