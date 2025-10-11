'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { ArrowLeft, MapPin, Clock, Phone, Check } from 'lucide-react'
import { useCreateRestaurant, ResponseBusinessDetails, CreateRestaurantCommand } from '@shared'
import { useOnboardingStore } from '@shared/stores/onboarding.store'

interface BusinessConfirmationProps {
  business?: ResponseBusinessDetails | null
  onConfirm?: (data: CreateRestaurantCommand) => void
  onBack?: () => void
}

export default function BusinessConfirmation({ business, onConfirm, onBack }: BusinessConfirmationProps) {
  const router = useRouter()
  const createRestaurantMutation = useCreateRestaurant()
  const { selectedBusiness, setSelectedBusiness, setRestaurantData, nextStep } = useOnboardingStore()

  // Use business from props or store
  const currentBusiness = business || selectedBusiness

  const [formData, setFormData] = useState({
    name: currentBusiness?.name || '',
    address: currentBusiness?.formattedAddress || '',
    city: currentBusiness?.vicinity || '',
    phone: currentBusiness?.formattedPhoneNumber || '',
    businessHours: currentBusiness?.openingHours?.weekdayText?.join('\n') || '',
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  useEffect(() => {
    if (currentBusiness) {
      setFormData({
        name: currentBusiness.name,
        address: currentBusiness.formattedAddress,
        city: currentBusiness.vicinity || '',
        phone: currentBusiness.formattedPhoneNumber,
        businessHours: currentBusiness.openingHours?.weekdayText?.join('\n') || '',
      })
    }
  }, [currentBusiness])

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async () => {
    if (!currentBusiness) return

    setIsSubmitting(true)
    setSubmitError(null)

    try {
      const command: CreateRestaurantCommand = {
        name: formData.name,
        address: formData.address,
        city: formData.city,
        state: '',
        zip: '',
        country: 'NO',
        latitude: currentBusiness.geometry.location.lat.toString(),
        longitude: currentBusiness.geometry.location.lng.toString(),
        googlePlaceId: currentBusiness.placeId,
        businessHours: formData.businessHours || null,
        isOpenNow: currentBusiness.openingHours?.openNow,
      }

      if (onConfirm) {
        onConfirm(command)
      } else {
        // Create restaurant and continue to next step
        await createRestaurantMutation.mutateAsync(command)
        setSelectedBusiness(currentBusiness)
        setRestaurantData(command)
        nextStep()
      }
    } catch (error) {
      console.error('Failed to create restaurant:', error)
      setSubmitError(error instanceof Error ? error.message : 'Failed to create restaurant. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleBack = () => {
    if (onBack) {
      onBack()
    } else {
      // Go back to previous step using store
      const { previousStep } = useOnboardingStore.getState()
      previousStep()
    }
  }

  if (!currentBusiness) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No business selected</p>
        <Button onClick={handleBack} variant="outline" className="mt-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Search
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold">Confirm Restaurant Details</h1>
        <p className="text-muted-foreground">Please review and update your restaurant information</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Restaurant Information
          </CardTitle>
          <CardDescription>Verify the details below and make any necessary changes</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Restaurant Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={e => handleInputChange('name', e.target.value)}
                placeholder="Restaurant name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={e => handleInputChange('phone', e.target.value)}
                placeholder="Phone number"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Input
              id="address"
              value={formData.address}
              onChange={e => handleInputChange('address', e.target.value)}
              placeholder="Full address"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="city">City</Label>
            <Input
              id="city"
              value={formData.city}
              onChange={e => handleInputChange('city', e.target.value)}
              placeholder="City"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="businessHours">Business Hours</Label>
            <Textarea
              id="businessHours"
              value={formData.businessHours}
              onChange={e => handleInputChange('businessHours', e.target.value)}
              placeholder="Business hours (one per line)"
              rows={7}
            />
            <p className="text-sm text-muted-foreground">Enter one time per line (e.g., "Monday: 9:00 AM – 5:00 PM")</p>
          </div>
        </CardContent>
      </Card>

      {submitError && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 bg-red-100 rounded-full flex items-center justify-center">
              <span className="text-red-600 text-xs">!</span>
            </div>
            <div>
              <h4 className="text-sm font-medium text-red-800">Error Creating Restaurant</h4>
              <p className="text-sm text-red-600 mt-1">{submitError}</p>
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-between">
        <Button onClick={handleBack} variant="outline">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Search
        </Button>

        <Button
          onClick={handleSubmit}
          disabled={isSubmitting || !formData.name || !formData.address}
          className="min-w-[120px]"
        >
          {isSubmitting ? (
            'Creating...'
          ) : (
            <>
              <Check className="h-4 w-4 mr-2" />
              Confirm & Continue
            </>
          )}
        </Button>
      </div>
    </div>
  )
}
