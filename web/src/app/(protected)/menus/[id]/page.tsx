'use client'

import { useParams, useRouter } from 'next/navigation'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowLeft, AlertCircle } from 'lucide-react'
import { useRestaurantMenus, useLocationSelection } from '@shared'
import { MenuEditor } from '@/components'

export default function MenuEditPage() {
  const params = useParams()
  const router = useRouter()
  const { selectedLocation } = useLocationSelection()

  const menuId = params.id as string
  const restaurantId = selectedLocation?.type === 'Restaurant' ? selectedLocation.id : null

  const { data: menusData, isLoading, error } = useRestaurantMenus(restaurantId || '')

  const menu = menusData?.menus?.find(m => m.id === menuId)

  if (isLoading) {
    return (
      <div className="container mx-auto py-6">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
            <p className="text-muted-foreground mt-2">Loading menu...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto py-6">
        <Card>
          <CardContent className="text-center py-12">
            <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Error Loading Menu</h2>
            <p className="text-muted-foreground mb-6">{error.message}</p>
            <Button onClick={() => router.push('/menus')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Menus
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!menu) {
    return (
      <div className="container mx-auto py-6">
        <Card>
          <CardContent className="text-center py-12">
            <AlertCircle className="w-12 h-12 text-amber-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Menu Not Found</h2>
            <p className="text-muted-foreground mb-6">
              The menu you're looking for doesn't exist or you don't have access to it.
            </p>
            <Button onClick={() => router.push('/menus')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Menus
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-6">
      <MenuEditor menu={menu} onBackToList={() => router.push('/menus')} />
    </div>
  )
}
