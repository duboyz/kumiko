'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, ArrowRight, Undo, X, MapPin } from 'lucide-react'

export interface PinAnnotation {
  id: string
  type: 'category' | 'item' | 'price' | 'description'
  color: string
  x: number
  y: number
  label?: string
  isSelected?: boolean
  imageId?: string
}

interface PinBasedAnnotationStepProps {
  imagePreview: string
  onAnnotate: (annotations: PinAnnotation[]) => void
  onBack: () => void
  onSkip: () => void
  initialAnnotations?: PinAnnotation[]
}

const ANNOTATION_TYPES = [
  {
    type: 'category' as const,
    label: 'Categories',
    color: '#3B82F6',
    description: 'Menu sections (Appetizers, Main Courses, etc.)',
    icon: '📋',
  },
  {
    type: 'item' as const,
    label: 'Menu Items',
    color: '#10B981',
    description: 'Individual dishes and food items',
    icon: '🍽️',
  },
  {
    type: 'price' as const,
    label: 'Prices',
    color: '#F59E0B',
    description: 'Price text and numbers',
    icon: '💰',
  },
  {
    type: 'description' as const,
    label: 'Descriptions',
    color: '#8B5CF6',
    description: 'Item descriptions and details',
    icon: '📝',
  },
]

export function PinBasedAnnotationStep({
  imagePreview,
  onAnnotate,
  onBack,
  onSkip,
  initialAnnotations = [],
}: PinBasedAnnotationStepProps) {
  const [annotations, setAnnotations] = useState<PinAnnotation[]>(initialAnnotations)
  const [selectedType, setSelectedType] = useState<PinAnnotation['type']>('category')
  const [image, setImage] = useState<HTMLImageElement | null>(null)
  const [selectedAnnotationId, setSelectedAnnotationId] = useState<string | null>(null)
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 })
  const [containerSize, setContainerSize] = useState({ width: 800, height: 600 }) // Start with default size
  const imageRef = useRef<HTMLDivElement>(null)

  const selectedAnnotationType = ANNOTATION_TYPES.find(t => t.type === selectedType)

  // Update annotations when initialAnnotations change (new image)
  useEffect(() => {
    setAnnotations(initialAnnotations)
  }, [initialAnnotations])

  // Load image and calculate dimensions
  useEffect(() => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => {
      setImage(img)
      setImageSize({ width: img.width, height: img.height })

      // Calculate container size with a small delay to ensure DOM is ready
      setTimeout(() => {
        const container = imageRef.current
        if (container) {
          const containerWidth = Math.min(container.offsetWidth || 800, 800)
          const aspectRatio = img.width / img.height
          const containerHeight = containerWidth / aspectRatio

          setContainerSize({ width: containerWidth, height: containerHeight })
        } else {
          // Fallback if container is not ready
          const containerWidth = 800
          const aspectRatio = img.width / img.height
          const containerHeight = containerWidth / aspectRatio
          setContainerSize({ width: containerWidth, height: containerHeight })
        }
      }, 100)
    }
    img.onerror = () => {
      console.error('Failed to load image:', imagePreview)
    }
    img.src = imagePreview
  }, [imagePreview])

  // Handle image click to add pin
  const handleImageClick = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      if (!imageRef.current || !image) return

      const rect = imageRef.current.getBoundingClientRect()
      const x = event.clientX - rect.left
      const y = event.clientY - rect.top

      // Convert click position to image coordinates
      const imageX = (x / containerSize.width) * imageSize.width
      const imageY = (y / containerSize.height) * imageSize.height

      const newAnnotation: PinAnnotation = {
        id: Math.random().toString(36).substr(2, 9),
        type: selectedType,
        color: selectedAnnotationType?.color || '#3B82F6',
        x: imageX,
        y: imageY,
        isSelected: false,
      }

      setAnnotations(prev => [...prev, newAnnotation])
    },
    [selectedType, selectedAnnotationType, containerSize, imageSize, image]
  )

  // Handle pin click to select/delete
  const handlePinClick = (annotationId: string, event: React.MouseEvent) => {
    event.stopPropagation()
    setSelectedAnnotationId(annotationId)
  }

  // Delete selected annotation
  const handleDeleteAnnotation = (annotationId: string) => {
    setAnnotations(prev => prev.filter(a => a.id !== annotationId))
    setSelectedAnnotationId(null)
  }

  // Convert image coordinates to display coordinates
  const getDisplayPosition = (annotation: PinAnnotation) => {
    const x = (annotation.x / imageSize.width) * containerSize.width
    const y = (annotation.y / imageSize.height) * containerSize.height
    return { x, y }
  }

  // Helper functions for step-by-step guidance
  const getAnnotationCount = (type: PinAnnotation['type']) => {
    return annotations.filter(a => a.type === type).length
  }

  const getNextStep = () => {
    const steps = [
      {
        type: 'category' as const,
        label: 'Mark Categories',
        description: 'Click on menu sections like "Appetizers", "Main Courses", etc.',
      },
      {
        type: 'item' as const,
        label: 'Mark Menu Items',
        description: 'Click on individual dishes and food items',
      },
      {
        type: 'price' as const,
        label: 'Mark Prices',
        description: 'Click on price text and numbers',
      },
      {
        type: 'description' as const,
        label: 'Mark Descriptions',
        description: 'Click on item descriptions and details',
      },
    ]

    for (const step of steps) {
      if (getAnnotationCount(step.type) === 0) {
        return step
      }
    }
    return null // All steps completed
  }

  const getProgressPercentage = () => {
    const totalSteps = ANNOTATION_TYPES.length
    const completedSteps = ANNOTATION_TYPES.filter(type => getAnnotationCount(type.type) > 0).length
    return (completedSteps / totalSteps) * 100
  }

  const nextStep = getNextStep()
  const progressPercentage = getProgressPercentage()

  // Auto-advance to next step when current step is completed
  useEffect(() => {
    if (nextStep && selectedType !== nextStep.type) {
      setSelectedType(nextStep.type)
    }
  }, [nextStep, selectedType])

  const handleContinue = () => {
    onAnnotate(annotations)
  }

  return (
    <div className="space-y-6">
      {/* Progress */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium">Annotation Progress</span>
          <span className="text-muted-foreground">{Math.round(progressPercentage)}% complete</span>
        </div>
        <div className="w-full bg-muted rounded-full h-2">
          <div
            className="bg-primary h-2 rounded-full transition-all duration-300"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>

      {/* Current Step Guidance */}
      {nextStep && (
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <div className="text-2xl">{ANNOTATION_TYPES.find(t => t.type === nextStep.type)?.icon}</div>
              <div>
                <h3 className="font-semibold text-primary">{nextStep.label}</h3>
                <p className="text-sm text-muted-foreground">{nextStep.description}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Annotation Type Selector */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        {ANNOTATION_TYPES.map(type => {
          const count = getAnnotationCount(type.type)
          const isSelected = selectedType === type.type

          return (
            <Button
              key={type.type}
              variant={isSelected ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedType(type.type)}
              className="flex items-center gap-2 h-auto p-3"
            >
              <span className="text-lg">{type.icon}</span>
              <div className="text-left">
                <div className="font-medium text-xs">{type.label}</div>
                {count > 0 && (
                  <Badge variant="secondary" className="text-xs">
                    {count}
                  </Badge>
                )}
              </div>
            </Button>
          )
        })}
      </div>

      {/* Image with Pins */}
      <div className="relative">
        <div
          ref={imageRef}
          className="relative cursor-crosshair border rounded-lg overflow-hidden bg-muted"
          onClick={handleImageClick}
          style={{
            width: containerSize.width || '100%',
            height: containerSize.height || 'auto',
            minHeight: '400px',
          }}
        >
          {imagePreview ? (
            <img
              src={imagePreview}
              alt="Menu to annotate"
              className="w-full h-full object-contain"
              style={{
                width: containerSize.width || '100%',
                height: containerSize.height || 'auto',
                minHeight: '400px',
              }}
              onLoad={() => {
                // Recalculate container size when image loads
                if (imageRef.current && image) {
                  const containerWidth = Math.min(imageRef.current.offsetWidth || 800, 800)
                  const aspectRatio = image.width / image.height
                  const containerHeight = containerWidth / aspectRatio
                  setContainerSize({ width: containerWidth, height: containerHeight })
                }
              }}
            />
          ) : (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              <div className="text-center">
                <div className="text-lg mb-2">📷</div>
                <div>Loading image...</div>
              </div>
            </div>
          )}

          {/* Render pins */}
          {annotations.map(annotation => {
            const position = getDisplayPosition(annotation)
            const isSelected = selectedAnnotationId === annotation.id

            return (
              <div
                key={annotation.id}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer"
                style={{
                  left: position.x,
                  top: position.y,
                }}
                onClick={e => handlePinClick(annotation.id, e)}
              >
                <div
                  className="w-6 h-6 rounded-full border-2 border-white shadow-lg flex items-center justify-center text-white text-xs font-bold"
                  style={{ backgroundColor: annotation.color }}
                >
                  <MapPin className="w-3 h-3" />
                </div>
                {isSelected && (
                  <Button
                    variant="destructive"
                    size="sm"
                    className="absolute -top-8 left-1/2 transform -translate-x-1/2 w-6 h-6 p-0"
                    onClick={() => handleDeleteAnnotation(annotation.id)}
                  >
                    <X className="w-3 h-3" />
                  </Button>
                )}
              </div>
            )
          })}
        </div>

        {/* Instructions */}
        <div className="mt-2 text-center text-sm text-muted-foreground">
          Click on the image to place {selectedAnnotationType?.label.toLowerCase()} pins
        </div>
      </div>

      {/* Annotation Summary */}
      {annotations.length > 0 && (
        <Card>
          <CardContent className="p-4">
            <h3 className="font-semibold mb-3">Annotation Summary</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {ANNOTATION_TYPES.map(type => {
                const count = getAnnotationCount(type.type)
                return (
                  <div key={type.type} className="flex items-center gap-2 text-sm">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: type.color }} />
                    <span>
                      {type.label}: {count}
                    </span>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Navigation */}
      <div className="flex items-center justify-between pt-6">
        <Button variant="outline" onClick={onBack} className="flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>

        <div className="flex items-center gap-2">
          <Button variant="ghost" onClick={onSkip}>
            Skip annotation
          </Button>
          <Button onClick={handleContinue} disabled={annotations.length === 0} className="flex items-center gap-2">
            Continue
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
