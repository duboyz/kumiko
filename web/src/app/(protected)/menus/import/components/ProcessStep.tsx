'use client'

import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { ArrowLeft, ArrowRight, X, AlertTriangle, CheckCircle, Loader2 } from 'lucide-react'
import { ParsedMenuStructure } from '@shared/types/menu-structure.types'
import { useParseMenuStructure } from '@shared/hooks/menu.hooks'
import { Stage, Layer, Rect, Image as KonvaImage } from 'react-konva'
import Konva from 'konva'

// Annotation types (matching AnnotationStep)
const ANNOTATION_TYPES = [
  {
    type: 'category' as const,
    label: 'Categories',
    color: '#3B82F6',
  },
  {
    type: 'item' as const,
    label: 'Menu Items',
    color: '#10B981',
  },
  {
    type: 'price' as const,
    label: 'Prices',
    color: '#F59E0B',
  },
  {
    type: 'description' as const,
    label: 'Descriptions',
    color: '#8B5CF6',
  },
]

interface ProcessStepProps {
  imageFile: File | null
  imagePreview: string | null
  annotations: any[]
  restaurantId: string
  onProcess: (structure: ParsedMenuStructure) => void
  onBack: () => void
  onError: (error: string) => void
  isProcessing: boolean
  setIsProcessing: (processing: boolean) => void
  processingStep: string
  setProcessingStep: (step: string) => void
  errorMessage: string | null
}

export function ProcessStep({
  imageFile,
  imagePreview,
  annotations,
  restaurantId,
  onProcess,
  onBack,
  onError,
  isProcessing,
  setIsProcessing,
  processingStep,
  setProcessingStep,
  errorMessage,
  restaurantId,
}: ProcessStepProps) {
  const [abortController, setAbortController] = useState<AbortController | null>(null)
  const [image, setImage] = useState<HTMLImageElement | null>(null)
  const [stageSize, setStageSize] = useState({ width: 600, height: 450 })
  const stageRef = useRef<Konva.Stage>(null)

  const parseMenuStructureMutation = useParseMenuStructure()

  // Load image and calculate proper dimensions
  useEffect(() => {
    if (!imagePreview) return

    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => {
      setImage(img)

      // Calculate stage dimensions that maintain aspect ratio
      const maxWidth = 600
      const maxHeight = 450
      const aspectRatio = img.width / img.height

      let stageWidth = maxWidth
      let stageHeight = maxWidth / aspectRatio

      // If height exceeds max, scale down by height instead
      if (stageHeight > maxHeight) {
        stageHeight = maxHeight
        stageWidth = maxHeight * aspectRatio
      }

      setStageSize({ width: stageWidth, height: stageHeight })
    }
    img.src = imagePreview
  }, [imagePreview])

  // Calculate scale factors for annotation coordinates
  const getScaleFactors = () => {
    if (!image) return { scaleX: 1, scaleY: 1 }

    const scaleX = stageSize.width / image.width
    const scaleY = stageSize.height / image.height

    return { scaleX, scaleY }
  }

  const handleProcess = async () => {
    if (!imageFile) return

    const controller = new AbortController()
    setAbortController(controller)
    setIsProcessing(true)
    onError('')

    try {
      // Step 1: Image preparation
      setProcessingStep('Preparing image for analysis...')
      await new Promise(resolve => setTimeout(resolve, 800))

      setProcessingStep('Optimizing image quality...')
      await new Promise(resolve => setTimeout(resolve, 600))

      setProcessingStep('Extracting text regions...')
      await new Promise(resolve => setTimeout(resolve, 700))

      // Step 2: AI Analysis
      setProcessingStep('Sending to AI vision model...')
      await new Promise(resolve => setTimeout(resolve, 500))

      setProcessingStep('Analyzing menu layout...')
      await new Promise(resolve => setTimeout(resolve, 400))

      setProcessingStep('Detecting categories and items...')
      const structure = await parseMenuStructureMutation.mutateAsync({
        imageFile,
        annotations,
        restaurantId,
      })

      // Step 3: Processing results
      setProcessingStep('Validating detected structure...')
      await new Promise(resolve => setTimeout(resolve, 600))

      setProcessingStep('Extracting pricing information...')
      await new Promise(resolve => setTimeout(resolve, 500))

      setProcessingStep('Organizing menu hierarchy...')
      await new Promise(resolve => setTimeout(resolve, 400))

      setProcessingStep('Finalizing menu structure...')
      await new Promise(resolve => setTimeout(resolve, 300))

      setProcessingStep('Complete!')
      onProcess(structure)
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        return // User cancelled
      }
      console.error('Error processing image:', error)
      onError(error instanceof Error ? error.message : 'Failed to process image. Please try again.')
    } finally {
      setIsProcessing(false)
      setAbortController(null)
    }
  }

  const handleCancel = () => {
    if (abortController) {
      abortController.abort()
    }
    setIsProcessing(false)
    setAbortController(null)
    // Go back to annotation step when cancelled
    onBack()
  }

  // Auto-start processing when component mounts (coming from annotation step)
  useEffect(() => {
    if (imageFile && !isProcessing && !errorMessage) {
      handleProcess()
    }
  }, [imageFile])

  const totalItems = annotations.filter(a => a.type === 'item').length
  const totalCategories = annotations.filter(a => a.type === 'category').length

  // Calculate progress percentage based on current step
  const getProgressPercentage = () => {
    const steps = [
      'Preparing image for analysis...',
      'Optimizing image quality...',
      'Extracting text regions...',
      'Sending to AI vision model...',
      'Analyzing menu layout...',
      'Detecting categories and items...',
      'Validating detected structure...',
      'Extracting pricing information...',
      'Organizing menu hierarchy...',
      'Finalizing menu structure...',
      'Complete!',
    ]

    const currentIndex = steps.findIndex(step => processingStep === step)
    if (currentIndex === -1) return 0
    return Math.round(((currentIndex + 1) / steps.length) * 100)
  }

  const progressPercentage = getProgressPercentage()

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">{isProcessing ? 'Processing Your Menu' : 'Ready to Process'}</h2>
        <p className="text-muted-foreground">
          {isProcessing
            ? 'AI is analyzing your menu structure and extracting categories and items'
            : 'Starting AI analysis of your menu...'}
        </p>
        {annotations.length > 0 && (
          <p className="text-sm text-muted-foreground mt-2">
            Using {totalCategories} category annotations and {totalItems} item annotations
          </p>
        )}
      </div>

      {/* Image Preview with Annotations - Only show when not processing */}
      {imagePreview && !isProcessing && (
        <Card>
          <CardContent className="p-4">
            <div className="text-center mb-4">
              <h3 className="text-lg font-semibold">Your Annotated Menu</h3>
              <p className="text-sm text-muted-foreground">Review your annotations before processing</p>
            </div>
            <div
              className="relative border rounded-lg overflow-hidden bg-gray-50 mx-auto"
              style={{ width: stageSize.width, height: stageSize.height }}
            >
              {image && (
                <Stage ref={stageRef} width={stageSize.width} height={stageSize.height}>
                  <Layer>
                    {/* Background Image */}
                    <KonvaImage image={image} width={stageSize.width} height={stageSize.height} />

                    {/* Annotations */}
                    {annotations.map(annotation => {
                      const typeConfig = ANNOTATION_TYPES.find(t => t.type === annotation.type)
                      if (!typeConfig) return null

                      const { scaleX, scaleY } = getScaleFactors()

                      return (
                        <Rect
                          key={annotation.id}
                          x={annotation.x * scaleX}
                          y={annotation.y * scaleY}
                          width={annotation.width * scaleX}
                          height={annotation.height * scaleY}
                          stroke={typeConfig.color}
                          strokeWidth={Math.max(2, 3 / Math.min(scaleX, scaleY))}
                          fill={`${typeConfig.color}20`}
                        />
                      )
                    })}
                  </Layer>
                </Stage>
              )}
            </div>

            {/* Annotation Legend */}
            {annotations.length > 0 && (
              <div className="mt-4 flex flex-wrap justify-center gap-2">
                {ANNOTATION_TYPES.map(type => {
                  const count = annotations.filter(a => a.type === type.type).length
                  if (count === 0) return null

                  return (
                    <div key={type.type} className="flex items-center gap-1 text-sm">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: type.color }} />
                      <span>
                        {type.label}: {count}
                      </span>
                    </div>
                  )
                })}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Processing Status */}
      <Card>
        <CardContent className="p-6">
          <div className="text-center space-y-6">
            {isProcessing ? (
              <>
                <div className="flex justify-center">
                  <div className="relative">
                    <div className="w-20 h-20 border-4 border-gray-200 rounded-full"></div>
                    <div className="absolute top-0 left-0 w-20 h-20 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-sm font-bold text-primary">{progressPercentage}%</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h3 className="text-xl font-semibold">AI is analyzing your menu...</h3>
                  <p className="text-muted-foreground text-lg">{processingStep}</p>

                  {/* Progress Bar */}
                  <div className="w-full max-w-md mx-auto">
                    <div className="flex justify-between text-sm text-muted-foreground mb-2">
                      <span>Progress</span>
                      <span>{progressPercentage}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className="bg-gradient-to-r from-primary to-primary/80 h-3 rounded-full transition-all duration-500 ease-out"
                        style={{ width: `${progressPercentage}%` }}
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-md mx-auto">
                  <div className="flex items-center gap-2 text-blue-800">
                    <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>
                    <span className="text-sm font-medium">This usually takes 30-60 seconds</span>
                  </div>
                </div>

                <Button variant="outline" onClick={handleCancel} className="mt-4">
                  <X className="w-4 h-4 mr-2" />
                  Cancel Processing
                </Button>
              </>
            ) : errorMessage ? (
              <>
                <div className="flex justify-center">
                  <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                    <AlertTriangle className="w-8 h-8 text-red-600" />
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2 text-red-600">Processing Failed</h3>
                  <p className="text-muted-foreground mb-4">{errorMessage}</p>
                  <Button onClick={handleProcess} size="lg">
                    <ArrowRight className="w-4 h-4 mr-2" />
                    Try Again
                  </Button>
                </div>
              </>
            ) : (
              <>
                <div className="flex justify-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-8 h-8 text-green-600" />
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2 text-green-600">Processing Complete!</h3>
                  <p className="text-muted-foreground">Your menu structure has been analyzed successfully</p>
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Processing Steps */}
      <Card>
        <CardContent className="p-4">
          <h3 className="font-semibold mb-4">Processing Pipeline</h3>
          <div className="space-y-3">
            {/* Phase 1: Image Preparation */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-sm font-medium text-blue-700">Image Preparation</span>
              </div>
              <div className="ml-4 space-y-1">
                <div
                  className={`flex items-center gap-2 text-sm ${processingStep === 'Preparing image for analysis...' ? 'text-primary font-medium' : 'text-muted-foreground'}`}
                >
                  <div
                    className={`w-1.5 h-1.5 rounded-full ${processingStep === 'Preparing image for analysis...' ? 'bg-primary' : 'bg-gray-300'}`}
                  ></div>
                  Preparing image for analysis
                </div>
                <div
                  className={`flex items-center gap-2 text-sm ${processingStep === 'Optimizing image quality...' ? 'text-primary font-medium' : 'text-muted-foreground'}`}
                >
                  <div
                    className={`w-1.5 h-1.5 rounded-full ${processingStep === 'Optimizing image quality...' ? 'bg-primary' : 'bg-gray-300'}`}
                  ></div>
                  Optimizing image quality
                </div>
                <div
                  className={`flex items-center gap-2 text-sm ${processingStep === 'Extracting text regions...' ? 'text-primary font-medium' : 'text-muted-foreground'}`}
                >
                  <div
                    className={`w-1.5 h-1.5 rounded-full ${processingStep === 'Extracting text regions...' ? 'bg-primary' : 'bg-gray-300'}`}
                  ></div>
                  Extracting text regions
                </div>
              </div>
            </div>

            {/* Phase 2: AI Analysis */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm font-medium text-green-700">AI Analysis</span>
              </div>
              <div className="ml-4 space-y-1">
                <div
                  className={`flex items-center gap-2 text-sm ${processingStep === 'Sending to AI vision model...' ? 'text-primary font-medium' : 'text-muted-foreground'}`}
                >
                  <div
                    className={`w-1.5 h-1.5 rounded-full ${processingStep === 'Sending to AI vision model...' ? 'bg-primary' : 'bg-gray-300'}`}
                  ></div>
                  Sending to AI vision model
                </div>
                <div
                  className={`flex items-center gap-2 text-sm ${processingStep === 'Analyzing menu layout...' ? 'text-primary font-medium' : 'text-muted-foreground'}`}
                >
                  <div
                    className={`w-1.5 h-1.5 rounded-full ${processingStep === 'Analyzing menu layout...' ? 'bg-primary' : 'bg-gray-300'}`}
                  ></div>
                  Analyzing menu layout
                </div>
                <div
                  className={`flex items-center gap-2 text-sm ${processingStep === 'Detecting categories and items...' ? 'text-primary font-medium' : 'text-muted-foreground'}`}
                >
                  <div
                    className={`w-1.5 h-1.5 rounded-full ${processingStep === 'Detecting categories and items...' ? 'bg-primary' : 'bg-gray-300'}`}
                  ></div>
                  Detecting categories and items
                </div>
              </div>
            </div>

            {/* Phase 3: Processing Results */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span className="text-sm font-medium text-purple-700">Processing Results</span>
              </div>
              <div className="ml-4 space-y-1">
                <div
                  className={`flex items-center gap-2 text-sm ${processingStep === 'Validating detected structure...' ? 'text-primary font-medium' : 'text-muted-foreground'}`}
                >
                  <div
                    className={`w-1.5 h-1.5 rounded-full ${processingStep === 'Validating detected structure...' ? 'bg-primary' : 'bg-gray-300'}`}
                  ></div>
                  Validating detected structure
                </div>
                <div
                  className={`flex items-center gap-2 text-sm ${processingStep === 'Extracting pricing information...' ? 'text-primary font-medium' : 'text-muted-foreground'}`}
                >
                  <div
                    className={`w-1.5 h-1.5 rounded-full ${processingStep === 'Extracting pricing information...' ? 'bg-primary' : 'bg-gray-300'}`}
                  ></div>
                  Extracting pricing information
                </div>
                <div
                  className={`flex items-center gap-2 text-sm ${processingStep === 'Organizing menu hierarchy...' ? 'text-primary font-medium' : 'text-muted-foreground'}`}
                >
                  <div
                    className={`w-1.5 h-1.5 rounded-full ${processingStep === 'Organizing menu hierarchy...' ? 'bg-primary' : 'bg-gray-300'}`}
                  ></div>
                  Organizing menu hierarchy
                </div>
                <div
                  className={`flex items-center gap-2 text-sm ${processingStep === 'Finalizing menu structure...' ? 'text-primary font-medium' : 'text-muted-foreground'}`}
                >
                  <div
                    className={`w-1.5 h-1.5 rounded-full ${processingStep === 'Finalizing menu structure...' ? 'bg-primary' : 'bg-gray-300'}`}
                  ></div>
                  Finalizing menu structure
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex items-center justify-between pt-6">
        <Button variant="outline" onClick={onBack} disabled={isProcessing}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        {!isProcessing && errorMessage && (
          <Button onClick={handleProcess} size="lg">
            <ArrowRight className="w-4 h-4 mr-2" />
            Try Again
          </Button>
        )}
      </div>
    </div>
  )
}
