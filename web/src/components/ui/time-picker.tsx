'use client'

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useEffect, useState } from 'react'

interface TimePickerProps {
  value: string // HH:mm format
  onChange: (value: string) => void
  min?: string // HH:mm format
  max?: string // HH:mm format
  className?: string
  disabled?: boolean
}

export function TimePicker({ value, onChange, min, max, className, disabled }: TimePickerProps) {
  const [hours, setHours] = useState<string>('12')
  const [minutes, setMinutes] = useState<string>('00')

  // Debug: log constraints
  useEffect(() => {
    console.log('[TimePicker] Received constraints:', { min, max, value })
  }, [min, max, value])

  // Parse initial value - update when value changes
  useEffect(() => {
    if (value) {
      const [h, m] = value.split(':')
      setHours(h || '12')
      setMinutes(m || '00')
    }
  }, [value])

  // Generate hour options (00-23)
  const hourOptions = Array.from({ length: 24 }, (_, i) => {
    const hour = String(i).padStart(2, '0')
    return { value: hour, label: hour }
  })

  // Generate minute options (00, 15, 30, 45)
  const minuteOptions = [
    { value: '00', label: '00' },
    { value: '15', label: '15' },
    { value: '30', label: '30' },
    { value: '45', label: '45' },
  ]

  // Filter hours based on min/max constraints
  const getAvailableHours = () => {
    if (!min && !max) return hourOptions

    let availableHours = hourOptions

    if (min) {
      const [minHour] = min.split(':').map(Number)
      availableHours = availableHours.filter(opt => {
        const optHour = Number(opt.value)
        return optHour >= minHour
      })
    }

    if (max) {
      const [maxHour] = max.split(':').map(Number)
      availableHours = availableHours.filter(opt => {
        const optHour = Number(opt.value)
        return optHour <= maxHour
      })
    }

    return availableHours
  }

  // Filter minutes based on min/max constraints for selected hour
  const getAvailableMinutes = () => {
    if (!min && !max) return minuteOptions

    const currentHour = Number(hours)
    let availableMinutes = minuteOptions

    if (min) {
      const [minHour, minMinute] = min.split(':').map(Number)
      if (currentHour === minHour) {
        // If selected hour equals min hour, only show minutes >= min minute
        availableMinutes = availableMinutes.filter(opt => Number(opt.value) >= minMinute)
      } else if (currentHour < minHour) {
        // If selected hour is before min hour, no minutes available
        return []
      }
    }

    if (max) {
      const [maxHour, maxMinute] = max.split(':').map(Number)
      if (currentHour === maxHour) {
        // If selected hour equals max hour, only show minutes <= max minute
        availableMinutes = availableMinutes.filter(opt => Number(opt.value) <= maxMinute)
      } else if (currentHour > maxHour) {
        // If selected hour is after max hour, no minutes available
        return []
      }
    }

    return availableMinutes
  }

  const handleHourChange = (newHour: string) => {
    setHours(newHour)
    const newTime = `${newHour}:${minutes}`

    // Validate against constraints
    if (min && newTime < min) {
      // If new time is before min, set to min
      const [minHour, minMinute] = min.split(':')
      setHours(minHour)
      setMinutes(minMinute)
      onChange(min)
    } else if (max && newTime > max) {
      // If new time is after max, set to max
      const [maxHour, maxMinute] = max.split(':')
      setHours(maxHour)
      setMinutes(maxMinute)
      onChange(max)
    } else {
      onChange(newTime)
    }
  }

  const handleMinuteChange = (newMinute: string) => {
    setMinutes(newMinute)
    const newTime = `${hours}:${newMinute}`

    // Validate against constraints
    if (min && newTime < min) {
      // If new time is before min, set to min
      const [minHour, minMinute] = min.split(':')
      setHours(minHour)
      setMinutes(minMinute)
      onChange(min)
    } else if (max && newTime > max) {
      // If new time is after max, set to max
      const [maxHour, maxMinute] = max.split(':')
      setHours(maxHour)
      setMinutes(maxMinute)
      onChange(max)
    } else {
      onChange(newTime)
    }
  }

  const availableHours = getAvailableHours()
  const availableMinutes = getAvailableMinutes()

  // Adjust time if it's outside constraints (but only if we have constraints)
  useEffect(() => {
    if ((min || max) && value) {
      const currentTime = `${hours}:${minutes}`
      const isTimeValid = (!min || currentTime >= min) && (!max || currentTime <= max)

      if (!isTimeValid) {
        // Time is outside bounds, adjust it
        if (min && currentTime < min) {
          // Time is before min, set to min
          const [minHour, minMinute] = min.split(':')
          setHours(minHour)
          setMinutes(minMinute)
          onChange(min)
        } else if (max && currentTime > max) {
          // Time is after max, set to max
          const [maxHour, maxMinute] = max.split(':')
          setHours(maxHour)
          setMinutes(maxMinute)
          onChange(max)
        }
      } else {
        // Time is valid, but check if hour/minute is in available lists
        // If hour is not available, adjust to first available
        if (availableHours.length > 0 && !availableHours.find(h => h.value === hours)) {
          const firstHour = availableHours[0].value
          const newTime = `${firstHour}:${minutes}`
          setHours(firstHour)
          onChange(newTime)
        }
        // If minute is not available, adjust to first available
        else if (availableMinutes.length > 0 && !availableMinutes.find(m => m.value === minutes)) {
          const firstMinute = availableMinutes[0].value
          const newTime = `${hours}:${firstMinute}`
          setMinutes(firstMinute)
          onChange(newTime)
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [min, max, value]) // Only when constraints or value change

  return (
    <div className={`flex items-center gap-2 ${className || ''}`}>
      <Select
        value={hours}
        onValueChange={handleHourChange}
        disabled={disabled || (min || max ? availableHours.length === 0 : false)}
      >
        <SelectTrigger className="w-20">
          <SelectValue placeholder="HH" />
        </SelectTrigger>
        <SelectContent>
          {availableHours.map(hour => (
            <SelectItem key={hour.value} value={hour.value}>
              {hour.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <span className="text-muted-foreground">:</span>
      <Select
        value={minutes}
        onValueChange={handleMinuteChange}
        disabled={disabled || (min || max ? availableMinutes.length === 0 : false)}
      >
        <SelectTrigger className="w-20">
          <SelectValue placeholder="mm" />
        </SelectTrigger>
        <SelectContent>
          {availableMinutes.map(minute => (
            <SelectItem key={minute.value} value={minute.value}>
              {minute.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
