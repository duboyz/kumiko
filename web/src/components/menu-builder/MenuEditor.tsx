'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core'
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable'
import {
  MenuCategoryDto,
  MenuItemDto,
  MenuCategoryItemDto,
  RestaurantMenuDto,
  CreateMenuCategoryCommand,
  CreateMenuItemCommand,
} from '../../../shared/types/menu.types'
import {
  useCreateMenuCategory,
  useUpdateMenuCategory,
  useDeleteMenuCategory,
  useCreateMenuItem,
  useUpdateMenuItem,
  useAddMenuItemToCategory,
  useRemoveMenuItemFromCategory,
  useReorderCategories,
  useReorderMenuItems,
  useAllRestaurantMenuItems,
  useLocationSelection,
} from '@shared'
import { MenuHeader, DeleteConfirmDialog, EditWarningDialog } from '@/components'
import { AddCategoryForm } from './AddCategoryForm'
import { SortableCategory } from './SortableCategory'
import { ClientOnlyWrapper } from './ClientOnlyWrapper'

// Helper function to get menu items for a category
const getMenuItemsForCategory = (category: MenuCategoryDto): MenuItemDto[] => {
  return category.menuCategoryItems
    .sort((a, b) => a.orderIndex - b.orderIndex)
    .map(categoryItem => categoryItem.menuItem!)
    .filter(item => item !== undefined)
}

interface MenuEditorProps {
  menu: RestaurantMenuDto
  onBackToList: () => void
}

export function MenuEditor({ menu, onBackToList }: MenuEditorProps) {
  const { selectedLocation } = useLocationSelection()
  const restaurantId = selectedLocation?.type === 'Restaurant' ? selectedLocation.id : null

  const {
    data: allMenuItemsData,
    isLoading: itemsLoading,
    error: itemsError,
  } = useAllRestaurantMenuItems(restaurantId || '')

  console.log('Debug - Restaurant ID:', restaurantId)
  console.log('Debug - Menu ID:', menu.id)
  console.log('Debug - All menu items data:', allMenuItemsData)
  console.log('Debug - Items loading:', itemsLoading)
  console.log('Debug - Items error:', itemsError)
  const createCategoryMutation = useCreateMenuCategory()
  const updateCategoryMutation = useUpdateMenuCategory()
  const deleteCategoryMutation = useDeleteMenuCategory()
  const createItemMutation = useCreateMenuItem()
  const updateItemMutation = useUpdateMenuItem()
  const addItemToCategoryMutation = useAddMenuItemToCategory()
  const removeItemFromCategoryMutation = useRemoveMenuItemFromCategory()
  const reorderCategoriesMutation = useReorderCategories()
  const reorderItemsMutation = useReorderMenuItems()

  // Local state for UI interactions
  const [editingCategory, setEditingCategory] = useState<string | null>(null)
  const [editingItem, setEditingItem] = useState<string | null>(null)
  const [newItem, setNewItem] = useState<CreateMenuItemCommand & { categoryId: string }>({
    name: '',
    description: '',
    price: 0,
    isAvailable: true,
    restaurantMenuId: menu.id,
    categoryId: '',
  })
  const [showNewItemForm, setShowNewItemForm] = useState<string | null>(null)
  const [addItemMode, setAddItemMode] = useState<'existing' | 'new' | null>(null)
  const [selectedExistingItem, setSelectedExistingItem] = useState<string>('')
  const [popoverOpen, setPopoverOpen] = useState<string | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<{
    type: 'category' | 'item'
    id: string
    categoryId?: string
  } | null>(null)
  const [editDialogOpen, setEditDialogOpen] = useState<{
    type: 'category' | 'item'
    id: string
    categoryId?: string
  } | null>(null)
  const [menuTitle, setMenuTitle] = useState(menu.name)
  const [menuDescription, setMenuDescription] = useState(menu.description)

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const categories = menu.categories || []

  const addCategory = async (newCategory: CreateMenuCategoryCommand) => {
    try {
      await createCategoryMutation.mutateAsync({
        ...newCategory,
        restaurantMenuId: menu.id,
      })
    } catch (error) {
      console.error('Failed to create category:', error)
    }
  }

  const confirmDeleteCategory = async (categoryId: string) => {
    try {
      await deleteCategoryMutation.mutateAsync(categoryId)
      setDeleteDialogOpen(null)
    } catch (error) {
      console.error('Failed to delete category:', error)
    }
  }

  const confirmEditCategory = (categoryId: string) => {
    setEditingCategory(categoryId)
    setEditDialogOpen(null)
  }

  const updateCategory = async (categoryId: string, updates: Partial<MenuCategoryDto>) => {
    const category = categories.find((cat: MenuCategoryDto) => cat.id === categoryId)
    if (!category) return

    try {
      await updateCategoryMutation.mutateAsync({
        id: categoryId,
        name: updates.name || category.name,
        description: updates.description || category.description,
        orderIndex: updates.orderIndex || category.orderIndex,
      })
      setEditingCategory(null)
    } catch (error) {
      console.error('Failed to update category:', error)
    }
  }

  const addMenuItem = async (categoryId: string) => {
    if (!newItem.name.trim()) return

    try {
      const itemResult = await createItemMutation.mutateAsync({
        name: newItem.name,
        description: newItem.description,
        price: newItem.price,
        isAvailable: newItem.isAvailable,
        restaurantMenuId: menu.id,
      })

      const category = categories.find((cat: MenuCategoryDto) => cat.id === categoryId)
      const orderIndex = category ? category.menuCategoryItems.length : 0

      if (!itemResult) {
        throw new Error('Failed to create menu item')
      }

      await addItemToCategoryMutation.mutateAsync({
        menuItemId: itemResult.id,
        menuCategoryId: categoryId,
        orderIndex: orderIndex,
      })

      closeAddItemForm()
    } catch (error) {
      console.error('Failed to create menu item:', error)
    }
  }

  const addExistingMenuItem = async (categoryId: string) => {
    if (!selectedExistingItem) return

    try {
      const category = categories.find((cat: MenuCategoryDto) => cat.id === categoryId)
      const orderIndex = category ? category.menuCategoryItems.length : 0

      await addItemToCategoryMutation.mutateAsync({
        menuItemId: selectedExistingItem,
        menuCategoryId: categoryId,
        orderIndex: orderIndex,
      })

      closeAddItemForm()
    } catch (error) {
      console.error('Failed to add existing menu item:', error)
    }
  }

  const handleAddItemClick = (categoryId: string) => {
    setPopoverOpen(categoryId)
    setAddItemMode(null)
    setSelectedExistingItem('')
    setNewItem({
      name: '',
      description: '',
      price: 0,
      isAvailable: true,
      restaurantMenuId: menu.id,
      categoryId: '',
    })
  }

  const handleModeSelect = (mode: 'existing' | 'new', categoryId: string) => {
    setAddItemMode(mode)
    setShowNewItemForm(categoryId)
    setPopoverOpen(null)
  }

  const closeAddItemForm = () => {
    setShowNewItemForm(null)
    setAddItemMode(null)
    setSelectedExistingItem('')
    setNewItem({
      name: '',
      description: '',
      price: 0,
      isAvailable: true,
      restaurantMenuId: menu.id,
      categoryId: '',
    })
  }

  const getAvailableExistingItems = () => {
    const allMenuItems = allMenuItemsData?.menuItems || []
    const currentCategoryId = showNewItemForm
    const currentCategory = categories.find((cat: MenuCategoryDto) => cat.id === currentCategoryId)
    const usedItemIdsInCurrentCategory =
      currentCategory?.menuCategoryItems.map((categoryItem: MenuCategoryItemDto) => categoryItem.menuItemId) || []

    console.log('Debug - All menu items:', allMenuItems.length)
    console.log('Debug - Current category:', currentCategoryId)
    console.log('Debug - Used item IDs in current category:', usedItemIdsInCurrentCategory)
    console.log(
      'Debug - Available items:',
      allMenuItems.filter(item => !usedItemIdsInCurrentCategory.includes(item.id)).length
    )

    // Show all menu items that aren't already in the current category
    return allMenuItems.filter(item => !usedItemIdsInCurrentCategory.includes(item.id))
  }

  const confirmDeleteMenuItem = async (categoryId: string, categoryItemId: string) => {
    try {
      await removeItemFromCategoryMutation.mutateAsync(categoryItemId)
      setDeleteDialogOpen(null)
    } catch (error) {
      console.error('Failed to delete menu item:', error)
    }
  }

  const confirmEditMenuItem = (categoryId: string, itemId: string) => {
    setEditingItem(itemId)
    setEditDialogOpen(null)
  }

  const updateMenuItem = async (categoryId: string, itemId: string, updates: Partial<MenuItemDto>) => {
    const category = categories.find((cat: MenuCategoryDto) => cat.id === categoryId)
    const categoryItem = category?.menuCategoryItems.find((ci: MenuCategoryItemDto) => ci.menuItemId === itemId)
    const item = categoryItem?.menuItem

    if (!item) return

    try {
      await updateItemMutation.mutateAsync({
        id: itemId,
        name: updates.name || item.name,
        description: updates.description || item.description,
        price: updates.price !== undefined ? updates.price : item.price,
        isAvailable: updates.isAvailable !== undefined ? updates.isAvailable : item.isAvailable,
      })
      setEditingItem(null)
    } catch (error) {
      console.error('Failed to update menu item:', error)
    }
  }

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event

    if (active.id !== over?.id) {
      const activeId = String(active.id)
      const overId = String(over?.id)

      const isDraggingCategory = categories.some((cat: MenuCategoryDto) => cat.id === activeId)

      if (isDraggingCategory) {
        const oldIndex = categories.findIndex((item: MenuCategoryDto) => item.id === activeId)
        const newIndex = categories.findIndex((item: MenuCategoryDto) => item.id === overId)

        const reorderedCategories = arrayMove([...categories], oldIndex, newIndex)
        const categoryIds = reorderedCategories.map((cat: MenuCategoryDto) => cat.id)

        try {
          await reorderCategoriesMutation.mutateAsync(categoryIds)
        } catch (error) {
          console.error('Failed to reorder categories:', error)
        }
      } else {
        const category = categories.find((cat: MenuCategoryDto) =>
          cat.menuCategoryItems.some((ci: MenuCategoryItemDto) => ci.id === activeId || ci.id === overId)
        )

        if (category) {
          const activeCategoryItemIndex = category.menuCategoryItems.findIndex(
            (ci: MenuCategoryItemDto) => ci.id === activeId
          )
          const overCategoryItemIndex = category.menuCategoryItems.findIndex(
            (ci: MenuCategoryItemDto) => ci.id === overId
          )

          if (activeCategoryItemIndex !== -1 && overCategoryItemIndex !== -1) {
            const reorderedItems = arrayMove(
              [...category.menuCategoryItems],
              activeCategoryItemIndex,
              overCategoryItemIndex
            )
            const categoryItemIds = reorderedItems.map((ci: MenuCategoryItemDto) => ci.id)

            try {
              await reorderItemsMutation.mutateAsync({ categoryId: category.id, categoryItemIds })
            } catch (error) {
              console.error('Failed to reorder menu items:', error)
            }
          }
        }
      }
    }
  }

  const sortedCategories = [...categories].sort((a, b) => a.orderIndex - b.orderIndex)

  return (
    <div className="space-y-6">
      {/* Back button and menu info */}
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={onBackToList}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Menus
        </Button>
        <div>
          <h2 className="text-xl font-semibold">Editing: {menu.name}</h2>
          <p className="text-sm text-muted-foreground">{menu.description}</p>
        </div>
      </div>

      <MenuHeader
        title={menuTitle}
        description={menuDescription}
        onTitleChange={setMenuTitle}
        onDescriptionChange={setMenuDescription}
      />

      <AddCategoryForm onAddCategory={addCategory} />

      <ClientOnlyWrapper
        fallback={
          <div className="space-y-6">
            {sortedCategories.map(category => (
              <SortableCategory
                key={category.id}
                category={category}
                editingCategory={editingCategory}
                editingItem={editingItem}
                showNewItemForm={showNewItemForm}
                addItemMode={addItemMode}
                selectedExistingItem={selectedExistingItem}
                newItem={newItem}
                popoverOpen={popoverOpen}
                onEditCategory={() => setEditDialogOpen({ type: 'category', id: category.id })}
                onDeleteCategory={() => setDeleteDialogOpen({ type: 'category', id: category.id })}
                onAddItemClick={handleAddItemClick}
                onModeSelect={handleModeSelect}
                onEditItem={(itemId: string) =>
                  setEditDialogOpen({ type: 'item', id: itemId, categoryId: category.id })
                }
                onDeleteItem={(categoryItemId: string) =>
                  setDeleteDialogOpen({ type: 'item', id: categoryItemId, categoryId: category.id })
                }
                onUpdateCategory={updateCategory}
                onUpdateMenuItem={updateMenuItem}
                onAddExistingMenuItem={addExistingMenuItem}
                onAddMenuItem={addMenuItem}
                onCloseAddItemForm={closeAddItemForm}
                onSetSelectedExistingItem={setSelectedExistingItem}
                onSetNewItem={setNewItem}
                onSetPopoverOpen={setPopoverOpen}
                getAvailableExistingItems={getAvailableExistingItems}
                getMenuItemsForCategory={getMenuItemsForCategory}
              />
            ))}
          </div>
        }
      >
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext
            items={[
              ...sortedCategories.map(cat => cat.id),
              ...sortedCategories.flatMap(cat => cat.menuCategoryItems.map(categoryItem => categoryItem.id)),
            ]}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-6">
              {sortedCategories.map(category => (
                <SortableCategory
                  key={category.id}
                  category={category}
                  editingCategory={editingCategory}
                  editingItem={editingItem}
                  showNewItemForm={showNewItemForm}
                  addItemMode={addItemMode}
                  selectedExistingItem={selectedExistingItem}
                  newItem={newItem}
                  popoverOpen={popoverOpen}
                  onEditCategory={() => setEditDialogOpen({ type: 'category', id: category.id })}
                  onDeleteCategory={() => setDeleteDialogOpen({ type: 'category', id: category.id })}
                  onAddItemClick={handleAddItemClick}
                  onModeSelect={handleModeSelect}
                  onEditItem={(itemId: string) =>
                    setEditDialogOpen({ type: 'item', id: itemId, categoryId: category.id })
                  }
                  onDeleteItem={(categoryItemId: string) =>
                    setDeleteDialogOpen({ type: 'item', id: categoryItemId, categoryId: category.id })
                  }
                  onUpdateCategory={updateCategory}
                  onUpdateMenuItem={updateMenuItem}
                  onAddExistingMenuItem={addExistingMenuItem}
                  onAddMenuItem={addMenuItem}
                  onCloseAddItemForm={closeAddItemForm}
                  onSetSelectedExistingItem={setSelectedExistingItem}
                  onSetNewItem={setNewItem}
                  onSetPopoverOpen={setPopoverOpen}
                  getAvailableExistingItems={getAvailableExistingItems}
                  getMenuItemsForCategory={getMenuItemsForCategory}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      </ClientOnlyWrapper>

      {sortedCategories.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <p className="text-muted-foreground text-lg">No categories yet.</p>
            <p className="text-sm text-muted-foreground mt-2">Add your first category above to get started!</p>
          </CardContent>
        </Card>
      )}

      <DeleteConfirmDialog
        isOpen={!!deleteDialogOpen}
        onOpenChange={(open: boolean) => !open && setDeleteDialogOpen(null)}
        deleteTarget={deleteDialogOpen}
        categories={categories}
        onConfirmDelete={() => {
          if (deleteDialogOpen?.type === 'category') {
            confirmDeleteCategory(deleteDialogOpen.id)
          } else if (deleteDialogOpen?.type === 'item' && deleteDialogOpen.categoryId) {
            confirmDeleteMenuItem(deleteDialogOpen.categoryId, deleteDialogOpen.id)
          }
        }}
      />

      <EditWarningDialog
        isOpen={!!editDialogOpen}
        onOpenChange={(open: boolean) => !open && setEditDialogOpen(null)}
        editTarget={editDialogOpen}
        onConfirmEdit={() => {
          if (editDialogOpen?.type === 'category') {
            confirmEditCategory(editDialogOpen.id)
          } else if (editDialogOpen?.type === 'item' && editDialogOpen.categoryId) {
            confirmEditMenuItem(editDialogOpen.categoryId, editDialogOpen.id)
          }
        }}
      />
    </div>
  )
}
