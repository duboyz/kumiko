'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Building2, Edit, Save, X } from 'lucide-react'
import { BusinessDetailsEditor, BusinessDetails, BusinessHoursEditor, BusinessHours } from '@/stories/onboarding'
import { useUpdateRestaurant, RestaurantBaseDto, UpdateRestaurantCommand } from '@shared'
import { toast } from 'sonner'

interface RestaurantDetailsSettingsProps {
    restaurant: RestaurantBaseDto
}

// Parse business hours from JSON string
const parseBusinessHours = (hoursJson?: string | null): BusinessHours | null => {
    if (!hoursJson) return null
    try {
        return JSON.parse(hoursJson) as BusinessHours
    } catch {
        return null
    }
}

export function RestaurantDetailsSettings({ restaurant }: RestaurantDetailsSettingsProps) {
    const [isEditing, setIsEditing] = useState(false)
    const [businessDetails, setBusinessDetails] = useState<BusinessDetails | null>(null)
    const [businessHours, setBusinessHours] = useState<BusinessHours | null>(null)
    const updateRestaurant = useUpdateRestaurant()

    useEffect(() => {
        if (isEditing) {
            if (!businessDetails) {
                // Initialize business details from restaurant
                setBusinessDetails({
                    name: restaurant.name,
                    address: restaurant.address,
                    city: restaurant.city,
                    state: restaurant.state,
                    zip: restaurant.zip,
                    country: restaurant.country,
                    phone: '',
                    website: '',
                    description: restaurant.description || '',
                    latitude: restaurant.latitude,
                    longitude: restaurant.longitude,
                    googlePlaceId: restaurant.googlePlaceId,
                })
            }

            if (!businessHours) {
                // Initialize business hours
                const parsedHours = parseBusinessHours(restaurant.businessHours)
                setBusinessHours(parsedHours)
            }
        }
    }, [isEditing, restaurant, businessDetails, businessHours])

    const handleSave = async () => {
        if (!businessDetails || !businessHours) {
            toast.error('Please fill in all required fields')
            return
        }

        try {
            const command: UpdateRestaurantCommand = {
                id: restaurant.id,
                name: businessDetails.name,
                description: businessDetails.description || null,
                address: businessDetails.address,
                city: businessDetails.city,
                state: businessDetails.state,
                zip: businessDetails.zip,
                country: businessDetails.country,
                latitude: businessDetails.latitude,
                longitude: businessDetails.longitude,
                googlePlaceId: businessDetails.googlePlaceId,
                businessHours: JSON.stringify(businessHours),
                isOpenNow: restaurant.isOpenNow,
            }

            await updateRestaurant.mutateAsync(command)
            toast.success('Restaurant details updated successfully')
            setIsEditing(false)
            setBusinessDetails(null)
            setBusinessHours(null)
        } catch (error) {
            toast.error('Failed to update restaurant details')
            console.error('Error updating restaurant:', error)
        }
    }

    const handleCancel = () => {
        setIsEditing(false)
        setBusinessDetails(null)
        setBusinessHours(null)
    }

    if (!isEditing) {
        const parsedBusinessHours = parseBusinessHours(restaurant.businessHours)

        return (
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Building2 className="w-5 h-5" />
                            <CardTitle>Restaurant Details</CardTitle>
                        </div>
                        <Button onClick={() => setIsEditing(true)} variant="outline" size="sm">
                            <Edit className="w-4 h-4 mr-2" />
                            Edit
                        </Button>
                    </div>
                    <CardDescription>View and manage your restaurant information</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-6">
                        {/* Basic Information */}
                        <div>
                            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
                                Basic Information
                            </h3>
                            <dl className="grid grid-cols-1 gap-3">
                                <div>
                                    <dt className="text-sm font-medium text-muted-foreground">Name</dt>
                                    <dd className="text-sm">{restaurant.name}</dd>
                                </div>
                                {restaurant.description && (
                                    <div>
                                        <dt className="text-sm font-medium text-muted-foreground">Description</dt>
                                        <dd className="text-sm">{restaurant.description}</dd>
                                    </div>
                                )}
                            </dl>
                        </div>

                        {/* Location */}
                        <div>
                            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">Location</h3>
                            <dl className="grid grid-cols-1 gap-3">
                                <div>
                                    <dt className="text-sm font-medium text-muted-foreground">Address</dt>
                                    <dd className="text-sm">
                                        {restaurant.address}
                                        {restaurant.city && `, ${restaurant.city}`}
                                        {restaurant.state && `, ${restaurant.state}`}
                                        {restaurant.zip && ` ${restaurant.zip}`}
                                        {restaurant.country && `, ${restaurant.country}`}
                                    </dd>
                                </div>
                            </dl>
                        </div>

                        {/* Business Hours */}
                        {parsedBusinessHours && (
                            <div>
                                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
                                    Business Hours
                                </h3>
                                <dl className="grid grid-cols-1 gap-2">
                                    {Object.entries(parsedBusinessHours).map(([day, hours]) => (
                                        <div key={day} className="flex justify-between items-center py-1">
                                            <dt className="text-sm font-medium capitalize">{day}</dt>
                                            <dd className="text-sm text-muted-foreground">
                                                {hours ? `${hours.open} - ${hours.close}` : 'Closed'}
                                            </dd>
                                        </div>
                                    ))}
                                </dl>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        )
    }

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Building2 className="w-5 h-5" />
                            <CardTitle>Edit Restaurant Details</CardTitle>
                        </div>
                        <div className="flex gap-2">
                            <Button onClick={handleCancel} variant="outline" size="sm" disabled={updateRestaurant.isPending}>
                                <X className="w-4 h-4 mr-2" />
                                Cancel
                            </Button>
                            <Button
                                onClick={handleSave}
                                size="sm"
                                disabled={!businessDetails || !businessHours || updateRestaurant.isPending}
                            >
                                <Save className="w-4 h-4 mr-2" />
                                {updateRestaurant.isPending ? 'Saving...' : 'Save Changes'}
                            </Button>
                        </div>
                    </div>
                </CardHeader>
            </Card>

            <BusinessDetailsEditor
                businessData={{
                    placeId: restaurant.googlePlaceId,
                    name: restaurant.name,
                    formattedAddress: restaurant.address,
                    formattedPhoneNumber: '',
                    internationalPhoneNumber: '',
                    website: '',
                    businessStatus: 'OPERATIONAL',
                    types: [],
                    vicinity: restaurant.city,
                    geometry: {
                        location: {
                            lat: parseFloat(restaurant.latitude),
                            lng: parseFloat(restaurant.longitude),
                        },
                    },
                    photos: [],
                    reviews: [],
                }}
                onChange={setBusinessDetails}
            />

            <BusinessHoursEditor
                initialHours={parseBusinessHours(restaurant.businessHours) || undefined}
                onChange={setBusinessHours}
            />
        </div>
    )
}
