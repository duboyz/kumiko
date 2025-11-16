/**
 * Business hours utility functions
 * Parses business hours JSON and provides date/time validation
 */

export interface BusinessHours {
  [day: string]: {
    open: string // HH:mm format
    close: string // HH:mm format
  } | null // null means closed
}

/**
 * Parse business hours JSON string into structured format
 */
export function parseBusinessHours(businessHoursJson: string | null | undefined): BusinessHours | null {
  if (!businessHoursJson) return null

  try {
    return JSON.parse(businessHoursJson) as BusinessHours
  } catch {
    return null
  }
}

/**
 * Get day name from date (monday, tuesday, etc.)
 */
function getDayName(date: Date): string {
  const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
  return days[date.getDay()]
}

/**
 * Check if a date is available (restaurant is open on that day)
 */
export function isDateAvailable(date: Date, businessHours: BusinessHours | null): boolean {
  if (!businessHours) return true // If no business hours, allow all dates

  const dayName = getDayName(date)
  const dayHours = businessHours[dayName]

  return dayHours !== null && dayHours !== undefined
}

/**
 * Get available dates (next N days where restaurant is open)
 */
export function getAvailableDates(businessHours: BusinessHours | null, daysAhead: number = 30): Date[] {
  const availableDates: Date[] = []
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  for (let i = 0; i < daysAhead; i++) {
    const date = new Date(today)
    date.setDate(today.getDate() + i)

    if (isDateAvailable(date, businessHours)) {
      availableDates.push(date)
    }
  }

  return availableDates
}

/**
 * Get minimum date string (today or next available date)
 */
export function getMinDate(businessHours: BusinessHours | null): string {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  // Format today in local timezone (YYYY-MM-DD)
  const year = today.getFullYear()
  const month = String(today.getMonth() + 1).padStart(2, '0')
  const day = String(today.getDate()).padStart(2, '0')
  const todayStr = `${year}-${month}-${day}`

  // Check if today is available
  if (isDateAvailable(today, businessHours)) {
    return todayStr
  }

  // Find next available date
  const availableDates = getAvailableDates(businessHours, 30)
  if (availableDates.length > 0) {
    const nextDate = availableDates[0]
    const nextYear = nextDate.getFullYear()
    const nextMonth = String(nextDate.getMonth() + 1).padStart(2, '0')
    const nextDay = String(nextDate.getDate()).padStart(2, '0')
    return `${nextYear}-${nextMonth}-${nextDay}`
  }

  // Fallback to today
  return todayStr
}

/**
 * Check if a time is within business hours for a given date
 */
export function isTimeAvailable(
  date: Date,
  time: string, // HH:mm format
  businessHours: BusinessHours | null
): boolean {
  if (!businessHours) return true // If no business hours, allow all times

  const dayName = getDayName(date)
  const dayHours = businessHours[dayName]

  if (!dayHours) return false // Restaurant is closed on this day

  const [hours, minutes] = time.split(':').map(Number)
  const timeMinutes = hours * 60 + minutes

  const [openHours, openMinutes] = dayHours.open.split(':').map(Number)
  const openTimeMinutes = openHours * 60 + openMinutes

  const [closeHours, closeMinutes] = dayHours.close.split(':').map(Number)
  const closeTimeMinutes = closeHours * 60 + closeMinutes

  return timeMinutes >= openTimeMinutes && timeMinutes <= closeTimeMinutes
}

/**
 * Get minimum time for a given date (restaurant opening time, or current time if later)
 */
export function getMinTime(date: Date, businessHours: BusinessHours | null): string | undefined {
  if (!businessHours) return undefined

  const dayName = getDayName(date)
  const dayHours = businessHours[dayName]

  if (!dayHours) return undefined // Closed

  const today = new Date()
  const isToday = date.toDateString() === today.toDateString()

  if (isToday) {
    // If today, use current time or opening time, whichever is later
    const now = new Date()
    const currentMinutes = now.getHours() * 60 + now.getMinutes()

    const [openHours, openMinutes] = dayHours.open.split(':').map(Number)
    const openTimeMinutes = openHours * 60 + openMinutes

    // Add 30 minutes buffer for order preparation
    const minTimeMinutes = Math.max(currentMinutes + 30, openTimeMinutes)

    const minHours = Math.floor(minTimeMinutes / 60)
    const minMins = minTimeMinutes % 60

    return `${String(minHours).padStart(2, '0')}:${String(minMins).padStart(2, '0')}`
  }

  // For future dates, use opening time
  return dayHours.open
}

/**
 * Get maximum time for a given date (restaurant closing time)
 */
export function getMaxTime(date: Date, businessHours: BusinessHours | null): string | undefined {
  if (!businessHours) return undefined

  const dayName = getDayName(date)
  const dayHours = businessHours[dayName]

  if (!dayHours) return undefined // Closed

  return dayHours.close
}

/**
 * Check if a date should be disabled in date picker
 */
export function shouldDisableDate(date: Date, businessHours: BusinessHours | null): boolean {
  if (!businessHours) return false

  const dayName = getDayName(date)
  const dayHours = businessHours[dayName]

  // Disable if closed or no hours defined
  return dayHours === null || dayHours === undefined
}
