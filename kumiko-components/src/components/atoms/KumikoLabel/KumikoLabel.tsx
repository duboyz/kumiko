import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const kumikoLabelVariants = cva(
  "font-kumiko font-normal inline-block",
  {
    variants: {
      size: {
        xs: "text-xs tracking-tight",
        sm: "text-sm tracking-tight",
        base: "text-sm tracking-wide",
      },
      color: {
        primary: "text-kumiko-black",
        secondary: "text-kumiko-gray-700",
        muted: "text-kumiko-gray-500",
        subtle: "text-kumiko-gray-400",
      },
      variant: {
        default: "",
        field: "text-xs text-kumiko-gray-400 tracking-wide uppercase mb-3",
        inline: "text-sm text-kumiko-gray-700 tracking-tight",
        required: "text-xs text-kumiko-gray-400 tracking-wide uppercase mb-3 after:content-['*'] after:ml-1 after:text-red-500",
      },
      uppercase: {
        true: "uppercase",
        false: "",
      },
      spacing: {
        tight: "tracking-tight",
        normal: "tracking-normal",
        wide: "tracking-wide",
        wider: "tracking-wider",
      },
    },
    defaultVariants: {
      size: "base",
      color: "secondary",
      variant: "default",
      uppercase: false,
      spacing: "tight",
    },
  }
)

export interface KumikoLabelProps
  extends Omit<React.LabelHTMLAttributes<HTMLLabelElement>, 'color'>,
    VariantProps<typeof kumikoLabelVariants> {
  required?: boolean
}

const KumikoLabel = React.forwardRef<HTMLLabelElement, KumikoLabelProps>(
  ({ className, size, color, variant, uppercase, spacing, required, children, ...props }, ref) => {
    const effectiveVariant = required ? "required" : variant

    return (
      <label
        className={cn(kumikoLabelVariants({
          size,
          color,
          variant: effectiveVariant,
          uppercase,
          spacing,
          className
        }))}
        ref={ref}
        {...props}
      >
        {children}
      </label>
    )
  }
)
KumikoLabel.displayName = "KumikoLabel"

export { KumikoLabel, kumikoLabelVariants }