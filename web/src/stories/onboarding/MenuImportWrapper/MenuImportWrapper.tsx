'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useLocationSelection } from '@shared'
import { Card, CardContent } from '@/components/ui/card'
import { LoadingSpinner } from '@/components'
import { UploadStep } from '@/stories/menus/MenuImport/UploadStep/UploadStep'
import { AnnotationStep } from '@/stories/menus/MenuImport/AnnotationStep/AnnotationStep'
import { ProcessStep } from '@/app/(protected)/menus/import/components/ProcessStep'
import { useImportFlow } from '@/app/(protected)/menus/import/hooks/useImportFlow'
import { StructureReviewStep } from '@/app/(protected)/menus/import/components/StructureReviewStep'
import { NoLocation } from '@/stories/restaurants/NoLocation/NoLocation'
import { RestaurantRequired } from '@/stories/restaurants/RestaurantRequired/RestaurantRequired'
import { ProgressBar } from '@/app/(protected)/menus/import/components/ProgressBar'
import { useOnboardingStore } from '@shared/stores/onboarding.store'
import { ImportStep } from '@/app/(protected)/menus/import/components/ImportWizard'

interface MenuImportWrapperProps {
  onComplete?: () => void
  onBack?: () => void
}

export default function MenuImportWrapper({ onComplete, onBack }: MenuImportWrapperProps) {
  const router = useRouter()
  const { selectedLocation, isLoading, hasNoLocations } = useLocationSelection()
  const { nextStep, setMenuData } = useOnboardingStore()

  const {
    currentStep,
    setCurrentStep,
    imageFile,
    setImageFile,
    imagePreview,
    setImagePreview,
    isProcessing,
    setIsProcessing,
    processingStep,
    setProcessingStep,
    errorMessage,
    setErrorMessage,
    setShowSuccess,
    annotations,
    setAnnotations,
    parsedStructure,
    setParsedStructure,
    resetImportFlow,
  } = useImportFlow()

  // Handle URL state
  useEffect(() => {
    const step = new URLSearchParams(window.location.search).get('step') as any
    if (step && Object.values(ImportStep).includes(step as ImportStep)) {
      // Only change step if we have the required data for that step
      if (step === ImportStep.PREVIEW && (!imageFile || !imagePreview)) {
        setCurrentStep(ImportStep.UPLOAD)
      } else if (step === ImportStep.PROCESS && (!imageFile || !imagePreview)) {
        setCurrentStep(ImportStep.UPLOAD)
      } else if (step === ImportStep.REVIEW && !parsedStructure) {
        setCurrentStep(ImportStep.UPLOAD)
      } else {
        setCurrentStep(step)
      }
    }
  }, [setCurrentStep, imageFile, imagePreview, parsedStructure])

  // Update URL when step changes
  const handleStepChange = (step: any) => {
    setCurrentStep(step)
    const url = new URL(window.location.href)
    url.searchParams.set('step', step)
    window.history.pushState({}, '', url.toString())
  }

  const handleBack = () => {
    if (currentStep === ImportStep.UPLOAD) {
      if (onBack) {
        onBack()
      } else {
        const { previousStep } = useOnboardingStore.getState()
        previousStep()
      }
    } else if (currentStep === ImportStep.PREVIEW) {
      handleStepChange(ImportStep.UPLOAD)
    } else if (currentStep === ImportStep.PROCESS) {
      handleStepChange(ImportStep.PREVIEW)
    } else if (currentStep === ImportStep.REVIEW) {
      handleStepChange(ImportStep.PROCESS)
    }
  }

  // Custom completion handler for onboarding
  const handleComplete = () => {
    console.log('Menu import completed, parsed structure:', parsedStructure)

    // Store the menu data in onboarding store
    if (parsedStructure) {
      setMenuData(parsedStructure)
    }

    // Call the completion callback or move to next step
    if (onComplete) {
      onComplete()
    } else {
      nextStep()
    }
  }

  // Handle errors from the import flow
  const handleImportError = (error: string) => {
    console.error('Menu import error:', error)
    setErrorMessage(error)
  }

  if (isLoading) return <LoadingSpinner size="lg" />
  if (hasNoLocations) return <NoLocation />
  if (!selectedLocation || selectedLocation.type !== 'Restaurant') return <RestaurantRequired />

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold">Upload Your Menu</h1>
        <p className="text-muted-foreground">
          Upload a photo of your menu and we'll automatically extract all the items for you
        </p>
      </div>

      <ProgressBar currentStep={currentStep} onStepClick={handleStepChange} />

      <Card>
        <CardContent className="p-4 sm:p-6">
          {currentStep === ImportStep.UPLOAD && (
            <UploadStep
              onImageSelect={(file, preview) => {
                setImageFile(file)
                setImagePreview(preview)
                handleStepChange(ImportStep.PREVIEW)
              }}
              onBack={handleBack}
            />
          )}

          {currentStep === ImportStep.PREVIEW && (
            <AnnotationStep
              imagePreview={imagePreview!}
              onAnnotate={newAnnotations => {
                setAnnotations(newAnnotations)
                handleStepChange(ImportStep.PROCESS)
              }}
              onBack={handleBack}
              onSkip={() => handleStepChange(ImportStep.PROCESS)}
            />
          )}

          {currentStep === ImportStep.PROCESS && (
            <ProcessStep
              imageFile={imageFile}
              imagePreview={imagePreview}
              annotations={annotations}
              restaurantId={selectedLocation.id}
              onProcess={structure => {
                setParsedStructure(structure)
                handleStepChange(ImportStep.REVIEW)
              }}
              onBack={handleBack}
              onError={handleImportError}
              isProcessing={isProcessing}
              setIsProcessing={setIsProcessing}
              processingStep={processingStep}
              setProcessingStep={setProcessingStep}
              errorMessage={errorMessage}
            />
          )}

          {currentStep === ImportStep.REVIEW && parsedStructure && (
            <StructureReviewStep
              parsedStructure={parsedStructure}
              onConfirm={handleComplete} // Use our custom completion handler
              onBack={handleBack}
              restaurantId={selectedLocation.id}
            />
          )}
        </CardContent>
      </Card>
    </div>
  )
}
