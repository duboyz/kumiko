'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import SearchBusiness from '@/components/SearchBusiness'
import { useCreateHospitality } from '@shared'
import type { ResponseBusinessDetails } from '@shared'
import { LoadingSpinner } from '@/components'
import { ErrorMessage } from '@/components'
import { ContentContainer } from '@/components/ContentContainer'

export default function HospitalityOnboardingPage() {
  const [selectedBusiness, setSelectedBusiness] = useState<ResponseBusinessDetails | null>(null)
  const router = useRouter()

  const createHospitality = useCreateHospitality()

  const handleBusinessSelect = (business: ResponseBusinessDetails) => {
    setSelectedBusiness(business)
  }

  const handleCreateHospitality = async () => {
    if (!selectedBusiness) return

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

      // Navigate to dashboard after successful creation
      router.push('/dashboard')
    } catch (error) {
      console.error('Failed to create hospitality:', error)
    }
  }

  return (
    <ContentContainer>
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Set up your hospitality business</h1>
        <p className="text-muted-foreground">Search for your hotel or hospitality business to get started</p>
      </div>

      <div className="max-w-2xl mx-auto">
        <SearchBusiness onBusinessSelect={handleBusinessSelect} selectedBusiness={selectedBusiness} />

        {selectedBusiness && (
          <div className="mt-8 text-center">
            <h3 className="text-lg font-semibold mb-2">Selected Business</h3>
            <div className="bg-card p-4 rounded-lg border text-left mb-6">
              <h4 className="font-semibold">{selectedBusiness.name}</h4>
              <p className="text-sm text-muted-foreground">{selectedBusiness.formattedAddress}</p>
            </div>

            <Button onClick={handleCreateHospitality} disabled={createHospitality.isPending} size="lg">
              {createHospitality.isPending ? (
                <>
                  <LoadingSpinner size="sm" />
                  Creating Hospitality Business...
                </>
              ) : (
                'Create Hospitality Business'
              )}
            </Button>

            {createHospitality.error && (
              <div className="mt-4">
                <ErrorMessage
                  title="Failed to create hospitality business"
                  message="There was an error creating your hospitality business. Please try again."
                />
              </div>
            )}
          </div>
        )}
      </div>
    </ContentContainer>
  )
}
