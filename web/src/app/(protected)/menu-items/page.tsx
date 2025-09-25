'use client'

import { ContentContainer } from '@/components/ContentContainer'
import { LoadingSpinner } from '@/components'
import { DeleteConfirmDialog } from '@/components'
import { MenuItemForm } from '@/components/menu-builder/MenuItemForm'
import MenuItemTableView from '@/components/menu-builder/MenuItemTableView'
import {
  useAllRestaurantMenuItems,
  useCreateMenuItem,
  useUpdateMenuItem,
  useDeleteMenuItem,
  useRestaurantMenus,
  useBulkAddMenuItemsToCategory,
} from '@shared'
import { useLocationSelection } from '@shared'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

import Link from 'next/link'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Building2, AlertCircle, Plus, Edit, Trash2, Package, Grid3X3, Table, Upload, CheckCircle } from 'lucide-react'
import { useState, useEffect, Suspense } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { useSearchParams } from 'next/navigation'
import { MenuItemDto, CreateMenuItemCommand, UpdateMenuItemCommand, RestaurantMenuDto } from '@shared'

function MenuItemsPageContent() {
  const { selectedLocation, isLoading, hasNoLocations } = useLocationSelection()
  const restaurantId = selectedLocation?.type === 'Restaurant' ? selectedLocation.id : null

  const { data: menuItemsData, isLoading: menuItemsLoading, error } = useAllRestaurantMenuItems(restaurantId || '')
  const { data: menusData } = useRestaurantMenus(restaurantId || '')
  const createMenuItemMutation = useCreateMenuItem()
  const updateMenuItemMutation = useUpdateMenuItem()
  const deleteMenuItemMutation = useDeleteMenuItem()
  const bulkAddMenuItemsToCategoryMutation = useBulkAddMenuItemsToCategory()
  const queryClient = useQueryClient()

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<MenuItemDto | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<{
    type: 'item'
    id: string
  } | null>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [activeView, setActiveView] = useState<'cards' | 'table'>('cards')
  const [showSuccess, setShowSuccess] = useState(false)
  const searchParams = useSearchParams()

  // Handle import success from new import flow
  useEffect(() => {
    if (searchParams.get('import') === 'success') {
      setShowSuccess(true)
      setTimeout(() => setShowSuccess(false), 3000)
      // Clean up URL
      window.history.replaceState({}, '', window.location.pathname)
    }
  }, [searchParams])

  if (isLoading) {
    return (
      <div className="container mx-auto py-6">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <LoadingSpinner size="lg" />
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
            <p className="text-muted-foreground mb-6">You need to add a restaurant before you can manage menu items.</p>
            <Button asChild>
              <a href="/onboarding/restaurant">Add Restaurant</a>
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
              Menu item management is only available for restaurant locations. Please select a restaurant from the
              sidebar.
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  const handleCreateMenuItem = async (data: CreateMenuItemCommand) => {
    try {
      await createMenuItemMutation.mutateAsync(data)
      setIsCreateDialogOpen(false)
    } catch (error) {
      console.error('Failed to create menu item:', error)
    }
  }

  const handleUpdateMenuItem = async (data: UpdateMenuItemCommand) => {
    try {
      await updateMenuItemMutation.mutateAsync(data)
      //   queryClient.invalidateQueries({ queryKey: ["restaurant-menu-items"] });
      setIsEditDialogOpen(false)
      setEditingItem(null)
    } catch (error) {
      console.error('Failed to update menu item:', error)
    }
  }

  const handleDeleteMenuItem = async (itemId: string) => {
    setDeleteTarget({ type: 'item', id: itemId })
    setIsDeleteDialogOpen(true)
  }

  const confirmDelete = async () => {
    if (!deleteTarget) return
    try {
      await deleteMenuItemMutation.mutateAsync(deleteTarget.id)
      setIsDeleteDialogOpen(false)
      setDeleteTarget(null)
    } catch (error) {
      console.error('Failed to delete menu item:', error)
    }
  }

  // Bulk operation handlers
  const handleBulkDelete = async (itemIds: string[]) => {
    try {
      // Delete items one by one using the existing mutation
      const deletePromises = itemIds.map(id => deleteMenuItemMutation.mutateAsync(id))
      await Promise.all(deletePromises)

      // Invalidate queries to refresh the data
      queryClient.invalidateQueries({ queryKey: ['restaurant-menus'] })
      queryClient.invalidateQueries({ queryKey: ['restaurant-menu-items'] })
      queryClient.invalidateQueries({
        queryKey: ['all-restaurant-menu-items'],
      })
    } catch (error) {
      console.error('Failed to delete menu items:', error)
      throw error
    }
  }

  const handleBulkUpdate = async (updates: { itemIds: string[]; updates: Partial<MenuItemDto> }) => {
    try {
      // Get the current menu items to find the items to update
      const currentItems = menuItemsData?.menuItems || []
      const itemsToUpdate = currentItems.filter(item => updates.itemIds.includes(item.id))

      // Update items one by one using the existing mutation
      const updatePromises = itemsToUpdate.map(item =>
        updateMenuItemMutation.mutateAsync({
          ...item,
          ...updates.updates,
        } as UpdateMenuItemCommand)
      )
      await Promise.all(updatePromises)

      // Invalidate queries to refresh the data
      queryClient.invalidateQueries({ queryKey: ['restaurant-menus'] })
      queryClient.invalidateQueries({ queryKey: ['restaurant-menu-items'] })
      queryClient.invalidateQueries({
        queryKey: ['all-restaurant-menu-items'],
      })
    } catch (error) {
      console.error('Failed to update menu items:', error)
      throw error
    }
  }

  const menuItems = menuItemsData?.menuItems || []

  return (
    <ContentContainer>
      {/* Success Notification */}
      {showSuccess && (
        <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-right duration-300">
          <div className="bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2">
            <CheckCircle className="w-5 h-5" />
            <span className="font-medium">Menu items added successfully!</span>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Menu Items</h1>
          <p className="text-muted-foreground">Manage all menu items for {selectedLocation.name}</p>
        </div>
        <div className="flex gap-2">
          {/* <Button variant="outline" asChild>
            <Link href="/menu-items/import">
              <Upload className="w-4 h-4 mr-2" />
              Import from Photo
            </Link>
          </Button> */}
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Add Menu Item
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Menu Item</DialogTitle>
              </DialogHeader>
              <MenuItemForm
                mode="create"
                menus={menusData?.menus || []}
                initialData={
                  {
                    restaurantId: restaurantId!,
                  } as Partial<CreateMenuItemCommand>
                }
                onSubmit={handleCreateMenuItem as (data: CreateMenuItemCommand | UpdateMenuItemCommand) => void}
                onCancel={() => setIsCreateDialogOpen(false)}
                isLoading={createMenuItemMutation.isPending}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Tabs value={activeView} onValueChange={value => setActiveView(value as 'cards' | 'table')} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="cards" className="flex items-center gap-2">
            <Grid3X3 className="w-4 h-4" />
            Cards
          </TabsTrigger>
          <TabsTrigger value="table" className="flex items-center gap-2">
            <Table className="w-4 h-4" />
            Table
          </TabsTrigger>
        </TabsList>

        <TabsContent value="cards" className="mt-6">
          {menuItemsLoading ? (
            <div className="flex items-center justify-center py-12">
              <LoadingSpinner size="lg" />
            </div>
          ) : menuItems.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h2 className="text-xl font-semibold mb-2">No Menu Items</h2>
                <p className="text-muted-foreground mb-6">
                  Get started by creating your first menu item or importing from a photo.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button asChild size="lg">
                    <Link href="/menu-items/import">
                      <Upload className="w-4 h-4 mr-2" />
                      Import from Photo
                    </Link>
                  </Button>
                  <Button onClick={() => setIsCreateDialogOpen(true)} variant="outline" size="lg">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Manually
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <>
              {/* Quick Import Card - Show when user has items but might want to import more */}
              {menuItems.length > 0 && menuItems.length < 10 && (
                <Card className="mb-6 border-dashed border-2 border-primary/20 bg-primary/5">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                          <Upload className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-sm">Import More Items</h3>
                          <p className="text-xs text-muted-foreground">
                            Have a menu photo? Import multiple items at once with AI.
                          </p>
                        </div>
                      </div>
                      <Button asChild size="sm">
                        <Link href="/menu-items/import">Import</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {menuItems.map(item => (
                  <MenuItemCard
                    key={item.id}
                    item={item}
                    onEdit={item => {
                      setEditingItem(item)
                      setIsEditDialogOpen(true)
                    }}
                    onDelete={handleDeleteMenuItem}
                  />
                ))}
              </div>
            </>
          )}
        </TabsContent>

        <TabsContent value="table" className="mt-6">
          <MenuItemTableView
            menuItems={menuItems}
            menus={menusData?.menus || []}
            isLoading={menuItemsLoading}
            onEditItem={item => {
              setEditingItem(item)
              setIsEditDialogOpen(true)
            }}
            onDeleteItem={handleDeleteMenuItem}
            onUpdateItem={async item => {
              try {
                await updateMenuItemMutation.mutateAsync(item)
              } catch (error) {
                console.error('Failed to update menu item:', error)
              }
            }}
            onCreateItem={async item => {
              try {
                await createMenuItemMutation.mutateAsync(item as CreateMenuItemCommand)
              } catch (error) {
                console.error('Failed to create menu item:', error)
              }
            }}
            onBulkDelete={handleBulkDelete}
            onBulkUpdate={handleBulkUpdate}
          />
        </TabsContent>
      </Tabs>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Menu Item</DialogTitle>
          </DialogHeader>
          {editingItem && (
            <MenuItemForm
              mode="edit"
              menus={menusData?.menus || []}
              initialData={editingItem as Partial<UpdateMenuItemCommand>}
              onSubmit={handleUpdateMenuItem as (data: CreateMenuItemCommand | UpdateMenuItemCommand) => void}
              onCancel={() => setIsEditDialogOpen(false)}
              isLoading={updateMenuItemMutation.isPending}
            />
          )}
        </DialogContent>
      </Dialog>

      <DeleteConfirmDialog
        isOpen={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        deleteTarget={deleteTarget}
        categories={[]}
        onConfirmDelete={confirmDelete}
      />
    </ContentContainer>
  )
}

function MenuItemCard({
  item,
  onEdit,
  onDelete,
}: {
  item: MenuItemDto
  onEdit: (item: MenuItemDto) => void
  onDelete: (id: string) => void
}) {
  return (
    <Card className="group hover:shadow-sm transition-all">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-medium truncate">{item.name}</h3>
              <div className={`w-2 h-2 rounded-full ${item.isAvailable ? 'bg-green-500' : 'bg-gray-400'}`} />
            </div>
            <p className="text-sm text-muted-foreground truncate">{item.description || 'No description'}</p>
            <p className="text-lg font-semibold text-green-600 mt-1">${item.price.toFixed(2)}</p>
          </div>
          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button variant="ghost" size="sm" onClick={() => onEdit(item)}>
              <Edit className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={() => onDelete(item.id)}>
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default function MenuItemsPage() {
  return (
    <Suspense fallback={<LoadingSpinner size="lg" />}>
      <MenuItemsPageContent />
    </Suspense>
  )
}
