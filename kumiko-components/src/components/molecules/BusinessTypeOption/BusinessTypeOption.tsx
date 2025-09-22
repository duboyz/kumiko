import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { KumikoText } from "../../atoms/KumikoText"

const businessTypeOptionVariants = cva(
  "w-full text-center transition-all duration-normal cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-kumiko-gray-300 focus-visible:ring-offset-1",
  {
    variants: {
      variant: {
        default: "border border-kumiko-gray-100 bg-kumiko-white text-kumiko-gray-700 hover:border-kumiko-gray-300 hover:text-kumiko-gray-900 hover:bg-kumiko-gray-25",
        selected: "border border-kumiko-black bg-kumiko-white text-kumiko-black",
        minimal: "border border-transparent bg-transparent text-kumiko-gray-700 hover:bg-kumiko-gray-25 hover:text-kumiko-gray-900",
      },
      size: {
        sm: "p-4 rounded-base",
        base: "p-6 rounded-base",
        lg: "p-8 rounded-base",
      },
      disabled: {
        true: "opacity-50 cursor-not-allowed hover:border-kumiko-gray-100 hover:text-kumiko-gray-700 hover:bg-kumiko-white",
        false: "",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "base",
      disabled: false,
    },
  }
)

export interface BusinessTypeOptionProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'disabled' | 'onSelect'>,
    VariantProps<typeof businessTypeOptionVariants> {
  title: string
  description?: string
  icon?: React.ReactNode
  selected?: boolean
  onSelect?: (value: string) => void
  value?: string
  disabled?: boolean
}

const BusinessTypeOption = React.forwardRef<HTMLButtonElement, BusinessTypeOptionProps>(
  ({
    className,
    title,
    description,
    icon,
    selected = false,
    onSelect,
    value,
    variant,
    size,
    disabled,
    onClick,
    ...props
  }, ref) => {
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      if (disabled) return

      if (onSelect && value) {
        onSelect(value)
      }

      onClick?.(event)
    }

    const effectiveVariant = selected ? "selected" : variant

    return (
      <button
        className={cn(businessTypeOptionVariants({
          variant: effectiveVariant,
          size,
          disabled,
          className
        }))}
        onClick={handleClick}
        disabled={disabled}
        aria-pressed={selected}
        ref={ref}
        {...props}
      >
        <div className="flex flex-col items-center space-y-3">
          {icon && (
            <div className={cn(
              "flex items-center justify-center transition-colors duration-normal",
              selected ? "text-kumiko-black" : "text-kumiko-gray-400",
              size === "sm" ? "text-lg" : size === "lg" ? "text-3xl" : "text-2xl"
            )}>
              {icon}
            </div>
          )}

          <div className="space-y-1">
            <KumikoText
              as="div"
              size={size === "lg" ? "lg" : "md"}
              weight="normal"
              spacing="tighter"
              className={cn(
                "transition-colors duration-normal",
                selected
                  ? "text-kumiko-black"
                  : disabled
                    ? "text-kumiko-gray-400"
                    : "text-kumiko-gray-700"
              )}
            >
              {title}
            </KumikoText>

            {description && (
              <KumikoText
                as="div"
                variant="hint"
                className={cn(
                  "transition-colors duration-normal",
                  selected
                    ? "text-kumiko-gray-600"
                    : disabled
                      ? "text-kumiko-gray-300"
                      : "text-kumiko-gray-500"
                )}
              >
                {description}
              </KumikoText>
            )}
          </div>
        </div>
      </button>
    )
  }
)
BusinessTypeOption.displayName = "BusinessTypeOption"

export { BusinessTypeOption, businessTypeOptionVariants }