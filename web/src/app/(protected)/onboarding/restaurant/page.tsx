'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft } from 'lucide-react'
import { SearchBusiness } from '@/components'
import { ContentContainer } from '@/components'
import { useCreateRestaurant, ResponseBusinessDetails, CreateRestaurantCommand } from '@shared'
import { BusinessHoursEditor, BusinessHours, BusinessDetailsEditor, BusinessDetails } from '@/stories/onboarding'

export default function RestaurantOnboardingPage() {
  const router = useRouter()
  const [selectedBusiness, setSelectedBusiness] = useState<ResponseBusinessDetails | null>(null)
  const [businessDetails, setBusinessDetails] = useState<BusinessDetails | null>(null)
  const [businessHours, setBusinessHours] = useState<BusinessHours | null>(null)
  const createRestaurantMutation = useCreateRestaurant()

  const handleBusinessSelect = (business: ResponseBusinessDetails) => {
    setSelectedBusiness(business)
  }

  const handleBusinessDetailsChange = (details: BusinessDetails) => {
    setBusinessDetails(details)
  }

  const handleBusinessHoursChange = (hours: BusinessHours) => {
    setBusinessHours(hours)
  }

  const handleCreateRestaurant = async () => {
    if (!businessDetails) return

    // Convert business hours to JSON string format
    let businessHoursJson: string | null = null
    if (businessHours) {
      businessHoursJson = JSON.stringify(businessHours)
    }

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

    try {
      await createRestaurantMutation.mutateAsync(command)
      // Navigate to dashboard or success page
      router.push('/dashboard')
    } catch (error) {
      console.error('Failed to create restaurant:', error)
    }
  }

  return (
    <ContentContainer>
      <div>
        <Button variant="ghost" onClick={() => router.push('/onboarding')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to business type selection
        </Button>

        <div className="text-center">
          <h1 className="text-3xl font-bold mb-2">Set up your restaurant</h1>
          <p className="text-muted-foreground">Search for your restaurant to get started with our platform</p>
        </div>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Find your restaurant</CardTitle>
          <CardDescription>
            Search for your restaurant using Google Places to automatically fill in the details
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SearchBusiness onBusinessSelect={handleBusinessSelect} selectedBusiness={selectedBusiness} />
        </CardContent>
      </Card>

      {selectedBusiness && (
        <div className="space-y-6">
          <BusinessDetailsEditor businessData={selectedBusiness} onChange={handleBusinessDetailsChange} />

          <BusinessHoursEditor
            weekdayText={selectedBusiness.openingHours?.weekdayText}
            onChange={handleBusinessHoursChange}
          />

          <div className="text-center">
            <Button
              onClick={handleCreateRestaurant}
              disabled={!businessDetails || !businessHours || createRestaurantMutation.isPending}
              size="lg"
            >
              {createRestaurantMutation.isPending ? 'Creating Restaurant...' : 'Complete Setup'}
            </Button>

            {createRestaurantMutation.error && (
              <p className="text-red-600 text-sm mt-2">Error: {createRestaurantMutation.error.message}</p>
            )}
          </div>
        </div>
      )}
    </ContentContainer>
  )
}
