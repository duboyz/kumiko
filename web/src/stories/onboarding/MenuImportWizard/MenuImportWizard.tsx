'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft, ArrowRight, CheckCircle, Upload, Eye, Cog, FileText } from 'lucide-react'
import { MultiImageUploadStep, MenuImage } from '@/stories/menus/MenuImport/MultiImageUploadStep'
import { PinBasedAnnotationStep, PinAnnotation } from '@/stories/menus/MenuImport/PinBasedAnnotationStep'
import { ProcessStep } from '@/app/(protected)/menus/import/components/ProcessStep'
import { StructureReviewStep } from '@/app/(protected)/menus/import/components/StructureReviewStep'
import { useImportFlow } from '@/app/(protected)/menus/import/hooks/useImportFlow'
import { useCreateMenuStructure } from '@shared'
import { toast } from 'sonner'

interface MenuImportWizardProps {
  restaurantId: string
  onMenuCreated: (menuId: string) => void
  onSkip: () => void
  onBack: () => void
  hideInternalStepper?: boolean // Hide the internal stepper when used within parent onboarding flow
}

export enum ImportStep {
  UPLOAD = 'upload',
  PREVIEW = 'preview',
  PROCESS = 'process',
  REVIEW = 'review',
}

export type ImportStepType = ImportStep.UPLOAD | ImportStep.PREVIEW | ImportStep.PROCESS | ImportStep.REVIEW

const getStepNumber = (step: ImportStep): number => {
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

const getStepProgress = (step: ImportStep): number => {
  return (getStepNumber(step) / 4) * 100
}

export function MenuImportWizard({
  restaurantId,
  onMenuCreated,
  onSkip,
  onBack,
  hideInternalStepper = false,
}: MenuImportWizardProps) {
  const [currentStep, setCurrentStep] = useState<ImportStep>(ImportStep.UPLOAD)

  console.log('MenuImportWizard received restaurantId:', restaurantId)
  const [menuImages, setMenuImages] = useState<MenuImage[]>([])
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [allAnnotations, setAllAnnotations] = useState<PinAnnotation[]>([])

  const {
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
    annotations,
    setAnnotations,
    parsedStructure,
    setParsedStructure,
    editableStructure,
    setEditableStructure,
    resetImportFlow,
  } = useImportFlow()

  const createMenuStructure = useCreateMenuStructure()

  const handleImagesSelect = (images: MenuImage[]) => {
    setMenuImages(images)
    // Set the first image for processing
    if (images.length > 0) {
      setImageFile(images[0].file)
      setImagePreview(images[0].preview)
    }
    setCurrentStep(ImportStep.PREVIEW)
  }

  const handleAnnotate = (annotations: PinAnnotation[]) => {
    // Store annotations for current image
    const imageId = menuImages[currentImageIndex]?.id
    if (imageId) {
      const annotationsWithImageId = annotations.map(ann => ({ ...ann, imageId }))
      setAllAnnotations(prev => [...prev.filter(a => a.imageId !== imageId), ...annotationsWithImageId])
    }

    // Move to next image or proceed to processing
    if (currentImageIndex < menuImages.length - 1) {
      setCurrentImageIndex(prev => prev + 1)
      const nextImage = menuImages[currentImageIndex + 1]
      setImageFile(nextImage.file)
      setImagePreview(nextImage.preview)
    } else {
      setAnnotations(allAnnotations)
      setCurrentStep(ImportStep.PROCESS)
    }
  }

  // Get annotations for current image
  const getCurrentImageAnnotations = () => {
    const currentImageId = menuImages[currentImageIndex]?.id
    return allAnnotations.filter(ann => ann.imageId === currentImageId)
  }

  const handleProcess = async (structure: any) => {
    setParsedStructure(structure)
    setCurrentStep(ImportStep.REVIEW)
  }

  const handleCreateMenu = async () => {
    if (!parsedStructure) {
      toast.error('No menu structure to create')
      return
    }

    try {
      console.log('Creating menu structure with restaurantId:', restaurantId)
      const result = await createMenuStructure.mutateAsync({
        restaurantId,
        menuName: parsedStructure.suggestedMenuName,
        menuDescription: parsedStructure.suggestedMenuDescription,
        categories: parsedStructure.categories.map((category: any) => ({
          name: category.name,
          description: category.description,
          orderIndex: category.orderIndex,
          items: category.items.map((item: any) => ({
            name: item.name,
            description: item.description,
            price: item.price,
            orderIndex: item.orderIndex,
            isAvailable: true,
          })),
        })),
      })

      toast.success('Menu created successfully!')
      console.log('Menu created with ID:', result.menuId)
      onMenuCreated(result.menuId)
    } catch (error) {
      console.error('Failed to create menu:', error)
      toast.error('Failed to create menu')
    }
  }

  const handleBack = () => {
    if (currentStep === ImportStep.UPLOAD) {
      onBack()
    } else if (currentStep === ImportStep.PREVIEW) {
      setCurrentStep(ImportStep.UPLOAD)
    } else if (currentStep === ImportStep.PROCESS) {
      setCurrentStep(ImportStep.PREVIEW)
    } else if (currentStep === ImportStep.REVIEW) {
      setCurrentStep(ImportStep.PROCESS)
    }
  }

  const steps = [
    { step: ImportStep.UPLOAD, label: 'Upload', icon: Upload },
    { step: ImportStep.PREVIEW, label: 'Annotate', icon: Eye },
    { step: ImportStep.PROCESS, label: 'Process', icon: Cog },
    { step: ImportStep.REVIEW, label: 'Review', icon: FileText },
  ]

  return (
    <div className="space-y-6">
      {/* Progress Indicator - Conditionally shown */}
      {!hideInternalStepper ? (
        <div className="flex items-center justify-center gap-1 md:gap-2 overflow-x-auto pb-2">
          {steps.map(({ step, label, icon: Icon }, index) => {
            const stepIndex = index + 1
            const isCurrentStep = currentStep === step
            const isCompleted = getStepNumber(currentStep) > stepIndex

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
                {index < 3 && <div className="w-6 md:w-12 h-0.5 bg-muted" />}
              </div>
            )
          })}
        </div>
      ) : (
        /* Subtle progress dots when stepper is hidden */
        <div className="flex items-center justify-center gap-2 pb-2">
          {steps.map((step, index) => {
            const isCurrentStep = currentStep === step.step
            const isCompleted = getStepNumber(currentStep) > index + 1

            return (
              <div
                key={step.step}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  isCurrentStep ? 'w-8 bg-primary' : isCompleted ? 'w-6 bg-primary/60' : 'w-1.5 bg-muted'
                }`}
              />
            )
          })}
        </div>
      )}

      {/* Step Content */}
      {currentStep === ImportStep.UPLOAD && (
        <MultiImageUploadStep onImagesSelect={handleImagesSelect} onBack={handleBack} />
      )}

      {currentStep === ImportStep.PREVIEW && imageFile && imagePreview && (
        <div className="space-y-4">
          {menuImages.length > 1 && (
            <div className="text-center">
              <h3 className="text-lg font-semibold">
                Annotate Image {currentImageIndex + 1} of {menuImages.length}
              </h3>
              <p className="text-sm text-muted-foreground">{menuImages[currentImageIndex]?.name}</p>
            </div>
          )}
          <PinBasedAnnotationStep
            key={`annotation-${currentImageIndex}`}
            imagePreview={imagePreview}
            onAnnotate={handleAnnotate}
            onBack={handleBack}
            onSkip={() => setCurrentStep(ImportStep.PROCESS)}
            initialAnnotations={getCurrentImageAnnotations()}
          />
        </div>
      )}

      {currentStep === ImportStep.PROCESS && imageFile && imagePreview && (
        <ProcessStep
          imageFile={imageFile}
          imagePreview={imagePreview}
          annotations={annotations}
          restaurantId={restaurantId}
          onProcess={handleProcess}
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
        <div className="space-y-4">
          <StructureReviewStep
            parsedStructure={parsedStructure}
            onBack={handleBack}
            onConfirm={handleCreateMenu}
            restaurantId={restaurantId}
          />
        </div>
      )}

      {/* Navigation */}
      {currentStep === ImportStep.UPLOAD && (
        <div className="flex items-center justify-between pt-6">
          <Button onClick={onSkip} variant="outline">
            Skip for now
          </Button>
          <div className="text-sm text-muted-foreground">
            {menuImages.length > 0
              ? `Upload ${menuImages.length} image${menuImages.length !== 1 ? 's' : ''} to continue`
              : 'Upload menu images to continue'}
          </div>
        </div>
      )}

      {errorMessage && <p className="text-red-600 text-sm text-center">{errorMessage}</p>}
    </div>
  )
}
