'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useLocationSelection } from '@shared'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { LoadingSpinner } from '@/components/LoadingSpinner'
import { ArrowLeft, AlertCircle } from 'lucide-react'
import { ProgressSidebar } from './ProgressSidebar'
import { UploadStep } from './UploadStep'
import { AnnotationStep } from './AnnotationStep'
import { ProcessStep } from './ProcessStep'
import { ReviewStep } from './ReviewStep'
import { CompleteStep } from './CompleteStep'
import { CategoryReviewStep } from './CategoryReviewStep'
import { ItemReviewStep } from './ItemReviewStep'
import { StructurePreviewStep } from './StructurePreviewStep'
import { StructureReviewStep } from './StructureReviewStep'
import { useImportFlow } from '../hooks/useImportFlow'

export type ImportStep = 'upload' | 'preview' | 'process' | 'review'

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
    parsedItems,
    setParsedItems,
    selectedCategoryId,
    setSelectedCategoryId,
    isProcessing,
    setIsProcessing,
    processingStep,
    setProcessingStep,
    errorMessage,
    setErrorMessage,
    showSuccess,
    setShowSuccess,
    annotations,
    setAnnotations,
    parsedStructure,
    setParsedStructure,
    editableStructure,
    setEditableStructure,
    resetImportFlow,
  } = useImportFlow()

  // Handle URL state
  useEffect(() => {
    const step = searchParams.get('step') as ImportStep
    if (step && ['upload', 'preview', 'process', 'review'].includes(step)) {
      setCurrentStep(step)
    }
  }, [searchParams, setCurrentStep])

  // Update URL when step changes
  const handleStepChange = (step: ImportStep) => {
    setCurrentStep(step)
    const url = new URL(window.location.href)
    url.searchParams.set('step', step)
    window.history.pushState({}, '', url.toString())
  }

  const handleBack = () => {
    if (currentStep === 'upload') {
      router.push('/menu-items')
    } else if (currentStep === 'preview') {
      handleStepChange('upload')
    } else if (currentStep === 'process') {
      handleStepChange('preview')
    } else if (currentStep === 'review') {
      handleStepChange('process')
    }
  }

  const handleComplete = () => {
    router.push('/menu-items')
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (hasNoLocations) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="text-center py-12">
            <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">No Restaurants Found</h2>
            <p className="text-muted-foreground mb-6">You need to add a restaurant before you can import menu items.</p>
            <Button asChild>
              <a href="/onboarding/restaurant">Add Restaurant</a>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!selectedLocation || selectedLocation.type !== 'Restaurant') {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="text-center py-12">
            <AlertCircle className="w-12 h-12 text-amber-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Restaurant Required</h2>
            <p className="text-muted-foreground mb-6">
              Menu item import is only available for restaurant locations. Please select a restaurant from the sidebar.
            </p>
            <Button onClick={() => router.push('/menu-items')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Menu Items
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push('/menu-items')}
                className="text-muted-foreground hover:text-foreground"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Menu Items
              </Button>
              <div className="h-6 w-px bg-border" />
              <div>
                <h1 className="text-lg font-semibold">Import Menu Items</h1>
                <p className="text-sm text-muted-foreground">{selectedLocation.name}</p>
              </div>
            </div>
            <Button variant="outline" onClick={resetImportFlow} className="text-muted-foreground">
              Start Over
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* Mobile Progress Indicator */}
        <div className="lg:hidden mb-6">
          <div className="bg-white rounded-lg border p-4">
            <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
              <span>
                Step{' '}
                {currentStep === 'upload'
                  ? '1'
                  : currentStep === 'preview'
                    ? '2'
                    : currentStep === 'process'
                      ? '3'
                      : '4'}{' '}
                of 4
              </span>
              <span>
                {Math.round(
                  ((currentStep === 'upload' ? 1 : currentStep === 'preview' ? 2 : currentStep === 'process' ? 3 : 4) /
                    4) *
                    100
                )}
                %
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-primary h-2 rounded-full transition-all duration-500"
                style={{
                  width: `${((currentStep === 'upload' ? 1 : currentStep === 'preview' ? 2 : currentStep === 'process' ? 3 : 4) / 4) * 100}%`,
                }}
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 lg:gap-8">
          {/* Sidebar - Hidden on mobile, shown on desktop */}
          <div className="hidden lg:block lg:col-span-1">
            <ProgressSidebar currentStep={currentStep} onStepClick={handleStepChange} />
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <Card>
              <CardContent className="p-4 sm:p-6">
                {currentStep === 'upload' && (
                  <UploadStep
                    onImageSelect={(file, preview) => {
                      setImageFile(file)
                      setImagePreview(preview)
                      handleStepChange('preview')
                    }}
                    onBack={handleBack}
                  />
                )}

                {currentStep === 'preview' && (
                  <AnnotationStep
                    imagePreview={imagePreview!}
                    onAnnotate={newAnnotations => {
                      setAnnotations(newAnnotations)
                      handleStepChange('process')
                    }}
                    onBack={handleBack}
                    onSkip={() => handleStepChange('process')}
                  />
                )}

                {currentStep === 'process' && (
                  <ProcessStep
                    imageFile={imageFile}
                    imagePreview={imagePreview}
                    annotations={annotations}
                    onProcess={structure => {
                      setParsedStructure(structure)
                      handleStepChange('review')
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

                {currentStep === 'review' && parsedStructure && (
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
      </div>
    </div>
  )
}
