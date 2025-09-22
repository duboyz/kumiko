import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const kumikoHeadingVariants = cva(
  "font-kumiko text-kumiko-black leading-tight",
  {
    variants: {
      level: {
        h1: "text-6xl font-ultra-light tracking-ultra mb-5 lg:text-6xl",
        h2: "text-xl font-light tracking-tight mb-12 lg:text-xl",
        h3: "text-lg font-light tracking-wide mb-10 lg:text-lg",
        h4: "text-2xl font-light tracking-normal mb-10 lg:text-2xl",
        h5: "text-base font-normal tracking-tight mb-6 lg:text-md",
        h6: "text-sm font-normal tracking-tight mb-4 lg:text-base",
      },
      size: {
        logo: "text-4xl font-ultra-light tracking-wider mb-5 lg:text-5xl lg:tracking-widest",
        "logo-large": "text-5xl font-ultra-light tracking-widest mb-5 lg:text-6xl lg:tracking-ultra",
        subtitle: "text-xs font-normal tracking-wide uppercase mb-20 lg:text-xs",
        section: "text-lg font-light tracking-tight mb-12 lg:text-xl",
        step: "text-xl font-light tracking-tight mb-12 lg:text-xl",
        category: "text-2xl font-light tracking-normal mb-5 lg:text-2xl",
      },
      color: {
        primary: "text-kumiko-black",
        secondary: "text-kumiko-gray-700",
        muted: "text-kumiko-gray-500",
        subtle: "text-kumiko-gray-400",
      },
      weight: {
        "ultra-light": "font-ultra-light",
        light: "font-light",
        normal: "font-normal",
        medium: "font-medium",
      },
      spacing: {
        tighter: "tracking-tighter",
        tight: "tracking-tight",
        normal: "tracking-normal",
        wide: "tracking-wide",
        wider: "tracking-wider",
        widest: "tracking-widest",
        ultra: "tracking-ultra",
      },
    },
    defaultVariants: {
      level: "h1",
      color: "primary",
    },
  }
)

export interface KumikoHeadingProps
  extends Omit<React.HTMLAttributes<HTMLHeadingElement>, 'color'>,
    VariantProps<typeof kumikoHeadingVariants> {
  level?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6"
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6"
}

const KumikoHeading = React.forwardRef<HTMLHeadingElement, KumikoHeadingProps>(
  ({ className, level = "h1", as, size, color, weight, spacing, children, ...props }, ref) => {
    const Comp = as || level

    return (
      <Comp
        className={cn(kumikoHeadingVariants({
          level: size ? undefined : level,
          size,
          color,
          weight,
          spacing,
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
KumikoHeading.displayName = "KumikoHeading"

export { KumikoHeading, kumikoHeadingVariants }