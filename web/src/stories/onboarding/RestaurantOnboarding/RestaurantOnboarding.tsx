'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft, ArrowRight, CheckCircle, Search } from 'lucide-react'
import { SearchBusiness } from '@/components'
import { BusinessDetailsEditor, BusinessDetails, BusinessHoursEditor, BusinessHours } from '@/stories/onboarding'
import { useCreateRestaurant, ResponseBusinessDetails, CreateRestaurantCommand } from '@shared'
import { toast } from 'sonner'

interface RestaurantOnboardingProps {
    onBack?: () => void
    onComplete?: () => void
}

type Step = 'search' | 'details' | 'hours'

export function RestaurantOnboarding({ onBack, onComplete }: RestaurantOnboardingProps) {
    const [currentStep, setCurrentStep] = useState<Step>('search')
    const [selectedBusiness, setSelectedBusiness] = useState<ResponseBusinessDetails | null>(null)
    const [businessDetails, setBusinessDetails] = useState<BusinessDetails | null>(null)
    const [businessHours, setBusinessHours] = useState<BusinessHours | null>(null)
    const createRestaurant = useCreateRestaurant()

    const handleBusinessSelect = (business: ResponseBusinessDetails) => {
        setSelectedBusiness(business)
    }

    const handleContinueToDetails = () => {
        if (!selectedBusiness) {
            toast.error('Please select a restaurant first')
            return
        }
        setCurrentStep('details')
    }

    const handleContinueToHours = () => {
        if (!businessDetails) {
            toast.error('Please fill in business details')
            return
        }
        setCurrentStep('hours')
    }

    const handleComplete = async () => {
        if (!businessDetails || !businessHours) {
            toast.error('Please complete all steps')
            return
        }

        try {
            const businessHoursJson = JSON.stringify(businessHours)

            const command: CreateRestaurantCommand = {
                name: businessDetails.name,
                address: businessDetails.address,
                city: businessDetails.city,
                state: businessDetails.state,
                zip: businessDetails.zip,
                country: businessDetails.country,
                latitude: businessDetails.latitude,
                longitude: businessDetails.longitude,
                googlePlaceId: businessDetails.googlePlaceId,
                businessHours: businessHoursJson,
                isOpenNow: selectedBusiness?.openingHours?.openNow,
            }

            await createRestaurant.mutateAsync(command)
            toast.success('Restaurant created successfully!')
            onComplete?.()
        } catch (error) {
            console.error('Failed to create restaurant:', error)
            toast.error('Failed to create restaurant')
        }
    }

    const handleBack = () => {
        if (currentStep === 'details') {
            setCurrentStep('search')
        } else if (currentStep === 'hours') {
            setCurrentStep('details')
        }
        // Don't call onBack for first step since we're directly on restaurant onboarding
    }

    return (
        <div className="space-y-6">
            {/* Progress Indicator */}
            <div className="flex items-center justify-center gap-2">
                <div className="flex items-center gap-2">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${currentStep === 'search' ? 'bg-primary text-primary-foreground' :
                        ['details', 'hours'].includes(currentStep) ? 'bg-green-500 text-white' : 'bg-muted text-muted-foreground'
                        }`}>
                        {['details', 'hours'].includes(currentStep) ? <CheckCircle className="w-4 h-4" /> : '1'}
                    </div>
                    <span className={`text-sm font-medium ${currentStep === 'search' ? 'text-foreground' : 'text-muted-foreground'}`}>
                        Find Restaurant
                    </span>
                </div>

                <div className="w-12 h-0.5 bg-muted" />

                <div className="flex items-center gap-2">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${currentStep === 'details' ? 'bg-primary text-primary-foreground' :
                        currentStep === 'hours' ? 'bg-green-500 text-white' : 'bg-muted text-muted-foreground'
                        }`}>
                        {currentStep === 'hours' ? <CheckCircle className="w-4 h-4" /> : '2'}
                    </div>
                    <span className={`text-sm font-medium ${currentStep === 'details' ? 'text-foreground' : 'text-muted-foreground'}`}>
                        Business Details
                    </span>
                </div>

                <div className="w-12 h-0.5 bg-muted" />

                <div className="flex items-center gap-2">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${currentStep === 'hours' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                        }`}>
                        3
                    </div>
                    <span className={`text-sm font-medium ${currentStep === 'hours' ? 'text-foreground' : 'text-muted-foreground'}`}>
                        Business Hours
                    </span>
                </div>
            </div>

            {/* Step Content */}
            {currentStep === 'search' && (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Search className="w-5 h-5" />
                            Find Your Restaurant
                        </CardTitle>
                        <CardDescription>
                            Search for your restaurant using Google Places to automatically fill in the details
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <SearchBusiness onBusinessSelect={handleBusinessSelect} selectedBusiness={selectedBusiness} />

                        {selectedBusiness && (
                            <div className="flex gap-3 pt-4 border-t">
                                <Button onClick={() => setSelectedBusiness(null)} variant="outline" className="flex-1">
                                    Deselect
                                </Button>
                                <Button onClick={handleContinueToDetails} className="flex-1">
                                    Next: Business Details
                                    <ArrowRight className="w-4 h-4 ml-2" />
                                </Button>
                            </div>
                        )}
                    </CardContent>
                </Card>
            )}

            {currentStep === 'details' && (
                <BusinessDetailsEditor businessData={selectedBusiness!} onChange={setBusinessDetails} />
            )}

            {currentStep === 'hours' && (
                <BusinessHoursEditor
                    weekdayText={selectedBusiness?.openingHours?.weekdayText}
                    onChange={setBusinessHours}
                />
            )}

            {/* Navigation Buttons */}
            {currentStep !== 'search' && (
                <div className="flex items-center justify-between pt-6">
                    <Button onClick={handleBack} variant="outline">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back
                    </Button>

                    {currentStep === 'details' && (
                        <Button onClick={handleContinueToHours} disabled={!businessDetails}>
                            Next: Business Hours
                            <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                    )}

                    {currentStep === 'hours' && (
                        <Button
                            onClick={handleComplete}
                            disabled={!businessHours || createRestaurant.isPending}
                        >
                            {createRestaurant.isPending ? 'Creating Restaurant...' : 'Complete Setup'}
                            <CheckCircle className="w-4 h-4 ml-2" />
                        </Button>
                    )}
                </div>
            )}

            {createRestaurant.error && (
                <p className="text-red-600 text-sm text-center">Error: {createRestaurant.error.message}</p>
            )}
        </div>
    )
}

