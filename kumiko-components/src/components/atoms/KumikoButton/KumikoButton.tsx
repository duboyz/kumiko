import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const kumikoButtonVariants = cva(
  "inline-flex items-center justify-center font-kumiko font-normal transition-all duration-normal outline-none disabled:opacity-30 disabled:cursor-not-allowed focus-visible:ring-2 focus-visible:ring-kumiko-gray-300 focus-visible:ring-offset-1",
  {
    variants: {
      variant: {
        primary: "bg-kumiko-black text-kumiko-white hover:bg-kumiko-gray-900 active:bg-kumiko-gray-800",
        secondary: "border border-kumiko-gray-100 text-kumiko-gray-700 hover:border-kumiko-gray-300 hover:text-kumiko-gray-900 hover:bg-kumiko-gray-25 active:bg-kumiko-gray-50",
        ghost: "text-kumiko-gray-500 hover:text-kumiko-gray-900 hover:bg-kumiko-gray-25 active:bg-kumiko-gray-50",
        minimal: "text-kumiko-gray-300 hover:text-kumiko-gray-500 active:text-kumiko-gray-700",
        destructive: "text-red-600 hover:text-red-700 hover:bg-red-50 active:bg-red-100",
      },
      size: {
        xs: "px-3 py-2 text-xs tracking-tight min-h-[32px]",
        sm: "px-4 py-3 text-sm tracking-tight min-h-[40px]",
        base: "px-6 py-4 text-base tracking-tighter min-h-[48px]",
        lg: "px-8 py-5 text-md tracking-tight min-h-[56px]",
        xl: "px-10 py-6 text-lg tracking-tight min-h-[64px]",
      },
      width: {
        auto: "w-auto",
        full: "w-full",
      },
      shape: {
        rectangle: "rounded-base",
        pill: "rounded-full",
        square: "aspect-square rounded-base",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "base",
      width: "auto",
      shape: "rectangle",
    },
  }
)

export interface KumikoButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof kumikoButtonVariants> {
  loading?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
}

const KumikoButton = React.forwardRef<HTMLButtonElement, KumikoButtonProps>(
  ({ className, variant, size, width, shape, loading, leftIcon, rightIcon, children, disabled, ...props }, ref) => {
    return (
      <button
        className={cn(kumikoButtonVariants({ variant, size, width, shape, className }))}
        disabled={disabled || loading}
        ref={ref}
        {...props}
      >
        {loading && (
          <svg
            className={cn(
              "animate-spin mr-2",
              size === "xs" || size === "sm" ? "h-3 w-3" : "h-4 w-4"
            )}
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="2"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        )}
        {!loading && leftIcon && (
          <span className={cn("mr-2", size === "xs" || size === "sm" ? "text-xs" : "text-sm")}>
            {leftIcon}
          </span>
        )}
        {children}
        {!loading && rightIcon && (
          <span className={cn("ml-2", size === "xs" || size === "sm" ? "text-xs" : "text-sm")}>
            {rightIcon}
          </span>
        )}
      </button>
    )
  }
)
KumikoButton.displayName = "KumikoButton"

// Icon Button variant
export interface KumikoIconButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    Pick<VariantProps<typeof kumikoButtonVariants>, "size" | "variant"> {
  icon: React.ReactNode
  "aria-label": string
  loading?: boolean
}

const KumikoIconButton = React.forwardRef<HTMLButtonElement, KumikoIconButtonProps>(
  ({ className, variant = "ghost", size = "base", icon, loading, disabled, ...props }, ref) => {
    return (
      <KumikoButton
        className={cn(className)}
        variant={variant}
        size={size}
        shape="square"
        disabled={disabled || loading}
        ref={ref}
        {...props}
      >
        {loading ? (
          <svg
            className={cn(size === "xs" || size === "sm" ? "h-3 w-3" : "h-4 w-4")}
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="2"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        ) : (
          icon
        )}
      </KumikoButton>
    )
  }
)
KumikoIconButton.displayName = "KumikoIconButton"

export { KumikoButton, KumikoIconButton, kumikoButtonVariants }