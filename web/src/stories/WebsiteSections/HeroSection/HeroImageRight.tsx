'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { HeroSectionType } from '@shared'
import { HeroSettingsPopover } from './HeroSettingsPopover'

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
    <section className={`py-12 px-4 md:py-20 md:px-6 lg:px-8 ${className}`} style={containerStyle}>
      {/* Floating Edit Button */}
      {isEditing && onUpdate && (
        <HeroSettingsPopover
          type={type}
          imageUrl={imageUrl}
          backgroundColor={backgroundColor}
          textColor={textColor}
          buttonText={buttonText}
          buttonUrl={buttonUrl}
          buttonTextColor={buttonTextColor}
          buttonBackgroundColor={buttonBackgroundColor}
          onUpdate={onUpdate}
          onTypeChange={onTypeChange}
        />
      )}

      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Content */}
          <div className="space-y-6 relative">
            {isEditing && onUpdate ? (
              <>
                {/* Content Editing */}
                <Input
                  value={title}
                  onChange={e => onUpdate('title', e.target.value)}
                  placeholder="Enter title..."
                  className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight min-h-[3.5rem] resize-none border-2 border-dashed border-blue-300 bg-blue-50/50"
                />
                <Textarea
                  value={description}
                  onChange={e => onUpdate('description', e.target.value)}
                  placeholder="Enter description..."
                  className="text-lg md:text-xl opacity-90 leading-relaxed min-h-[5rem] resize-none border-2 border-dashed border-blue-300 bg-blue-50/50"
                />
                <div className="pt-4">
                  <Button
                    size="lg"
                    className="px-8 py-3 text-base font-semibold"
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
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight">{title}</h1>
                <p className="text-lg md:text-xl opacity-90 leading-relaxed">{description}</p>
                <div className="pt-4">
                  <Button
                    size="lg"
                    className="px-8 py-3 text-base font-semibold"
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
            )}
          </div>

          {/* Image */}
          <div className="order-first lg:order-last">
            {imageUrl ? (
              <img
                src={imageUrl}
                alt={imageAlt || title}
                className="w-full h-64 md:h-80 lg:h-96 object-cover rounded-lg shadow-lg"
              />
            ) : (
              <div className="w-full h-64 md:h-80 lg:h-96 bg-gray-200 rounded-lg flex items-center justify-center">
                <div className="text-gray-500 text-center">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gray-300 rounded-lg flex items-center justify-center">
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
        </div>
      </div>
    </section>
  )
}
