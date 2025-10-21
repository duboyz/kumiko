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

      // Calculate container size with responsive considerations
      const calculateContainerSize = () => {
        const container = imageRef.current
        if (container) {
          // Get available width from container, with responsive max widths
          const availableWidth = container.offsetWidth || window.innerWidth
          const maxWidth = window.innerWidth < 768 ? availableWidth - 32 : Math.min(availableWidth, 1000) // 32px padding on mobile
          const aspectRatio = img.width / img.height
          const containerHeight = maxWidth / aspectRatio

          setContainerSize({ width: maxWidth, height: containerHeight })
        } else {
          // Fallback with responsive sizing
          const maxWidth = window.innerWidth < 768 ? window.innerWidth - 32 : Math.min(window.innerWidth * 0.9, 1000)
          const aspectRatio = img.width / img.height
          const containerHeight = maxWidth / aspectRatio
          setContainerSize({ width: maxWidth, height: containerHeight })
        }
      }

      // Calculate immediately and on resize
      calculateContainerSize()

      const handleResize = () => {
        calculateContainerSize()
      }

      window.addEventListener('resize', handleResize)

      return () => {
        window.removeEventListener('resize', handleResize)
      }
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
    <div className="space-y-4 sm:space-y-6">
      {/* Progress */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs sm:text-sm">
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
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-start gap-2 sm:gap-3">
              <div className="text-xl sm:text-2xl flex-shrink-0">
                {ANNOTATION_TYPES.find(t => t.type === nextStep.type)?.icon}
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="font-semibold text-primary text-sm sm:text-base">{nextStep.label}</h3>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">{nextStep.description}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Annotation Type Selector */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
        {ANNOTATION_TYPES.map(type => {
          const count = getAnnotationCount(type.type)
          const isSelected = selectedType === type.type

          return (
            <Button
              key={type.type}
              variant={isSelected ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedType(type.type)}
              className="flex items-center gap-2 h-auto p-2 sm:p-3 min-h-[60px] sm:min-h-[70px]"
            >
              <span className="text-base sm:text-lg">{type.icon}</span>
              <div className="text-left flex-1">
                <div className="font-medium text-xs sm:text-sm leading-tight">{type.label}</div>
                {count > 0 && (
                  <Badge variant="secondary" className="text-xs mt-1">
                    {count}
                  </Badge>
                )}
              </div>
            </Button>
          )
        })}
      </div>

      {/* Image with Pins */}
      <div className="relative w-full">
        <div
          ref={imageRef}
          className="relative cursor-crosshair border rounded-lg overflow-hidden bg-muted mx-auto"
          onClick={handleImageClick}
          style={{
            width: containerSize.width || '100%',
            height: containerSize.height || 'auto',
            minHeight: window.innerWidth < 768 ? '300px' : '400px',
            maxWidth: '100%',
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
                minHeight: window.innerWidth < 768 ? '300px' : '400px',
              }}
              onLoad={() => {
                // Recalculate container size when image loads with responsive considerations
                if (imageRef.current && image) {
                  const availableWidth = imageRef.current.offsetWidth || window.innerWidth
                  const maxWidth = window.innerWidth < 768 ? availableWidth - 32 : Math.min(availableWidth, 1000)
                  const aspectRatio = image.width / image.height
                  const containerHeight = maxWidth / aspectRatio
                  setContainerSize({ width: maxWidth, height: containerHeight })
                }
              }}
            />
          ) : (
            <div className="flex items-center justify-center h-full text-muted-foreground min-h-[300px] sm:min-h-[400px]">
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
                className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer touch-manipulation"
                style={{
                  left: position.x,
                  top: position.y,
                }}
                onClick={e => handlePinClick(annotation.id, e)}
              >
                <div
                  className="w-6 h-6 sm:w-7 sm:h-7 rounded-full border-2 border-white shadow-lg flex items-center justify-center text-white text-xs font-bold hover:scale-110 transition-transform"
                  style={{ backgroundColor: annotation.color }}
                >
                  <MapPin className="w-3 h-3 sm:w-4 sm:h-4" />
                </div>
                {isSelected && (
                  <Button
                    variant="destructive"
                    size="sm"
                    className="absolute -top-8 sm:-top-10 left-1/2 transform -translate-x-1/2 w-6 h-6 sm:w-7 sm:h-7 p-0 touch-manipulation"
                    onClick={() => handleDeleteAnnotation(annotation.id)}
                  >
                    <X className="w-3 h-3 sm:w-4 sm:h-4" />
                  </Button>
                )}
              </div>
            )
          })}
        </div>

        {/* Instructions */}
        <div className="mt-2 text-center text-xs sm:text-sm text-muted-foreground px-2">
          Tap on the image to place {selectedAnnotationType?.label.toLowerCase()} pins
        </div>
      </div>

      {/* Annotation Summary */}
      {annotations.length > 0 && (
        <Card>
          <CardContent className="p-3 sm:p-4">
            <h3 className="font-semibold mb-3 text-sm sm:text-base">Annotation Summary</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
              {ANNOTATION_TYPES.map(type => {
                const count = getAnnotationCount(type.type)
                return (
                  <div key={type.type} className="flex items-center gap-2 text-xs sm:text-sm">
                    <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: type.color }} />
                    <span className="truncate">
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
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-6">
        <Button variant="outline" onClick={onBack} className="flex items-center gap-2 order-2 sm:order-1">
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 order-1 sm:order-2">
          <Button variant="ghost" onClick={onSkip} className="text-sm">
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
