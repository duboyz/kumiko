'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft, ArrowRight, CheckCircle, Search } from 'lucide-react'
import { SearchBusiness } from '@/components'
import { useCreateHospitality, ResponseBusinessDetails } from '@shared'
import { toast } from 'sonner'
import { useTranslations } from 'next-intl'

interface HospitalityOnboardingProps {
    onBack?: () => void
    onComplete?: () => void
}

export function HospitalityOnboarding({ onBack, onComplete }: HospitalityOnboardingProps) {
    const t = useTranslations('onboarding.hospitalityOnboarding')
    const [selectedBusiness, setSelectedBusiness] = useState<ResponseBusinessDetails | null>(null)
    const createHospitality = useCreateHospitality()

    const handleBusinessSelect = (business: ResponseBusinessDetails) => {
        setSelectedBusiness(business)
    }

    const handleComplete = async () => {
        if (!selectedBusiness) {
            toast.error(t('pleaseSelectBusiness'))
            return
        }

        try {
            await createHospitality.mutateAsync({
                name: selectedBusiness.name,
                address: selectedBusiness.street || selectedBusiness.formattedAddress,
                city: selectedBusiness.city || selectedBusiness.vicinity || '',
                state: selectedBusiness.state || '',
                zip: selectedBusiness.postalCode || '',
                country: selectedBusiness.country || 'NO',
                latitude: selectedBusiness.geometry.location.lat.toString(),
                longitude: selectedBusiness.geometry.location.lng.toString(),
                googlePlaceId: selectedBusiness.placeId,
                description: `${selectedBusiness.name} - Hospitality business`,
            })

            toast.success(t('businessCreated'))
            onComplete?.()
        } catch (error) {
            console.error('Failed to create hospitality:', error)
            toast.error(t('failedToCreate'))
        }
    }

    return (
        <div className="space-y-6">
            {/* Search Step */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Search className="w-5 h-5" />
                        {t('findYourBusiness')}
                    </CardTitle>
                    <CardDescription>
                        {t('searchDescription')}
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
                            {t('selectedBusiness')}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2">
                            <p>
                                <strong>{t('name')}:</strong> {selectedBusiness.name}
                            </p>
                            <p>
                                <strong>{t('address')}:</strong> {selectedBusiness.formattedAddress}
                            </p>
                            {selectedBusiness.formattedPhoneNumber && (
                                <p>
                                    <strong>{t('phone')}:</strong> {selectedBusiness.formattedPhoneNumber}
                                </p>
                            )}
                            {selectedBusiness.website && (
                                <p>
                                    <strong>{t('website')}:</strong> {selectedBusiness.website}
                                </p>
                            )}
                            {selectedBusiness.rating && (
                                <p>
                                    <strong>{t('rating')}:</strong> {selectedBusiness.rating} ⭐ ({selectedBusiness.userRatingsTotal} {t('reviews')})
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
                    {t('back')}
                </Button>

                <Button
                    onClick={handleComplete}
                    disabled={!selectedBusiness || createHospitality.isPending}
                >
                    {createHospitality.isPending ? t('creatingBusiness') : t('completeSetup')}
                    <CheckCircle className="w-4 h-4 ml-2" />
                </Button>
            </div>

            {createHospitality.error && (
                <p className="text-red-600 text-sm text-center">
                    Error: {createHospitality.error instanceof Error ? createHospitality.error.message : t('failedToCreate')}
                </p>
            )}
        </div>
    )
}

