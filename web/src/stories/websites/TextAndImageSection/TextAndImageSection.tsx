'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { TextAlignment } from '@shared'

interface TextAndImageSectionProps {
  title?: string
  content?: string
  buttonText?: string
  buttonUrl?: string
  imageUrl?: string
  imageAlt?: string
  textColor?: string
  buttonColor?: string
  buttonTextColor?: string
  alignment: TextAlignment
  imageOnLeft: boolean
  className?: string
  isEditing?: boolean
  onUpdate?: (field: string, value: string | boolean) => void
}

export function TextAndImageSection({
  title,
  content,
  buttonText,
  buttonUrl,
  imageUrl,
  imageAlt,
  textColor,
  buttonColor,
  buttonTextColor,
  alignment,
  imageOnLeft,
  className = '',
  isEditing,
  onUpdate,
}: TextAndImageSectionProps) {
  const sectionStyle = {
    color: textColor || '#1f2937',
  }

  const buttonStyle = {
    backgroundColor: buttonColor || '#3b82f6',
    color: buttonTextColor || '#ffffff',
  }

  const getAlignmentClass = () => {
    switch (alignment) {
      case TextAlignment.Left:
        return 'text-left items-start'
      case TextAlignment.Center:
        return 'text-center items-center'
      case TextAlignment.Right:
        return 'text-right items-end'
      default:
        return 'text-left items-start'
    }
  }

  const contentElement = (
    <div className={`flex flex-col ${getAlignmentClass()} justify-center p-12`}>
      {/* Title */}
      {isEditing && onUpdate ? (
        <Input
          value={title || ''}
          onChange={e => onUpdate('title', e.target.value)}
          placeholder="Enter section title..."
          className="text-3xl font-bold leading-tight mb-4 min-h-[3rem] border-2 border-dashed border-blue-300 bg-blue-50/50"
        />
      ) : title ? (
        <h2 className="text-3xl font-bold leading-tight mb-4">{title}</h2>
      ) : null}

      {/* Content */}
      {isEditing && onUpdate ? (
        <Textarea
          value={content || ''}
          onChange={e => onUpdate('content', e.target.value)}
          placeholder="Enter your content..."
          className="text-base leading-relaxed mb-6 min-h-[8rem] resize-none border-2 border-dashed border-blue-300 bg-blue-50/50"
        />
      ) : content ? (
        <div className="text-base leading-relaxed mb-6 whitespace-pre-wrap">
          {content.split('\n\n').map((paragraph, index) => (
            <p key={index} className="mb-4 last:mb-0">
              {paragraph}
            </p>
          ))}
        </div>
      ) : null}

      {/* Button */}
      {(buttonText || isEditing) && (
        <div>
          {isEditing && onUpdate ? (
            <div className="space-y-2">
              <Input
                value={buttonText || ''}
                onChange={e => onUpdate('buttonText', e.target.value)}
                placeholder="Button text..."
                className="border-2 border-dashed border-blue-300 bg-blue-50/50"
              />
              <Input
                value={buttonUrl || ''}
                onChange={e => onUpdate('buttonUrl', e.target.value)}
                placeholder="Button URL..."
                className="border-2 border-dashed border-blue-300 bg-blue-50/50"
              />
              <Button style={buttonStyle} className="px-8 py-3">
                {buttonText || 'Button Preview'}
              </Button>
            </div>
          ) : (
            <Button style={buttonStyle} className="px-8 py-3" asChild={!!buttonUrl}>
              {buttonUrl ? <a href={buttonUrl}>{buttonText}</a> : <span>{buttonText}</span>}
            </Button>
          )}
        </div>
      )}

      {/* Empty state for editing */}
      {!isEditing && !title && !content && !buttonText && (
        <div className="text-center py-8 text-muted-foreground border-2 border-dashed">
          <p className="text-lg">Empty Text and Image Section</p>
          <p className="text-sm">Click to edit and add content</p>
        </div>
      )}
    </div>
  )

  const imageElement = (
    <div className="h-full min-h-[400px]">
      {isEditing && onUpdate ? (
        <div className="h-full">
          {imageUrl ? (
            <div
              className="h-full min-h-[400px] bg-cover bg-center"
              style={{ backgroundImage: `url(${imageUrl})` }}
              role="img"
              aria-label={imageAlt || title || 'Section image'}
            />
          ) : (
            <div className="h-full min-h-[400px] bg-muted flex items-center justify-center border-2 border-dashed border-blue-300">
              <div className="text-center text-muted-foreground">
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
                <p className="text-sm">Add an image URL in settings</p>
              </div>
            </div>
          )}
        </div>
      ) : imageUrl ? (
        <div
          className="h-full min-h-[400px] bg-cover bg-center"
          style={{ backgroundImage: `url(${imageUrl})` }}
          role="img"
          aria-label={imageAlt || title || 'Section image'}
        />
      ) : (
        <div className="h-full min-h-[400px] bg-muted flex items-center justify-center">
          <div className="text-center text-muted-foreground">
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
            <p className="text-sm">No image</p>
          </div>
        </div>
      )}
    </div>
  )

  return (
    <section className={`relative bg-white ${className}`} style={sectionStyle}>
      {/* Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2">
        {imageOnLeft ? (
          <>
            {imageElement}
            {contentElement}
          </>
        ) : (
          <>
            {contentElement}
            {imageElement}
          </>
        )}
      </div>
    </section>
  )
}
