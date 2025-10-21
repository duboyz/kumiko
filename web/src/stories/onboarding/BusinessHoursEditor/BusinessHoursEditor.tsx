'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { useIsMobile } from '@/hooks/use-mobile'

export interface DayHours {
  open: string
  close: string
}

export interface BusinessHours {
  monday: DayHours | null
  tuesday: DayHours | null
  wednesday: DayHours | null
  thursday: DayHours | null
  friday: DayHours | null
  saturday: DayHours | null
  sunday: DayHours | null
}

interface BusinessHoursEditorProps {
  weekdayText?: string[] // Google Places format
  initialHours?: BusinessHours // Direct business hours object
  onChange: (businessHours: BusinessHours) => void
}

const DAYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'] as const
const DAY_LABELS = {
  monday: 'Monday',
  tuesday: 'Tuesday',
  wednesday: 'Wednesday',
  thursday: 'Thursday',
  friday: 'Friday',
  saturday: 'Saturday',
  sunday: 'Sunday',
}

// Parse Google's weekday text format
function parseWeekdayText(weekdayText: string[]): BusinessHours {
  const hours: BusinessHours = {
    monday: null,
    tuesday: null,
    wednesday: null,
    thursday: null,
    friday: null,
    saturday: null,
    sunday: null,
  }

  weekdayText.forEach(dayText => {
    const match = dayText.match(/^(\w+):\s*(.+)$/i)
    if (!match) return

    const dayName = match[1].toLowerCase() as keyof BusinessHours
    const hoursText = match[2]

    if (hoursText.match(/closed/i)) {
      hours[dayName] = null
      return
    }

    // Try to parse times (handles AM/PM and 24-hour format)
    const timeMatch = hoursText.match(/(\d{1,2}):(\d{2})\s*(AM|PM)?\s*[–-]\s*(\d{1,2}):(\d{2})\s*(AM|PM)?/i)
    if (timeMatch) {
      const openHour = parseInt(timeMatch[1])
      const openMinute = timeMatch[2]
      const openPeriod = timeMatch[3]
      const closeHour = parseInt(timeMatch[4])
      const closeMinute = timeMatch[5]
      const closePeriod = timeMatch[6]

      const convertTo24Hour = (hour: number, minute: string, period?: string) => {
        if (!period) return `${hour.toString().padStart(2, '0')}:${minute}`
        let h = hour
        if (period.toUpperCase() === 'PM' && h !== 12) h += 12
        if (period.toUpperCase() === 'AM' && h === 12) h = 0
        return `${h.toString().padStart(2, '0')}:${minute}`
      }

      hours[dayName] = {
        open: convertTo24Hour(openHour, openMinute, openPeriod),
        close: convertTo24Hour(closeHour, closeMinute, closePeriod),
      }
    }
  })

  return hours
}

export function BusinessHoursEditor({ weekdayText, initialHours, onChange }: BusinessHoursEditorProps) {
  const isMobile = useIsMobile()
  const [hours, setHours] = useState<BusinessHours>(() => {
    // Priority: initialHours > weekdayText > defaults
    if (initialHours) {
      return initialHours
    }
    if (weekdayText && weekdayText.length > 0) {
      return parseWeekdayText(weekdayText)
    }
    // Default hours: 9:00 - 17:00 Monday-Friday, closed weekends
    return {
      monday: { open: '09:00', close: '17:00' },
      tuesday: { open: '09:00', close: '17:00' },
      wednesday: { open: '09:00', close: '17:00' },
      thursday: { open: '09:00', close: '17:00' },
      friday: { open: '09:00', close: '17:00' },
      saturday: null,
      sunday: null,
    }
  })

  useEffect(() => {
    onChange(hours)
  }, [hours, onChange])

  const handleToggleDay = (day: keyof BusinessHours) => {
    setHours(prev => ({
      ...prev,
      [day]: prev[day] ? null : { open: '09:00', close: '17:00' },
    }))
  }

  const handleTimeChange = (day: keyof BusinessHours, type: 'open' | 'close', value: string) => {
    setHours(prev => ({
      ...prev,
      [day]: prev[day] ? { ...prev[day]!, [type]: value } : null,
    }))
  }

  const handleCopyToAll = (day: keyof BusinessHours) => {
    const dayHours = hours[day]
    if (!dayHours) return

    const newHours: BusinessHours = { ...hours }
    DAYS.forEach(d => {
      newHours[d] = { ...dayHours }
    })
    setHours(newHours)
  }

  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="text-lg sm:text-xl">Business Hours</CardTitle>
        <CardDescription className="text-sm sm:text-base">
          Set your opening hours for each day of the week
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-3 sm:space-y-4">
          {DAYS.map(day => {
            const isOpen = hours[day] !== null
            return (
              <div
                key={day}
                className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 p-3 sm:p-4 border rounded-lg"
              >
                <div className="flex items-center space-x-3 sm:w-32">
                  <Switch id={`${day}-toggle`} checked={isOpen} onCheckedChange={() => handleToggleDay(day)} />
                  <Label htmlFor={`${day}-toggle`} className="font-medium cursor-pointer text-sm sm:text-base">
                    {DAY_LABELS[day]}
                  </Label>
                </div>

                {isOpen && hours[day] ? (
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-2 flex-1">
                    {/* Time inputs - mobile-friendly layout */}
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                      <div className="flex items-center gap-2">
                        <Label
                          htmlFor={`${day}-open`}
                          className="text-xs sm:text-sm text-muted-foreground w-12 sm:w-12"
                        >
                          Open
                        </Label>
                        <Input
                          id={`${day}-open`}
                          type="time"
                          value={hours[day]!.open}
                          onChange={e => handleTimeChange(day, 'open', e.target.value)}
                          className="w-32 sm:w-32 text-sm h-10"
                        />
                      </div>
                      <span className="text-muted-foreground hidden sm:inline">-</span>
                      <div className="flex items-center gap-2">
                        <Label
                          htmlFor={`${day}-close`}
                          className="text-xs sm:text-sm text-muted-foreground w-12 sm:w-12"
                        >
                          Close
                        </Label>
                        <Input
                          id={`${day}-close`}
                          type="time"
                          value={hours[day]!.close}
                          onChange={e => handleTimeChange(day, 'close', e.target.value)}
                          className="w-32 sm:w-32 text-sm h-10"
                        />
                      </div>
                    </div>

                    {/* Copy button - full width on mobile, inline on desktop */}
                    <button
                      onClick={() => handleCopyToAll(day)}
                      className="text-xs text-primary hover:underline whitespace-nowrap self-start sm:self-auto"
                    >
                      Copy to all
                    </button>
                  </div>
                ) : (
                  <span className="text-muted-foreground italic text-sm sm:text-base">Closed</span>
                )}
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
