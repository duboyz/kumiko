import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { KumikoHeading } from "../../atoms/KumikoHeading"
import { KumikoText } from "../../atoms/KumikoText"
import { KumikoButton } from "../../atoms/KumikoButton"

const heroSectionVariants = cva(
  "relative w-full overflow-hidden",
  {
    variants: {
      variant: {
        "image-right": "bg-kumiko-white",
        "background-image": "relative bg-cover bg-center bg-no-repeat",
        "minimal": "bg-kumiko-white",
      },
      spacing: {
        compact: "py-16 px-6",
        normal: "py-24 px-6 lg:py-32",
        spacious: "py-32 px-6 lg:py-48",
      },
    },
    defaultVariants: {
      variant: "minimal",
      spacing: "normal",
    },
  }
)

export interface HeroSectionProps
  extends React.HTMLAttributes<HTMLElement>,
  VariantProps<typeof heroSectionVariants> {
  title: string
  description?: string
  imageUrl?: string
  imageAlt?: string
  backgroundColor?: string
  textColor?: string
  backgroundOverlayColor?: string
  backgroundImageUrl?: string
  buttonText?: string
  buttonUrl?: string
  buttonVariant?: "primary" | "secondary" | "ghost"
  isEditing?: boolean
  onUpdate?: (field: string, value: string) => void
  onTypeChange?: (variant: "image-right" | "background-image" | "minimal") => void
}

const HeroSection = React.forwardRef<HTMLElement, HeroSectionProps>(
  ({
    className,
    title,
    description,
    imageUrl,
    imageAlt,
    backgroundColor,
    textColor,
    backgroundOverlayColor,
    backgroundImageUrl,
    buttonText,
    buttonUrl,
    buttonVariant = "primary",
    variant,
    spacing,
    isEditing,
    onUpdate,
    onTypeChange,
    ...props
  }, ref) => {
    const containerStyle = React.useMemo(() => ({
      backgroundColor: backgroundColor || undefined,
      color: textColor || undefined,
      backgroundImage: variant === "background-image" && backgroundImageUrl
        ? `url(${backgroundImageUrl})`
        : undefined,
    }), [backgroundColor, textColor, variant, backgroundImageUrl])

    const overlayStyle = React.useMemo(() => ({
      backgroundColor: backgroundOverlayColor || undefined,
    }), [backgroundOverlayColor])

    const renderContent = () => (
      <div className="relative z-10 max-w-7xl mx-auto">
        <div className={cn(
          "grid gap-12 items-center",
          variant === "image-right" ? "lg:grid-cols-2" : "grid-cols-1"
        )}>
          {/* Text Content */}
          <div className={cn(
            "space-y-8",
            variant === "background-image" ? "text-center" : "text-left"
          )}>
            {/* Title */}
            <KumikoHeading
              level="h1"
              size="logo-large"
              className="leading-tight"
              color={textColor ? undefined : "primary"}
              style={textColor ? { color: textColor } : undefined}
            >
              {title}
            </KumikoHeading>

            {/* Description */}
            {description && (
              <KumikoText
                size="lg"
                className={cn(
                  "max-w-2xl",
                  variant === "background-image" ? "mx-auto" : ""
                )}
                color={textColor ? undefined : "secondary"}
                style={textColor ? { color: textColor } : undefined}
              >
                {description}
              </KumikoText>
            )}

            {/* Call to Action Button */}
            {buttonText && (
              <div className={cn(
                "pt-4",
                variant === "background-image" ? "flex justify-center" : "flex justify-start"
              )}>
                {buttonUrl ? (
                  <a href={buttonUrl} className="inline-flex">
                    <KumikoButton
                      variant={buttonVariant}
                      size="lg"
                    >
                      {buttonText}
                    </KumikoButton>
                  </a>
                ) : (
                  <KumikoButton
                    variant={buttonVariant}
                    size="lg"
                  >
                    {buttonText}
                  </KumikoButton>
                )}
              </div>
            )}
          </div>

          {/* Image (for image-right variant) */}
          {variant === "image-right" && imageUrl && (
            <div className="relative">
              <div className="aspect-[4/3] overflow-hidden rounded-base">
                <img
                  src={imageUrl}
                  alt={imageAlt || title}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    )

    return (
      <section
        ref={ref}
        className={cn(heroSectionVariants({ variant, spacing, className }))}
        style={containerStyle}
        {...props}
      >
        {/* Background Overlay (for background-image variant) */}
        {variant === "background-image" && backgroundOverlayColor && (
          <div
            className="absolute inset-0 z-0"
            style={overlayStyle}
          />
        )}

        {renderContent()}
      </section>
    )
  }
)

HeroSection.displayName = "HeroSection"

export { HeroSection, heroSectionVariants }