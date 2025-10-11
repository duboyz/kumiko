'use client'

import { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Card, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { useOnboardingStore } from '@shared/stores/onboarding.store'
import { OnboardingStep } from '@shared/types/onboarding.types'
import BusinessSearch from '../BusinessSearch'
import BusinessConfirmation from '../BusinessConfirmation'
import MenuImportWrapper from '../MenuImportWrapper'
import WebsiteGeneration from '../WebsiteGeneration'
import { OnboardingErrorBoundary } from '../OnboardingErrorBoundary'

interface OnboardingWizardProps {
  step?: OnboardingStep
  onComplete?: () => void
}

export default function OnboardingWizard({ step, onComplete }: OnboardingWizardProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { currentStep, setCurrentStep, isCompleted } = useOnboardingStore()

  const activeStep = step || currentStep

  useEffect(() => {
    // Handle URL-based step navigation
    const stepParam = searchParams.get('step')
    if (stepParam && Object.values(OnboardingStep).includes(stepParam as OnboardingStep)) {
      setCurrentStep(stepParam as OnboardingStep)
    }
  }, [searchParams, setCurrentStep])

  const steps = [
    { key: OnboardingStep.Business, title: 'Find Restaurant', description: 'Search and select your restaurant' },
    { key: OnboardingStep.Confirmation, title: 'Confirm Details', description: 'Review restaurant information' },
    { key: OnboardingStep.Menu, title: 'Upload Menu', description: 'Add your menu with AI' },
    { key: OnboardingStep.Website, title: 'Generate Website', description: 'Create your online presence' },
  ]

  const currentStepIndex = steps.findIndex(s => s.key === activeStep)
  const progress = ((currentStepIndex + 1) / steps.length) * 100

  const handleStepComplete = () => {
    if (onComplete) {
      onComplete()
    }
  }

  const renderStep = () => {
    switch (activeStep) {
      case OnboardingStep.Business:
        return <BusinessSearch />
      case OnboardingStep.Confirmation:
        return <BusinessConfirmation />
      case OnboardingStep.Menu:
        return <MenuImportWrapper onComplete={handleStepComplete} />
      case OnboardingStep.Website:
        return <WebsiteGeneration onWebsiteGenerated={handleStepComplete} />
      default:
        return <BusinessSearch />
    }
  }

  if (isCompleted) {
    return (
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardContent className="p-8 text-center">
            <h1 className="text-2xl font-bold mb-4">Welcome to Kumiko!</h1>
            <p className="text-muted-foreground mb-6">
              Your restaurant is now set up and ready to go. You can start managing your menu and website from the
              dashboard.
            </p>
            <button
              onClick={() => router.push('/dashboard')}
              className="bg-primary text-primary-foreground px-6 py-2 rounded-md hover:bg-primary/90"
            >
              Go to Dashboard
            </button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <OnboardingErrorBoundary onReset={() => window.location.reload()}>
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Progress Header */}
        <div className="space-y-4">
          <div className="text-center">
            <h1 className="text-3xl font-bold">Get Started with Kumiko</h1>
            <p className="text-muted-foreground mt-2">
              Let's set up your restaurant's online presence in just a few steps
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              {steps.map((step, index) => (
                <div key={step.key} className="flex flex-col items-center space-y-2 flex-1">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                      index <= currentStepIndex
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    {index + 1}
                  </div>
                  <div className="text-center">
                    <p
                      className={`text-sm font-medium ${
                        index <= currentStepIndex ? 'text-foreground' : 'text-muted-foreground'
                      }`}
                    >
                      {step.title}
                    </p>
                    <p className="text-xs text-muted-foreground hidden sm:block">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <Progress value={progress} className="h-2" />
          </div>
        </div>

        {/* Step Content */}
        <Card>
          <CardContent className="p-8">{renderStep()}</CardContent>
        </Card>
      </div>
    </OnboardingErrorBoundary>
  )
}
