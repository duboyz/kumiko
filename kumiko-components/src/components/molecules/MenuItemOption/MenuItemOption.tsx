import * as React from "react"
import { cn } from "@/lib/utils"
import { KumikoInput } from "../../atoms/KumikoInput"
import { KumikoIconButton } from "../../atoms/KumikoButton"

export interface MenuItemOptionData {
  id: string
  name: string
  price: string
}

export interface MenuItemOptionProps extends React.HTMLAttributes<HTMLDivElement> {
  option?: MenuItemOptionData
  onOptionChange?: (option: MenuItemOptionData) => void
  onRemove?: () => void
  showRemoveButton?: boolean
  placeholder?: {
    name?: string
    price?: string
  }
  autoFocus?: boolean
}

const MenuItemOption = React.forwardRef<HTMLDivElement, MenuItemOptionProps>(
  ({
    className,
    option,
    onOptionChange,
    onRemove,
    showRemoveButton = true,
    placeholder = {},
    autoFocus = false,
    ...props
  }, ref) => {
    const nameInputRef = React.useRef<HTMLInputElement>(null)

    const {
      name: namePlaceholder = "Option name (e.g., 6 pieces, 12 pieces)",
      price: pricePlaceholder = "190 kr",
    } = placeholder

    // Auto-focus the name input when component mounts if specified
    React.useEffect(() => {
      if (autoFocus && nameInputRef.current) {
        nameInputRef.current.focus()
      }
    }, [autoFocus])

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (onOptionChange && option) {
        onOptionChange({
          ...option,
          name: e.target.value,
        })
      }
    }

    const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (onOptionChange && option) {
        onOptionChange({
          ...option,
          price: e.target.value,
        })
      }
    }

    const handleRemove = () => {
      onRemove?.()
    }

    return (
      <div
        className={cn(
          "grid grid-cols-3 gap-4 items-center py-3 transition-all duration-normal group",
          "border-b border-kumiko-gray-25 last:border-b-0",
          "hover:bg-kumiko-gray-25/30 hover:px-2 hover:-mx-2",
          className
        )}
        ref={ref}
        {...props}
      >
        {/* Option Name */}
        <KumikoInput
          ref={nameInputRef}
          variant="minimal"
          size="sm"
          placeholder={namePlaceholder}
          value={option?.name || ""}
          onChange={handleNameChange}
          className="text-kumiko-gray-600 font-normal text-sm"
        />

        {/* Option Price */}
        <KumikoInput
          variant="minimal"
          size="sm"
          placeholder={pricePlaceholder}
          value={option?.price || ""}
          onChange={handlePriceChange}
          className="text-right text-kumiko-gray-600 font-medium text-sm"
        />

        {/* Remove Button */}
        {showRemoveButton && (
          <div className="flex justify-end">
            <KumikoIconButton
              variant="minimal"
              size="sm"
              icon={
                <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
                  <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8 2.146 2.854Z"/>
                </svg>
              }
              aria-label="Delete option"
              onClick={handleRemove}
              className={cn(
                "opacity-0 group-hover:opacity-100 transition-opacity duration-normal",
                "text-kumiko-gray-300 hover:text-kumiko-gray-500"
              )}
            />
          </div>
        )}
      </div>
    )
  }
)
MenuItemOption.displayName = "MenuItemOption"

export { MenuItemOption }