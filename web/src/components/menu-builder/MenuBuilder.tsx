'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
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
  CreateMenuCategoryCommand,
  CreateMenuItemCommand,
} from '../../../shared/types/menu.types'
import { MenuHeader } from './MenuHeader'
import { AddCategoryForm } from './AddCategoryForm'
import { SortableCategory } from './SortableCategory'
import { DeleteConfirmDialog } from './DeleteConfirmDialog'
import { EditWarningDialog } from './EditWarningDialog'
import { ClientOnlyWrapper } from './ClientOnlyWrapper'

// Mock existing menu items (global database of all menu items)
const mockExistingMenuItems: MenuItemDto[] = [
  {
    id: 'existing-1',
    name: 'Caesar Salad',
    description: 'Fresh romaine lettuce with caesar dressing and parmesan cheese',
    price: 14.0,
    isAvailable: true,
    restaurantMenuId: 'menu-1',
    menuCategoryItems: [],
    options: [],
    allergens: [],
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
  },
  {
    id: 'existing-2',
    name: 'Chicken Wings',
    description: 'Buffalo wings served with blue cheese dressing',
    price: 16.5,
    isAvailable: true,
    restaurantMenuId: 'menu-1',
    menuCategoryItems: [],
    options: [],
    allergens: [],
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
  },
  {
    id: 'existing-3',
    name: 'Margherita Pizza',
    description: 'Classic pizza with tomato sauce, mozzarella, and fresh basil',
    price: 22.0,
    isAvailable: true,
    restaurantMenuId: 'menu-1',
    menuCategoryItems: [],
    options: [],
    allergens: [],
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
  },
  {
    id: 'existing-4',
    name: 'Chocolate Cake',
    description: 'Rich chocolate cake with chocolate frosting',
    price: 8.5,
    isAvailable: true,
    restaurantMenuId: 'menu-1',
    menuCategoryItems: [],
    options: [],
    allergens: [],
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
  },
  {
    id: 'existing-5',
    name: 'Fish and Chips',
    description: 'Beer-battered cod with crispy fries and tartar sauce',
    price: 24.0,
    isAvailable: true,
    restaurantMenuId: 'menu-1',
    menuCategoryItems: [],
    options: [],
    allergens: [],
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
  },
]

// Mock menu items that are already assigned to categories
const mockMenuItems: MenuItemDto[] = [
  {
    id: 'item-1',
    name: 'Bruschetta',
    description: 'Toasted bread with fresh tomatoes, garlic, and basil',
    price: 12.5,
    isAvailable: true,
    restaurantMenuId: 'menu-1',
    menuCategoryItems: [],
    options: [],
    allergens: [],
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
  },
  {
    id: 'item-2',
    name: 'Calamari Rings',
    description: 'Crispy fried squid rings with marinara sauce',
    price: 15.0,
    isAvailable: true,
    restaurantMenuId: 'menu-1',
    menuCategoryItems: [],
    options: [],
    allergens: [],
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
  },
  {
    id: 'item-3',
    name: 'Grilled Salmon',
    description: 'Fresh Atlantic salmon with lemon butter sauce',
    price: 28.0,
    isAvailable: true,
    restaurantMenuId: 'menu-1',
    menuCategoryItems: [],
    options: [],
    allergens: [],
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
  },
  {
    id: 'item-4',
    name: 'Ribeye Steak',
    description: '12oz ribeye steak cooked to perfection',
    price: 35.0,
    isAvailable: false,
    restaurantMenuId: 'menu-1',
    menuCategoryItems: [],
    options: [],
    allergens: [],
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
  },
]

// Initial mock categories with MenuCategoryItems
const initialMockCategories: MenuCategoryDto[] = [
  {
    id: '1',
    name: 'Appetizers',
    description: 'Start your meal with our delicious appetizers',
    orderIndex: 0,
    restaurantMenuId: 'menu-1',
    menuCategoryItems: [
      {
        id: 'cat-item-1',
        menuCategoryId: '1',
        menuItemId: 'item-1',
        orderIndex: 0,
        menuItem: mockMenuItems[0],
        createdAt: '2024-01-01',
        updatedAt: '2024-01-01',
      },
      {
        id: 'cat-item-2',
        menuCategoryId: '1',
        menuItemId: 'item-2',
        orderIndex: 1,
        menuItem: mockMenuItems[1],
        createdAt: '2024-01-01',
        updatedAt: '2024-01-01',
      },
    ],
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
  },
  {
    id: '2',
    name: 'Main Courses',
    description: 'Our signature main dishes',
    orderIndex: 1,
    restaurantMenuId: 'menu-1',
    menuCategoryItems: [
      {
        id: 'cat-item-3',
        menuCategoryId: '2',
        menuItemId: 'item-3',
        orderIndex: 0,
        menuItem: mockMenuItems[2],
        createdAt: '2024-01-01',
        updatedAt: '2024-01-01',
      },
      {
        id: 'cat-item-4',
        menuCategoryId: '2',
        menuItemId: 'item-4',
        orderIndex: 1,
        menuItem: mockMenuItems[3],
        createdAt: '2024-01-01',
        updatedAt: '2024-01-01',
      },
    ],
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
  },
]

// Helper function to get menu items for a category
const getMenuItemsForCategory = (category: MenuCategoryDto): MenuItemDto[] => {
  return category.menuCategoryItems
    .sort((a, b) => a.orderIndex - b.orderIndex)
    .map(categoryItem => categoryItem.menuItem!)
    .filter(item => item !== undefined)
}

export function MenuBuilder() {
  const [categories, setCategories] = useState<MenuCategoryDto[]>(initialMockCategories)
  const [editingCategory, setEditingCategory] = useState<string | null>(null)
  const [editingItem, setEditingItem] = useState<string | null>(null)
  const [newItem, setNewItem] = useState<CreateMenuItemCommand & { categoryId: string }>({
    name: '',
    description: '',
    price: 0,
    isAvailable: true,
    restaurantMenuId: 'menu-1',
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
  const [menuTitle, setMenuTitle] = useState('Main Menu')
  const [menuDescription, setMenuDescription] = useState('Our carefully crafted selection of dishes')

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const addCategory = (newCategory: CreateMenuCategoryCommand) => {
    const category: MenuCategoryDto = {
      id: `cat-${Date.now()}`,
      name: newCategory.name,
      description: newCategory.description,
      orderIndex: categories.length,
      restaurantMenuId: newCategory.restaurantMenuId,
      menuCategoryItems: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    setCategories([...categories, category])
  }

  const confirmDeleteCategory = (categoryId: string) => {
    setCategories(categories.filter(cat => cat.id !== categoryId))
    setDeleteDialogOpen(null)
  }

  const confirmEditCategory = (categoryId: string) => {
    setEditingCategory(categoryId)
    setEditDialogOpen(null)
  }

  const updateCategory = (categoryId: string, updates: Partial<MenuCategoryDto>) => {
    setCategories(
      categories.map(cat => (cat.id === categoryId ? { ...cat, ...updates, updatedAt: new Date().toISOString() } : cat))
    )
    setEditingCategory(null)
  }

  const addMenuItem = (categoryId: string) => {
    if (!newItem.name.trim()) return

    const category = categories.find(cat => cat.id === categoryId)
    const orderIndex = category ? category.menuCategoryItems.length : 0

    const newItemId = `item-${Date.now()}`
    const item: MenuItemDto = {
      id: newItemId,
      name: newItem.name,
      description: newItem.description,
      price: newItem.price,
      isAvailable: newItem.isAvailable,
      restaurantMenuId: 'menu-1',
      menuCategoryItems: [],
      options: [],
      allergens: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    const categoryItem: MenuCategoryItemDto = {
      id: `cat-item-${Date.now()}`,
      menuCategoryId: categoryId,
      menuItemId: newItemId,
      orderIndex: orderIndex,
      menuItem: item,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    setCategories(
      categories.map(cat =>
        cat.id === categoryId ? { ...cat, menuCategoryItems: [...cat.menuCategoryItems, categoryItem] } : cat
      )
    )
    closeAddItemForm()
  }

  const addExistingMenuItem = (categoryId: string) => {
    if (!selectedExistingItem) return

    const existingItem = mockExistingMenuItems.find(item => item.id === selectedExistingItem)
    if (!existingItem) return

    const category = categories.find(cat => cat.id === categoryId)
    const orderIndex = category ? category.menuCategoryItems.length : 0

    const categoryItem: MenuCategoryItemDto = {
      id: `cat-item-${Date.now()}`,
      menuCategoryId: categoryId,
      menuItemId: existingItem.id,
      orderIndex: orderIndex,
      menuItem: existingItem,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    setCategories(
      categories.map(cat =>
        cat.id === categoryId ? { ...cat, menuCategoryItems: [...cat.menuCategoryItems, categoryItem] } : cat
      )
    )
    closeAddItemForm()
  }

  const handleAddItemClick = (categoryId: string) => {
    setPopoverOpen(categoryId)
    setAddItemMode(null)
    setSelectedExistingItem('')
    setNewItem({ name: '', description: '', price: 0, isAvailable: true, restaurantMenuId: 'menu-1', categoryId: '' })
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
    setNewItem({ name: '', description: '', price: 0, isAvailable: true, restaurantMenuId: 'menu-1', categoryId: '' })
  }

  const getAvailableExistingItems = () => {
    const currentCategoryId = showNewItemForm
    const currentCategory = categories.find(cat => cat.id === currentCategoryId)
    const usedItemIds = currentCategory?.menuCategoryItems.map(categoryItem => categoryItem.menuItemId) || []

    return mockExistingMenuItems.filter(item => !usedItemIds.includes(item.id))
  }

  const confirmDeleteMenuItem = (categoryId: string, categoryItemId: string) => {
    setCategories(
      categories.map(cat =>
        cat.id === categoryId
          ? {
              ...cat,
              menuCategoryItems: cat.menuCategoryItems.filter(categoryItem => categoryItem.id !== categoryItemId),
            }
          : cat
      )
    )
    setDeleteDialogOpen(null)
  }

  const confirmEditMenuItem = (categoryId: string, itemId: string) => {
    setEditingItem(itemId)
    setEditDialogOpen(null)
  }

  const updateMenuItem = (categoryId: string, itemId: string, updates: Partial<MenuItemDto>) => {
    setCategories(
      categories.map(cat =>
        cat.id === categoryId
          ? {
              ...cat,
              menuCategoryItems: cat.menuCategoryItems.map(categoryItem =>
                categoryItem.menuItemId === itemId && categoryItem.menuItem
                  ? {
                      ...categoryItem,
                      menuItem: { ...categoryItem.menuItem, ...updates, updatedAt: new Date().toISOString() },
                      updatedAt: new Date().toISOString(),
                    }
                  : categoryItem
              ),
            }
          : cat
      )
    )
    setEditingItem(null)
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (active.id !== over?.id) {
      const activeId = String(active.id)
      const overId = String(over?.id)

      // Check if we're dragging categories
      const isDraggingCategory = categories.some(cat => cat.id === activeId)

      if (isDraggingCategory) {
        // Handle category reordering
        setCategories(items => {
          const oldIndex = items.findIndex(item => item.id === activeId)
          const newIndex = items.findIndex(item => item.id === overId)

          const reorderedCategories = arrayMove(items, oldIndex, newIndex)

          // Update orderIndex for all categories
          return reorderedCategories.map((category, index) => ({
            ...category,
            orderIndex: index,
            updatedAt: new Date().toISOString(),
          }))
        })
      } else {
        // Handle menu item reordering within a category
        setCategories(categories => {
          return categories.map(category => {
            const activeCategoryItemIndex = category.menuCategoryItems.findIndex(
              categoryItem => categoryItem.id === activeId
            )
            const overCategoryItemIndex = category.menuCategoryItems.findIndex(
              categoryItem => categoryItem.id === overId
            )

            // If both items are in this category, reorder them
            if (activeCategoryItemIndex !== -1 && overCategoryItemIndex !== -1) {
              const reorderedCategoryItems = arrayMove(
                category.menuCategoryItems,
                activeCategoryItemIndex,
                overCategoryItemIndex
              )

              // Update orderIndex for all category items
              const updatedCategoryItems = reorderedCategoryItems.map((categoryItem, index) => ({
                ...categoryItem,
                orderIndex: index,
                updatedAt: new Date().toISOString(),
              }))

              return {
                ...category,
                menuCategoryItems: updatedCategoryItems,
                updatedAt: new Date().toISOString(),
              }
            }

            return category
          })
        })
      }
    }
  }

  // Sort categories by orderIndex
  const sortedCategories = [...categories].sort((a, b) => a.orderIndex - b.orderIndex)

  return (
    <div className="space-y-6">
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
