'use client'

import { MenuList } from '@/components/menu-builder/MenuList'
import { useRestaurantMenus, useCreateRestaurantMenu } from '@shared'
import { useLocationSelection } from '@shared'
import { Card, CardContent } from '@/components/ui/card'
import { Building2, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { ContentContainer } from '@/components/ContentContainer'

export default function MenusPage() {
    const { selectedLocation, isLoading, hasNoLocations } = useLocationSelection()
    const restaurantId = selectedLocation?.type === 'Restaurant' ? selectedLocation.id : null

    const { data: menusData, isLoading: menusLoading, error } = useRestaurantMenus(restaurantId || '')
    const createMenuMutation = useCreateRestaurantMenu()

    if (isLoading) {
        return (
            <div className="container mx-auto py-6">
                <div className="flex items-center justify-center py-12">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
                        <p className="text-muted-foreground mt-2">Loading...</p>
                    </div>
                </div>
            </div>
        )
    }

    if (hasNoLocations) {
        return (
            <div className="container mx-auto py-6">
                <Card>
                    <CardContent className="text-center py-12">
                        <Building2 className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                        <h2 className="text-xl font-semibold mb-2">No Restaurants Found</h2>
                        <p className="text-muted-foreground mb-6">
                            You need to add a restaurant before you can manage menus.
                        </p>
                        <Button asChild>
                            <Link href="/onboarding/restaurant">Add Restaurant</Link>
                        </Button>
                    </CardContent>
                </Card>
            </div>
        )
    }

    if (!selectedLocation || selectedLocation.type !== 'Restaurant') {
        return (
            <div className="container mx-auto py-6">
                <Card>
                    <CardContent className="text-center py-12">
                        <AlertCircle className="w-12 h-12 text-amber-500 mx-auto mb-4" />
                        <h2 className="text-xl font-semibold mb-2">Restaurant Required</h2>
                        <p className="text-muted-foreground mb-6">
                            Menu management is only available for restaurant locations. Please select a restaurant from the sidebar.
                        </p>
                    </CardContent>
                </Card>
            </div>
        )
    }

    const createMenu = async (menuData: { name: string; description: string; restaurantId: string }) => {
        try {
            await createMenuMutation.mutateAsync(menuData)
        } catch (error) {
            console.error('Failed to create menu:', error)
        }
    }

    const deleteMenu = async (menuId: string) => {
        // TODO: Implement delete menu functionality
        console.log('Delete menu:', menuId)
    }

    return (
        <ContentContainer>

            <MenuList
                menus={menusData?.menus || []}
                restaurantId={restaurantId || ''}
                restaurantName={selectedLocation?.name || 'Restaurant'}
                isLoading={menusLoading}
                onCreateMenu={createMenu}
                onDeleteMenu={deleteMenu}
                createMenuLoading={createMenuMutation.isPending}
            />
        </ContentContainer>
    )
}
