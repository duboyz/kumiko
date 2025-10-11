'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft, ArrowRight, CheckCircle, Search } from 'lucide-react'
import { SearchBusiness } from '@/components'
import { useCreateHospitality, ResponseBusinessDetails } from '@shared'
import { toast } from 'sonner'

interface HospitalityOnboardingProps {
    onBack?: () => void
    onComplete?: () => void
}

export function HospitalityOnboarding({ onBack, onComplete }: HospitalityOnboardingProps) {
    const [selectedBusiness, setSelectedBusiness] = useState<ResponseBusinessDetails | null>(null)
    const createHospitality = useCreateHospitality()

    const handleBusinessSelect = (business: ResponseBusinessDetails) => {
        setSelectedBusiness(business)
    }

    const handleComplete = async () => {
        if (!selectedBusiness) {
            toast.error('Please select a business first')
            return
        }

        try {
            await createHospitality.mutateAsync({
                name: selectedBusiness.name,
                address: selectedBusiness.formattedAddress,
                city: selectedBusiness.vicinity || '',
                state: '',
                zip: '',
                country: 'NO',
                latitude: selectedBusiness.geometry.location.lat.toString(),
                longitude: selectedBusiness.geometry.location.lng.toString(),
                googlePlaceId: selectedBusiness.placeId,
                description: `${selectedBusiness.name} - Hospitality business`,
            })

            toast.success('Hospitality business created successfully!')
            onComplete?.()
        } catch (error) {
            console.error('Failed to create hospitality:', error)
            toast.error('Failed to create hospitality business')
        }
    }

    return (
        <div className="space-y-6">
            {/* Search Step */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Search className="w-5 h-5" />
                        Find Your Hospitality Business
                    </CardTitle>
                    <CardDescription>
                        Search for your hotel or hospitality business using Google Places
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <SearchBusiness onBusinessSelect={handleBusinessSelect} selectedBusiness={selectedBusiness} />
                </CardContent>
            </Card>

            {selectedBusiness && (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <CheckCircle className="h-5 w-5 text-green-600" />
                            Selected Business
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2">
                            <p>
                                <strong>Name:</strong> {selectedBusiness.name}
                            </p>
                            <p>
                                <strong>Address:</strong> {selectedBusiness.formattedAddress}
                            </p>
                            {selectedBusiness.formattedPhoneNumber && (
                                <p>
                                    <strong>Phone:</strong> {selectedBusiness.formattedPhoneNumber}
                                </p>
                            )}
                            {selectedBusiness.website && (
                                <p>
                                    <strong>Website:</strong> {selectedBusiness.website}
                                </p>
                            )}
                            {selectedBusiness.rating && (
                                <p>
                                    <strong>Rating:</strong> {selectedBusiness.rating} ⭐ ({selectedBusiness.userRatingsTotal} reviews)
                                </p>
                            )}
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between pt-6">
                <Button onClick={onBack} variant="outline">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back
                </Button>

                <Button
                    onClick={handleComplete}
                    disabled={!selectedBusiness || createHospitality.isPending}
                >
                    {createHospitality.isPending ? 'Creating Business...' : 'Complete Setup'}
                    <CheckCircle className="w-4 h-4 ml-2" />
                </Button>
            </div>

            {createHospitality.error && (
                <p className="text-red-600 text-sm text-center">
                    Error: {createHospitality.error instanceof Error ? createHospitality.error.message : 'Failed to create business'}
                </p>
            )}
        </div>
    )
}

