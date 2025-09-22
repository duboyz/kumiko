import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { KumikoHeading } from "../../atoms/KumikoHeading"
import { KumikoText } from "../../atoms/KumikoText"

const emptyStateVariants = cva(
  "text-center transition-all duration-normal",
  {
    variants: {
      size: {
        sm: "py-8 px-4",
        base: "py-12 px-6",
        lg: "py-16 px-8",
      },
      variant: {
        default: "",
        subtle: "opacity-75",
        minimal: "opacity-60",
      },
    },
    defaultVariants: {
      size: "base",
      variant: "default",
    },
  }
)

const emptyStateIconVariants = cva(
  "flex items-center justify-center transition-all duration-normal",
  {
    variants: {
      size: {
        sm: "text-2xl mb-3",
        base: "text-4xl mb-5",
        lg: "text-6xl mb-6",
      },
      color: {
        default: "text-kumiko-gray-300",
        subtle: "text-kumiko-gray-200",
        muted: "text-kumiko-gray-400",
      },
    },
    defaultVariants: {
      size: "base",
      color: "default",
    },
  }
)

export interface EmptyStateProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof emptyStateVariants> {
  icon?: React.ReactNode
  title: string
  subtitle?: string
  action?: React.ReactNode
  iconColor?: "default" | "subtle" | "muted"
}

const EmptyState = React.forwardRef<HTMLDivElement, EmptyStateProps>(
  ({
    className,
    icon,
    title,
    subtitle,
    action,
    size,
    variant,
    iconColor = "default",
    ...props
  }, ref) => {
    return (
      <div
        className={cn(emptyStateVariants({ size, variant, className }))}
        ref={ref}
        {...props}
      >
        {icon && (
          <div
            className={cn(emptyStateIconVariants({ size, color: iconColor }))}
            aria-hidden="true"
          >
            {icon}
          </div>
        )}

        <KumikoHeading
          level={size === "lg" ? "h2" : size === "sm" ? "h4" : "h3"}
          size={size === "lg" ? "section" : size === "sm" ? "category" : "step"}
          color="muted"
          className="mb-3"
        >
          {title}
        </KumikoHeading>

        {subtitle && (
          <KumikoText
            variant="description"
            size={size === "lg" ? "base" : "sm"}
            className="mb-6"
          >
            {subtitle}
          </KumikoText>
        )}

        {action && (
          <div className="flex justify-center">
            {action}
          </div>
        )}
      </div>
    )
  }
)
EmptyState.displayName = "EmptyState"

export { EmptyState, emptyStateVariants }