'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Upload, Camera, FileImage, X, Check, Loader2 } from 'lucide-react'
import { useOnboardingStore } from '@shared/stores/onboarding.store'
import { ParsedMenuStructure } from '@shared/types/menu-structure.types'
import { parseMenuStructure } from '@shared/api/menu-structure.api'
import { useRestaurantStore } from '@shared/stores/restaurant-store'

interface MenuPhotoImportProps {
  onMenuParsed?: (data: ParsedMenuStructure) => void
  onBack?: () => void
}

export default function MenuPhotoImport({ onMenuParsed, onBack }: MenuPhotoImportProps) {
  const router = useRouter()
  const { setMenuData, nextStep } = useOnboardingStore()
  const { selectedRestaurant } = useRestaurantStore()

  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [parsedMenu, setParsedMenu] = useState<ParsedMenuStructure | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleFileSelect = (file: File) => {
    if (!file?.type.startsWith('image/')) {
      setError('Please select a valid image file')
      return
    }

    setSelectedFile(file)
    setError(null)
    setParsedMenu(null)

    const url = URL.createObjectURL(file)
    setPreviewUrl(url)
  }

  const handleRemoveFile = () => {
    setSelectedFile(null)
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl)
      setPreviewUrl(null)
    }
    setParsedMenu(null)
    setError(null)
  }

  const handleProcessMenu = async () => {
    if (!selectedFile || !selectedRestaurant) return

    setIsProcessing(true)
    setError(null)

    try {
      const result = await parseMenuStructure(selectedFile, undefined, selectedRestaurant.restaurant.id)
      setParsedMenu(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to parse menu')
    } finally {
      setIsProcessing(false)
    }
  }

  const handleContinue = () => {
    if (parsedMenu) {
      if (onMenuParsed) {
        onMenuParsed(parsedMenu)
      } else {
        setMenuData(parsedMenu)
        nextStep()
        router.push('/onboarding/website')
      }
    }
  }

  const handleBack = () => {
    if (onBack) {
      onBack()
    } else {
      // Go back to previous step using store
      const { previousStep } = useOnboardingStore.getState()
      previousStep()
    }
  }

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold">Upload Your Menu</h1>
        <p className="text-muted-foreground">
          Take a photo or upload an image of your menu to automatically extract menu items
        </p>
      </div>

      {!selectedFile && (
        <Card>
          <CardContent className="p-12">
            <div
              className="border-2 border-dashed border-muted-foreground/25 rounded-xl p-8 text-center transition-colors cursor-pointer hover:border-muted-foreground/50"
              onClick={() => document.getElementById('file-input')?.click()}
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
                      <FileImage className="w-4 h-4 mr-2" />
                      Choose File
                    </Button>
                    <Button type="button" size="lg" variant="outline">
                      <Camera className="w-4 h-4 mr-2" />
                      Take Photo
                    </Button>
                  </div>
                </div>
              </div>
            </div>
            <input
              id="file-input"
              type="file"
              accept="image/*,image/heic"
              capture="environment"
              onChange={e => {
                const file = e.target.files?.[0]
                if (file) handleFileSelect(file)
              }}
              className="hidden"
            />
          </CardContent>
        </Card>
      )}

      {selectedFile && !parsedMenu && (
        <Card>
          <CardHeader>
            <CardTitle>Menu Preview</CardTitle>
            <CardDescription>Review your menu image before processing</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="relative">
              <img src={previewUrl!} alt="Menu preview" className="w-full h-64 object-cover rounded-lg border" />
              <Button onClick={handleRemoveFile} variant="destructive" size="sm" className="absolute top-2 right-2">
                <X className="w-4 h-4" />
              </Button>
            </div>

            <div className="flex justify-center">
              <Button onClick={handleProcessMenu} disabled={isProcessing} className="min-w-[160px]">
                {isProcessing ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  'Extract Menu Items'
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-4">
            <p className="text-red-600 text-sm">{error}</p>
          </CardContent>
        </Card>
      )}

      {parsedMenu && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Check className="w-5 h-5 text-green-600" />
              Menu Extracted Successfully
            </CardTitle>
            <CardDescription>
              We found {parsedMenu.categories.length} categories with{' '}
              {parsedMenu.categories.reduce((acc, cat) => acc + cat.items.length, 0)} items
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              {parsedMenu.categories.map((category, index) => (
                <div key={index} className="border rounded-lg p-3">
                  <h4 className="font-semibold mb-2">{category.name}</h4>
                  <div className="flex flex-wrap gap-1">
                    {category.items.map((item, itemIndex) => (
                      <Badge key={itemIndex} variant="outline" className="text-xs">
                        {item.name}
                      </Badge>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="flex justify-between">
        <Button onClick={handleBack} variant="outline">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>

        {parsedMenu && (
          <Button onClick={handleContinue} className="min-w-[120px]">
            <Check className="h-4 w-4 mr-2" />
            Continue
          </Button>
        )}
      </div>
    </div>
  )
}
