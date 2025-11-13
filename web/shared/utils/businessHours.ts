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

  // Check if today is available
  if (isDateAvailable(today, businessHours)) {
    return today.toISOString().split('T')[0]
  }

  // Find next available date
  const availableDates = getAvailableDates(businessHours, 30)
  if (availableDates.length > 0) {
    return availableDates[0].toISOString().split('T')[0]
  }

  // Fallback to today
  return today.toISOString().split('T')[0]
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
export function getMinTime(date: Date, businessHours: BusinessHours | null): string {
  if (!businessHours) return '00:00'

  const dayName = getDayName(date)
  const dayHours = businessHours[dayName]

  if (!dayHours) return '00:00' // Closed, but return default

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
export function getMaxTime(date: Date, businessHours: BusinessHours | null): string {
  if (!businessHours) return '23:59'

  const dayName = getDayName(date)
  const dayHours = businessHours[dayName]

  if (!dayHours) return '23:59' // Closed, but return default

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
