'use client'

import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Upload, Camera, FileImage } from 'lucide-react'

interface DropzoneProps {
  onFileSelect: (files: File[]) => void
  accept?: string
  multiple?: boolean
  className?: string
}

export function Dropzone({
  onFileSelect,
  accept = 'image/*,image/heic',
  multiple = true,
  className = '',
}: DropzoneProps) {
  const [isDragOver, setIsDragOver] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFilesSelect = (files: File[]) => {
    if (!files || files.length === 0) return
    onFileSelect(files)
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
    const files = Array.from(e.dataTransfer.files || [])
    if (files.length > 0) handleFilesSelect(files)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length > 0) handleFilesSelect(files)
  }

  return (
    <>
      <div
        className={`border-2 border-dashed rounded-xl p-12 text-center transition-colors cursor-pointer ${
          isDragOver ? 'border-primary bg-primary/5' : 'border-muted-foreground/25 hover:border-muted-foreground/50'
        } ${className}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <div className="space-y-4">
          <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
            <Upload className="w-8 h-8 text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2">Upload Menu Image</h3>
            <p className="text-muted-foreground mb-4">Drag and drop your menu image here, or click to browse</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button type="button" size="lg" variant="outline">
                <FileImage />
                Choose File
              </Button>
              <Button type="button" size="lg" variant="outline">
                <Camera />
                Take Photo
              </Button>
            </div>
          </div>
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        capture="environment"
        onChange={handleInputChange}
        className="hidden"
      />
    </>
  )
}
