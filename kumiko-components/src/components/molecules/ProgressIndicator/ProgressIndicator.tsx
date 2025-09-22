import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const progressIndicatorVariants = cva(
  "flex items-center justify-center",
  {
    variants: {
      orientation: {
        horizontal: "flex-row gap-2",
        vertical: "flex-col gap-3",
      },
      size: {
        sm: "",
        base: "",
        lg: "",
      },
    },
    defaultVariants: {
      orientation: "horizontal",
      size: "base",
    },
  }
)

const progressDotVariants = cva(
  "rounded-full transition-all duration-medium",
  {
    variants: {
      state: {
        pending: "bg-kumiko-gray-50",
        active: "bg-kumiko-gray-300",
        completed: "bg-kumiko-black",
      },
      size: {
        sm: "w-1.5 h-1.5",
        base: "w-2 h-2",
        lg: "w-3 h-3",
      },
    },
    defaultVariants: {
      state: "pending",
      size: "base",
    },
  }
)

export interface ProgressStep {
  id: string
  title?: string
  state: "pending" | "active" | "completed"
}

export interface ProgressIndicatorProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof progressIndicatorVariants> {
  steps: ProgressStep[]
  showLabels?: boolean
  currentStep?: string
}

const ProgressIndicator = React.forwardRef<HTMLDivElement, ProgressIndicatorProps>(
  ({ className, steps, showLabels = false, currentStep, orientation, size, ...props }, ref) => {
    // Auto-calculate states based on currentStep if provided
    const processedSteps = React.useMemo(() => {
      if (!currentStep) return steps

      const currentIndex = steps.findIndex(step => step.id === currentStep)
      if (currentIndex === -1) return steps

      return steps.map((step, index) => ({
        ...step,
        state: (index < currentIndex ? "completed" : index === currentIndex ? "active" : "pending") as "pending" | "active" | "completed"
      }))
    }, [steps, currentStep])

    return (
      <div
        className={cn(progressIndicatorVariants({ orientation, size, className }))}
        ref={ref}
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={steps.length}
        aria-valuenow={processedSteps.filter(step => step.state === "completed").length}
        aria-valuetext={`Step ${processedSteps.findIndex(step => step.state === "active") + 1} of ${steps.length}`}
        {...props}
      >
        {processedSteps.map((step, index) => (
          <div
            key={step.id}
            className={cn(
              "flex items-center",
              orientation === "horizontal" ? "flex-col gap-2" : "flex-row gap-3"
            )}
          >
            <div
              className={cn(progressDotVariants({ state: step.state, size }))}
              aria-label={step.title || `Step ${index + 1}`}
            />

            {showLabels && step.title && (
              <span
                className={cn(
                  "font-kumiko text-xs tracking-tight",
                  {
                    "text-kumiko-gray-300": step.state === "pending",
                    "text-kumiko-gray-500": step.state === "active",
                    "text-kumiko-black": step.state === "completed",
                  }
                )}
              >
                {step.title}
              </span>
            )}
          </div>
        ))}
      </div>
    )
  }
)
ProgressIndicator.displayName = "ProgressIndicator"

export { ProgressIndicator, progressIndicatorVariants, progressDotVariants }