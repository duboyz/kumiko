'use client'

import { Button } from '@/components/ui/button'
import { HeroSectionType, type HeroSectionDto } from '@shared'
import Image from 'next/image'

interface HeroSectionProps {
  heroSection: HeroSectionDto
}

export function HeroSection({ heroSection }: HeroSectionProps) {
  const {
    title,
    description,
    buttonText,
    buttonUrl,
    imageUrl,
    imageAlt,
    type,
    backgroundColor,
    textColor,
    backgroundImageUrl,
    backgroundOverlayColor,
    buttonTextColor,
    buttonBackgroundColor
  } = heroSection

  if (type === HeroSectionType.ImageRight) {
    return (
      <section
        className="py-16 px-4"
        style={{
          backgroundColor: backgroundColor || undefined,
          color: textColor || undefined
        }}
      >
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h1 className="text-4xl lg:text-6xl font-bold">{title}</h1>
              <p className="text-lg lg:text-xl opacity-90">{description}</p>
              {buttonText && buttonUrl && (
                <Button
                  asChild
                  size="lg"
                  style={{
                    backgroundColor: buttonBackgroundColor || undefined,
                    color: buttonTextColor || undefined
                  }}
                >
                  <a href={buttonUrl}>{buttonText}</a>
                </Button>
              )}
            </div>
            {imageUrl && (
              <div className="relative aspect-square lg:aspect-[4/3]">
                <Image
                  src={imageUrl}
                  alt={imageAlt || title}
                  fill
                  className="object-cover rounded-lg"
                />
              </div>
            )}
          </div>
        </div>
      </section>
    )
  }

  // BackgroundImage variant
  return (
    <section
      className="relative py-24 px-4 min-h-[60vh] flex items-center justify-center"
      style={{
        backgroundImage: backgroundImageUrl ? `url(${backgroundImageUrl})` : undefined,
        backgroundColor: backgroundColor || undefined,
      }}
    >
      {/* Background overlay */}
      {backgroundOverlayColor && (
        <div
          className="absolute inset-0"
          style={{ backgroundColor: backgroundOverlayColor }}
        />
      )}

      <div className="relative z-10 container mx-auto text-center">
        <div className="max-w-3xl mx-auto space-y-6">
          <h1
            className="text-5xl lg:text-7xl font-bold"
            style={{ color: textColor || undefined }}
          >
            {title}
          </h1>
          <p
            className="text-xl lg:text-2xl opacity-90"
            style={{ color: textColor || undefined }}
          >
            {description}
          </p>
          {buttonText && buttonUrl && (
            <Button
              asChild
              size="lg"
              style={{
                backgroundColor: buttonBackgroundColor || undefined,
                color: buttonTextColor || undefined
              }}
            >
              <a href={buttonUrl}>{buttonText}</a>
            </Button>
          )}
        </div>
      </div>
    </section>
  )
}