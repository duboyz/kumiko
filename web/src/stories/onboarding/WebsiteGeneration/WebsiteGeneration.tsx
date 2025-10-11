'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Globe, Check, Loader2, ExternalLink } from 'lucide-react'
import { useOnboardingStore } from '@shared/stores/onboarding.store'
import { useRestaurantStore } from '@shared/stores/restaurant-store'
import { ParsedMenuStructure } from '@shared/types/menu-structure.types'

interface WebsiteGenerationProps {
  menuData?: ParsedMenuStructure | null
  onWebsiteGenerated?: (websiteId: string) => void
  onBack?: () => void
}

export default function WebsiteGeneration({ menuData, onWebsiteGenerated, onBack }: WebsiteGenerationProps) {
  const router = useRouter()
  const { menuData: storeMenuData, markCompleted } = useOnboardingStore()
  const { selectedRestaurant } = useRestaurantStore()

  const [websiteData, setWebsiteData] = useState({
    subdomain: '',
    name: '',
    description: '',
  })
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedWebsite, setGeneratedWebsite] = useState<{ id: string; subdomain: string } | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [retryCount, setRetryCount] = useState(0)

  const currentMenuData = menuData || storeMenuData

  useEffect(() => {
    if (selectedRestaurant) {
      const restaurantName = selectedRestaurant.restaurant.name
      const suggestedSubdomain = restaurantName
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '')

      setWebsiteData(prev => ({
        ...prev,
        subdomain: suggestedSubdomain,
        name: restaurantName,
        description: `Online presence for ${restaurantName}`,
      }))
    }
  }, [selectedRestaurant])

  const handleInputChange = (field: string, value: string) => {
    setWebsiteData(prev => ({ ...prev, [field]: value }))
  }

  const handleGenerateWebsite = async () => {
    if (!selectedRestaurant || !currentMenuData) return

    setIsGenerating(true)
    setError(null)

    try {
      // For now, we'll simulate the website generation
      // In a real implementation, this would call the auto-generate-website API
      await new Promise(resolve => setTimeout(resolve, 2000)) // Simulate API call

      const websiteId = `website-${Date.now()}`
      setGeneratedWebsite({
        id: websiteId,
        subdomain: websiteData.subdomain,
      })

      if (onWebsiteGenerated) {
        onWebsiteGenerated(websiteId)
      } else {
        markCompleted()
        // Navigate to dashboard or website preview
        router.push('/dashboard')
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to generate website'
      setError(errorMessage)
      setRetryCount(prev => prev + 1)
    } finally {
      setIsGenerating(false)
    }
  }

  const handleRetry = () => {
    setError(null)
    setRetryCount(0)
    handleGenerateWebsite()
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

  const handleViewWebsite = () => {
    if (generatedWebsite) {
      window.open(`https://${generatedWebsite.subdomain}.kumiko.app`, '_blank')
    }
  }

  if (!selectedRestaurant) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No restaurant selected</p>
        <Button onClick={handleBack} variant="outline" className="mt-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold">Generate Your Website</h1>
        <p className="text-muted-foreground">We'll create a beautiful website for your restaurant with your menu</p>
      </div>

      {!generatedWebsite && (
        <>
          <Card>
            <CardHeader>
              <CardTitle>Restaurant Summary</CardTitle>
              <CardDescription>Here's what we'll include in your website</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold mb-2">Restaurant Info</h4>
                  <div className="space-y-1 text-sm text-muted-foreground">
                    <p>
                      <strong>Name:</strong> {selectedRestaurant.restaurant.name}
                    </p>
                    <p>
                      <strong>Address:</strong> {selectedRestaurant.restaurant.address}
                    </p>
                    <p>
                      <strong>City:</strong> {selectedRestaurant.restaurant.city}
                    </p>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Menu Summary</h4>
                  {currentMenuData ? (
                    <div className="space-y-1 text-sm text-muted-foreground">
                      <p>
                        <strong>Categories:</strong> {currentMenuData.categories.length}
                      </p>
                      <p>
                        <strong>Total Items:</strong>{' '}
                        {currentMenuData.categories.reduce((acc: number, cat: any) => acc + cat.items.length, 0)}
                      </p>
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">No menu data available</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Website Settings</CardTitle>
              <CardDescription>Configure your website details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="subdomain">Website URL</Label>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">https://</span>
                  <Input
                    id="subdomain"
                    value={websiteData.subdomain}
                    onChange={e => handleInputChange('subdomain', e.target.value)}
                    placeholder="your-restaurant"
                    className="flex-1"
                  />
                  <span className="text-sm text-muted-foreground">.kumiko.app</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  This will be your website's address. Only letters, numbers, and hyphens are allowed.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="name">Website Name</Label>
                <Input
                  id="name"
                  value={websiteData.name}
                  onChange={e => handleInputChange('name', e.target.value)}
                  placeholder="Restaurant Website"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description (Optional)</Label>
                <Input
                  id="description"
                  value={websiteData.description}
                  onChange={e => handleInputChange('description', e.target.value)}
                  placeholder="Brief description of your restaurant"
                />
              </div>
            </CardContent>
          </Card>

          {currentMenuData && (
            <Card>
              <CardHeader>
                <CardTitle>Menu Preview</CardTitle>
                <CardDescription>Your menu will be automatically added to the website</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {currentMenuData.categories.slice(0, 3).map((category: any, index: number) => (
                    <div key={index} className="border rounded-lg p-3">
                      <h4 className="font-semibold mb-2">{category.name}</h4>
                      <div className="flex flex-wrap gap-1">
                        {category.items.slice(0, 4).map((item: any, itemIndex: number) => (
                          <Badge key={itemIndex} variant="outline" className="text-xs">
                            {item.name}
                          </Badge>
                        ))}
                        {category.items.length > 4 && (
                          <Badge variant="outline" className="text-xs">
                            +{category.items.length - 4} more
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
                  {currentMenuData.categories.length > 3 && (
                    <p className="text-sm text-muted-foreground text-center">
                      +{currentMenuData.categories.length - 3} more categories
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}

      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <div className="w-5 h-5 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-red-600 text-xs">!</span>
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-medium text-red-800 mb-1">Website Generation Failed</h4>
                <p className="text-sm text-red-600 mb-3">{error}</p>
                <div className="flex gap-2">
                  <Button
                    onClick={handleRetry}
                    size="sm"
                    variant="outline"
                    className="border-red-300 text-red-700 hover:bg-red-100"
                  >
                    Try Again
                  </Button>
                  {retryCount > 2 && (
                    <Button
                      onClick={() => {
                        // Skip website generation and complete onboarding
                        if (onWebsiteGenerated) {
                          onWebsiteGenerated('skipped')
                        } else {
                          markCompleted()
                          router.push('/dashboard')
                        }
                      }}
                      size="sm"
                      variant="ghost"
                      className="text-red-600 hover:bg-red-100"
                    >
                      Skip for Now
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {generatedWebsite && (
        <Card className="border-green-200 bg-green-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-800">
              <Check className="w-5 h-5" />
              Website Generated Successfully!
            </CardTitle>
            <CardDescription className="text-green-700">
              Your restaurant website is now live and ready to use
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-green-600" />
              <span className="text-sm">
                <strong>Website URL:</strong> https://{generatedWebsite.subdomain}.kumiko.app
              </span>
            </div>
            <Button onClick={handleViewWebsite} className="w-full">
              <ExternalLink className="w-4 h-4 mr-2" />
              View Your Website
            </Button>
          </CardContent>
        </Card>
      )}

      <div className="flex justify-between">
        <Button onClick={handleBack} variant="outline" disabled={isGenerating}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>

        {!generatedWebsite && (
          <Button
            onClick={handleGenerateWebsite}
            disabled={isGenerating || !websiteData.subdomain || !websiteData.name}
            className="min-w-[160px]"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Globe className="h-4 w-4 mr-2" />
                Generate Website
              </>
            )}
          </Button>
        )}
      </div>
    </div>
  )
}
