'use client'

import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  Search,
  Upload,
  Globe,
  PartyPopper,
  Building2,
  Clock,
  Menu,
  Sparkles,
} from 'lucide-react'
import { SearchBusiness } from '@/components'
import {
  BusinessDetailsEditor,
  BusinessDetails,
  BusinessHoursEditor,
  BusinessHours,
  WebsiteTemplateStep,
  CelebrationStep,
} from '@/stories/onboarding'
import { MenuImportWizard } from '@/stories/onboarding/MenuImportWizard'
import { gsap } from 'gsap'
import { useRouter } from 'next/navigation'
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
import { useIsMobile } from '@/hooks/use-mobile'

interface RestaurantOnboardingProps {
  onBack?: () => void
  onComplete?: () => void
}

type Step = 'search' | 'details' | 'hours' | 'menu' | 'website' | 'celebration'

export function RestaurantOnboarding({ onBack, onComplete }: RestaurantOnboardingProps) {
  const router = useRouter()
  const isMobile = useIsMobile()
  const [currentStep, setCurrentStep] = useState<Step>('search')
  const [selectedBusiness, setSelectedBusiness] = useState<ResponseBusinessDetails | null>(null)
  const [businessDetails, setBusinessDetails] = useState<BusinessDetails | null>(null)
  const [businessHours, setBusinessHours] = useState<BusinessHours | null>(null)
  const [restaurantId, setRestaurantId] = useState<string | null>(null)
  const [menuId, setMenuId] = useState<string | null>(null)
  const [selectedTemplates, setSelectedTemplates] = useState<PageTemplate[]>([])
  const [websiteData, setWebsiteData] = useState<{ subdomain: string; pagesCount: number } | null>(null)
  const [isCreatingWebsite, setIsCreatingWebsite] = useState(false)
  const [creationProgress, setCreationProgress] = useState(0)
  const stepContentRef = useRef<HTMLDivElement>(null)
  const overlayRef = useRef<HTMLDivElement>(null)
  const createRestaurant = useCreateRestaurant()
  const createWebsiteFromTemplates = useCreateWebsiteFromTemplates()

  const handleBusinessSelect = (business: ResponseBusinessDetails) => {
    setSelectedBusiness(business)
    // Auto-advance to details step immediately
    setCurrentStep('details')
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
      setIsCreatingWebsite(true)
      setCreationProgress(0)

      // Simulate progress steps
      const progressSteps = ['Creating website...', 'Generating pages...', 'Finalizing...']
      let stepIndex = 0

      const progressInterval = setInterval(() => {
        stepIndex++
        setCreationProgress((stepIndex / progressSteps.length) * 100)
        if (stepIndex >= progressSteps.length) {
          clearInterval(progressInterval)
        }
      }, 500)

      // Generate clean subdomain from restaurant name
      const subdomain =
        businessDetails.name
          .toLowerCase()
          .replace(/\s+/g, '-')
          .replace(/[^a-z0-9-]/g, '') || 'restaurant'
      const result = await createWebsiteFromTemplates.mutateAsync({
        restaurantId,
        websiteName: `${businessDetails.name} Website`,
        subdomain,
        description: `Website for ${businessDetails.name}`,
        pageTemplates: templates.map(template => ({
          templateType: template,
        })),
        menuId: menuId || undefined,
      })

      clearInterval(progressInterval)
      setCreationProgress(100)

      // Store website data for celebration step
      if (result?.createdPages) {
        setWebsiteData({
          subdomain,
          pagesCount: result.createdPages.length,
        })
      }

      // Small delay to show 100% before transitioning
      setTimeout(() => {
        setIsCreatingWebsite(false)
        setCurrentStep('celebration')
      }, 300)
    } catch (error) {
      console.error('Failed to create website:', error)
      toast.error('Failed to create website')
      setIsCreatingWebsite(false)
    }
  }

  const handleSkipWebsite = () => {
    onComplete?.()
  }

  const handleViewWebsite = () => {
    if (websiteData) {
      window.open(`http://${websiteData.subdomain}.localhost:3003`, '_blank')
    }
  }

  const handleGoToDashboard = () => {
    router.push('/websites')
  }

  const handleBack = () => {
    if (currentStep === 'details') {
      setSelectedBusiness(null) // Clear selection so user can search again
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

  // GSAP step transitions with blur effect
  useEffect(() => {
    if (!stepContentRef.current) return

    const tl = gsap.timeline()

    tl.fromTo(
      stepContentRef.current,
      { opacity: 0, x: 30, filter: 'blur(10px)' },
      {
        opacity: 1,
        x: 0,
        filter: 'blur(0px)',
        duration: 0.5,
        ease: 'power2.out',
      }
    )
  }, [currentStep])

  // Pulse animation for active step
  useEffect(() => {
    const activeStepElement = document.querySelector('.active-step-indicator')
    if (!activeStepElement) return

    const pulseAnimation = gsap.to(activeStepElement, {
      scale: 1.05,
      duration: 0.8,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
    })

    return () => {
      pulseAnimation.kill()
    }
  }, [currentStep])

  // Checkmark animation when step completes
  useEffect(() => {
    const checkmarks = document.querySelectorAll('.checkmark-icon')
    if (checkmarks.length === 0) return

    // Animate the most recent checkmark
    const latestCheckmark = checkmarks[checkmarks.length - 1]
    gsap.fromTo(
      latestCheckmark,
      { scale: 0, rotation: -180, opacity: 0 },
      { scale: 1, rotation: 0, opacity: 1, duration: 0.5, ease: 'back.out(1.7)' }
    )
  }, [currentStep])

  // Loading overlay animation
  useEffect(() => {
    if (!overlayRef.current) return

    if (isCreatingWebsite) {
      gsap.fromTo(overlayRef.current, { opacity: 0 }, { opacity: 1, duration: 0.3, ease: 'power2.out' })

      const card = overlayRef.current.querySelector('.loading-card')
      if (card) {
        gsap.fromTo(card, { scale: 0.9, y: 20 }, { scale: 1, y: 0, duration: 0.4, ease: 'back.out(1.7)', delay: 0.1 })
      }
    }
  }, [isCreatingWebsite])

  // Calculate progress percentage
  const stepOrder: Step[] = ['search', 'details', 'hours', 'menu', 'website', 'celebration']
  const progressPercentage = (stepOrder.indexOf(currentStep) / (stepOrder.length - 1)) * 100

  // Get contextual header based on current step
  const getStepHeader = () => {
    switch (currentStep) {
      case 'search':
        return {
          title: "Welcome! Let's get your restaurant online",
          description:
            "We'll help you set up everything you need to start taking orders and building your online presence",
          icon: Sparkles,
        }
      case 'details':
        return {
          title: 'Business Details',
          description: 'Review and update your restaurant information',
          icon: Building2,
        }
      case 'hours':
        return {
          title: 'Opening Hours',
          description: "Set your restaurant's operating hours",
          icon: Clock,
        }
      case 'menu':
        return {
          title: 'Add Your Menu',
          description: 'Import your menu to get started',
          icon: null,
        }
      case 'website':
        return {
          title: 'Create Your Website',
          description: 'Choose what template you want!',
          icon: Globe,
        }
      case 'celebration':
        return {
          title: 'All Set!',
          description: 'Your restaurant is ready to go live',
          icon: PartyPopper,
        }
      default:
        return {
          title: 'Set up your restaurant',
          description: 'Follow the steps to get your restaurant set up on our platform',
          icon: Sparkles,
        }
    }
  }

  const stepHeader = getStepHeader()

  return (
    <div className="space-y-4">
      {/* Contextual Header */}
      <div className="text-center mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold mb-2 flex items-center justify-center gap-3">
          {!!stepHeader.icon && <stepHeader.icon className="w-6 h-6 sm:w-7 sm:h-7 text-primary" />}
          {/* <stepHeader.icon className="w-6 h-6 sm:w-7 sm:h-7 text-primary" /> */}
          {stepHeader.title}
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base">{stepHeader.description}</p>
      </div>

      {/* Progress Indicator - Hidden on mobile */}
      {!isMobile && (
        <div className="space-y-3">
          <div className="flex items-center justify-center gap-1 md:gap-2 overflow-x-auto">
            {[
              { step: 'search', label: 'Find', icon: Search },
              { step: 'details', label: 'Details', icon: CheckCircle },
              { step: 'hours', label: 'Hours', icon: CheckCircle },
              { step: 'menu', label: 'Menu', icon: Upload },
              { step: 'website', label: 'Website', icon: Globe },
              { step: 'celebration', label: 'Live!', icon: PartyPopper },
            ].map(({ step, label, icon: Icon }, index) => {
              const stepIndex = index + 1
              const isCurrentStep = currentStep === step
              const isCompleted =
                ['search', 'details', 'hours', 'menu', 'website', 'celebration'].indexOf(currentStep) > index
              const isActive = isCurrentStep || isCompleted

              return (
                <div key={step} className="flex items-center gap-1 md:gap-2 flex-shrink-0">
                  <div className="flex items-center gap-1 md:gap-2">
                    <div
                      className={`w-6 h-6 md:w-8 md:h-8 rounded-full flex items-center justify-center text-xs md:text-sm font-medium transition-all duration-300 ${
                        isCurrentStep
                          ? 'bg-primary text-primary-foreground active-step-indicator shadow-lg'
                          : isCompleted
                            ? 'bg-green-500 text-white'
                            : 'bg-muted text-muted-foreground'
                      }`}
                    >
                      {isCompleted ? <CheckCircle className="w-3 h-3 md:w-4 md:h-4 checkmark-icon" /> : stepIndex}
                    </div>
                    <span
                      className={`text-xs md:text-sm font-medium hidden sm:block transition-colors duration-200 ${
                        isCurrentStep ? 'text-foreground' : 'text-muted-foreground'
                      }`}
                    >
                      {label}
                    </span>
                  </div>
                  {index < 5 && <div className="w-6 md:w-12 h-0.5 bg-muted" />}
                </div>
              )
            })}
          </div>

          {/* Progress Bar */}
          <div className="w-full h-1 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-primary to-primary/80 transition-all duration-500 ease-out"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>
      )}

      {/* Step Content */}
      <div ref={stepContentRef}>
        {currentStep === 'search' && (
          <div className="max-w-4xl mx-auto">
            {/* <div className="text-center mb-6">
              <h2 className="text-2xl sm:text-3xl font-bold mb-3 flex items-center justify-center gap-3">
                <Search className="w-6 h-6 sm:w-7 sm:h-7 text-blue-600" />
                Is your restaurant on Google?
              </h2>
              <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
                Great news! If your restaurant is listed on Google, we can automatically pull in all your details to
                save you time. Just search for your restaurant name below.
              </p>
            </div> */}

            <Card className="border-0 shadow-lg">
              <CardContent className="p-6 sm:p-8">
                <SearchBusiness onBusinessSelect={handleBusinessSelect} selectedBusiness={selectedBusiness} />

                {!selectedBusiness && (
                  <div className="pt-4 border-t mt-4">
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground mb-3 flex items-center justify-center gap-2">
                        <Building2 className="w-4 h-4 text-orange-600" />
                        Don't see your restaurant? No problem at all!
                      </p>
                      <Button onClick={handleContinueToDetails} variant="outline" className="w-full max-w-sm">
                        Add your details manually
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
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
            hideInternalStepper={true}
          />
        )}

        {currentStep === 'website' && (
          <WebsiteTemplateStep
            onTemplatesSelected={handleTemplatesSelected}
            onSkip={handleSkipWebsite}
            selectedMenuId={menuId || undefined}
          />
        )}

        {currentStep === 'celebration' && websiteData && businessDetails && (
          <CelebrationStep
            websiteName={`${businessDetails.name} Website`}
            subdomain={websiteData.subdomain}
            pagesCreated={websiteData.pagesCount}
            onViewWebsite={handleViewWebsite}
            onGoToDashboard={handleGoToDashboard}
          />
        )}
      </div>

      {/* Navigation Buttons */}
      {currentStep !== 'search' &&
        currentStep !== 'menu' &&
        currentStep !== 'celebration' &&
        currentStep !== 'website' && (
          <div className="flex items-center justify-between pt-6">
            <Button onClick={handleBack} variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>

            {currentStep === 'details' && (
              <Button onClick={handleContinueToHours} disabled={!businessDetails}>
                Next: Opening Hours
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            )}

            {currentStep === 'hours' && (
              <Button onClick={handleContinueToMenu} disabled={!businessHours || createRestaurant.isPending}>
                {createRestaurant.isPending ? 'Setting up your place...' : 'Next: Add Your Menu'}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            )}
          </div>
        )}

      {createRestaurant.error && (
        <p className="text-red-600 text-sm text-center">Error: {createRestaurant.error.message}</p>
      )}

      {/* Website Creation Loading Overlay */}
      {isCreatingWebsite && (
        <div
          ref={overlayRef}
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center"
        >
          <Card className="loading-card w-full max-w-md mx-4">
            <CardContent className="pt-6">
              <div className="space-y-4 text-center">
                <div className="flex justify-center">
                  <Globe className="w-12 h-12 text-primary animate-pulse" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">Creating Your Website</h3>
                  <p className="text-sm text-muted-foreground">
                    {creationProgress < 33
                      ? 'Setting up your website...'
                      : creationProgress < 66
                        ? 'Generating pages...'
                        : 'Finalizing...'}
                  </p>
                </div>
                <div className="space-y-2">
                  <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-primary to-primary/80 transition-all duration-500 ease-out"
                      style={{ width: `${creationProgress}%` }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">{Math.round(creationProgress)}%</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
