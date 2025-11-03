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
    <section
      className={`relative py-16 md:py-24 px-6 md:px-10 bg-gradient-to-b from-background to-muted/20 ${className}`}
      style={sectionStyle}
    >
      {/* Content */}
      <div className={`${getMaxWidth()} mx-auto ${getAlignmentClass()}`}>
        {/* Title */}
        {isEditing && onUpdate ? (
          <textarea
            value={title || ''}
            onChange={e => onUpdate('title', e.target.value)}
            placeholder="Enter section title (optional)..."
            className={`w-full text-3xl md:text-4xl font-semibold leading-tight mb-6 md:mb-10 min-h-[3rem] resize-none bg-transparent placeholder:text-muted-foreground outline-none border border-transparent hover:border-border focus:border-primary rounded transition-colors px-3 py-2 ${getAlignmentClass()}`}
            style={{ color: textColor || 'currentColor' }}
          />
        ) : title ? (
          <h2 className="text-3xl md:text-4xl font-semibold leading-tight mb-6 md:mb-10 text-foreground">{title}</h2>
        ) : null}

        {/* Text */}
        {isEditing && onUpdate ? (
          <textarea
            value={text || ''}
            onChange={e => onUpdate('text', e.target.value)}
            placeholder="Enter your text content (optional)..."
            className={`w-full text-base md:text-lg leading-relaxed min-h-[8rem] resize-none bg-transparent placeholder:text-muted-foreground outline-none border border-transparent hover:border-border focus:border-primary rounded transition-colors px-3 py-2 ${getAlignmentClass()}`}
            style={{ color: textColor || 'currentColor' }}
          />
        ) : text ? (
          <div className="text-base md:text-lg leading-relaxed whitespace-pre-wrap">
            {(() => {
              const paragraphs = text.split('\n\n')
              const introParagraph = paragraphs[0]?.trim()
              const contactInfoLines = text.split('\n').filter(line => /📍|🏙️|🕒/.test(line.trim()))

              // Check if this looks like a contact page (has contact info emojis)
              const isContactPage = contactInfoLines.length > 0

              if (isContactPage && introParagraph) {
                // Render contact page layout
                const addressLine = contactInfoLines.find(l => l.includes('📍'))
                const cityLine = contactInfoLines.find(l => l.includes('🏙️'))

                // Extract business hours - find the 🕒 line and get everything after it
                const hoursIndex = text.indexOf('🕒')
                let hoursSection = hoursIndex >= 0 ? text.substring(hoursIndex + 1) : null
                let parsedBusinessHours: any = null

                if (hoursSection) {
                  // Remove the emoji and "Business Hours:" label, get just the hours
                  let rawHours = hoursSection
                    .replace(/^🕒\s*/, '')
                    .replace(/Business Hours:\s*/i, '')
                    .trim()

                  // Try to parse as JSON (business hours are stored as JSON)
                  try {
                    parsedBusinessHours = JSON.parse(rawHours)
                  } catch {
                    // If not JSON, use as plain text
                    hoursSection = rawHours
                      .split('\n')
                      .filter(line => line.trim() && !line.includes('🕒'))
                      .join('\n')

                    if (!hoursSection) hoursSection = null
                  }
                }

                return (
                  <div className="space-y-8">
                    {/* Introduction */}
                    <p className="text-muted-foreground mb-8 leading-relaxed text-lg">{introParagraph}</p>

                    {/* Contact Information Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Address Card */}
                      {(addressLine || cityLine) && (
                        <div className="p-6 rounded-lg bg-card border border-border/50 hover:border-border transition-colors shadow-sm">
                          <div className="space-y-4">
                            {addressLine && (
                              <div className="flex items-start gap-3">
                                <span className="text-2xl flex-shrink-0 mt-0.5">📍</span>
                                <div className="flex-1">
                                  <h3 className="text-sm font-semibold text-muted-foreground mb-1 uppercase tracking-wide">
                                    Address
                                  </h3>
                                  <p className="text-foreground leading-relaxed">
                                    {addressLine.replace(/📍\s*/, '').trim()}
                                  </p>
                                </div>
                              </div>
                            )}
                            {cityLine && (
                              <div className="flex items-start gap-3 pt-2 border-t border-border/50">
                                <span className="text-2xl flex-shrink-0 mt-0.5">🏙️</span>
                                <div className="flex-1">
                                  <p className="text-foreground leading-relaxed">
                                    {cityLine.replace(/🏙️\s*/, '').trim()}
                                  </p>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Business Hours Card */}
                      {(hoursSection || parsedBusinessHours) && (
                        <div className="p-6 rounded-lg bg-card border border-border/50 hover:border-border transition-colors shadow-sm">
                          <div className="flex items-start gap-3">
                            <span className="text-2xl flex-shrink-0 mt-0.5">🕒</span>
                            <div className="flex-1">
                              <h3 className="text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-wide">
                                Business Hours
                              </h3>
                              {parsedBusinessHours ? (
                                <div className="space-y-1.5 text-sm">
                                  {parsedBusinessHours.monday !== undefined && parsedBusinessHours.monday !== null && (
                                    <div className="flex justify-between items-center">
                                      <span className="font-medium text-foreground">Monday</span>
                                      <span className="text-muted-foreground">
                                        {parsedBusinessHours.monday.open} – {parsedBusinessHours.monday.close}
                                      </span>
                                    </div>
                                  )}
                                  {parsedBusinessHours.monday === null && (
                                    <div className="flex justify-between items-center">
                                      <span className="font-medium text-foreground">Monday</span>
                                      <span className="text-muted-foreground">Closed</span>
                                    </div>
                                  )}
                                  {parsedBusinessHours.tuesday !== undefined &&
                                    parsedBusinessHours.tuesday !== null && (
                                      <div className="flex justify-between items-center">
                                        <span className="font-medium text-foreground">Tuesday</span>
                                        <span className="text-muted-foreground">
                                          {parsedBusinessHours.tuesday.open} – {parsedBusinessHours.tuesday.close}
                                        </span>
                                      </div>
                                    )}
                                  {parsedBusinessHours.tuesday === null && (
                                    <div className="flex justify-between items-center">
                                      <span className="font-medium text-foreground">Tuesday</span>
                                      <span className="text-muted-foreground">Closed</span>
                                    </div>
                                  )}
                                  {parsedBusinessHours.wednesday !== undefined &&
                                    parsedBusinessHours.wednesday !== null && (
                                      <div className="flex justify-between items-center">
                                        <span className="font-medium text-foreground">Wednesday</span>
                                        <span className="text-muted-foreground">
                                          {parsedBusinessHours.wednesday.open} – {parsedBusinessHours.wednesday.close}
                                        </span>
                                      </div>
                                    )}
                                  {parsedBusinessHours.wednesday === null && (
                                    <div className="flex justify-between items-center">
                                      <span className="font-medium text-foreground">Wednesday</span>
                                      <span className="text-muted-foreground">Closed</span>
                                    </div>
                                  )}
                                  {parsedBusinessHours.thursday !== undefined &&
                                    parsedBusinessHours.thursday !== null && (
                                      <div className="flex justify-between items-center">
                                        <span className="font-medium text-foreground">Thursday</span>
                                        <span className="text-muted-foreground">
                                          {parsedBusinessHours.thursday.open} – {parsedBusinessHours.thursday.close}
                                        </span>
                                      </div>
                                    )}
                                  {parsedBusinessHours.thursday === null && (
                                    <div className="flex justify-between items-center">
                                      <span className="font-medium text-foreground">Thursday</span>
                                      <span className="text-muted-foreground">Closed</span>
                                    </div>
                                  )}
                                  {parsedBusinessHours.friday !== undefined && parsedBusinessHours.friday !== null && (
                                    <div className="flex justify-between items-center">
                                      <span className="font-medium text-foreground">Friday</span>
                                      <span className="text-muted-foreground">
                                        {parsedBusinessHours.friday.open} – {parsedBusinessHours.friday.close}
                                      </span>
                                    </div>
                                  )}
                                  {parsedBusinessHours.friday === null && (
                                    <div className="flex justify-between items-center">
                                      <span className="font-medium text-foreground">Friday</span>
                                      <span className="text-muted-foreground">Closed</span>
                                    </div>
                                  )}
                                  {parsedBusinessHours.saturday !== undefined &&
                                    parsedBusinessHours.saturday !== null && (
                                      <div className="flex justify-between items-center">
                                        <span className="font-medium text-foreground">Saturday</span>
                                        <span className="text-muted-foreground">
                                          {parsedBusinessHours.saturday.open} – {parsedBusinessHours.saturday.close}
                                        </span>
                                      </div>
                                    )}
                                  {parsedBusinessHours.saturday === null && (
                                    <div className="flex justify-between items-center">
                                      <span className="font-medium text-foreground">Saturday</span>
                                      <span className="text-muted-foreground">Closed</span>
                                    </div>
                                  )}
                                  {parsedBusinessHours.sunday !== undefined && parsedBusinessHours.sunday !== null && (
                                    <div className="flex justify-between items-center">
                                      <span className="font-medium text-foreground">Sunday</span>
                                      <span className="text-muted-foreground">
                                        {parsedBusinessHours.sunday.open} – {parsedBusinessHours.sunday.close}
                                      </span>
                                    </div>
                                  )}
                                  {parsedBusinessHours.sunday === null && (
                                    <div className="flex justify-between items-center">
                                      <span className="font-medium text-foreground">Sunday</span>
                                      <span className="text-muted-foreground">Closed</span>
                                    </div>
                                  )}
                                </div>
                              ) : hoursSection ? (
                                <div className="text-foreground leading-relaxed whitespace-pre-line">
                                  {hoursSection.split('\n').map((line, idx) => (
                                    <p key={idx} className={idx > 0 ? 'mt-1.5' : ''}>
                                      {line.trim()}
                                    </p>
                                  ))}
                                </div>
                              ) : null}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )
              }

              // Default rendering for non-contact pages
              return (
                <div className="text-muted-foreground space-y-4">
                  {paragraphs.map((paragraph, index) => {
                    const isContactInfo = /📍|🏙️|🕒/.test(paragraph)

                    if (isContactInfo) {
                      const lines = paragraph.split('\n')
                      return (
                        <div key={index} className="space-y-3">
                          {lines.map((line, lineIndex) => {
                            if (/📍|🏙️|🕒/.test(line)) {
                              return (
                                <div key={lineIndex} className="flex items-start gap-3 text-foreground">
                                  <span className="text-xl flex-shrink-0">{line.match(/📍|🏙️|🕒/)?.[0]}</span>
                                  <span className="flex-1 leading-relaxed">{line.replace(/📍|🏙️|🕒\s*/, '')}</span>
                                </div>
                              )
                            }
                            return line.trim() ? (
                              <p key={lineIndex} className="leading-relaxed">
                                {line}
                              </p>
                            ) : null
                          })}
                        </div>
                      )
                    }

                    return paragraph.trim() ? (
                      <p key={index} className="leading-relaxed">
                        {paragraph}
                      </p>
                    ) : null
                  })}
                </div>
              )
            })()}
          </div>
        ) : null}

        {/* Show placeholder when both title and text are empty and not editing */}
        {!isEditing && !title && !text && (
          <div className="text-center py-12 text-muted-foreground border-2 border-dashed rounded-lg bg-muted/30">
            <p className="text-lg font-medium">Empty Text Section</p>
            <p className="text-sm mt-1">Click to edit and add content</p>
          </div>
        )}
      </div>
    </section>
  )
}
