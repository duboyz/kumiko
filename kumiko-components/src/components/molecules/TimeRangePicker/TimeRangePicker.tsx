import * as React from "react"
import { cn } from "@/lib/utils"
import { KumikoInput } from "../../atoms/KumikoInput"
import { KumikoText } from "../../atoms/KumikoText"

export interface TimeRangePickerProps extends React.HTMLAttributes<HTMLDivElement> {
  openTime?: string
  closeTime?: string
  isClosed?: boolean
  onTimeChange?: (openTime: string, closeTime: string) => void
  onClosedToggle?: (isClosed: boolean) => void
  dayLabel?: string
  disabled?: boolean
}

const TimeRangePicker = React.forwardRef<HTMLDivElement, TimeRangePickerProps>(
  ({
    className,
    openTime = "09:00",
    closeTime = "22:00",
    isClosed = false,
    onTimeChange,
    onClosedToggle,
    dayLabel,
    disabled = false,
    ...props
  }, ref) => {
    const handleOpenTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!disabled && !isClosed) {
        onTimeChange?.(e.target.value, closeTime)
      }
    }

    const handleCloseTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!disabled && !isClosed) {
        onTimeChange?.(openTime, e.target.value)
      }
    }

    const handleClosedToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!disabled) {
        onClosedToggle?.(e.target.checked)
      }
    }

    return (
      <div
        className={cn(
          "grid grid-cols-3 gap-5 items-center py-3 transition-all duration-normal",
          "border-b border-kumiko-gray-25 last:border-b-0",
          disabled && "opacity-50",
          className
        )}
        ref={ref}
        {...props}
      >
        {/* Day Label */}
        {dayLabel && (
          <KumikoText
            as="div"
            size="sm"
            color="secondary"
            weight="normal"
            spacing="tighter"
            className="font-kumiko"
          >
            {dayLabel}
          </KumikoText>
        )}

        {/* Time Inputs */}
        <div className="grid grid-cols-3 gap-4 items-center">
          <KumikoInput
            type="time"
            variant="minimal"
            size="sm"
            value={openTime}
            onChange={handleOpenTimeChange}
            disabled={disabled || isClosed}
            className={cn(
              "text-sm font-normal",
              (disabled || isClosed) && "opacity-50"
            )}
          />

          <KumikoText
            as="div"
            size="sm"
            color="subtle"
            className="text-center"
          >
            —
          </KumikoText>

          <KumikoInput
            type="time"
            variant="minimal"
            size="sm"
            value={closeTime}
            onChange={handleCloseTimeChange}
            disabled={disabled || isClosed}
            className={cn(
              "text-sm font-normal",
              (disabled || isClosed) && "opacity-50"
            )}
          />
        </div>

        {/* Closed Toggle */}
        <div className="flex justify-end">
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={isClosed}
              onChange={handleClosedToggle}
              disabled={disabled}
              className={cn(
                "appearance-none w-5 h-5 border border-kumiko-gray-100 bg-kumiko-white transition-all duration-normal",
                "focus:outline-none focus:ring-2 focus:ring-kumiko-gray-300 focus:ring-offset-1",
                "checked:bg-kumiko-gray-50 checked:border-kumiko-gray-200",
                "disabled:opacity-50 disabled:cursor-not-allowed",
                "relative"
              )}
              aria-label={`Mark ${dayLabel || 'day'} as closed`}
            />
            <span
              className={cn(
                "absolute inset-0 flex items-center justify-center text-kumiko-gray-500 text-xs font-medium transition-opacity duration-normal",
                isClosed ? "opacity-100" : "opacity-0"
              )}
            >
              ×
            </span>
            <span className="sr-only">
              {isClosed ? 'Open' : 'Closed'}
            </span>
          </label>
        </div>
      </div>
    )
  }
)
TimeRangePicker.displayName = "TimeRangePicker"

export { TimeRangePicker }