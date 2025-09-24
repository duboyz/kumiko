import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const kumikoSpinnerVariants = cva(
  "animate-spin",
  {
    variants: {
      size: {
        xs: "h-3 w-3",
        sm: "h-4 w-4",
        base: "h-6 w-6",
        lg: "h-8 w-8",
        xl: "h-10 w-10",
      },
      color: {
        primary: "text-kumiko-black",
        secondary: "text-kumiko-gray-700",
        muted: "text-kumiko-gray-500",
        subtle: "text-kumiko-gray-400",
      },
    },
    defaultVariants: {
      size: "base",
      color: "primary",
    },
  }
)

export interface KumikoSpinnerProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof kumikoSpinnerVariants> {}

const KumikoSpinner = React.forwardRef<HTMLDivElement, KumikoSpinnerProps>(
  ({ className, size, color, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(kumikoSpinnerVariants({ size, color, className }))}
        {...props}
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="h-full w-full"
        >
          <circle
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeDasharray="32"
            strokeDashoffset="32"
            className="opacity-25"
          />
          <circle
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeDasharray="32"
            strokeDashoffset="24"
            className="opacity-75"
          />
        </svg>
      </div>
    )
  }
)

KumikoSpinner.displayName = "KumikoSpinner"

export { KumikoSpinner, kumikoSpinnerVariants }