'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft, ArrowRight, CheckCircle, Search, Upload, Globe } from 'lucide-react'
import { SearchBusiness } from '@/components'
import {
  BusinessDetailsEditor,
  BusinessDetails,
  BusinessHoursEditor,
  BusinessHours,
  WebsiteTemplateStep,
} from '@/stories/onboarding'
import { MenuImportWizard } from '@/stories/onboarding/MenuImportWizard'
import {
  useCreateRestaurant,
  ResponseBusinessDetails,
  CreateRestaurantCommand,
  PageTemplate,
  useCreateWebsiteFromTemplates,
  useParseMenuStructure,
  useCreateMenuStructure,
} from '@shared'
import { toast } from 'sonner'

interface RestaurantOnboardingProps {
  onBack?: () => void
  onComplete?: () => void
}

type Step = 'search' | 'details' | 'hours' | 'menu' | 'website'

export function RestaurantOnboarding({ onBack, onComplete }: RestaurantOnboardingProps) {
  const [currentStep, setCurrentStep] = useState<Step>('search')
  const [selectedBusiness, setSelectedBusiness] = useState<ResponseBusinessDetails | null>(null)
  const [businessDetails, setBusinessDetails] = useState<BusinessDetails | null>(null)
  const [businessHours, setBusinessHours] = useState<BusinessHours | null>(null)
  const [restaurantId, setRestaurantId] = useState<string | null>(null)
  const [menuId, setMenuId] = useState<string | null>(null)
  const [selectedTemplates, setSelectedTemplates] = useState<PageTemplate[]>([])
  const createRestaurant = useCreateRestaurant()
  const createWebsiteFromTemplates = useCreateWebsiteFromTemplates()

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

  const handleContinueToMenu = async () => {
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

      const result = await createRestaurant.mutateAsync(command)
      console.log('Restaurant creation result:', result)
      console.log('Restaurant ID:', result?.id)
      setRestaurantId(result?.id || null)
      toast.success('Restaurant created successfully!')
      setCurrentStep('menu')
    } catch (error) {
      console.error('Failed to create restaurant:', error)
      toast.error('Failed to create restaurant')
    }
  }

  const handleMenuCreated = (createdMenuId: string) => {
    console.log('RestaurantOnboarding: Menu created with ID:', createdMenuId)
    setMenuId(createdMenuId)
    setCurrentStep('website')
  }

  const handleSkipMenu = () => {
    setCurrentStep('website')
  }

  const handleTemplatesSelected = async (templates: PageTemplate[]) => {
    setSelectedTemplates(templates)

    if (!restaurantId || !businessDetails) {
      toast.error('Missing required information')
      return
    }

    try {
      const result = await createWebsiteFromTemplates.mutateAsync({
        restaurantId,
        websiteName: `${businessDetails.name} Website`,
        subdomain: businessDetails.name.toLowerCase().replace(/\s+/g, '-') || 'restaurant',
        description: `Website for ${businessDetails.name}`,
        pageTemplates: templates.map(template => ({
          templateType: template,
        })),
        menuId: menuId || undefined,
      })

      toast.success('Website created successfully!')
      onComplete?.()
    } catch (error) {
      console.error('Failed to create website:', error)
      toast.error('Failed to create website')
    }
  }

  const handleSkipWebsite = () => {
    onComplete?.()
  }

  const handleBack = () => {
    if (currentStep === 'details') {
      setCurrentStep('search')
    } else if (currentStep === 'hours') {
      setCurrentStep('details')
    } else if (currentStep === 'menu') {
      setCurrentStep('hours')
    } else if (currentStep === 'website') {
      setCurrentStep('menu')
    }
    // Don't call onBack for first step since we're directly on restaurant onboarding
  }

  return (
    <div className="space-y-6">
      {/* Progress Indicator */}
      <div className="flex items-center justify-center gap-1 md:gap-2 overflow-x-auto pb-2">
        {[
          { step: 'search', label: 'Find Restaurant', icon: Search },
          { step: 'details', label: 'Details', icon: CheckCircle },
          { step: 'hours', label: 'Hours', icon: CheckCircle },
          { step: 'menu', label: 'Menu', icon: Upload },
          { step: 'website', label: 'Website', icon: Globe },
        ].map(({ step, label, icon: Icon }, index) => {
          const stepIndex = index + 1
          const isCurrentStep = currentStep === step
          const isCompleted = ['search', 'details', 'hours', 'menu', 'website'].indexOf(currentStep) > index
          const isActive = isCurrentStep || isCompleted

          return (
            <div key={step} className="flex items-center gap-1 md:gap-2 flex-shrink-0">
              <div className="flex items-center gap-1 md:gap-2">
                <div
                  className={`w-6 h-6 md:w-8 md:h-8 rounded-full flex items-center justify-center text-xs md:text-sm font-medium ${
                    isCurrentStep
                      ? 'bg-primary text-primary-foreground'
                      : isCompleted
                        ? 'bg-green-500 text-white'
                        : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {isCompleted ? <CheckCircle className="w-3 h-3 md:w-4 md:h-4" /> : stepIndex}
                </div>
                <span
                  className={`text-xs md:text-sm font-medium hidden sm:block ${
                    isCurrentStep ? 'text-foreground' : 'text-muted-foreground'
                  }`}
                >
                  {label}
                </span>
              </div>
              {index < 4 && <div className="w-6 md:w-12 h-0.5 bg-muted" />}
            </div>
          )
        })}
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
        <BusinessHoursEditor weekdayText={selectedBusiness?.openingHours?.weekdayText} onChange={setBusinessHours} />
      )}

      {currentStep === 'menu' && restaurantId && (
        <MenuImportWizard
          restaurantId={restaurantId}
          onMenuCreated={handleMenuCreated}
          onSkip={handleSkipMenu}
          onBack={() => setCurrentStep('hours')}
        />
      )}

      {currentStep === 'website' && (
        <WebsiteTemplateStep
          onTemplatesSelected={handleTemplatesSelected}
          onSkip={handleSkipWebsite}
          selectedMenuId={menuId || undefined}
        />
      )}

      {/* Navigation Buttons */}
      {currentStep !== 'search' && currentStep !== 'menu' && currentStep !== 'website' && (
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
            <Button onClick={handleContinueToMenu} disabled={!businessHours || createRestaurant.isPending}>
              {createRestaurant.isPending ? 'Creating Restaurant...' : 'Next: Import Menu'}
              <ArrowRight className="w-4 h-4 ml-2" />
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
