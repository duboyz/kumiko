import { HeroBackgroundImage } from '@/components/sections/HeroSection/HeroBackgroundImage'
import { HeroSectionType } from '@shared'

interface HeroSectionBackgroundImageProps {
  title: string
  description: string
  backgroundColor?: string
  textColor?: string
  backgroundOverlayColor?: string
  backgroundImageUrl?: string
  buttonText?: string
  buttonUrl?: string
  buttonTextColor?: string
  buttonBackgroundColor?: string
  className?: string
  isEditing?: boolean
  onUpdate?: (field: string, value: string) => void
  onTypeChange?: (type: HeroSectionType) => void
}

export const HeroSectionBackgroundImage = ({
  title,
  description,
  backgroundColor,
  textColor,
  backgroundOverlayColor,
  backgroundImageUrl,
  buttonText,
  buttonUrl,
  buttonTextColor,
  buttonBackgroundColor,
  className,
  isEditing,
  onUpdate,
  onTypeChange,
}: HeroSectionBackgroundImageProps) => {
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
      type={HeroSectionType.BackgroundImage}
      className={className}
      isEditing={isEditing}
      onUpdate={onUpdate}
      onTypeChange={onTypeChange}
    />
  )
}