import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const kumikoTextVariants = cva(
  "font-kumiko leading-relaxed",
  {
    variants: {
      size: {
        xs: "text-xs tracking-tighter",
        sm: "text-sm tracking-tighter",
        base: "text-base tracking-tighter",
        md: "text-md tracking-tighter",
        lg: "text-lg tracking-tight",
        xl: "text-xl tracking-tight",
      },
      color: {
        primary: "text-kumiko-black",
        secondary: "text-kumiko-gray-700",
        muted: "text-kumiko-gray-500",
        subtle: "text-kumiko-gray-400",
        placeholder: "text-kumiko-gray-300",
        disabled: "text-kumiko-gray-200",
      },
      weight: {
        light: "font-light",
        normal: "font-normal",
        medium: "font-medium",
      },
      spacing: {
        tighter: "tracking-tighter",
        tight: "tracking-tight",
        normal: "tracking-normal",
        wide: "tracking-wide",
      },
      variant: {
        default: "",
        description: "text-kumiko-gray-500 font-normal",
        meta: "text-kumiko-gray-400 font-normal text-sm tracking-tight",
        placeholder: "text-kumiko-gray-300 font-normal",
        hint: "text-kumiko-gray-400 font-light text-sm tracking-tighter",
        error: "text-red-500 font-normal text-sm tracking-tighter",
      },
    },
    defaultVariants: {
      size: "base",
      color: "primary",
      weight: "normal",
      spacing: "tighter",
      variant: "default",
    },
  }
)

export interface KumikoTextProps
  extends Omit<React.HTMLAttributes<HTMLElement>, 'color'>,
  VariantProps<typeof kumikoTextVariants> {
  as?: "p" | "span" | "div" | "label" | "small" | "strong" | "em"
}

const KumikoText = React.forwardRef<HTMLElement, KumikoTextProps>(
  ({ className, as = "p", size, color, weight, spacing, variant, children, ...props }, ref) => {
    const Comp = as as any

    return (
      <Comp
        className={cn(kumikoTextVariants({
          size,
          color,
          weight,
          spacing,
          variant,
          className
        }))}
        ref={ref}
        {...props}
      >
        {children}
      </Comp>
    )
  }
)
KumikoText.displayName = "KumikoText"

export { KumikoText, kumikoTextVariants }