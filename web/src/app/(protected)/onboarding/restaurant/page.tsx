'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft, CheckCircle } from 'lucide-react'
import SearchBusiness from '@/components/SearchBusiness'
import { ContentContainer } from '@/components/ContentContainer'
import { useCreateRestaurant, ResponseBusinessDetails, CreateRestaurantCommand } from '@shared'

export default function RestaurantOnboardingPage() {
  const router = useRouter()
  const [selectedBusiness, setSelectedBusiness] = useState<ResponseBusinessDetails | null>(null)
  const createRestaurantMutation = useCreateRestaurant()

  const handleBusinessSelect = (business: ResponseBusinessDetails) => {
    setSelectedBusiness(business)
  }

  const handleCreateRestaurant = async () => {
    if (!selectedBusiness) return

    const command: CreateRestaurantCommand = {
      name: selectedBusiness.name,
      address: selectedBusiness.formattedAddress,
      city: selectedBusiness.vicinity || '',
      state: '',
      zip: '',
      country: 'NO',
      latitude: selectedBusiness.geometry.location.lat.toString(),
      longitude: selectedBusiness.geometry.location.lng.toString(),
      googlePlaceId: selectedBusiness.placeId,
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
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              Selected Restaurant
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

      <div className="text-center">
        <Button
          onClick={handleCreateRestaurant}
          disabled={!selectedBusiness || createRestaurantMutation.isPending}
          size="lg"
        >
          {createRestaurantMutation.isPending ? 'Creating...' : 'Create Restaurant'}
        </Button>

        {createRestaurantMutation.error && (
          <p className="text-red-600 text-sm mt-2">Error: {createRestaurantMutation.error.message}</p>
        )}
      </div>
    </ContentContainer>
  )
}
