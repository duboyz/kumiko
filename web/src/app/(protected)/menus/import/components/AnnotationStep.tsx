'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  ArrowLeft,
  ArrowRight,
  Undo,
  Redo,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Palette,
  MousePointer,
  Square,
  Type,
  Eraser,
  Circle,
  X,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Stage, Layer, Rect, Circle as KonvaCircle, Image as KonvaImage } from 'react-konva'
import Konva from 'konva'

export interface Annotation {
  id: string
  type: 'category' | 'item' | 'price' | 'note' | 'description'
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
    icon: Square,
    description: 'Menu sections (Appetizers, Main Courses, etc.)',
  },
  {
    type: 'item' as const,
    label: 'Menu Items',
    color: '#10B981',
    icon: Type,
    description: 'Individual dishes and food items',
  },
  {
    type: 'price' as const,
    label: 'Prices',
    color: '#F59E0B',
    icon: Type,
    description: 'Price text and numbers',
  },
  {
    type: 'note' as const,
    label: 'Special Notes',
    color: '#EF4444',
    icon: Type,
    description: 'Spicy, Vegetarian, etc.',
  },
  {
    type: 'description' as const,
    label: 'Descriptions',
    color: '#8B5CF6',
    icon: Type,
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
  const [tool, setTool] = useState<'rectangle' | 'circle' | 'highlight'>('rectangle')
  const [zoom, setZoom] = useState(1)
  const [stagePos, setStagePos] = useState({ x: 0, y: 0 })
  const [history, setHistory] = useState<Annotation[][]>([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const [image, setImage] = useState<HTMLImageElement | null>(null)
  const [selectedAnnotationId, setSelectedAnnotationId] = useState<string | null>(null)
  const [stageSize, setStageSize] = useState({ width: 800, height: 600 })
  const stageRef = useRef<Konva.Stage>(null)

  const selectedAnnotationType = ANNOTATION_TYPES.find(t => t.type === selectedType)

  // Load image and calculate proper dimensions
  useEffect(() => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => {
      setImage(img)

      // Calculate stage dimensions that maintain aspect ratio
      const maxWidth = 800
      const maxHeight = 600
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

  const redo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1)
      setAnnotations([...history[historyIndex + 1]])
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

    // Convert stage coordinates to image coordinates
    const imagePos = {
      x: (pos.x - stagePos.x) / zoom,
      y: (pos.y - stagePos.y) / zoom,
    }

    if (tool === 'rectangle' || tool === 'circle') {
      setIsDrawing(true)
      setStartPos(imagePos)
      setCurrentRect({ x: imagePos.x, y: imagePos.y, width: 0, height: 0 })
    } else if (tool === 'highlight') {
      // Create a small highlight circle
      const newAnnotation: Annotation = {
        id: Date.now().toString(),
        type: selectedType,
        color: selectedAnnotationType?.color || '#000000',
        x: imagePos.x - 10,
        y: imagePos.y - 10,
        width: 20,
        height: 20,
      }

      saveToHistory()
      setAnnotations(prev => [...prev, newAnnotation])
    }
  }

  const handleMouseMove = (e: Konva.KonvaEventObject<MouseEvent>) => {
    if (!isDrawing || !image) return

    const stage = e.target.getStage()
    if (!stage) return

    const pos = stage.getPointerPosition()
    if (!pos) return

    // Convert stage coordinates to image coordinates
    const imagePos = {
      x: (pos.x - stagePos.x) / zoom,
      y: (pos.y - stagePos.y) / zoom,
    }

    if (tool === 'rectangle' || tool === 'circle') {
      const width = imagePos.x - startPos.x
      const height = imagePos.y - startPos.y
      setCurrentRect({
        x: Math.min(startPos.x, imagePos.x),
        y: Math.min(startPos.y, imagePos.y),
        width: Math.abs(width),
        height: Math.abs(height),
      })
    }
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

  const handleWheel = (e: Konva.KonvaEventObject<WheelEvent>) => {
    e.evt.preventDefault()
    const stage = e.target.getStage()
    if (!stage) return

    const oldScale = stage.scaleX()
    const pointer = stage.getPointerPosition()
    if (!pointer) return

    const mousePointTo = {
      x: (pointer.x - stage.x()) / oldScale,
      y: (pointer.y - stage.y()) / oldScale,
    }

    const newScale = e.evt.deltaY > 0 ? oldScale * 0.9 : oldScale * 1.1
    const clampedScale = Math.max(0.1, Math.min(3, newScale))

    stage.scale({ x: clampedScale, y: clampedScale })

    const newPos = {
      x: pointer.x - mousePointTo.x * clampedScale,
      y: pointer.y - mousePointTo.y * clampedScale,
    }

    stage.position(newPos)
    stage.batchDraw()

    setZoom(clampedScale)
    setStagePos(newPos)
  }

  const resetView = () => {
    if (stageRef.current) {
      stageRef.current.scale({ x: 1, y: 1 })
      stageRef.current.position({ x: 0, y: 0 })
      stageRef.current.batchDraw()
      setZoom(1)
      setStagePos({ x: 0, y: 0 })
    }
  }

  const clearAnnotations = () => {
    saveToHistory()
    setAnnotations([])
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
        <h2 className="text-2xl font-bold mb-2">Annotate Your Menu</h2>
        <p className="text-muted-foreground">
          Mark categories, items, and prices with different colors to help AI understand your menu structure
        </p>
        <p className="text-sm text-muted-foreground mt-2">
          This step is optional but will significantly improve AI accuracy
        </p>
        <div className="text-xs text-muted-foreground mt-2">
          <strong>Tip:</strong> Hold <kbd className="px-1 py-0.5 bg-gray-200 rounded text-xs">Shift</kbd> + drag to pan
          around the image
        </div>
      </div>

      <div className="space-y-4">
        {/* Compact Toolbar */}
        <div className="flex flex-wrap items-center gap-2 p-4 bg-gray-50 rounded-lg">
          {/* Tools */}
          <div className="flex items-center gap-1">
            <span className="text-sm font-medium text-gray-700 mr-2">Tools:</span>
            <Button
              variant={tool === 'rectangle' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setTool('rectangle')}
            >
              <Square className="w-4 h-4" />
            </Button>
            <Button variant={tool === 'circle' ? 'default' : 'outline'} size="sm" onClick={() => setTool('circle')}>
              <Circle className="w-4 h-4" />
            </Button>
            <Button
              variant={tool === 'highlight' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setTool('highlight')}
            >
              <Type className="w-4 h-4" />
            </Button>
          </div>

          <div className="h-4 w-px bg-gray-300" />

          {/* Colors */}
          <div className="flex items-center gap-1">
            <span className="text-sm font-medium text-gray-700 mr-2">Colors:</span>
            {ANNOTATION_TYPES.map(type => {
              const count = annotations.filter(a => a.type === type.type).length
              return (
                <Button
                  key={type.type}
                  variant={selectedType === type.type ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedType(type.type)}
                  className="relative"
                >
                  <div className="w-3 h-3 rounded-full mr-1" style={{ backgroundColor: type.color }} />
                  {type.label}
                  {count > 0 && (
                    <Badge variant="secondary" className="ml-1 text-xs">
                      {count}
                    </Badge>
                  )}
                </Button>
              )
            })}
          </div>

          <div className="h-4 w-px bg-gray-300" />

          {/* Actions */}
          <div className="flex items-center gap-1">
            <Button variant="outline" size="sm" onClick={undo} disabled={historyIndex <= 0}>
              <Undo className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={redo} disabled={historyIndex >= history.length - 1}>
              <Redo className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={resetView}>
              <RotateCcw className="w-4 h-4" />
            </Button>
            <Button variant="destructive" size="sm" onClick={clearAnnotations}>
              <Eraser className="w-4 h-4" />
            </Button>
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
          </div>
        </div>

        {/* Canvas Area */}
        <div>
          <Card>
            <CardContent className="p-4">
              <div className="relative border rounded-lg overflow-hidden bg-gray-50">
                <Stage
                  ref={stageRef}
                  width={stageSize.width}
                  height={stageSize.height}
                  onMouseDown={handleMouseDown}
                  onMousemove={handleMouseMove}
                  onMouseup={handleMouseUp}
                  onWheel={handleWheel}
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
                    <KonvaImage image={image} width={stageSize.width} height={stageSize.height} />

                    {/* Existing Annotations */}
                    {annotations.map(annotation => {
                      const typeConfig = ANNOTATION_TYPES.find(t => t.type === annotation.type)
                      if (!typeConfig) return null

                      const isSelected = selectedAnnotationId === annotation.id

                      if (tool === 'circle') {
                        return (
                          <KonvaCircle
                            key={annotation.id}
                            x={annotation.x + annotation.width / 2}
                            y={annotation.y + annotation.height / 2}
                            radius={Math.max(annotation.width, annotation.height) / 2}
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
                                      x: e.target.x() - a.width / 2,
                                      y: e.target.y() - a.height / 2,
                                    }
                                  : a
                              )
                              setAnnotations(newAnnotations)
                            }}
                          />
                        )
                      } else {
                        return (
                          <Rect
                            key={annotation.id}
                            x={annotation.x}
                            y={annotation.y}
                            width={annotation.width}
                            height={annotation.height}
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
                      }
                    })}

                    {/* Resize Handles for Selected Annotation */}
                    {selectedAnnotationId &&
                      (() => {
                        const selectedAnnotation = annotations.find(a => a.id === selectedAnnotationId)
                        if (!selectedAnnotation) return null

                        const handleSize = 8
                        const handles = [
                          {
                            x: selectedAnnotation.x - handleSize / 2,
                            y: selectedAnnotation.y - handleSize / 2,
                            cursor: 'nw-resize',
                          },
                          {
                            x: selectedAnnotation.x + selectedAnnotation.width / 2 - handleSize / 2,
                            y: selectedAnnotation.y - handleSize / 2,
                            cursor: 'n-resize',
                          },
                          {
                            x: selectedAnnotation.x + selectedAnnotation.width - handleSize / 2,
                            y: selectedAnnotation.y - handleSize / 2,
                            cursor: 'ne-resize',
                          },
                          {
                            x: selectedAnnotation.x + selectedAnnotation.width - handleSize / 2,
                            y: selectedAnnotation.y + selectedAnnotation.height / 2 - handleSize / 2,
                            cursor: 'e-resize',
                          },
                          {
                            x: selectedAnnotation.x + selectedAnnotation.width - handleSize / 2,
                            y: selectedAnnotation.y + selectedAnnotation.height - handleSize / 2,
                            cursor: 'se-resize',
                          },
                          {
                            x: selectedAnnotation.x + selectedAnnotation.width / 2 - handleSize / 2,
                            y: selectedAnnotation.y + selectedAnnotation.height - handleSize / 2,
                            cursor: 's-resize',
                          },
                          {
                            x: selectedAnnotation.x - handleSize / 2,
                            y: selectedAnnotation.y + selectedAnnotation.height - handleSize / 2,
                            cursor: 'sw-resize',
                          },
                          {
                            x: selectedAnnotation.x - handleSize / 2,
                            y: selectedAnnotation.y + selectedAnnotation.height / 2 - handleSize / 2,
                            cursor: 'w-resize',
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
                            stroke="#000000"
                            strokeWidth={1}
                            draggable
                            onDragEnd={e => {
                              const newAnnotations = annotations.map(a => {
                                if (a.id === selectedAnnotationId) {
                                  const newWidth = Math.max(20, selectedAnnotation.width + (e.target.x() - handle.x))
                                  const newHeight = Math.max(20, selectedAnnotation.height + (e.target.y() - handle.y))
                                  return {
                                    ...a,
                                    width: newWidth,
                                    height: newHeight,
                                  }
                                }
                                return a
                              })
                              setAnnotations(newAnnotations)
                            }}
                          />
                        ))
                      })()}

                    {/* Current Drawing */}
                    {currentRect && (
                      <Rect
                        x={currentRect.x}
                        y={currentRect.y}
                        width={currentRect.width}
                        height={currentRect.height}
                        stroke={selectedAnnotationType?.color || '#000000'}
                        strokeWidth={2}
                        fill={`${selectedAnnotationType?.color || '#000000'}20`}
                        dash={[5, 5]}
                      />
                    )}
                  </Layer>
                </Stage>

                {/* Zoom Controls */}
                <div className="absolute top-2 right-2 flex flex-col gap-1">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      if (stageRef.current) {
                        const newScale = Math.min(3, zoom * 1.2)
                        stageRef.current.scale({ x: newScale, y: newScale })
                        setZoom(newScale)
                      }
                    }}
                  >
                    <ZoomIn className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      if (stageRef.current) {
                        const newScale = Math.max(0.1, zoom / 1.2)
                        stageRef.current.scale({ x: newScale, y: newScale })
                        setZoom(newScale)
                      }
                    }}
                  >
                    <ZoomOut className="w-4 h-4" />
                  </Button>
                </div>

                {/* Instructions Overlay */}
                <div className="absolute bottom-2 left-2 bg-black/70 text-white px-2 py-1 rounded text-xs">
                  {tool === 'rectangle' && 'Click and drag to draw rectangles'}
                  {tool === 'circle' && 'Click and drag to draw circles'}
                  {tool === 'highlight' && 'Click to highlight areas'}
                  {selectedAnnotationId && ' • Click to select • Drag handles to resize • Delete key to remove'}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <div className="flex gap-2">
          <Button variant="outline" onClick={onSkip}>
            Skip Annotation
          </Button>
          <Button onClick={handleContinue}>
            Continue with {annotations.length} annotations
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  )
}
