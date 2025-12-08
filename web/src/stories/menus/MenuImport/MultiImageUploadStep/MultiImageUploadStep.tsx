'use client'

import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowRight, ArrowLeft, X, Plus, Trash2, Upload, Camera } from 'lucide-react'
import { gsap } from 'gsap'
import { cn } from '@/lib/utils'

export interface MenuImage {
  id: string
  file: File
  preview: string
  name: string
}

interface MultiImageUploadStepProps {
  onImagesSelect: (images: MenuImage[]) => void
  onBack: () => void
  onBuildManually?: () => void
}

export function MultiImageUploadStep({ onImagesSelect, onBack, onBuildManually }: MultiImageUploadStepProps) {
  const [images, setImages] = useState<MenuImage[]>([])
  const [isAnimating, setIsAnimating] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const imagesGridRef = useRef<HTMLDivElement>(null)
  const uploadAreaRef = useRef<HTMLDivElement>(null)

  // Animate container entrance
  useEffect(() => {
    if (containerRef.current) {
      gsap.fromTo(containerRef.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' })
    }
  }, [])

  // Animate images grid when images change
  useEffect(() => {
    if (imagesGridRef.current && images.length > 0) {
      const cards = imagesGridRef.current.querySelectorAll('.image-card')

      if (cards.length > 0) {
        // Stagger animation for new cards
        gsap.fromTo(
          cards,
          {
            opacity: 0,
            scale: 0.8,
            y: 20,
            rotationY: -15,
          },
          {
            opacity: 1,
            scale: 1,
            y: 0,
            rotationY: 0,
            duration: 0.5,
            ease: 'back.out(1.7)',
            stagger: 0.1,
          }
        )
      }
    }
  }, [images.length])

  const fileInputRef = useRef<HTMLInputElement>(null)
  const cameraInputRef = useRef<HTMLInputElement>(null)

  const handleFilesSelect = (files: File[]) => {
    const validFiles = files.filter(file => file?.type.startsWith('image/'))

    if (validFiles.length === 0) return

    // Animate upload area if it's the first upload
    if (images.length === 0 && uploadAreaRef.current) {
      gsap.to(uploadAreaRef.current, {
        opacity: 0,
        scale: 0.95,
        duration: 0.3,
        ease: 'power2.in',
        onComplete: () => {
          const newImages: MenuImage[] = validFiles.map(file => ({
            id: Math.random().toString(36).substr(2, 9),
            file,
            preview: URL.createObjectURL(file),
            name: file.name,
          }))

          setImages(prev => [...prev, ...newImages])
        },
      })
    } else {
      const newImages: MenuImage[] = validFiles.map(file => ({
        id: Math.random().toString(36).substr(2, 9),
        file,
        preview: URL.createObjectURL(file),
        name: file.name,
      }))

      setImages(prev => [...prev, ...newImages])
    }
  }

  const handleUploadClick = () => {
    fileInputRef.current?.click()
  }

  const handleCameraClick = () => {
    // cameraInputRef.current?.click()
  }

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length > 0) handleFilesSelect(files)
    // Reset input so same file can be selected again
    if (e.target) e.target.value = ''
  }

  const handleCameraInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length > 0) handleFilesSelect(files)
    // Reset input so same file can be selected again
    if (e.target) e.target.value = ''
  }

  const handleRemoveImage = (imageId: string) => {
    const imageElement = document.querySelector(`[data-image-id="${imageId}"]`)

    if (imageElement) {
      gsap.to(imageElement, {
        scale: 0.8,
        opacity: 0,
        rotationY: 15,
        duration: 0.3,
        ease: 'power2.in',
        onComplete: () => {
          setImages(prev => {
            const imageToRemove = prev.find(img => img.id === imageId)
            if (imageToRemove) {
              URL.revokeObjectURL(imageToRemove.preview)
            }
            return prev.filter(img => img.id !== imageId)
          })
        },
      })
    } else {
      // Fallback if element not found
      setImages(prev => {
        const imageToRemove = prev.find(img => img.id === imageId)
        if (imageToRemove) {
          URL.revokeObjectURL(imageToRemove.preview)
        }
        return prev.filter(img => img.id !== imageId)
      })
    }
  }

  const handleContinue = () => {
    if (images.length > 0) {
      // Animate the continue button
      const continueBtn = document.querySelector('[data-continue-btn]')
      if (continueBtn) {
        gsap.to(continueBtn, {
          scale: 0.95,
          duration: 0.1,
          yoyo: true,
          repeat: 1,
          ease: 'power2.inOut',
          onComplete: () => {
            onImagesSelect(images)
          },
        })
      } else {
        onImagesSelect(images)
      }
    }
  }

  const handleClearAll = () => {
    if (imagesGridRef.current) {
      const cards = imagesGridRef.current.querySelectorAll('.image-card')

      gsap.to(cards, {
        scale: 0.8,
        opacity: 0,
        rotationY: 15,
        duration: 0.3,
        ease: 'power2.in',
        stagger: 0.05,
        onComplete: () => {
          images.forEach(img => URL.revokeObjectURL(img.preview))
          setImages([])
        },
      })
    } else {
      images.forEach(img => URL.revokeObjectURL(img.preview))
      setImages([])
    }
  }

  return (
    <div ref={containerRef} className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Add Your Menu</h2>
        <p className="text-muted-foreground">
          Upload menu images to automatically extract menu items, prices, and categories
        </p>
      </div>

      {/* Upload Area */}
      {images.length === 0 && (
        <div ref={uploadAreaRef} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {/* Upload Image Card */}
            <Card
              className={cn(
                'cursor-pointer transition-all hover:shadow-lg hover:border-primary/50',
                'group relative overflow-hidden'
              )}
              onClick={handleUploadClick}
            >
              <div className="absolute top-4 right-4">
                <Badge variant="secondary" className="bg-orange-500/10 text-orange-600 border-orange-500/20">
                  Beta
                </Badge>
              </div>
              <CardHeader className="pb-4">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <Upload className="w-6 h-6 text-primary" />
                </div>
                <CardTitle className="text-xl">Upload Image</CardTitle>
                <CardDescription className="text-base mt-2">
                  Select menu images from your device to automatically extract items, prices, and categories
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-0.5">•</span>
                    <span>Choose from your photo library</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-0.5">•</span>
                    <span>Supports multiple images</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-0.5">•</span>
                    <span>AI extracts menu items automatically</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Take a Picture Card */}
            <Card
              className={cn(
                'cursor-pointer transition-all hover:shadow-lg hover:border-primary/50',
                'group relative overflow-hidden'
              )}
              onClick={handleCameraClick}
            >
              <div className="absolute top-4 right-4">
                <Badge variant="secondary" className="bg-orange-500/10 text-orange-600 border-orange-500/20">
                  Beta
                </Badge>
              </div>
              <CardHeader className="pb-4">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <Camera className="w-6 h-6 text-primary" />
                </div>
                <CardTitle className="text-xl">Take a Picture</CardTitle>
                <CardDescription className="text-base mt-2">
                  Use your device camera to capture menu photos and let AI automatically extract menu items
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-0.5">•</span>
                    <span>Capture menu with your camera</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-0.5">•</span>
                    <span>Works on mobile and desktop</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-0.5">•</span>
                    <span>AI extracts menu items automatically</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Hidden file inputs */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,image/heic"
            multiple
            onChange={handleFileInputChange}
            className="hidden"
          />
          <input
            ref={cameraInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handleCameraInputChange}
            className="hidden"
          />
        </div>
      )}

      {/* Images Grid */}
      {images.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="text-sm">
                {images.length} image{images.length !== 1 ? 's' : ''} uploaded
              </Badge>
              {images.length > 1 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClearAll}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="w-4 h-4 mr-1" />
                  Clear all
                </Button>
              )}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const input = document.createElement('input')
                input.type = 'file'
                input.accept = 'image/*,image/heic'
                input.multiple = true
                input.onchange = e => {
                  const files = Array.from((e.target as HTMLInputElement).files || [])
                  if (files.length > 0) handleFilesSelect(files)
                }
                input.click()
              }}
              className="flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add more
            </Button>
          </div>

          <div ref={imagesGridRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {images.map(image => (
              <Card key={image.id} data-image-id={image.id} className="relative group image-card">
                <CardContent className="p-0">
                  <div className="relative">
                    <img src={image.preview} alt={image.name} className="w-full h-48 object-cover rounded-t-lg" />
                    <Button
                      variant="destructive"
                      size="sm"
                      className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => handleRemoveImage(image.id)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="p-3">
                    <p className="text-sm font-medium truncate">{image.name}</p>
                    <p className="text-xs text-muted-foreground">{(image.file.size / 1024 / 1024).toFixed(1)} MB</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Add More Dropzone */}
          <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
            <div className="space-y-4">
              <div className="w-12 h-12 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
                <Plus className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h4 className="text-sm font-medium mb-1">Add More Images</h4>
                <p className="text-xs text-muted-foreground mb-3">Drag and drop more images here, or click to browse</p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const input = document.createElement('input')
                    input.type = 'file'
                    input.accept = 'image/*,image/heic'
                    input.multiple = true
                    input.onchange = e => {
                      const files = Array.from((e.target as HTMLInputElement).files || [])
                      if (files.length > 0) handleFilesSelect(files)
                    }
                    input.click()
                  }}
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Choose Files
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="flex items-center justify-between pt-6">
        <Button variant="outline" onClick={onBack} className="flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>
        <Button
          onClick={handleContinue}
          disabled={images.length === 0}
          size="lg"
          className="flex items-center gap-2"
          data-continue-btn
        >
          Continue with {images.length} image{images.length !== 1 ? 's' : ''}
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  )
}
