'use client'

import { useState } from 'react'
import { X } from 'lucide-react'
import { Dropzone } from '../Dropzone/Dropzone'
import { Button } from '@/components/ui/button'

interface SimpleUploadStepProps {
    onImageSelect: (file: File, preview: string) => void
    onBack: () => void
    onGenerateMenu: () => void
    selectedFile?: File | null
    previewUrl?: string | null
}

export function SimpleUploadStep({ onImageSelect, onBack, onGenerateMenu, selectedFile: propSelectedFile, previewUrl: propPreviewUrl }: SimpleUploadStepProps) {
    // Use props if provided, otherwise use local state
    const [localSelectedFile, setLocalSelectedFile] = useState<File | null>(null)
    const [localPreviewUrl, setLocalPreviewUrl] = useState<string | null>(null)

    const selectedFile = propSelectedFile || localSelectedFile
    const previewUrl = propPreviewUrl || localPreviewUrl

    const handleFileSelect = (file: File) => {
        if (!file?.type.startsWith('image/')) return

        setLocalSelectedFile(file)
        const url = URL.createObjectURL(file)
        setLocalPreviewUrl(url)
        onImageSelect(file, url)
    }

    const handleRemoveFile = () => {
        setLocalSelectedFile(null)
        if (localPreviewUrl) {
            URL.revokeObjectURL(localPreviewUrl)
            setLocalPreviewUrl(null)
        }
    }


    return (
        <div className="space-y-6">
            <div className="text-center">
                <h2 className="text-2xl font-bold mb-2">Upload Menu Image</h2>
                <p className="text-muted-foreground">Upload a clear photo of your menu to automatically extract menu items</p>
            </div>

            {!selectedFile && <Dropzone onFileSelect={handleFileSelect} />}
            {selectedFile && <SelectedFile previewUrl={previewUrl!} onRemoveFile={handleRemoveFile} />}


            <Button
                onClick={onGenerateMenu}
                variant="default"
                className="w-full"
                disabled={!selectedFile}
            >
                Generate menu
            </Button>
        </div>
    )
}


interface SelectedFileProps {
    previewUrl: string
    onRemoveFile: () => void
}

const SelectedFile = ({ previewUrl, onRemoveFile }: SelectedFileProps) => {
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
                <Button onClick={handleRemoveFile} variant="destructive" size="sm" className="absolute top-2 right-2">
                    <X className="w-4 h-4" />
                </Button>
            </div>
        </div>
    )
}
