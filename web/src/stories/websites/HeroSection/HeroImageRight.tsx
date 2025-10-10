'use client'

import { Button } from '@/components/ui/button'
import { HeroSectionType } from '@shared'

interface HeroImageRightProps {
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
  type: HeroSectionType
  className?: string
  isEditing?: boolean
  onUpdate?: (field: string, value: string) => void
  onTypeChange?: (type: HeroSectionType) => void
}

export function HeroImageRight({
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
  type,
}: HeroImageRightProps) {
  const containerStyle = {
    backgroundColor: backgroundColor || undefined,
    color: textColor || undefined,
  }

  const buttonStyle = {
    backgroundColor: buttonBackgroundColor || undefined,
    color: buttonTextColor || undefined,
  }

  return (
    <section
      className={`grid grid-cols-1 lg:grid-cols-2 min-h-[600px] items-center ${className}`}
      style={containerStyle}
    >
      {/* Content */}
      <div className="p-20">
        {isEditing && onUpdate ? (
          <>
            {/* Content Editing */}
            <textarea
              value={title}
              onChange={e => onUpdate('title', e.target.value)}
              placeholder="Enter title..."
              className="w-full text-5xl font-light leading-tight mb-6 min-h-[3.5rem] resize-none border-2 border-dashed border-blue-300 bg-blue-50/50 text-left outline-none focus:border-blue-500 transition-colors px-4 py-2"
              style={{ color: textColor || 'inherit' }}
            />
            <textarea
              value={description}
              onChange={e => onUpdate('description', e.target.value)}
              placeholder="Enter description..."
              className="w-full text-lg leading-relaxed mb-10 min-h-[5rem] resize-none border-2 border-dashed border-blue-300 bg-blue-50/50 text-left outline-none focus:border-blue-500 transition-colors px-4 py-2 opacity-70"
              style={{ color: textColor || 'inherit' }}
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
            <h1 className="text-5xl font-light leading-tight mb-6 text-left" style={{ color: textColor || 'inherit' }}>
              {title}
            </h1>
            <p className="text-lg leading-relaxed mb-10 text-left opacity-70" style={{ color: textColor || 'inherit' }}>
              {description}
            </p>
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

      {/* Image */}
      <div className="h-full">
        {imageUrl ? (
          <div
            className="h-full min-h-[600px] bg-cover bg-center"
            style={{ backgroundImage: `url(${imageUrl})` }}
            role="img"
            aria-label={imageAlt || title}
          />
        ) : (
          <div className="h-full min-h-[600px] bg-muted flex items-center justify-center">
            <div className="text-muted-foreground text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-muted-foreground/10 flex items-center justify-center rounded">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <p className="text-sm">Add an image to see it here</p>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
