export interface BusinessHours {
    monday?: DayHours | null
    tuesday?: DayHours | null
    wednesday?: DayHours | null
    thursday?: DayHours | null
    friday?: DayHours | null
    saturday?: DayHours | null
    sunday?: DayHours | null
}

export interface DayHours {
    open: string // Format: "HH:MM" (24-hour)
    close: string // Format: "HH:MM" (24-hour)
}

export interface BusinessHoursDisplayProps {
    businessHours?: string | null // JSON string of BusinessHours
    isOpenNow?: boolean | null
    className?: string
}
