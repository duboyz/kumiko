'use client'

import { Clock } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { BusinessHours, DayHours } from '@shared/types/business-hours.types'

interface BusinessHoursDisplayProps {
    businessHours?: string | null
    isOpenNow?: boolean | null
    className?: string
}

export default function BusinessHoursDisplay({
    businessHours,
    isOpenNow,
    className
}: BusinessHoursDisplayProps) {
    if (!businessHours) {
        return (
            <Card className={className}>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Clock className="h-5 w-5" />
                        Business Hours
                    </CardTitle>
                    <CardDescription>No business hours available</CardDescription>
                </CardHeader>
            </Card>
        )
    }

    let parsedHours: BusinessHours | null = null
    try {
        parsedHours = JSON.parse(businessHours)
    } catch (error) {
        console.error('Failed to parse business hours:', error)
        return (
            <Card className={className}>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Clock className="h-5 w-5" />
                        Business Hours
                    </CardTitle>
                    <CardDescription>Unable to display business hours</CardDescription>
                </CardHeader>
            </Card>
        )
    }

    const getCurrentStatus = () => {
        if (isOpenNow === null || isOpenNow === undefined) return null
        return isOpenNow ? 'Open now' : 'Closed now'
    }

    const getStatusColor = () => {
        if (isOpenNow === null || isOpenNow === undefined) return 'secondary'
        return isOpenNow ? 'default' : 'destructive'
    }

    const formatTime = (time: string) => {
        // Time is already in 24-hour format (HH:MM), just return it as-is
        return time
    }

    const formatDayHours = (day: string, hours: DayHours | null) => {
        if (!hours) return `${day}: Closed`
        return `${day}: ${formatTime(hours.open)} – ${formatTime(hours.close)}`
    }

    const currentStatus = getCurrentStatus()

    return (
        <Card className={className}>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    Business Hours
                </CardTitle>
                {currentStatus && (
                    <div className="flex items-center gap-2">
                        <Badge variant={getStatusColor() as any}>
                            {currentStatus}
                        </Badge>
                    </div>
                )}
            </CardHeader>
            <CardContent>
                <div className="space-y-2">
                    {parsedHours && (
                        <>
                            {parsedHours.monday !== undefined && (
                                <div className="flex justify-between items-center py-1">
                                    <span className="text-sm font-medium">
                                        {formatDayHours('Monday', parsedHours.monday)}
                                    </span>
                                </div>
                            )}
                            {parsedHours.tuesday !== undefined && (
                                <div className="flex justify-between items-center py-1">
                                    <span className="text-sm font-medium">
                                        {formatDayHours('Tuesday', parsedHours.tuesday)}
                                    </span>
                                </div>
                            )}
                            {parsedHours.wednesday !== undefined && (
                                <div className="flex justify-between items-center py-1">
                                    <span className="text-sm font-medium">
                                        {formatDayHours('Wednesday', parsedHours.wednesday)}
                                    </span>
                                </div>
                            )}
                            {parsedHours.thursday !== undefined && (
                                <div className="flex justify-between items-center py-1">
                                    <span className="text-sm font-medium">
                                        {formatDayHours('Thursday', parsedHours.thursday)}
                                    </span>
                                </div>
                            )}
                            {parsedHours.friday !== undefined && (
                                <div className="flex justify-between items-center py-1">
                                    <span className="text-sm font-medium">
                                        {formatDayHours('Friday', parsedHours.friday)}
                                    </span>
                                </div>
                            )}
                            {parsedHours.saturday !== undefined && (
                                <div className="flex justify-between items-center py-1">
                                    <span className="text-sm font-medium">
                                        {formatDayHours('Saturday', parsedHours.saturday)}
                                    </span>
                                </div>
                            )}
                            {parsedHours.sunday !== undefined && (
                                <div className="flex justify-between items-center py-1">
                                    <span className="text-sm font-medium">
                                        {formatDayHours('Sunday', parsedHours.sunday)}
                                    </span>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </CardContent>
        </Card>
    )
}
