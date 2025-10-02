'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { HeroSectionType } from '@shared'
import { HeroSettingsPopover } from './HeroSettingsPopover'

interface HeroBackgroundImageProps {
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
  type: HeroSectionType
  className?: string
  isEditing?: boolean
  onUpdate?: (field: string, value: string) => void
  onTypeChange?: (type: HeroSectionType) => void
}

export function HeroBackgroundImage({
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
  type,
}: HeroBackgroundImageProps) {
  const sectionStyle = {
    backgroundColor: backgroundColor || '#1f2937',
    color: textColor || '#ffffff',
    backgroundImage: backgroundImageUrl ? `url(${backgroundImageUrl})` : undefined,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
  }

  const overlayStyle = {
    backgroundColor: backgroundOverlayColor || (backgroundImageUrl ? 'rgba(0, 0, 0, 0.5)' : undefined),
  }

  const buttonStyle = {
    backgroundColor: buttonBackgroundColor || undefined,
    color: buttonTextColor || undefined,
  }

  return (
    <section className={`relative py-[160px] px-10 text-center ${className}`} style={sectionStyle}>
      {/* Floating Edit Button */}
      {isEditing && onUpdate && (
        <HeroSettingsPopover
          type={type}
          backgroundImageUrl={backgroundImageUrl}
          backgroundColor={backgroundColor}
          textColor={textColor}
          backgroundOverlayColor={backgroundOverlayColor}
          buttonText={buttonText}
          buttonUrl={buttonUrl}
          buttonTextColor={buttonTextColor}
          buttonBackgroundColor={buttonBackgroundColor}
          onUpdate={onUpdate}
          onTypeChange={onTypeChange}
        />
      )}

      {/* Overlay */}
      <div className="absolute inset-0" style={overlayStyle} />

      {/* Content */}
      <div className="relative max-w-[800px] mx-auto">
        {isEditing && onUpdate ? (
          <>
            {/* Content Editing */}
            <Input
              value={title}
              onChange={e => onUpdate('title', e.target.value)}
              placeholder="Enter title..."
              className="text-6xl font-light leading-tight mb-6 min-h-[4rem] resize-none border-2 border-dashed border-white/50 bg-white/10 placeholder:text-white/70 text-center"
            />
            <Textarea
              value={description}
              onChange={e => onUpdate('description', e.target.value)}
              placeholder="Enter description..."
              className="text-lg text-muted-foreground leading-relaxed mb-10 min-h-[6rem] resize-none border-2 border-dashed border-white/50 bg-white/10 placeholder:text-white/70 text-center"
            />
            <div className="inline-flex gap-4">
              <Button
                variant="default"
                className="px-10 py-5 text-sm"
                style={buttonStyle}
                asChild={!!buttonUrl && !!buttonText}
              >
                {buttonUrl && buttonText ? (
                  <a href={buttonUrl}>{buttonText}</a>
                ) : (
                  <span>{buttonText || 'Button Text'}</span>
                )}
              </Button>
            </div>
          </>
        ) : (
          <>
            <h1 className="text-6xl font-light leading-tight mb-6">{title}</h1>
            <p className="text-lg text-muted-foreground leading-relaxed mb-10">{description}</p>
            {buttonText && (
              <div className="inline-flex gap-4">
                <Button variant="default" className="px-10 py-5 text-sm" style={buttonStyle} asChild={!!buttonUrl}>
                  {buttonUrl ? <a href={buttonUrl}>{buttonText}</a> : <span>{buttonText}</span>}
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  )
}
