import { TextSection as MainTextSection } from '@/components/sections/TextSection'
import { TextAlignment } from '@shared'

interface TextSectionProps {
  title?: string
  text?: string
  alignText: TextAlignment
  textColor?: string
  className?: string
  isEditing?: boolean
  onUpdate?: (field: string, value: string) => void
}

export const TextSection = ({
  title,
  text,
  alignText,
  textColor,
  className,
  isEditing,
  onUpdate,
}: TextSectionProps) => {
  return (
    <MainTextSection
      title={title}
      text={text}
      alignText={alignText}
      textColor={textColor}
      className={className}
      isEditing={isEditing}
      onUpdate={onUpdate}
    />
  )
}