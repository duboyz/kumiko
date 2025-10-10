'use client'

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

export function TextSection({
  title,
  text,
  alignText,
  textColor,
  className = '',
  isEditing,
  onUpdate,
}: TextSectionProps) {
  const sectionStyle = {
    color: textColor || '#000000',
  }

  const getAlignmentClass = () => {
    switch (alignText) {
      case TextAlignment.Left:
        return 'text-left'
      case TextAlignment.Center:
        return 'text-center'
      case TextAlignment.Right:
        return 'text-right'
      default:
        return 'text-center'
    }
  }

  const getMaxWidth = () => {
    return 'max-w-[800px]'
  }

  return (
    <section className={`relative py-20 px-10 bg-white ${className}`} style={sectionStyle}>
      {/* Content */}
      <div className={`${getMaxWidth()} mx-auto ${getAlignmentClass()}`}>
        {/* Title */}
        {isEditing && onUpdate ? (
          <textarea
            value={title || ''}
            onChange={e => onUpdate('title', e.target.value)}
            placeholder="Enter section title (optional)..."
            className={`w-full text-4xl font-light leading-tight mb-8 min-h-[3rem] resize-none bg-transparent placeholder:text-gray-400 outline-none border border-transparent hover:border-gray-300 focus:border-gray-400 rounded transition-colors px-2 py-1 ${getAlignmentClass()}`}
            style={{ color: textColor || '#000000' }}
          />
        ) : title ? (
          <h2 className="text-4xl font-light leading-tight mb-8">{title}</h2>
        ) : null}

        {/* Text */}
        {isEditing && onUpdate ? (
          <textarea
            value={text || ''}
            onChange={e => onUpdate('text', e.target.value)}
            placeholder="Enter your text content (optional)..."
            className={`w-full text-base leading-relaxed min-h-[8rem] resize-none bg-transparent placeholder:text-gray-400 outline-none border border-transparent hover:border-gray-300 focus:border-gray-400 rounded transition-colors px-2 py-1 ${getAlignmentClass()}`}
            style={{ color: textColor || '#000000', opacity: 0.7 }}
          />
        ) : text ? (
          <div className="text-base text-muted-foreground leading-relaxed whitespace-pre-wrap [&>p]:mb-6 [&>p:last-child]:mb-0">
            {text.split('\n\n').map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
        ) : null}

        {/* Show placeholder when both title and text are empty and not editing */}
        {!isEditing && !title && !text && (
          <div className="text-center py-8 text-muted-foreground border-2 border-dashed">
            <p className="text-lg">Empty Text Section</p>
            <p className="text-sm">Click to edit and add content</p>
          </div>
        )}
      </div>
    </section>
  )
}
