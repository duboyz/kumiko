import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const kumikoAlertVariants = cva(
  "relative w-full rounded-base border px-6 py-5 font-kumiko",
  {
    variants: {
      variant: {
        default: "bg-kumiko-white border-kumiko-gray-200 text-kumiko-gray-900",
        destructive: "bg-red-50 border-red-200 text-red-900",
        warning: "bg-yellow-50 border-yellow-200 text-yellow-900",
        success: "bg-green-50 border-green-200 text-green-900",
        info: "bg-blue-50 border-blue-200 text-blue-900",
      },
      size: {
        sm: "px-4 py-3 text-sm",
        base: "px-6 py-5 text-base",
        lg: "px-8 py-6 text-lg",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "base",
    },
  }
)

export interface KumikoAlertProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof kumikoAlertVariants> {
  title?: string
  icon?: React.ReactNode
}

const KumikoAlert = React.forwardRef<HTMLDivElement, KumikoAlertProps>(
  ({ className, variant, size, title, icon, children, ...props }, ref) => {
    // Default icons for each variant
    const defaultIcons = {
      default: (
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      destructive: (
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
        </svg>
      ),
      warning: (
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
        </svg>
      ),
      success: (
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      info: (
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    }

    const displayIcon = icon !== undefined ? icon : defaultIcons[variant || 'default']

    return (
      <div
        ref={ref}
        role="alert"
        className={cn(kumikoAlertVariants({ variant, size, className }))}
        {...props}
      >
        <div className="flex gap-3">
          {displayIcon && (
            <div className="flex-shrink-0 mt-0.5">
              {displayIcon}
            </div>
          )}
          <div className="flex-1 space-y-1">
            {title && (
              <h5 className="font-medium leading-none tracking-tight">
                {title}
              </h5>
            )}
            {children && (
              <div className="text-sm opacity-90 [&_p]:leading-relaxed">
                {children}
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }
)

KumikoAlert.displayName = "KumikoAlert"

export { KumikoAlert, kumikoAlertVariants }