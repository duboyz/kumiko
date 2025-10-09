'use client'

import { useParams, useRouter } from 'next/navigation'
import { useRestaurantMenus, useLocationSelection, MenuCategoryDto, useReorderMenuItems, MenuCategoryItemDto, useUpdateMenuItem, useAllergens, useCreateMenuItem, useAddMenuItemToCategory, useCreateMenuCategory } from '@shared'
import { LoadingSpinner } from '@/components'
import { ContentLoadingError } from '@/stories/shared/ContentLoadingError/ContentLoadingError'
import { ContentNotFound } from '@/stories/shared/ContentNotFound/ContentNotFound'
import { ContentContainer } from '@/components'
import { RestaurantMenu } from '@/stories/menus/EditableRestaurantMenu/RestaurantMenu/RestaurantMenu'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { ChevronDown, ChevronRight, Edit, GripVertical, Trash2, Save, X, Plus } from 'lucide-react'
import { useState, useEffect } from 'react'
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core'
import { arrayMove, SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { toast } from 'sonner'

export default function MenuEditPage() {
  const params = useParams()
  const { selectedLocation } = useLocationSelection()

  const menuId = params.id as string
  const restaurantId = selectedLocation?.type === 'Restaurant' ? selectedLocation.id : null

  const { data: menusData, isLoading, error } = useRestaurantMenus(restaurantId || '')

  const menu = menusData?.menus?.find(m => m.id === menuId)

  // Category creation state
  const [showAddCategoryForm, setShowAddCategoryForm] = useState(false)
  const [newCategoryData, setNewCategoryData] = useState({
    name: '',
    description: '',
  })
  const createCategoryMutation = useCreateMenuCategory()

  // Category handlers
  const handleAddCategory = () => {
    setShowAddCategoryForm(true)
    setNewCategoryData({
      name: '',
      description: '',
    })
  }

  const handleCancelAddCategory = () => {
    setShowAddCategoryForm(false)
    setNewCategoryData({
      name: '',
      description: '',
    })
  }

  const handleCreateCategory = () => {
    if (!newCategoryData.name.trim()) {
      toast.error('Category name is required')
      return
    }

    createCategoryMutation.mutate(
      {
        name: newCategoryData.name,
        description: newCategoryData.description,
        orderIndex: 0, // Will be handled by backend
        restaurantMenuId: menu?.id || '',
      },
      {
        onSuccess: (result) => {
          toast.success('Category created successfully')
          setShowAddCategoryForm(false)
          setNewCategoryData({
            name: '',
            description: '',
          })
          // The query will automatically refetch and show the new category
        },
        onError: (error) => {
          console.error('Create category error:', error)
          toast.error('Failed to create category')
        },
      }
    )
  }

  if (isLoading) return <LoadingSpinner />
  if (error)
    return (
      <ContentLoadingError
        message={error.message}
        title="Error Loading Menu"
        backToText="Back to Menus"
        backToLink="/menus"
      />
    )
  if (!menu)
    return (
      <ContentNotFound
        message="The menu you're looking for doesn't exist or you don't have access to it."
        title="Menu Not Found"
        backToText="Back to Menus"
        backToLink="/menus"
      />
    )

  return (
    <ContentContainer className="bg-white">
      {/* <RestaurantMenu menu={menu} /> */}

      {/* Add Category Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold">{menu.name}</h1>
            {menu.description && (
              <p className="text-gray-600 mt-2">{menu.description}</p>
            )}
          </div>
          <Button
            onClick={handleAddCategory}
            disabled={showAddCategoryForm}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Category
          </Button>
        </div>

        {showAddCategoryForm && (
          <div className="mb-6 p-4 border rounded-lg bg-gray-50">
            <h3 className="text-lg font-semibold mb-4">Add New Category</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium mb-1">Name *</label>
                <Input
                  value={newCategoryData.name}
                  onChange={(e) => setNewCategoryData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Category name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <Input
                  value={newCategoryData.description}
                  onChange={(e) => setNewCategoryData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Description (optional)"
                />
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                onClick={handleCreateCategory}
                disabled={createCategoryMutation.isPending}
                className="flex items-center gap-2"
              >
                <Save className="h-4 w-4" />
                {createCategoryMutation.isPending ? 'Creating...' : 'Create Category'}
              </Button>
              <Button
                variant="outline"
                onClick={handleCancelAddCategory}
                disabled={createCategoryMutation.isPending}
              >
                Cancel
              </Button>
            </div>
          </div>
        )}
      </div>

      <div className="space-y-6">
        {menu.categories.map(category => (
          <CategoryTable key={category.id} menuCategory={category} />
        ))}
      </div>





    </ContentContainer>
  )
}

interface CategoryTableProps {
  menuCategory: MenuCategoryDto
}

export const CategoryTable = ({ menuCategory }: CategoryTableProps) => {
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set())
  const [editingItemId, setEditingItemId] = useState<string | null>(null)
  const [showAddItemForm, setShowAddItemForm] = useState(false)
  const [newItemData, setNewItemData] = useState({
    name: '',
    description: '',
    price: '',
    isAvailable: true,
    allergenIds: [] as string[],
  })
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
    // Auto-expand the row when editing
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
    setNewItemData({
      name: '',
      description: '',
      price: '',
      isAvailable: true,
      allergenIds: [],
    })
  }

  const handleCancelAddItem = () => {
    setShowAddItemForm(false)
    setNewItemData({
      name: '',
      description: '',
      price: '',
      isAvailable: true,
      allergenIds: [],
    })
  }

  const handleCreateMenuItem = () => {
    if (!newItemData.name.trim()) {
      toast.error('Name is required')
      return
    }

    if (!newItemData.price || parseFloat(newItemData.price) <= 0) {
      toast.error('Valid price is required')
      return
    }

    createMenuItemMutation.mutate(
      {
        name: newItemData.name,
        description: newItemData.description,
        price: parseFloat(newItemData.price),
        hasOptions: false, // New items don't have options initially
        isAvailable: newItemData.isAvailable,
        restaurantMenuId: menuCategory.restaurantMenuId,
        allergenIds: newItemData.allergenIds,
      },
      {
        onSuccess: (result) => {
          if (!result?.id) {
            toast.error('Failed to create menu item - no ID returned')
            return
          }

          // Now add the created menu item to this category
          addToCategoryMutation.mutate(
            {
              menuItemId: result.id,
              menuCategoryId: menuCategory.id,
              orderIndex: items.length, // Add at the end
            },
            {
              onSuccess: () => {
                toast.success('Menu item created and added to category')
                setShowAddItemForm(false)
                setNewItemData({
                  name: '',
                  description: '',
                  price: '',
                  isAvailable: true,
                  allergenIds: [],
                })
              },
              onError: (error) => {
                console.error('Add to category error:', error)
                toast.error('Menu item created but failed to add to category')
                setShowAddItemForm(false)
                setNewItemData({
                  name: '',
                  description: '',
                  price: '',
                  isAvailable: true,
                  allergenIds: [],
                })
              },
            }
          )
        },
        onError: (error) => {
          console.error('Create menu item error:', error)
          toast.error('Failed to create menu item')
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

    // Update local state immediately for optimistic UI
    const newItems = arrayMove(items, oldIndex, newIndex)
    setItems(newItems)

    // Call API to persist the new order
    const categoryItemIds = newItems.map(item => item.id)
    reorderMutation.mutate(
      { categoryId: menuCategory.id, categoryItemIds },
      {
        onError: () => {
          // Revert on error
          setItems(items)
          toast.error('Failed to reorder items')
        },
        onSuccess: () => {
          toast.success('Order updated successfully')
        },
      }
    )
  }

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-2xl font-bold">{menuCategory.name}</h2>
          {menuCategory.description && (
            <p className="text-gray-600">{menuCategory.description}</p>
          )}
        </div>
        <Button
          onClick={handleAddMenuItem}
          disabled={showAddItemForm}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Add Menu Item
        </Button>
      </div>

      {showAddItemForm && (
        <div className="mb-6 p-4 border rounded-lg bg-gray-50">
          <h3 className="text-lg font-semibold mb-4">Add New Menu Item</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium mb-1">Name *</label>
              <Input
                value={newItemData.name}
                onChange={(e) => setNewItemData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Menu item name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Description</label>
              <Input
                value={newItemData.description}
                onChange={(e) => setNewItemData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Description (optional)"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Price *</label>
              <Input
                type="number"
                step="0.01"
                value={newItemData.price}
                onChange={(e) => setNewItemData(prev => ({ ...prev, price: e.target.value }))}
                placeholder="0.00"
              />
            </div>
          </div>

          <div className="flex items-center gap-4 mb-4">
            <div className="flex items-center gap-2">
              <Checkbox
                checked={newItemData.isAvailable}
                onCheckedChange={(checked) => setNewItemData(prev => ({ ...prev, isAvailable: checked as boolean }))}
              />
              <label className="text-sm">Available</label>
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              onClick={handleCreateMenuItem}
              disabled={createMenuItemMutation.isPending || addToCategoryMutation.isPending}
              className="flex items-center gap-2"
            >
              <Save className="h-4 w-4" />
              {createMenuItemMutation.isPending || addToCategoryMutation.isPending ? 'Creating...' : 'Create Menu Item'}
            </Button>
            <Button
              variant="outline"
              onClick={handleCancelAddItem}
              disabled={createMenuItemMutation.isPending || addToCategoryMutation.isPending}
            >
              Cancel
            </Button>
          </div>
        </div>
      )}

      <div className="rounded-md border">
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]"></TableHead>
                <TableHead className="w-[50px]"></TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <SortableContext items={items.map(item => item.id)} strategy={verticalListSortingStrategy}>
              <TableBody>
                {items.map(item => {
                  const isExpanded = expandedRows.has(item.id)
                  const isEditing = editingItemId === item.id

                  return (
                    <SortableRow
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
              </TableBody>
            </SortableContext>
          </Table>
        </DndContext>
      </div>
    </div>
  )
}

interface SortableRowProps {
  item: MenuCategoryItemDto
  isExpanded: boolean
  isEditing: boolean
  toggleRow: (id: string) => void
  startEditing: (id: string) => void
  stopEditing: () => void
}

const SortableRow = ({ item, isExpanded, isEditing, toggleRow, startEditing, stopEditing }: SortableRowProps) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: item.id })
  const updateMutation = useUpdateMenuItem()
  const { data: allergensData } = useAllergens()

  const [editedData, setEditedData] = useState({
    name: item.menuItem.name,
    description: item.menuItem.description || '',
    price: item.menuItem.price || 0,
    isAvailable: item.menuItem.isAvailable,
    options: item.menuItem.options || [],
    allergenIds: item.menuItem.allergens?.map(a => a.id) || [],
  })

  // Reset edited data when item changes (important for concurrency)
  useEffect(() => {
    if (!isEditing) {
      setEditedData({
        name: item.menuItem.name,
        description: item.menuItem.description || '',
        price: item.menuItem.price || 0,
        isAvailable: item.menuItem.isAvailable,
        options: item.menuItem.options || [],
        allergenIds: item.menuItem.allergens?.map(a => a.id) || [],
      })
    }
  }, [item.menuItem, isEditing])

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  const hasOptions = item.menuItem.options && item.menuItem.options.length > 0
  const hasAllergens = item.menuItem.allergens && item.menuItem.allergens.length > 0

  const handleSave = () => {
    const hasOptions = editedData.options.length > 0

    // Validation
    if (!editedData.name.trim()) {
      toast.error('Name is required')
      return
    }

    if (hasOptions) {
      // Backend requires at least 2 options
      if (editedData.options.length < 2) {
        toast.error('Items with options must have at least 2 options')
        return
      }

      // Validate options
      const invalidOptions = editedData.options.filter(opt => !opt.name.trim())
      if (invalidOptions.length > 0) {
        toast.error('All options must have a name')
        return
      }
    } else {
      // Items without options must have a price
      if (!editedData.price || editedData.price <= 0) {
        toast.error('Items without options must have a valid price')
        return
      }
    }

    const payload = {
      id: item.menuItem.id,
      name: editedData.name,
      description: editedData.description,
      price: hasOptions ? null : (editedData.price || null),
      hasOptions: hasOptions,
      isAvailable: editedData.isAvailable,
      // Backend will recreate all options, so we don't need to send IDs
      options: hasOptions ? editedData.options.map((opt, idx) => ({
        id: undefined, // Always undefined - backend recreates options
        name: opt.name,
        description: opt.description || '',
        price: opt.price || 0,
        orderIndex: idx,
      })) : [],
      allergenIds: editedData.allergenIds,
    }

    console.log('Sending update payload:', payload)

    updateMutation.mutate(
      payload,
      {
        onSuccess: () => {
          toast.success('Menu item updated successfully')
          stopEditing()
        },
        onError: (error: any) => {
          console.error('Update error:', error)
          console.error('Error response:', error?.response?.data)
          const message = error?.response?.data?.message || 'Failed to update menu item'
          toast.error(message)
        },
      }
    )
  }

  const handleCancel = () => {
    setEditedData({
      name: item.menuItem.name,
      description: item.menuItem.description || '',
      price: item.menuItem.price || 0,
      isAvailable: item.menuItem.isAvailable,
      options: item.menuItem.options || [],
      allergenIds: item.menuItem.allergens?.map(a => a.id) || [],
    })
    stopEditing()
  }

  const addOption = () => {
    setEditedData(prev => ({
      ...prev,
      options: [
        ...prev.options,
        {
          id: `temp-${Date.now()}`,
          name: '',
          description: '',
          price: 0,
          orderIndex: prev.options.length,
          menuItemId: item.menuItem.id,
        },
      ],
    }))
  }

  const removeOption = (index: number) => {
    setEditedData(prev => ({
      ...prev,
      options: prev.options.filter((_, i) => i !== index),
    }))
  }

  const updateOption = (index: number, field: string, value: string | number) => {
    setEditedData(prev => ({
      ...prev,
      options: prev.options.map((opt, i) =>
        i === index ? { ...opt, [field]: value } : opt
      ),
    }))
  }

  const toggleAllergen = (allergenId: string) => {
    setEditedData(prev => ({
      ...prev,
      allergenIds: prev.allergenIds.includes(allergenId)
        ? prev.allergenIds.filter(id => id !== allergenId)
        : [...prev.allergenIds, allergenId],
    }))
  }

  return (
    <>
      <TableRow ref={setNodeRef} style={style} className="hover:bg-gray-50">
        <TableCell>
          <div {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing p-1 hover:bg-gray-200 rounded transition-colors">
            <GripVertical className="h-4 w-4 text-gray-400" />
          </div>
        </TableCell>
        <TableCell>
          <button
            onClick={() => toggleRow(item.id)}
            className="p-1 hover:bg-gray-200 rounded transition-colors"
            disabled={isEditing}
          >
            {isExpanded ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </button>
        </TableCell>
        {isEditing ? (
          <>
            <TableCell>
              <Input
                value={editedData.name}
                onChange={(e) => setEditedData(prev => ({ ...prev, name: e.target.value }))}
                className="w-full"
              />
            </TableCell>
            <TableCell>
              <Input
                value={editedData.description}
                onChange={(e) => setEditedData(prev => ({ ...prev, description: e.target.value }))}
                className="w-full"
              />
            </TableCell>
            <TableCell>
              <Input
                type="number"
                step="0.01"
                value={editedData.price}
                onChange={(e) => setEditedData(prev => ({ ...prev, price: parseFloat(e.target.value) || 0 }))}
                className="w-24"
                disabled={editedData.options.length > 0}
                placeholder={editedData.options.length > 0 ? "N/A" : "0.00"}
              />
              {editedData.options.length > 0 && (
                <p className="text-xs text-gray-500 mt-1">Price set by options</p>
              )}
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                <Checkbox
                  checked={editedData.isAvailable}
                  onCheckedChange={(checked) => setEditedData(prev => ({ ...prev, isAvailable: checked as boolean }))}
                />
                <span className="text-sm">Available</span>
              </div>
            </TableCell>
            <TableCell>
              <div className="flex gap-2">
                <Button variant="default" size="sm" onClick={handleSave}>
                  <Save className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm" onClick={handleCancel}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </TableCell>
          </>
        ) : (
          <>
            <TableCell className="font-medium">{item.menuItem.name}</TableCell>
            <TableCell className="text-gray-600">{item.menuItem.description || '-'}</TableCell>
            <TableCell>
              {hasOptions && item.menuItem.options.length > 0 ? (
                (() => {
                  const prices = item.menuItem.options.map(opt => opt.price)
                  const minPrice = Math.min(...prices)
                  const maxPrice = Math.max(...prices)
                  return `${minPrice.toFixed(0)}-${maxPrice.toFixed(0)}`
                })()
              ) : item.menuItem.price ? (
                `$${item.menuItem.price.toFixed(2)}`
              ) : (
                '-'
              )}
            </TableCell>
            <TableCell>
              <Badge variant={item.menuItem.isAvailable ? 'default' : 'secondary'}>
                {item.menuItem.isAvailable ? 'Available' : 'Unavailable'}
              </Badge>
            </TableCell>
            <TableCell>
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" onClick={() => startEditing(item.id)}>
                  <Edit className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm"><Trash2 className="h-4 w-4" /></Button>
              </div>
            </TableCell>
          </>
        )}
      </TableRow>

      {isExpanded && (
        <TableRow key={`${item.id}-details`}>
          <TableCell colSpan={7} className="bg-gray-50">
            <div className="p-4 space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-sm">Options</h4>
                  {isEditing && (
                    <Button variant="outline" size="sm" onClick={addOption}>
                      <Plus className="h-4 w-4 mr-1" />
                      Add Option
                    </Button>
                  )}
                </div>
                {isEditing ? (
                  editedData.options.length > 0 ? (
                    <div className="space-y-2">
                      {editedData.options.map((option, idx) => (
                        <div key={idx} className="flex items-center gap-2 bg-white p-3 rounded border">
                          <Input
                            placeholder="Option name"
                            value={option.name}
                            onChange={(e) => updateOption(idx, 'name', e.target.value)}
                            className="flex-1"
                          />
                          <Input
                            placeholder="Description"
                            value={option.description}
                            onChange={(e) => updateOption(idx, 'description', e.target.value)}
                            className="flex-1"
                          />
                          <Input
                            type="number"
                            step="0.01"
                            placeholder="Price"
                            value={option.price}
                            onChange={(e) => updateOption(idx, 'price', parseFloat(e.target.value) || 0)}
                            className="w-24"
                          />
                          <Button variant="ghost" size="sm" onClick={() => removeOption(idx)}>
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">No options</p>
                  )
                ) : hasOptions ? (
                  <div className="space-y-2">
                    {item.menuItem.options.map(option => (
                      <div
                        key={option.id}
                        className="flex items-center justify-between bg-white p-3 rounded border"
                      >
                        <div>
                          <p className="font-medium">{option.name}</p>
                          {option.description && (
                            <p className="text-sm text-gray-600">{option.description}</p>
                          )}
                        </div>
                        <span className="font-semibold">
                          +${option.price.toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">No options</p>
                )}
              </div>

              <div>
                <h4 className="font-semibold mb-2 text-sm">Allergens</h4>
                {isEditing && allergensData ? (
                  <div className="flex flex-wrap gap-2">
                    {allergensData.map(allergen => (
                      <div key={allergen.id} className="flex items-center gap-2">
                        <Checkbox
                          id={`allergen-${allergen.id}`}
                          checked={editedData.allergenIds.includes(allergen.id)}
                          onCheckedChange={() => toggleAllergen(allergen.id)}
                        />
                        <label
                          htmlFor={`allergen-${allergen.id}`}
                          className="text-sm cursor-pointer"
                        >
                          {allergen.name}
                        </label>
                      </div>
                    ))}
                  </div>
                ) : hasAllergens ? (
                  <div className="flex flex-wrap gap-2">
                    {item.menuItem.allergens.map(allergen => (
                      <Badge key={allergen.id} variant="outline" className="bg-white">
                        {allergen.name}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">No allergens</p>
                )}
              </div>
            </div>
          </TableCell>
        </TableRow>
      )}
    </>
  )
}