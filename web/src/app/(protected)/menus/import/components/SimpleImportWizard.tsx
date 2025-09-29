'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useLocationSelection } from '@shared'
import { Card, CardContent } from '@/components/ui/card'
import { LoadingSpinner } from '@/components'
import { SimpleUploadStep } from '@/stories/Components/MenuImport/SimpleUploadStep/SimpleUploadStep'
import { NoLocation } from '@/stories/Components/NoLocation/NoLocation'
import { RestaurantRequired } from '@/stories/Components/RestaurantRequired/RestaurantRequired'

interface SimpleImportWizardProps {
  onGenerateMenu: (file: File, restaurantId: string) => Promise<void>
}

export function SimpleImportWizard({ onGenerateMenu }: SimpleImportWizardProps) {
  const router = useRouter()
  const { selectedLocation, isLoading, hasNoLocations } = useLocationSelection()
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)

  const handleImageSelect = (file: File, preview: string) => {
    setImageFile(file)
    setImagePreview(preview)
  }

  const handleGenerateMenu = async () => {
    console.log('Generating menu...', imageFile, selectedLocation)
    if (!imageFile || !selectedLocation) return

    setIsGenerating(true)
    try {
      await onGenerateMenu(imageFile, selectedLocation.id)
      router.push('/menu-items')
    } catch (error) {
    } finally {
      setIsGenerating(false)
    }
  }

  const handleBack = () => router.push('/menu-items')

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (hasNoLocations) return <NoLocation />

  if (!selectedLocation || selectedLocation.type !== 'Restaurant') return <RestaurantRequired />


  if (isGenerating) {
    return (
      <div className="text-center">
        <LoadingSpinner size="lg" />
        <p className="mt-4 text-lg font-medium">Generating your menu...</p>
        <p className="text-muted-foreground">This may take a few moments</p>
      </div>

    )
  }

  return (
    <div className="bg-gray-50">

      <Card>
        <CardContent className="p-6">
          <SimpleUploadStep
            onImageSelect={handleImageSelect}
            onBack={handleBack}
            onGenerateMenu={handleGenerateMenu}
            selectedFile={imageFile}
            previewUrl={imagePreview}
          />
        </CardContent>
      </Card>

    </div >
  )
}