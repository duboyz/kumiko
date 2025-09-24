'use client'

import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { ArrowLeft, ArrowRight, X, AlertTriangle, CheckCircle, Loader2 } from 'lucide-react'
import { parseMenuStructure } from '@shared/api/menu-structure.api'
import { ParsedMenuStructure } from '@shared/types/menu-structure.types'
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
  onProcess,
  onBack,
  onError,
  isProcessing,
  setIsProcessing,
  processingStep,
  setProcessingStep,
  errorMessage,
}: ProcessStepProps) {
  const [abortController, setAbortController] = useState<AbortController | null>(null)
  const [image, setImage] = useState<HTMLImageElement | null>(null)
  const [stageSize, setStageSize] = useState({ width: 600, height: 450 })
  const stageRef = useRef<Konva.Stage>(null)

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
      setProcessingStep('Preparing image...')
      await new Promise(resolve => setTimeout(resolve, 500))

      setProcessingStep('Sending to AI for structure analysis...')
      const structure = await parseMenuStructure(imageFile, annotations)

      setProcessingStep('Processing menu structure...')
      await new Promise(resolve => setTimeout(resolve, 1000))

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
          <div className="text-center space-y-4">
            {isProcessing ? (
              <>
                <div className="flex justify-center">
                  <div className="relative">
                    <div className="w-16 h-16 border-4 border-gray-200 rounded-full"></div>
                    <div className="absolute top-0 left-0 w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">Processing...</h3>
                  <p className="text-muted-foreground">{processingStep}</p>
                </div>
                <Button variant="outline" onClick={handleCancel} className="mt-4">
                  <X className="w-4 h-4 mr-2" />
                  Cancel
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
          <h3 className="font-semibold mb-3">Processing Steps</h3>
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                  processingStep === 'Preparing image...' || isProcessing
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-gray-200 text-gray-600'
                }`}
              >
                1
              </div>
              <span className={processingStep === 'Preparing image...' ? 'text-primary font-medium' : ''}>
                Preparing image
              </span>
            </div>
            <div className="flex items-center gap-3">
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                  processingStep.includes('Sending to AI') || processingStep.includes('AI is analyzing')
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-gray-200 text-gray-600'
                }`}
              >
                2
              </div>
              <span
                className={
                  processingStep.includes('Sending to AI') || processingStep.includes('AI is analyzing')
                    ? 'text-primary font-medium'
                    : ''
                }
              >
                AI structure analysis
              </span>
            </div>
            <div className="flex items-center gap-3">
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                  processingStep === 'Processing menu structure...' || processingStep === 'Complete!'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-gray-200 text-gray-600'
                }`}
              >
                3
              </div>
              <span
                className={
                  processingStep === 'Processing menu structure...' || processingStep === 'Complete!'
                    ? 'text-primary font-medium'
                    : ''
                }
              >
                Processing results
              </span>
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
