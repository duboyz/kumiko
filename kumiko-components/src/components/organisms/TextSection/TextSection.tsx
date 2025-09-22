import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { KumikoHeading } from "../../atoms/KumikoHeading"
import { KumikoText } from "../../atoms/KumikoText"
import { EmptyState } from "../../molecules/EmptyState"

const textSectionVariants = cva(
  "relative w-full",
  {
    variants: {
      alignment: {
        left: "text-left",
        center: "text-center",
        right: "text-right",
      },
      spacing: {
        compact: "py-12 px-6",
        normal: "py-16 px-6 lg:py-20",
        spacious: "py-24 px-6 lg:py-32",
      },
      width: {
        narrow: "max-w-2xl mx-auto",
        normal: "max-w-4xl mx-auto",
        wide: "max-w-6xl mx-auto",
        full: "max-w-none",
      },
    },
    defaultVariants: {
      alignment: "left",
      spacing: "normal",
      width: "normal",
    },
  }
)

export interface TextSectionProps
  extends React.HTMLAttributes<HTMLElement>,
  VariantProps<typeof textSectionVariants> {
  title?: string
  text?: string
  titleLevel?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6"
  titleSize?: "logo" | "logo-large" | "subtitle" | "section" | "step" | "category"
  textSize?: "xs" | "sm" | "base" | "md" | "lg" | "xl"
  textColor?: string
  backgroundColor?: string
  isEditing?: boolean
  onUpdate?: (field: string, value: string) => void
}

const TextSection = React.forwardRef<HTMLElement, TextSectionProps>(
  ({
    className,
    title,
    text,
    titleLevel = "h2",
    titleSize = "section",
    textSize = "base",
    textColor,
    backgroundColor,
    alignment,
    spacing,
    width,
    isEditing,
    onUpdate,
    ...props
  }, ref) => {
    const sectionStyle = React.useMemo(() => ({
      backgroundColor: backgroundColor || undefined,
      color: textColor || undefined,
    }), [backgroundColor, textColor])

    // Show empty state when no content and not editing
    if (!isEditing && !title && !text) {
      return (
        <section
          ref={ref}
          className={cn(textSectionVariants({ alignment, spacing, width, className }))}
          style={sectionStyle}
          {...props}
        >
          <EmptyState
            icon={
              <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 6h16M4 12h16M4 18h7" />
              </svg>
            }
            title="Empty Text Section"
            subtitle="Add content to display text and titles"
            size="sm"
          />
        </section>
      )
    }

    return (
      <section
        ref={ref}
        className={cn(textSectionVariants({ alignment, spacing, width, className }))}
        style={sectionStyle}
        {...props}
      >
        <div className="space-y-6">
          {/* Title */}
          {title && (
            <KumikoHeading
              level={titleLevel}
              size={titleSize}
              color={textColor ? undefined : "primary"}
              className="leading-tight"
            >
              {title}
            </KumikoHeading>
          )}

          {/* Text Content */}
          {text && (
            <KumikoText
              size={textSize}
              color={textColor ? undefined : "secondary"}
              className="leading-relaxed whitespace-pre-wrap"
            >
              {text}
            </KumikoText>
          )}
        </div>
      </section>
    )
  }
)

TextSection.displayName = "TextSection"

export { TextSection, textSectionVariants }