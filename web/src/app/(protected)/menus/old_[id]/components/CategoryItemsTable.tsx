import { Table, TableBody, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { useState, useEffect } from 'react'
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core'
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { MenuCategoryDto, useReorderMenuItems, useCreateMenuItem, useAddMenuItemToCategory } from '@shared'
import { toast } from 'sonner'
import { useTranslations } from 'next-intl'
import { MenuItemRow } from './MenuItemRow'
import { AddMenuItemRow } from './AddMenuItemRow'

interface CategoryItemsTableProps {
  menuCategory: MenuCategoryDto
}

export const CategoryItemsTable = ({ menuCategory }: CategoryItemsTableProps) => {
  const t = useTranslations('menus')
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set())
  const [editingItemId, setEditingItemId] = useState<string | null>(null)
  const [showAddItemForm, setShowAddItemForm] = useState(false)
  const [items, setItems] = useState(menuCategory.menuCategoryItems)

  const reorderMutation = useReorderMenuItems()
  const createMenuItemMutation = useCreateMenuItem()
  const addToCategoryMutation = useAddMenuItemToCategory()

  // Update items when menuCategory changes
  useEffect(() => {
    setItems(menuCategory.menuCategoryItems)
  }, [menuCategory.menuCategoryItems])

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const toggleRow = (itemId: string) => {
    setExpandedRows(prev => {
      const newSet = new Set(prev)
      if (newSet.has(itemId)) {
        newSet.delete(itemId)
      } else {
        newSet.add(itemId)
      }
      return newSet
    })
  }

  const startEditing = (itemId: string) => {
    setEditingItemId(itemId)
    setExpandedRows(prev => {
      const newSet = new Set(prev)
      newSet.add(itemId)
      return newSet
    })
  }

  const stopEditing = () => {
    setEditingItemId(null)
  }

  const handleAddMenuItem = () => {
    setShowAddItemForm(true)
  }

  const handleCancelAddItem = () => {
    setShowAddItemForm(false)
  }

  const handleCreateMenuItem = (data: {
    name: string
    description: string
    price: string
    isAvailable: boolean
    allergenIds: string[]
    options: Array<{ name: string; description: string; price: number }>
  }) => {
    if (!data.name.trim()) {
      toast.error(t('nameRequired'))
      return
    }

    const hasOptions = data.options.length > 0

    // Validation for items with options
    if (hasOptions) {
      if (data.options.length < 2) {
        toast.error(t('itemsWithOptionsNeed2'))
        return
      }

      const invalidOptions = data.options.filter(opt => !opt.name.trim())
      if (invalidOptions.length > 0) {
        toast.error(t('allOptionsMustHaveName'))
        return
      }
    } else {
      // Validation for simple items
      if (!data.price || parseFloat(data.price) <= 0) {
        toast.error(t('itemsWithoutOptionsNeedPrice'))
        return
      }
    }

    createMenuItemMutation.mutate(
      {
        name: data.name,
        description: data.description,
        price: hasOptions ? null : parseFloat(data.price),
        hasOptions: hasOptions,
        isAvailable: data.isAvailable,
        restaurantMenuId: menuCategory.restaurantMenuId,
        allergenIds: data.allergenIds,
        options: hasOptions ? data.options.map((opt, idx) => ({
          name: opt.name,
          description: opt.description || '',
          price: opt.price || 0,
          orderIndex: idx,
        })) : [],
      },
      {
        onSuccess: (result) => {
          if (!result?.id) {
            toast.error('Failed to create menu item - no ID returned')
            return
          }

          addToCategoryMutation.mutate(
            {
              menuItemId: result.id,
              menuCategoryId: menuCategory.id,
              orderIndex: items.length,
            },
            {
              onSuccess: () => {
                toast.success(t('menuItemCreated'))
                setShowAddItemForm(false)
              },
              onError: (error) => {
                console.error('Add to category error:', error)
                toast.error(t('failedToCreate'))
                setShowAddItemForm(false)
              },
            }
          )
        },
        onError: (error) => {
          console.error('Create menu item error:', error)
          toast.error(t('failedToCreate'))
        },
      }
    )
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (!over || active.id === over.id) {
      return
    }

    const oldIndex = items.findIndex(item => item.id === active.id)
    const newIndex = items.findIndex(item => item.id === over.id)

    if (oldIndex === -1 || newIndex === -1) {
      return
    }

    const newItems = arrayMove(items, oldIndex, newIndex)
    setItems(newItems)

    const categoryItemIds = newItems.map(item => item.id)
    reorderMutation.mutate(
      { categoryId: menuCategory.id, categoryItemIds },
      {
        onError: () => {
          setItems(items)
          toast.error(t('failedToReorder'))
        },
        onSuccess: () => {
          toast.success(t('orderUpdated'))
        },
      }
    )
  }

  return (
    <div className="border rounded">
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <div className="rounded overflow-hidden">
          <Table>
            <TableHeader className="bg-gray-200">
              <TableRow className="uppercase text-xs font-bold">
                <TableHead className="w-[50px]"></TableHead>
                <TableHead className="w-[50px]"></TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <SortableContext items={items.map(item => item.id)} strategy={verticalListSortingStrategy}>
              <TableBody className="bg-white">
                {items.map(item => {
                  const isExpanded = expandedRows.has(item.id)
                  const isEditing = editingItemId === item.id

                  return (
                    <MenuItemRow
                      key={item.id}
                      item={item}
                      isExpanded={isExpanded}
                      isEditing={isEditing}
                      toggleRow={toggleRow}
                      startEditing={startEditing}
                      stopEditing={stopEditing}
                    />
                  )
                })}
                {showAddItemForm && (
                  <AddMenuItemRow
                    onSave={handleCreateMenuItem}
                    onCancel={handleCancelAddItem}
                    isSubmitting={createMenuItemMutation.isPending || addToCategoryMutation.isPending}
                  />
                )}
              </TableBody>
            </SortableContext>
          </Table>
        </div>
      </DndContext>
      <div className="pt-2 mb-2 border-t">
        <Button variant="ghost" onClick={handleAddMenuItem} className="w-full" disabled={showAddItemForm}>
          <Plus className="w-4 h-4 mr-1" /> {t('addItem')}
        </Button>
      </div>
    </div>
  )
}
