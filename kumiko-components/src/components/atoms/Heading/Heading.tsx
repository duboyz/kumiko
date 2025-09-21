import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const headingVariants = cva(
  "font-semibold text-foreground",
  {
    variants: {
      level: {
        h1: "text-4xl lg:text-5xl",
        h2: "text-3xl lg:text-4xl",
        h3: "text-2xl lg:text-3xl",
        h4: "text-xl lg:text-2xl",
        h5: "text-lg lg:text-xl",
        h6: "text-base lg:text-lg",
      },
      weight: {
        normal: "font-normal",
        medium: "font-medium",
        semibold: "font-semibold",
        bold: "font-bold",
      },
    },
    defaultVariants: {
      level: "h1",
      weight: "semibold",
    },
  }
)

export interface HeadingProps
  extends React.HTMLAttributes<HTMLHeadingElement>,
  VariantProps<typeof headingVariants> {
  level?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6"
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6"
}

const Heading = React.forwardRef<HTMLHeadingElement, HeadingProps>(
  ({ className, level = "h1", as, weight, children, ...props }, ref) => {
    const Comp = as || level

    return (
      <Comp
        className={cn(headingVariants({ level, weight, className }))}
        ref={ref}
        {...props}
      >
        {children}
      </Comp>
    )
  }
)
Heading.displayName = "Heading"

export { Heading, headingVariants }