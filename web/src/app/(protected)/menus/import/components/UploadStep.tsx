'use client'

import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Upload, Camera, FileImage, ArrowRight, ArrowLeft, X } from 'lucide-react'
import { isMobileDevice } from '@/lib/device-detection'

interface UploadStepProps {
  onImageSelect: (file: File, preview: string) => void
  onBack: () => void
}

export function UploadStep({ onImageSelect, onBack }: UploadStepProps) {
  const [isDragOver, setIsDragOver] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const cameraInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (file: File) => {
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file)
      const url = URL.createObjectURL(file)
      setPreviewUrl(url)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    const files = e.dataTransfer.files
    if (files && files[0]) {
      handleFileSelect(files[0])
    }
  }

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleFileSelect(file)
    }
  }

  const handleCameraCapture = () => {
    cameraInputRef.current?.click()
  }

  const handleFileUpload = () => {
    fileInputRef.current?.click()
  }

  const handleContinue = () => {
    if (selectedFile && previewUrl) {
      onImageSelect(selectedFile, previewUrl)
    }
  }

  const handleRemoveFile = () => {
    setSelectedFile(null)
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl)
      setPreviewUrl(null)
    }
  }

  const clearFileInputs = () => {
    if (fileInputRef.current) fileInputRef.current.value = ''
    if (cameraInputRef.current) cameraInputRef.current.value = ''
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Upload Menu Image</h2>
        <p className="text-muted-foreground">Upload a clear photo of your menu to automatically extract menu items</p>
      </div>

      {!selectedFile ? (
        <div className="space-y-6">
          {/* Single Upload Area */}
          <div
            className={`
              border-2 border-dashed rounded-xl p-12 text-center transition-colors cursor-pointer
              ${
                isDragOver
                  ? 'border-primary bg-primary/5'
                  : 'border-muted-foreground/25 hover:border-muted-foreground/50'
              }
            `}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={handleFileUpload}
          >
            <div className="space-y-4">
              <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
                <Upload className="w-8 h-8 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Upload Menu Image</h3>
                <p className="text-muted-foreground mb-4">Drag and drop your menu image here, or click to browse</p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button onClick={handleFileUpload} size="lg" variant="outline">
                    <FileImage className="w-4 h-4 mr-2" />
                    Choose File
                  </Button>
                  <Button onClick={handleCameraCapture} size="lg" variant="outline">
                    <Camera className="w-4 h-4 mr-2" />
                    Take Photo
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Image Preview */}
          <div className="relative">
            <img src={previewUrl!} alt="Menu preview" className="w-full h-64 object-cover rounded-lg border" />
            <Button onClick={handleRemoveFile} size="sm" variant="destructive" className="absolute top-2 right-2">
              <X className="w-4 h-4" />
            </Button>
          </div>

          {/* File Info */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <FileImage className="w-5 h-5 text-muted-foreground" />
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{selectedFile.name}</p>
                  <p className="text-sm text-muted-foreground">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Hidden File Inputs */}
      <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileInputChange} className="hidden" />
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFileInputChange}
        className="hidden"
      />

      {/* Action Buttons */}
      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <Button onClick={handleContinue} disabled={!selectedFile} size="lg">
          Continue
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  )
}
