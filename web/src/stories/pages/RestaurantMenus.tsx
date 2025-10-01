'use client'
import { useLocationSelection } from '@shared/hooks/locationSelection.hooks'
import { useRestaurantMenus, useDeleteRestaurantMenu } from '@shared/hooks/menu.hooks'
import { RestaurantMenuDto } from '@shared/types/menu.types'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime'
import { MenuSquare, Trash2 } from 'lucide-react'
import { LoadingState } from '@/components/LoadingState'
import { ErrorState } from '@/components/ErrorState'
import { EmptyState } from '@/components/EmptyState'

interface RestaurantMenusProps {
  router: AppRouterInstance
}

export const RestaurantMenus = ({ router }: RestaurantMenusProps) => {
  const { selectedLocation } = useLocationSelection()
  const { data: menusData, isLoading, error } = useRestaurantMenus(selectedLocation?.id || '')

  if (isLoading) {
    return <LoadingState />
  }

  if (error) {
    return (
      <ErrorState title="Failed to load menus" message="There was an error loading your menus. Please try again." />
    )
  }

  if (!menusData?.menus || menusData.menus.length === 0) {
    return (
      <EmptyState
        icon={MenuSquare}
        title="No menus yet"
        description="Create your first menu to start managing your restaurant offerings."
      />
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {menusData.menus.map(menu => (
        <RestaurantMenuCard key={menu.id} menu={menu} router={router} />
      ))}
    </div>
  )
}

export const RestaurantMenuCard = ({ menu, router }: { menu: RestaurantMenuDto; router: AppRouterInstance }) => {
  const { mutate: deleteMenu } = useDeleteRestaurantMenu()

  const handleDelete = () => {
    if (confirm(`Are you sure you want to delete "${menu.name}"? This action cannot be undone.`)) {
      deleteMenu(menu.id)
    }
  }

  const categoryCount = menu.categories?.length || 0
  const itemCount = menu.categories?.reduce((total, cat) => total + (cat.menuCategoryItems?.length || 0), 0) || 0

  return (
    <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => router.push(`/menus/${menu.id}`)}>
      <CardHeader>
        <MenuSquare className="w-5 h-5 text-muted-foreground mb-2" />
        <CardTitle className="text-xl">{menu.name}</CardTitle>
        {menu.description && <CardDescription className="line-clamp-2">{menu.description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <div className="flex gap-4 text-xs text-muted-foreground">
          <span>
            {categoryCount} {categoryCount === 1 ? 'category' : 'categories'}
          </span>
          <span>•</span>
          <span>
            {itemCount} {itemCount === 1 ? 'item' : 'items'}
          </span>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button
          variant="ghost"
          size="sm"
          onClick={e => {
            e.stopPropagation()
            router.push(`/menus/${menu.id}`)
          }}
        >
          Edit Menu
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={e => {
            e.stopPropagation()
            handleDelete()
          }}
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </CardFooter>
    </Card>
  )
}
