'use client'

import { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useLocationSelection } from '@shared'
import { Card, CardContent } from '@/components/ui/card'
import { LoadingSpinner } from '@/components'
import { UploadStep } from '@/stories/menus/MenuImport/UploadStep/UploadStep'
import { AnnotationStep } from '@/stories/menus/MenuImport/AnnotationStep/AnnotationStep'
import { ProcessStep } from './ProcessStep'
import { useImportFlow } from '../hooks/useImportFlow'
import { StructureReviewStep } from './StructureReviewStep'
import { NoLocation } from '@/stories/restaurants/NoLocation/NoLocation'
import { RestaurantRequired } from '@/stories/restaurants/RestaurantRequired/RestaurantRequired'
import { ProgressBar } from './ProgressBar'

export enum ImportStep {
  UPLOAD = 'upload',
  PREVIEW = 'preview',
  PROCESS = 'process',
  REVIEW = 'review',
}

export type ImportStepType = ImportStep.UPLOAD | ImportStep.PREVIEW | ImportStep.PROCESS | ImportStep.REVIEW

// Helper functions for step management
const getStepNumber = (step: ImportStepType): number => {
  switch (step) {
    case ImportStep.UPLOAD:
      return 1
    case ImportStep.PREVIEW:
      return 2
    case ImportStep.PROCESS:
      return 3
    case ImportStep.REVIEW:
      return 4
    default:
      return 1
  }
}

const getStepProgress = (step: ImportStepType): number => {
  return (getStepNumber(step) / 4) * 100
}

export function ImportWizard() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { selectedLocation, isLoading, hasNoLocations } = useLocationSelection()

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
    const step = searchParams.get('step') as ImportStepType
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
  }, [searchParams, setCurrentStep, imageFile, imagePreview, parsedStructure])

  // Update URL when step changes
  const handleStepChange = (step: ImportStepType) => {
    setCurrentStep(step)
    const url = new URL(window.location.href)
    url.searchParams.set('step', step)
    window.history.pushState({}, '', url.toString())
  }

  const handleBack = () => {
    if (currentStep === ImportStep.UPLOAD) {
      router.push('/menu-items')
    } else if (currentStep === ImportStep.PREVIEW) {
      handleStepChange(ImportStep.UPLOAD)
    } else if (currentStep === ImportStep.PROCESS) {
      handleStepChange(ImportStep.PREVIEW)
    } else if (currentStep === ImportStep.REVIEW) {
      handleStepChange(ImportStep.PROCESS)
    }
  }

  const handleComplete = () => router.push('/menu-items')
  if (isLoading) return <LoadingSpinner size="lg" />
  if (hasNoLocations) <NoLocation />
  if (!selectedLocation || selectedLocation.type !== 'Restaurant') return <RestaurantRequired />

  return (
    <>
      {/* Mobile Progress Indicator */}
      <div className="lg:hidden mb-6">
        <div className="bg-white rounded-lg border p-4">
          <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
            <span>Step {getStepNumber(currentStep)} of 4</span>
            <span>{Math.round(getStepProgress(currentStep))}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-primary h-2 rounded-full transition-all duration-500"
              style={{
                width: `${getStepProgress(currentStep)}%`,
              }}
            />
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        {/* Sidebar - Hidden on mobile, shown on desktop */}
        {/* <div className="hidden lg:block lg:col-span-1">
          <ProgressSidebar currentStep={currentStep} onStepClick={handleStepChange} />
        </div> */}

        <ProgressBar currentStep={currentStep} onStepClick={handleStepChange} />

        {/* Main Content */}
        <div className="lg:col-span-3">
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
                  onError={setErrorMessage}
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
                  onConfirm={() => {
                    setShowSuccess(true)
                    handleComplete()
                  }}
                  onBack={handleBack}
                  restaurantId={selectedLocation.id}
                />
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  )
}
