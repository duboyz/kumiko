'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { FileImage, ArrowRight, ArrowLeft, X } from 'lucide-react'
import { Dropzone } from '../Dropzone/Dropzone'

interface UploadStepProps {
    onImageSelect: (file: File, preview: string) => void
    onBack: () => void
}

export function UploadStep({ onImageSelect, onBack }: UploadStepProps) {
    const [selectedFile, setSelectedFile] = useState<File | null>(null)
    const [previewUrl, setPreviewUrl] = useState<string | null>(null)

    const handleFileSelect = (file: File) => {
        if (!file?.type.startsWith('image/')) return

        setSelectedFile(file)
        const url = URL.createObjectURL(file)
        setPreviewUrl(url)
    }

    const handleRemoveFile = () => {
        setSelectedFile(null)
        if (previewUrl) {
            URL.revokeObjectURL(previewUrl)
            setPreviewUrl(null)
        }
    }

    const handleContinue = () => (selectedFile && previewUrl) && onImageSelect(selectedFile, previewUrl)

    return (
        <div className="space-y-6">
            <div className="text-center">
                <h2 className="text-2xl font-bold mb-2">Upload Menu Image</h2>
                <p className="text-muted-foreground">Upload a clear photo of your menu to automatically extract menu items</p>
            </div>

            {!selectedFile && <Dropzone onFileSelect={handleFileSelect} />}
            {selectedFile && <SelectedFile file={selectedFile} previewUrl={previewUrl!} onRemoveFile={handleRemoveFile} />}

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


interface SelectedFileProps {
    file: File
    previewUrl: string
    onRemoveFile: () => void
}

const SelectedFile = ({ file, previewUrl, onRemoveFile }: SelectedFileProps) => {
    const handleRemoveFile = () => {
        onRemoveFile()
        if (previewUrl) {
            URL.revokeObjectURL(previewUrl)
        }
    }
    return (
        <div className="space-y-6">
            <div className="relative">
                <img src={previewUrl!} alt="Menu preview" className="w-full h-64 object-cover rounded-lg border" />
                <Button onClick={handleRemoveFile} size="sm" variant="destructive" className="absolute top-2 right-2">
                    <X className="w-4 h-4" />
                </Button>
            </div>
        </div>
    )
}
