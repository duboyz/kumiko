'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ChefHat, Plus, Edit2, Trash2, Calendar, Upload } from 'lucide-react'
import { MenuCategoryDto, MenuItemDto, RestaurantMenuDto } from '@shared'
import { CreateMenuForm } from './CreateMenuForm'

interface MenuListProps {
  menus: RestaurantMenuDto[]
  restaurantId: string
  restaurantName: string
  isLoading: boolean
  onCreateMenu: (menuData: { name: string; description: string; restaurantId: string }) => void
  onDeleteMenu: (menuId: string) => void
  createMenuLoading: boolean
}

// Helper function to get total items count for a menu
const getTotalItemsCount = (menu: RestaurantMenuDto): number => {
  return menu.categories.reduce((total, category) => total + category.menuCategoryItems.length, 0)
}

// Helper function to format date
const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

export function MenuList({
  menus,
  restaurantId,
  restaurantName,
  isLoading,
  onCreateMenu,
  onDeleteMenu,
  createMenuLoading,
}: MenuListProps) {
  const router = useRouter()
  const [showCreateForm, setShowCreateForm] = useState(false)

  const handleCreateMenu = (menuData: { name: string; description: string; restaurantId: string }) => {
    onCreateMenu(menuData)
    setShowCreateForm(false)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          <p className="text-muted-foreground mt-2">Loading menus...</p>
        </div>
      </div>
    )
  }

  if (showCreateForm) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Create New Menu</h2>
            <p className="text-muted-foreground">Add a new menu for {restaurantName}</p>
          </div>
          <Button variant="outline" onClick={() => setShowCreateForm(false)}>
            Back to Menus
          </Button>
        </div>

        <CreateMenuForm
          restaurantId={restaurantId}
          restaurantName={restaurantName}
          onCreateMenu={handleCreateMenu}
          isLoading={createMenuLoading}
        />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Restaurant Menus</h2>
          <p className="text-muted-foreground">Manage all menus for {restaurantName}</p>
        </div>

        <div className="flex gap-2">
          <Button onClick={() => router.push('/menus/import')}>
            <Upload className="w-4 h-4 mr-2" />
            Import from Photo
          </Button>

          <Button onClick={() => setShowCreateForm(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Create Menu
          </Button>
        </div>
      </div>

      {/* Menu Grid */}
      {menus.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {menus.map(menu => (
            <Card key={menu.id} className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{menu.name}</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{menu.description}</p>
                  </div>
                  <ChefHat className="w-5 h-5 text-muted-foreground flex-shrink-0 ml-2" />
                </div>
              </CardHeader>

              <CardContent className="pt-0">
                <div className="space-y-3">
                  {/* Stats */}
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Badge variant="secondary" className="text-xs">
                        {menu.categories.length} categories
                      </Badge>
                    </div>
                    <div className="flex items-center gap-1">
                      <Badge variant="outline" className="text-xs">
                        {getTotalItemsCount(menu)} items
                      </Badge>
                    </div>
                  </div>

                  {/* Last updated */}
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Calendar className="w-3 h-3" />
                    Updated {formatDate(menu.updatedAt)}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-2">
                    <Button size="sm" className="flex-1" onClick={() => router.push(`/menus/${menu.id}`)}>
                      <Edit2 className="w-4 h-4 mr-2" />
                      Edit Menu
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={e => {
                        e.stopPropagation()
                        onDeleteMenu(menu.id)
                      }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="text-center py-12">
            <ChefHat className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Menus Yet</h3>
            <p className="text-muted-foreground mb-6">Create your first menu for {restaurantName} to get started.</p>
            <Button onClick={() => setShowCreateForm(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Create Your First Menu
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
