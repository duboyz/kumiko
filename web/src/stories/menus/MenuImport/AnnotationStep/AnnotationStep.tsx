'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, ArrowRight, Undo, X, Plus, Minus } from 'lucide-react'
import { Stage, Layer, Rect, Image as KonvaImage } from 'react-konva'
import Konva from 'konva'

export interface Annotation {
  id: string
  type: 'category' | 'item' | 'price' | 'description'
  color: string
  x: number
  y: number
  width: number
  height: number
  points?: number[]
  isSelected?: boolean
}

interface AnnotationStepProps {
  imagePreview: string
  onAnnotate: (annotations: Annotation[]) => void
  onBack: () => void
  onSkip: () => void
}

const ANNOTATION_TYPES = [
  {
    type: 'category' as const,
    label: 'Categories',
    color: '#3B82F6',
    description: 'Menu sections (Appetizers, Main Courses, etc.)',
  },
  {
    type: 'item' as const,
    label: 'Menu Items',
    color: '#10B981',
    description: 'Individual dishes and food items',
  },
  {
    type: 'price' as const,
    label: 'Prices',
    color: '#F59E0B',
    description: 'Price text and numbers',
  },
  {
    type: 'description' as const,
    label: 'Descriptions',
    color: '#8B5CF6',
    description: 'Item descriptions and details',
  },
]

export function AnnotationStep({ imagePreview, onAnnotate, onBack, onSkip }: AnnotationStepProps) {
  const [annotations, setAnnotations] = useState<Annotation[]>([])
  const [selectedType, setSelectedType] = useState<Annotation['type']>('category')
  const [isDrawing, setIsDrawing] = useState(false)
  const [startPos, setStartPos] = useState({ x: 0, y: 0 })
  const [currentRect, setCurrentRect] = useState<{
    x: number
    y: number
    width: number
    height: number
  } | null>(null)
  const [zoom, setZoom] = useState(1)
  const [stagePos, setStagePos] = useState({ x: 0, y: 0 })
  const [history, setHistory] = useState<Annotation[][]>([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const [image, setImage] = useState<HTMLImageElement | null>(null)
  const [selectedAnnotationId, setSelectedAnnotationId] = useState<string | null>(null)
  const [stageSize, setStageSize] = useState({ width: 800, height: 600 })
  const stageRef = useRef<Konva.Stage>(null)

  const selectedAnnotationType = ANNOTATION_TYPES.find(t => t.type === selectedType)

  // Helper functions for step-by-step guidance
  const getAnnotationCount = (type: Annotation['type']) => {
    return annotations.filter(a => a.type === type).length
  }

  const getNextStep = () => {
    const steps = [
      {
        type: 'category' as const,
        label: 'Mark Categories',
        description: 'Draw rectangles around menu sections like "Appetizers", "Main Courses", etc.',
      },
      {
        type: 'item' as const,
        label: 'Mark Menu Items',
        description: 'Draw rectangles around individual dishes and food items',
      },
      { type: 'price' as const, label: 'Mark Prices', description: 'Draw rectangles around price text and numbers' },
      {
        type: 'description' as const,
        label: 'Mark Descriptions',
        description: 'Draw rectangles around item descriptions and details',
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

  // Load image and calculate proper dimensions
  useEffect(() => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => {
      setImage(img)

      // Calculate stage dimensions to use full width available
      const containerWidth = Math.min(window.innerWidth * 0.85, 1200) // 85% of viewport or max 1200px
      const aspectRatio = img.width / img.height

      const stageWidth = containerWidth
      const stageHeight = stageWidth / aspectRatio

      setStageSize({ width: stageWidth, height: stageHeight })
    }
    img.src = imagePreview
  }, [imagePreview])

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Delete' || e.key === 'Backspace') {
        if (selectedAnnotationId) {
          setAnnotations(annotations.filter(a => a.id !== selectedAnnotationId))
          setSelectedAnnotationId(null)
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [selectedAnnotationId, annotations])

  const saveToHistory = useCallback(() => {
    const newHistory = history.slice(0, historyIndex + 1)
    newHistory.push([...annotations])
    setHistory(newHistory)
    setHistoryIndex(newHistory.length - 1)
  }, [annotations, history, historyIndex])

  const undo = useCallback(() => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1)
      setAnnotations([...history[historyIndex - 1]])
    }
  }, [historyIndex, history])

  const handleMouseDown = (e: Konva.KonvaEventObject<MouseEvent>) => {
    if (!image) return

    const stage = e.target.getStage()
    if (!stage) return

    // Check if Shift key is held for panning
    if (e.evt.shiftKey) {
      stage.draggable(true)
      return
    }

    // Disable stage dragging when drawing
    stage.draggable(false)

    // Get position relative to the image, not the stage
    const pos = stage.getPointerPosition()
    if (!pos) return

    // Convert stage coordinates to image coordinates (accounting for zoom scaling)
    const imagePos = {
      x: pos.x / zoom,
      y: pos.y / zoom,
    }

    // Always use rectangle tool for simplicity
    setIsDrawing(true)
    setStartPos(imagePos)
    setCurrentRect({ x: imagePos.x, y: imagePos.y, width: 0, height: 0 })
  }

  const handleMouseMove = (e: Konva.KonvaEventObject<MouseEvent>) => {
    if (!isDrawing || !image) return

    const stage = e.target.getStage()
    if (!stage) return

    const pos = stage.getPointerPosition()
    if (!pos) return

    // Convert stage coordinates to image coordinates (accounting for zoom scaling)
    const imagePos = {
      x: pos.x / zoom,
      y: pos.y / zoom,
    }

    // Always use rectangle tool for simplicity
    const width = imagePos.x - startPos.x
    const height = imagePos.y - startPos.y
    setCurrentRect({
      x: Math.min(startPos.x, imagePos.x),
      y: Math.min(startPos.y, imagePos.y),
      width: Math.abs(width),
      height: Math.abs(height),
    })
  }

  const handleMouseUp = () => {
    if (!isDrawing || !currentRect) return

    if (currentRect.width > 5 && currentRect.height > 5) {
      const newAnnotation: Annotation = {
        id: Date.now().toString(),
        type: selectedType,
        color: selectedAnnotationType?.color || '#000000',
        x: currentRect.x,
        y: currentRect.y,
        width: currentRect.width,
        height: currentRect.height,
      }

      saveToHistory()
      setAnnotations(prev => [...prev, newAnnotation])
    }

    setIsDrawing(false)
    setCurrentRect(null)
  }

  const handleZoomIn = () => {
    const newZoom = Math.min(3, zoom * 1.2)
    setZoom(newZoom)
  }

  const handleZoomOut = () => {
    const newZoom = Math.max(0.1, zoom * 0.8)
    setZoom(newZoom)
  }

  const handleResetZoom = () => {
    setZoom(1)
  }

  const handleContinue = () => {
    onAnnotate(annotations)
  }

  if (!image) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading image...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>

        {/* Current Step Guidance */}
        {nextStep ? (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
            <div className="flex items-center justify-center gap-2">
              <div className="w-5 h-5 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                {ANNOTATION_TYPES.findIndex(t => t.type === nextStep.type) + 1}
              </div>
              <h3 className="text-lg font-semibold text-blue-900">{nextStep.label}</h3>
            </div>
            <p className="text-blue-800 text-sm mt-1">{nextStep.description}</p>
          </div>
        ) : (
          <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
            <div className="flex items-center justify-center gap-2">
              <div className="w-5 h-5 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                ✓
              </div>
              <h3 className="text-lg font-semibold text-green-900">All Done!</h3>
            </div>
          </div>
        )}
      </div>

      <div className="space-y-4">
        {/* Minimal Toolbar - Only show what's needed */}
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          {/* Current Step Info */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div
                className="w-4 h-4 rounded-full border-2 border-gray-400"
                style={{ backgroundColor: selectedAnnotationType?.color }}
              />
              <span className="text-sm font-medium text-gray-700">Marking: {selectedAnnotationType?.label}</span>
              {getAnnotationCount(selectedType) > 0 && (
                <Badge variant="secondary" className="text-xs">
                  {getAnnotationCount(selectedType)} marked
                </Badge>
              )}
            </div>
          </div>

          {/* Minimal Actions - Only essential */}
          <div className="flex items-center gap-2">
            {/* Zoom Controls */}
            <div className="flex items-center gap-1 border rounded-md">
              <Button variant="ghost" size="sm" onClick={handleZoomOut} disabled={zoom <= 0.1}>
                <Minus className="w-4 h-4" />
              </Button>
              <span className="px-2 text-sm font-medium min-w-[4rem] text-center">{Math.round(zoom * 100)}%</span>
              <Button variant="ghost" size="sm" onClick={handleZoomIn} disabled={zoom >= 3}>
                <Plus className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={handleResetZoom}>
                Reset
              </Button>
            </div>

            {selectedAnnotationId && (
              <Button
                variant="destructive"
                size="sm"
                onClick={() => {
                  setAnnotations(annotations.filter(a => a.id !== selectedAnnotationId))
                  setSelectedAnnotationId(null)
                }}
              >
                <X className="w-4 h-4" />
              </Button>
            )}
            <Button variant="ghost" size="sm" onClick={undo} disabled={historyIndex <= 0}>
              <Undo className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Quick Type Switcher - Only show if not following the guided flow */}
        {!nextStep && (
          <div className="flex flex-wrap items-center gap-2 p-3 bg-blue-50 rounded-lg">
            <span className="text-sm font-medium ">Switch to different type:</span>
            {ANNOTATION_TYPES.map(type => {
              const count = getAnnotationCount(type.type)
              const isCompleted = count > 0
              return (
                <Button
                  key={type.type}
                  variant={selectedType === type.type ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedType(type.type)}
                  className={`relative ${isCompleted ? 'bg-green-50 border-green-200 text-black' : ''}`}
                >
                  <div className="w-3 h-3 rounded-full mr-1" style={{ backgroundColor: type.color }} />
                  {type.label}
                  {isCompleted && (
                    <Badge variant="secondary" className="ml-1 text-xs bg-green-100 text-black border-green-200">
                      ✓
                    </Badge>
                  )}
                </Button>
              )
            })}
          </div>
        )}

        {/* Canvas Area */}
        <div>
          <Card>
            <CardContent className="p-4">
              <div className="relative border rounded-lg overflow-auto bg-gray-50 max-h-[70vh] max-w-[90vw]">
                <Stage
                  ref={stageRef}
                  width={stageSize.width * zoom}
                  height={stageSize.height * zoom}
                  onMouseDown={handleMouseDown}
                  onMousemove={handleMouseMove}
                  onMouseup={handleMouseUp}
                  draggable={false}
                  onDragEnd={e => {
                    setStagePos(e.target.position())
                  }}
                  onClick={e => {
                    // Deselect if clicking on empty space
                    if (e.target === e.target.getStage()) {
                      setSelectedAnnotationId(null)
                    }
                  }}
                >
                  <Layer>
                    {/* Background Image */}
                    <KonvaImage image={image} width={stageSize.width * zoom} height={stageSize.height * zoom} />

                    {/* Existing Annotations */}
                    {annotations.map(annotation => {
                      const typeConfig = ANNOTATION_TYPES.find(t => t.type === annotation.type)
                      if (!typeConfig) return null

                      const isSelected = selectedAnnotationId === annotation.id

                      return (
                        <Rect
                          key={annotation.id}
                          x={annotation.x * zoom}
                          y={annotation.y * zoom}
                          width={annotation.width * zoom}
                          height={annotation.height * zoom}
                          stroke={typeConfig.color}
                          strokeWidth={isSelected ? 3 : 2}
                          fill={`${typeConfig.color}20`}
                          draggable
                          onClick={() => setSelectedAnnotationId(annotation.id)}
                          onDragEnd={e => {
                            const newAnnotations = annotations.map(a =>
                              a.id === annotation.id
                                ? {
                                    ...a,
                                    x: e.target.x(),
                                    y: e.target.y(),
                                  }
                                : a
                            )
                            setAnnotations(newAnnotations)
                          }}
                        />
                      )
                    })}

                    {/* Resize Handles for Selected Annotation */}
                    {selectedAnnotationId &&
                      (() => {
                        const selectedAnnotation = annotations.find(a => a.id === selectedAnnotationId)
                        if (!selectedAnnotation) return null

                        const handleSize = 10
                        const handles = [
                          // Corner handles
                          {
                            x: selectedAnnotation.x - handleSize / 2,
                            y: selectedAnnotation.y - handleSize / 2,
                            cursor: 'nw-resize',
                            type: 'nw' as const,
                          },
                          {
                            x: selectedAnnotation.x + selectedAnnotation.width - handleSize / 2,
                            y: selectedAnnotation.y - handleSize / 2,
                            cursor: 'ne-resize',
                            type: 'ne' as const,
                          },
                          {
                            x: selectedAnnotation.x + selectedAnnotation.width - handleSize / 2,
                            y: selectedAnnotation.y + selectedAnnotation.height - handleSize / 2,
                            cursor: 'se-resize',
                            type: 'se' as const,
                          },
                          {
                            x: selectedAnnotation.x - handleSize / 2,
                            y: selectedAnnotation.y + selectedAnnotation.height - handleSize / 2,
                            cursor: 'sw-resize',
                            type: 'sw' as const,
                          },
                        ]

                        return handles.map((handle, index) => (
                          <Rect
                            key={`handle-${index}`}
                            x={handle.x}
                            y={handle.y}
                            width={handleSize}
                            height={handleSize}
                            fill="#ffffff"
                            stroke="#3B82F6"
                            strokeWidth={2}
                            draggable
                            onDragMove={e => {
                              const newAnnotations = annotations.map(a => {
                                if (a.id === selectedAnnotationId) {
                                  const deltaX = e.target.x() - handle.x
                                  const deltaY = e.target.y() - handle.y

                                  let newX = selectedAnnotation.x
                                  let newY = selectedAnnotation.y
                                  let newWidth = selectedAnnotation.width
                                  let newHeight = selectedAnnotation.height

                                  switch (handle.type) {
                                    case 'nw':
                                      newX = Math.min(
                                        selectedAnnotation.x + selectedAnnotation.width - 20,
                                        selectedAnnotation.x + deltaX
                                      )
                                      newY = Math.min(
                                        selectedAnnotation.y + selectedAnnotation.height - 20,
                                        selectedAnnotation.y + deltaY
                                      )
                                      newWidth = selectedAnnotation.width - (newX - selectedAnnotation.x)
                                      newHeight = selectedAnnotation.height - (newY - selectedAnnotation.y)
                                      break
                                    case 'ne':
                                      newY = Math.min(
                                        selectedAnnotation.y + selectedAnnotation.height - 20,
                                        selectedAnnotation.y + deltaY
                                      )
                                      newWidth = Math.max(20, selectedAnnotation.width + deltaX)
                                      newHeight = selectedAnnotation.height - (newY - selectedAnnotation.y)
                                      break
                                    case 'se':
                                      newWidth = Math.max(20, selectedAnnotation.width + deltaX)
                                      newHeight = Math.max(20, selectedAnnotation.height + deltaY)
                                      break
                                    case 'sw':
                                      newX = Math.min(
                                        selectedAnnotation.x + selectedAnnotation.width - 20,
                                        selectedAnnotation.x + deltaX
                                      )
                                      newWidth = selectedAnnotation.width - (newX - selectedAnnotation.x)
                                      newHeight = Math.max(20, selectedAnnotation.height + deltaY)
                                      break
                                  }

                                  return {
                                    ...a,
                                    x: newX,
                                    y: newY,
                                    width: newWidth,
                                    height: newHeight,
                                  }
                                }
                                return a
                              })
                              setAnnotations(newAnnotations)
                            }}
                            onDragEnd={e => {
                              // Reset handle position
                              e.target.x(handle.x)
                              e.target.y(handle.y)
                            }}
                          />
                        ))
                      })()}

                    {/* Current Drawing */}
                    {currentRect && (
                      <Rect
                        x={currentRect.x * zoom}
                        y={currentRect.y * zoom}
                        width={currentRect.width * zoom}
                        height={currentRect.height * zoom}
                        stroke={selectedAnnotationType?.color || '#000000'}
                        strokeWidth={2}
                        fill={`${selectedAnnotationType?.color || '#000000'}20`}
                        dash={[5, 5]}
                      />
                    )}
                  </Layer>
                </Stage>

                {/* Instructions Overlay */}
                <div className="absolute bottom-2 left-2 bg-black/70 text-white px-3 py-2 rounded text-sm">
                  {nextStep ? (
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full border-2 border-white"
                        style={{ backgroundColor: ANNOTATION_TYPES.find(t => t.type === nextStep.type)?.color }}
                      />
                      <span>Click and drag to draw rectangles around {nextStep.type}s</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <span>✓ All elements marked! Ready to continue.</span>
                    </div>
                  )}
                  {selectedAnnotationId && (
                    <div className="mt-1 text-xs opacity-80">
                      • Drag corner handles to resize • Delete key to remove
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft />
          Back
        </Button>
        <div className="flex gap-2">
          <Button variant="outline" onClick={onSkip}>
            Skip Annotation
          </Button>
          <Button
            onClick={handleContinue}
            className={nextStep ? 'opacity-75' : ''}
            disabled={false} // Allow continuing even if not all steps completed
          >
            {nextStep ? (
              <>
                Process with {annotations.length} annotations
                <ArrowRight className="w-4 h-4 ml-2" />
              </>
            ) : (
              <>
                Perfect! Process with {annotations.length} annotations
                <ArrowRight className="w-4 h-4 ml-2" />
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}
