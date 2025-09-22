import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const kumikoInputVariants = cva(
  "w-full bg-transparent font-kumiko font-normal text-kumiko-black transition-all duration-normal outline-none disabled:opacity-50 disabled:cursor-not-allowed",
  {
    variants: {
      variant: {
        underline: "border-0 border-b border-kumiko-gray-50 focus:border-kumiko-gray-300 focus:scale-105 hover:border-kumiko-gray-100",
        minimal: "border-0 focus:scale-102",
        outlined: "border border-kumiko-gray-100 rounded-base px-4 focus:border-kumiko-gray-300 hover:border-kumiko-gray-200",
      },
      size: {
        sm: "text-sm py-2 tracking-tighter",
        base: "text-md py-4 tracking-tighter",
        lg: "text-lg py-6 tracking-tight",
      },
      state: {
        default: "",
        error: "border-red-300 focus:border-red-500 text-red-900",
        success: "border-green-300 focus:border-green-500",
      },
    },
    defaultVariants: {
      variant: "underline",
      size: "base",
      state: "default",
    },
  }
)

export interface KumikoInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'>,
    VariantProps<typeof kumikoInputVariants> {
  error?: boolean
  success?: boolean
}

const KumikoInput = React.forwardRef<HTMLInputElement, KumikoInputProps>(
  ({ className, variant, size, state, error, success, ...props }, ref) => {
    const effectiveState = error ? "error" : success ? "success" : state

    return (
      <input
        className={cn(
          kumikoInputVariants({ variant, size, state: effectiveState, className }),
          "placeholder:text-kumiko-gray-200 placeholder:font-normal",
          "focus:placeholder:text-kumiko-gray-300"
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
KumikoInput.displayName = "KumikoInput"

// Textarea variant
const kumikoTextareaVariants = cva(
  "w-full bg-transparent font-kumiko font-normal text-kumiko-black transition-all duration-normal outline-none resize-none disabled:opacity-50 disabled:cursor-not-allowed",
  {
    variants: {
      variant: {
        underline: "border-0 border-b border-kumiko-gray-50 focus:border-kumiko-gray-300 focus:scale-105 hover:border-kumiko-gray-100",
        minimal: "border-0 focus:scale-102",
        outlined: "border border-kumiko-gray-100 rounded-base px-4 focus:border-kumiko-gray-300 hover:border-kumiko-gray-200",
      },
      size: {
        sm: "text-sm py-2 tracking-tighter min-h-[40px]",
        base: "text-base py-4 tracking-tighter min-h-[56px]",
        lg: "text-lg py-6 tracking-tight min-h-[72px]",
      },
      state: {
        default: "",
        error: "border-red-300 focus:border-red-500 text-red-900",
        success: "border-green-300 focus:border-green-500",
      },
    },
    defaultVariants: {
      variant: "underline",
      size: "base",
      state: "default",
    },
  }
)

export interface KumikoTextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement>,
    VariantProps<typeof kumikoTextareaVariants> {
  error?: boolean
  success?: boolean
  autoResize?: boolean
}

const KumikoTextarea = React.forwardRef<HTMLTextAreaElement, KumikoTextareaProps>(
  ({ className, variant, size, state, error, success, autoResize = false, onChange, ...props }, ref) => {
    const effectiveState = error ? "error" : success ? "success" : state
    const textareaRef = React.useRef<HTMLTextAreaElement>(null)

    React.useImperativeHandle(ref, () => textareaRef.current!)

    const handleChange = React.useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
      if (autoResize && textareaRef.current) {
        textareaRef.current.style.height = 'auto'
        textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px'
      }
      onChange?.(e)
    }, [autoResize, onChange])

    React.useEffect(() => {
      if (autoResize && textareaRef.current) {
        textareaRef.current.style.height = 'auto'
        textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px'
      }
    }, [autoResize, props.value])

    return (
      <textarea
        ref={textareaRef}
        className={cn(
          kumikoTextareaVariants({ variant, size, state: effectiveState, className }),
          "placeholder:text-kumiko-gray-200 placeholder:font-normal",
          "focus:placeholder:text-kumiko-gray-300"
        )}
        onChange={handleChange}
        {...props}
      />
    )
  }
)
KumikoTextarea.displayName = "KumikoTextarea"

export { KumikoInput, KumikoTextarea, kumikoInputVariants, kumikoTextareaVariants }