import * as React from "react"
import { cn } from "@/lib/utils"
import { KumikoLabel } from "../../atoms/KumikoLabel"
import { KumikoText } from "../../atoms/KumikoText"

export interface InputGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  label?: string
  hint?: string
  error?: string
  required?: boolean
  children?: React.ReactElement
  spacing?: "compact" | "normal" | "relaxed"
}

const InputGroup = React.forwardRef<HTMLDivElement, InputGroupProps>(
  ({ className, label, hint, error, required, children, spacing = "normal", ...props }, ref) => {
    const spacingClasses = {
      compact: "space-y-2",
      normal: "space-y-3",
      relaxed: "space-y-4",
    }

    // Generate a unique ID for the input if not provided
    const inputId = React.useMemo(() => {
      if (children?.props?.id) {
        return children.props.id
      }
      return `input-${Math.random().toString(36).substr(2, 9)}`
    }, [children?.props?.id])

    // Clone the input element with proper props
    const inputElement = children ? React.cloneElement(children, {
      id: inputId,
      'aria-describedby': [
        hint ? `${inputId}-hint` : '',
        error ? `${inputId}-error` : ''
      ].filter(Boolean).join(' ') || undefined,
      'aria-invalid': error ? 'true' : undefined,
      error: !!error,
      ...children.props,
    }) : null

    return (
      <div
        className={cn(spacingClasses[spacing], className)}
        ref={ref}
        {...props}
      >
        {label && (
          <KumikoLabel
            variant="field"
            required={required}
            htmlFor={inputId}
          >
            {label}
          </KumikoLabel>
        )}

        {inputElement}

        {hint && !error && (
          <KumikoText
            variant="hint"
            id={`${inputId}-hint`}
            as="div"
          >
            {hint}
          </KumikoText>
        )}

        {error && (
          <KumikoText
            variant="error"
            id={`${inputId}-error`}
            as="div"
            role="alert"
          >
            {error}
          </KumikoText>
        )}
      </div>
    )
  }
)
InputGroup.displayName = "InputGroup"

export { InputGroup }