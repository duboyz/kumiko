'use client'

import { useState, useMemo, useEffect, useCallback } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Trash2,
  Edit,
  Package,
  Search,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  Save,
  X,
  Plus,
  Check,
  Info,
  Users,
  Upload,
} from 'lucide-react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { toast } from 'sonner'
import { MenuItemDto, RestaurantMenuDto, useBulkDeleteMenuItems, Currency, formatPrice, useLocationSelection } from '@shared'
import { DeleteConfirmDialog } from '@/stories/shared/DeleteConfirmDialog/DeleteConfirmDialog'

interface MenuItemTableViewProps {
  menuItems: MenuItemDto[]
  menus: RestaurantMenuDto[]
  isLoading: boolean
  onEditItem?: (item: MenuItemDto) => void
  onDeleteItem?: (itemId: string) => void
  onUpdateItem?: (item: MenuItemDto) => void
  onCreateItem?: (item: Partial<MenuItemDto>) => void
  onBulkDelete?: (itemIds: string[]) => void
  onBulkUpdate?: (updates: { itemIds: string[]; updates: Partial<MenuItemDto> }) => void
}

interface EditableMenuItem extends MenuItemDto {
  isEditing?: boolean
  isNew?: boolean
}

export default function MenuItemTableView({
  menuItems,
  menus,
  isLoading,
  onEditItem,
  onDeleteItem,
  onUpdateItem,
  onCreateItem,
  onBulkDelete,
  onBulkUpdate,
}: MenuItemTableViewProps) {
  const { selectedLocation } = useLocationSelection()
  const currency = selectedLocation?.currency ?? Currency.USD
  const bulkDeleteMenuItemsMutation = useBulkDeleteMenuItems()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedMenu, setSelectedMenu] = useState<string>('')
  const [deleteConfirmItem, setDeleteConfirmItem] = useState<MenuItemDto | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [editingItems, setEditingItems] = useState<EditableMenuItem[]>([])
  const [isAddingNew, setIsAddingNew] = useState(false)
  const [isGlobalEditMode, setIsGlobalEditMode] = useState(false)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [focusedRowId, setFocusedRowId] = useState<string | null>(null)
  const [focusedField, setFocusedField] = useState<string | null>(null)
  const [isMac, setIsMac] = useState(false)
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set())
  const [bulkDeleteConfirm, setBulkDeleteConfirm] = useState(false)
  const [bulkMenuAssign, setBulkMenuAssign] = useState(false)
  const [bulkMenuId, setBulkMenuId] = useState<string>('')
  const [isBulkOperationLoading, setIsBulkOperationLoading] = useState(false)

  // Detect operating system
  useEffect(() => {
    const userAgent = navigator.userAgent.toLowerCase()
    const isMacOS = userAgent.includes('mac') || userAgent.includes('darwin')
    setIsMac(isMacOS)
  }, [])

  // Filter and paginate menu items
  const { filteredItems, paginatedItems, totalPages, isAllSelected, isIndeterminate } = useMemo(() => {
    // Filter items based on search and menu
    const filtered = menuItems.filter(item => {
      const matchesSearch =
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesMenu = !selectedMenu || item.restaurantMenuId === selectedMenu
      return matchesSearch && matchesMenu
    })

    // Calculate pagination
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    const paginated = filtered.slice(startIndex, endIndex)
    const totalPagesCalc = Math.ceil(filtered.length / itemsPerPage)

    // Calculate selection state
    const selectedCount = paginated.filter(item => selectedItems.has(item.id)).length
    const isAllSelected = paginated.length > 0 && selectedCount === paginated.length
    const isIndeterminate = selectedCount > 0 && selectedCount < paginated.length

    return {
      filteredItems: filtered,
      paginatedItems: paginated,
      totalPages: totalPagesCalc,
      isAllSelected,
      isIndeterminate,
    }
  }, [menuItems, searchTerm, selectedMenu, currentPage, itemsPerPage, selectedItems])

  const handleDelete = (item: MenuItemDto) => {
    setDeleteConfirmItem(item)
  }

  const confirmDelete = () => {
    if (deleteConfirmItem && onDeleteItem) {
      onDeleteItem(deleteConfirmItem.id)
      setDeleteConfirmItem(null)
    }
  }

  // Bulk selection handlers
  const handleSelectItem = (itemId: string, checked: boolean) => {
    setSelectedItems(prev => {
      const newSet = new Set(prev)
      if (checked) {
        newSet.add(itemId)
      } else {
        newSet.delete(itemId)
      }
      return newSet
    })
  }

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const allIds = new Set(paginatedItems.map(item => item.id))
      setSelectedItems(allIds)
    } else {
      setSelectedItems(new Set())
    }
  }

  const handleBulkDelete = () => {
    setBulkDeleteConfirm(true)
  }

  const confirmBulkDelete = async () => {
    if (selectedItems.size > 0) {
      setIsBulkOperationLoading(true)
      try {
        const result = await bulkDeleteMenuItemsMutation.mutateAsync({
          menuItemIds: Array.from(selectedItems),
        })

        setSelectedItems(new Set())
        setBulkDeleteConfirm(false)

        if (result && result.itemsNotFound > 0) {
          toast.warning(`Deleted ${result.itemsDeleted} menu items. ${result.itemsNotFound} items were not found.`)
        } else if (result) {
          toast.success(`Deleted ${result.itemsDeleted} menu items`)
        }
      } catch (error) {
        toast.error('Failed to delete menu items')
        console.error('Bulk delete error:', error)
      } finally {
        setIsBulkOperationLoading(false)
      }
    }
  }

  const handleBulkMenuAssign = () => {
    setBulkMenuAssign(true)
  }

  const confirmBulkMenuAssign = async () => {
    if (onBulkUpdate && selectedItems.size > 0 && bulkMenuId) {
      setIsBulkOperationLoading(true)
      try {
        await onBulkUpdate({
          itemIds: Array.from(selectedItems),
          updates: { restaurantMenuId: bulkMenuId },
        })
        setSelectedItems(new Set())
        setBulkMenuAssign(false)
        setBulkMenuId('')
        toast.success(`Updated ${selectedItems.size} menu items`)
      } catch (error) {
        toast.error('Failed to update menu items')
        console.error('Bulk update error:', error)
      } finally {
        setIsBulkOperationLoading(false)
      }
    }
  }

  const handleBulkToggleAvailability = async () => {
    if (onBulkUpdate && selectedItems.size > 0) {
      setIsBulkOperationLoading(true)
      try {
        // Get the first selected item to determine current availability state
        const firstSelected = paginatedItems.find(item => selectedItems.has(item.id))
        const newAvailability = !firstSelected?.isAvailable

        await onBulkUpdate({
          itemIds: Array.from(selectedItems),
          updates: { isAvailable: newAvailability },
        })
        setSelectedItems(new Set())
        toast.success(`Updated availability for ${selectedItems.size} menu items`)
      } catch (error) {
        toast.error('Failed to update menu items')
        console.error('Bulk update error:', error)
      } finally {
        setIsBulkOperationLoading(false)
      }
    }
  }

  const handleEdit = (item: MenuItemDto) => {
    const editableItem: EditableMenuItem = { ...item, isEditing: true }
    setEditingItems(prev => [...prev.filter(i => i.id !== item.id), editableItem])
  }

  const handleCancelEdit = (itemId: string) => {
    setEditingItems(prev => prev.filter(i => i.id !== itemId))
  }

  const handleSaveEdit = async (item: EditableMenuItem) => {
    try {
      if (item.isNew && onCreateItem) {
        // Create new item
        await onCreateItem({
          name: item.name,
          description: item.description,
          price: item.price,
          isAvailable: item.isAvailable,
          restaurantMenuId: item.restaurantMenuId,
        })
        toast.success('Menu item created successfully!')
        setIsAddingNew(false)
      } else if (onUpdateItem) {
        // Update existing item
        await onUpdateItem(item)
        toast.success('Menu item updated successfully!')
      }
      setEditingItems(prev => prev.filter(i => i.id !== item.id))
    } catch (error) {
      toast.error('Failed to save menu item')
    }
  }

  const handleAddNew = () => {
    const newItem: EditableMenuItem = {
      id: `new-${Date.now()}`,
      name: '',
      description: '',
      price: 0,
      hasOptions: false,
      isAvailable: true,
      restaurantMenuId: menus[0]?.id || '',
      menuCategoryItems: [],
      options: [],
      allergens: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isEditing: true,
      isNew: true,
    }
    setEditingItems(prev => [...prev, newItem])
    setIsAddingNew(true)
    setHasUnsavedChanges(true)

    // Focus the first field of the new item
    setTimeout(() => {
      setFocusedRowId(newItem.id)
      setFocusedField('name')
      const firstInput = document.querySelector(`[data-field="name"][data-item-id="${newItem.id}"]`) as HTMLInputElement
      if (firstInput) {
        firstInput.focus()
      }
    }, 100)
  }

  const handleCancelAdd = () => {
    setEditingItems(prev => prev.filter(i => !i.isNew))
    setIsAddingNew(false)
    setHasUnsavedChanges(editingItems.length > 1)
  }

  const handleToggleGlobalEditMode = () => {
    if (isGlobalEditMode) {
      // Cancel all edits
      setEditingItems([])
      setIsAddingNew(false)
      setHasUnsavedChanges(false)
    } else {
      // Enter global edit mode - put all visible items in edit mode
      const editableItems = paginatedItems.map(item => ({
        ...item,
        isEditing: true,
        isNew: false,
      }))
      setEditingItems(editableItems)
      setHasUnsavedChanges(false)
    }
    setIsGlobalEditMode(!isGlobalEditMode)
  }

  const updateEditingItem = (itemId: string, field: keyof EditableMenuItem, value: any) => {
    setEditingItems(prev => prev.map(i => (i.id === itemId ? { ...i, [field]: value } : i)))
    setHasUnsavedChanges(true)
  }

  const getEditingItem = (itemId: string) => {
    return editingItems.find(i => i.id === itemId)
  }

  const isEditing = (itemId: string) => {
    return editingItems.some(i => i.id === itemId)
  }

  // Keyboard navigation handlers
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      // Global shortcuts
      if (event.shiftKey && event.key === 'Enter') {
        event.preventDefault()
        handleAddNew()
        return
      }

      if (event.key === 'Escape') {
        if (isGlobalEditMode) {
          handleToggleGlobalEditMode()
        } else if (focusedRowId) {
          const editingItem = getEditingItem(focusedRowId)
          if (editingItem?.isNew) {
            handleCancelAdd()
          } else {
            handleCancelEdit(focusedRowId)
          }
        }
        return
      }

      // Use Cmd on Mac, Ctrl on Windows/Linux
      const modifierKey = isMac ? event.metaKey : event.ctrlKey

      if (modifierKey) {
        switch (event.key) {
          case 's':
            event.preventDefault()
            if (focusedRowId) {
              const editingItem = getEditingItem(focusedRowId)
              if (editingItem) {
                handleSaveEdit(editingItem)
              }
            }
            break
          case 'e':
            event.preventDefault()
            if (!isGlobalEditMode) {
              handleToggleGlobalEditMode()
            }
            break
          case 'a':
            event.preventDefault()
            handleSelectAll(!isAllSelected)
            break
        }
      }
    },
    [
      isGlobalEditMode,
      focusedRowId,
      isMac,
      handleAddNew,
      handleToggleGlobalEditMode,
      handleCancelAdd,
      handleCancelEdit,
      handleSaveEdit,
      getEditingItem,
    ]
  )

  // Set up global keyboard listeners
  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  // Field navigation
  const focusNextField = useCallback((currentField: string, itemId: string) => {
    const fieldOrder = ['name', 'description', 'menu', 'price']
    const currentIndex = fieldOrder.indexOf(currentField)
    const nextField = fieldOrder[currentIndex + 1]

    if (nextField) {
      setFocusedField(nextField)
      setFocusedRowId(itemId)
      // Focus the next input
      setTimeout(() => {
        const nextInput = document.querySelector(
          `[data-field="${nextField}"][data-item-id="${itemId}"]`
        ) as HTMLInputElement
        if (nextInput) {
          nextInput.focus()
        }
      }, 0)
    }
  }, [])

  const focusPreviousField = useCallback((currentField: string, itemId: string) => {
    const fieldOrder = ['name', 'description', 'menu', 'price']
    const currentIndex = fieldOrder.indexOf(currentField)
    const prevField = fieldOrder[currentIndex - 1]

    if (prevField) {
      setFocusedField(prevField)
      setFocusedRowId(itemId)
      // Focus the previous input
      setTimeout(() => {
        const prevInput = document.querySelector(
          `[data-field="${prevField}"][data-item-id="${itemId}"]`
        ) as HTMLInputElement
        if (prevInput) {
          prevInput.focus()
        }
      }, 0)
    }
  }, [])

  // Handle field-specific keyboard events
  const handleFieldKeyDown = useCallback(
    (event: React.KeyboardEvent, field: string, itemId: string) => {
      if (event.key === 'Tab') {
        event.preventDefault()
        if (event.shiftKey) {
          focusPreviousField(field, itemId)
        } else {
          focusNextField(field, itemId)
        }
      } else if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault()
        const editingItem = getEditingItem(itemId)
        if (editingItem) {
          handleSaveEdit(editingItem)
        }
      }
    },
    [focusNextField, focusPreviousField, getEditingItem, handleSaveEdit]
  )

  if (isLoading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-2 text-gray-600">Loading menu items...</p>
      </div>
    )
  }

  if (menuItems.length === 0 && !isAddingNew) {
    return (
      <div className="text-center py-8">
        <Package className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <p className="text-gray-600">No menu items found. Create your first one!</p>
        <Button onClick={handleAddNew} className="mt-4">
          <Plus className="mr-2 h-4 w-4" />
          Add Menu Item
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span>Menu Items ({filteredItems.length})</span>
              {hasUnsavedChanges && (
                <Badge variant="outline" className="text-orange-600 border-orange-200">
                  Unsaved Changes
                </Badge>
              )}
            </div>
            <div className="flex gap-2 items-center">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search menu items..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="pl-8 w-64"
                />
              </div>

              {/* Menu Filter */}
              <select
                value={selectedMenu}
                onChange={e => setSelectedMenu(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Menus</option>
                {menus.map(menu => (
                  <option key={menu.id} value={menu.id}>
                    {menu.name}
                  </option>
                ))}
              </select>

              {/* Items per page */}
              <select
                value={itemsPerPage}
                onChange={e => setItemsPerPage(Number(e.target.value))}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value={5}>5 per page</option>
                <option value={10}>10 per page</option>
                <option value={25}>25 per page</option>
                <option value={50}>50 per page</option>
              </select>

              {/* Import Button */}
              <Button variant="outline" size="sm" asChild>
                <a href="/menu-items/import">
                  <Upload />
                  Import
                </a>
              </Button>

              {/* Global Edit Mode Toggle */}
              <div className="flex items-center gap-3">
                <div className="flex items-center space-x-2">
                  <Switch id="edit-mode" checked={isGlobalEditMode} onCheckedChange={handleToggleGlobalEditMode} />
                  <Label htmlFor="edit-mode" className="text-sm font-medium">
                    Edit Mode
                  </Label>
                </div>
              </div>
            </div>
          </CardTitle>
        </CardHeader>

        <CardContent>
          {/* Add Row Button and Bulk Actions */}
          <div className="mb-4 flex justify-between items-center">
            <div className="flex items-center gap-4">
              <Button onClick={handleAddNew} disabled={isAddingNew} size="sm" variant="outline">
                <Plus className="mr-2 h-4 w-4" />
                Add (Shift + Enter)
              </Button>

              {/* Bulk Actions */}
              {selectedItems.size > 0 && (
                <div className="flex items-center gap-2 pl-4 border-l border-gray-200">
                  <span className="text-sm text-gray-600">{selectedItems.size} selected</span>
                  <Button
                    onClick={handleBulkDelete}
                    size="sm"
                    variant="outline"
                    className="text-red-600 hover:text-red-700"
                    disabled={isBulkOperationLoading || bulkDeleteMenuItemsMutation.isPending}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </Button>
                  <Button onClick={handleBulkMenuAssign} size="sm" variant="outline" disabled={isBulkOperationLoading}>
                    <Users className="mr-2 h-4 w-4" />
                    Assign to Menu
                  </Button>
                  <Button
                    onClick={handleBulkToggleAvailability}
                    size="sm"
                    variant="outline"
                    disabled={isBulkOperationLoading}
                  >
                    <Check className="mr-2 h-4 w-4" />
                    Toggle Availability
                  </Button>
                </div>
              )}

              {/* Keyboard shortcuts info tooltip */}
              <div className="relative group">
                <Info className="h-4 w-4 text-gray-400 hover:text-gray-600 cursor-help" />
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                  <div className="space-y-1">
                    <div>
                      <span className="font-semibold">Shift+Enter:</span> Add new menu item
                    </div>
                    <div>
                      <span className="font-semibold">Tab:</span> Navigate between fields
                    </div>
                    <div>
                      <span className="font-semibold">Enter:</span> Save current row
                    </div>
                    <div>
                      <span className="font-semibold">Esc:</span> Cancel edit
                    </div>
                    <div>
                      <span className="font-semibold">{isMac ? 'Cmd+S:' : 'Ctrl+S:'}</span> Save current row
                    </div>
                    <div>
                      <span className="font-semibold">{isMac ? 'Cmd+E:' : 'Ctrl+E:'}</span> Toggle edit mode
                    </div>
                    <div>
                      <span className="font-semibold">Ctrl+A:</span> Select all
                    </div>
                  </div>
                  {/* Arrow pointing down */}
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-gray-900"></div>
                </div>
              </div>
            </div>
            {isGlobalEditMode && <div className="text-sm text-gray-600">Edit mode active - All rows are editable</div>}
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]">
                  <Checkbox
                    checked={isAllSelected}
                    onCheckedChange={handleSelectAll}
                    ref={el => {
                      if (el) {
                        ; (el as any).indeterminate = isIndeterminate
                      }
                    }}
                  />
                </TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Menu</TableHead>
                <TableHead>Options</TableHead>
                <TableHead className="text-right">Price</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {/* Render existing menu items */}
              {paginatedItems.map(item => {
                const editingItem = getEditingItem(item.id)
                const isCurrentlyEditing = isEditing(item.id) || isGlobalEditMode
                const menu = menus.find(m => m.id === item.restaurantMenuId)

                return (
                  <TableRow
                    key={item.id}
                    className={`hover:bg-gray-50 ${isGlobalEditMode ? 'bg-blue-50/30' : ''} ${selectedItems.has(item.id) ? 'bg-blue-50' : ''}`}
                  >
                    <TableCell>
                      <Checkbox
                        checked={selectedItems.has(item.id)}
                        onCheckedChange={checked => handleSelectItem(item.id, checked as boolean)}
                      />
                    </TableCell>
                    <TableCell>
                      {isCurrentlyEditing && editingItem ? (
                        <Input
                          value={editingItem.name}
                          onChange={e => updateEditingItem(item.id, 'name', e.target.value)}
                          onKeyDown={e => handleFieldKeyDown(e, 'name', item.id)}
                          onFocus={() => {
                            setFocusedRowId(item.id)
                            setFocusedField('name')
                          }}
                          placeholder="Menu item name"
                          className="w-full"
                          data-field="name"
                          data-item-id={item.id}
                        />
                      ) : (
                        <div className="font-medium">{item.name}</div>
                      )}
                    </TableCell>
                    <TableCell>
                      {isCurrentlyEditing && editingItem ? (
                        <Input
                          value={editingItem.description}
                          onChange={e => updateEditingItem(item.id, 'description', e.target.value)}
                          onKeyDown={e => handleFieldKeyDown(e, 'description', item.id)}
                          onFocus={() => {
                            setFocusedRowId(item.id)
                            setFocusedField('description')
                          }}
                          placeholder="Description"
                          className="w-full"
                          data-field="description"
                          data-item-id={item.id}
                        />
                      ) : (
                        <div className="text-sm text-gray-500 truncate max-w-[200px]">{item.description}</div>
                      )}
                    </TableCell>
                    <TableCell>
                      {isCurrentlyEditing && editingItem ? (
                        <select
                          value={editingItem.restaurantMenuId}
                          onChange={e => updateEditingItem(item.id, 'restaurantMenuId', e.target.value)}
                          onKeyDown={e => handleFieldKeyDown(e, 'menu', item.id)}
                          onFocus={() => {
                            setFocusedRowId(item.id)
                            setFocusedField('menu')
                          }}
                          className="px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                          data-field="menu"
                          data-item-id={item.id}
                        >
                          <option value="">Select Menu</option>
                          {menus.map(menu => (
                            <option key={menu.id} value={menu.id}>
                              {menu.name}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <Badge variant="outline" className="text-xs">
                          {menu?.name || 'Unknown Menu'}
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="text-sm text-gray-500">
                        {item.options && item.options.length > 0
                          ? `${item.options.length} option${item.options.length !== 1 ? 's' : ''}`
                          : 'No options'}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      {isCurrentlyEditing && editingItem ? (
                        <Input
                          type="number"
                          step="0.01"
                          value={editingItem.price || ''}
                          onChange={e => updateEditingItem(item.id, 'price', parseFloat(e.target.value) || 0)}
                          onKeyDown={e => handleFieldKeyDown(e, 'price', item.id)}
                          onFocus={() => {
                            setFocusedRowId(item.id)
                            setFocusedField('price')
                          }}
                          placeholder="0.00"
                          className="w-20 text-right"
                          data-field="price"
                          data-item-id={item.id}
                        />
                      ) : (
                        <span className="font-medium">
                          {item.price !== null ? formatPrice(item.price, currency) : 'Variable'}
                        </span>
                      )}
                    </TableCell>
                    <TableCell>
                      {isCurrentlyEditing && editingItem ? (
                        <div className="flex items-center space-x-2">
                          <Switch
                            checked={editingItem.isAvailable}
                            onCheckedChange={checked => updateEditingItem(item.id, 'isAvailable', checked)}
                          />
                          <Label className="text-sm">{editingItem.isAvailable ? 'Available' : 'Unavailable'}</Label>
                        </div>
                      ) : (
                        <Badge variant={item.isAvailable ? 'default' : 'secondary'}>
                          {item.isAvailable ? 'Available' : 'Unavailable'}
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      {isCurrentlyEditing && editingItem && !isGlobalEditMode ? (
                        <div className="flex gap-1">
                          <Button size="sm" onClick={() => handleSaveEdit(editingItem)} className="h-8 w-8 p-0">
                            <Save className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => (editingItem.isNew ? handleCancelAdd() : handleCancelEdit(item.id))}
                            className="h-8 w-8 p-0"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ) : !isGlobalEditMode ? (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleEdit(item)}>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>

                            <DropdownMenuItem onClick={() => handleDelete(item)} className="text-red-600">
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      ) : (
                        <div className="flex gap-1">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDelete(item)}
                            className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                            title="Delete"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                )
              })}

              {/* Render new items being added */}
              {editingItems
                .filter(item => item.isNew)
                .map(item => {
                  const menu = menus.find(m => m.id === item.restaurantMenuId)

                  return (
                    <TableRow key={item.id} className="bg-green-50/30 border-l-4 border-l-green-400">
                      <TableCell>
                        <Checkbox
                          checked={selectedItems.has(item.id)}
                          onCheckedChange={checked => handleSelectItem(item.id, checked as boolean)}
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          value={item.name}
                          onChange={e => updateEditingItem(item.id, 'name', e.target.value)}
                          onKeyDown={e => handleFieldKeyDown(e, 'name', item.id)}
                          onFocus={() => {
                            setFocusedRowId(item.id)
                            setFocusedField('name')
                          }}
                          placeholder="Menu item name"
                          className="w-full"
                          data-field="name"
                          data-item-id={item.id}
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          value={item.description}
                          onChange={e => updateEditingItem(item.id, 'description', e.target.value)}
                          onKeyDown={e => handleFieldKeyDown(e, 'description', item.id)}
                          onFocus={() => {
                            setFocusedRowId(item.id)
                            setFocusedField('description')
                          }}
                          placeholder="Description"
                          className="w-full"
                          data-field="description"
                          data-item-id={item.id}
                        />
                      </TableCell>
                      <TableCell>
                        <select
                          value={item.restaurantMenuId}
                          onChange={e => updateEditingItem(item.id, 'restaurantMenuId', e.target.value)}
                          onKeyDown={e => handleFieldKeyDown(e, 'menu', item.id)}
                          onFocus={() => {
                            setFocusedRowId(item.id)
                            setFocusedField('menu')
                          }}
                          className="px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                          data-field="menu"
                          data-item-id={item.id}
                        >
                          <option value="">Select Menu</option>
                          {menus.map(menu => (
                            <option key={menu.id} value={menu.id}>
                              {menu.name}
                            </option>
                          ))}
                        </select>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm text-gray-500">No options</div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Input
                          type="number"
                          step="0.01"
                          value={item.price || ''}
                          onChange={e => updateEditingItem(item.id, 'price', parseFloat(e.target.value) || 0)}
                          onKeyDown={e => handleFieldKeyDown(e, 'price', item.id)}
                          onFocus={() => {
                            setFocusedRowId(item.id)
                            setFocusedField('price')
                          }}
                          placeholder="0.00"
                          className="w-20 text-right"
                          data-field="price"
                          data-item-id={item.id}
                        />
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Switch
                            checked={item.isAvailable}
                            onCheckedChange={checked => updateEditingItem(item.id, 'isAvailable', checked)}
                          />
                          <Label className="text-sm">{item.isAvailable ? 'Available' : 'Unavailable'}</Label>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button size="sm" onClick={() => handleSaveEdit(item)} className="h-8 w-8 p-0">
                            <Save className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => handleCancelAdd()} className="h-8 w-8 p-0">
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                })}
            </TableBody>
          </Table>

          {filteredItems.length === 0 && !isAddingNew && editingItems.filter(i => i.isNew).length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500">No menu items match your search criteria.</p>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between pt-4">
              <div className="text-sm text-gray-700">
                Showing {(currentPage - 1) * itemsPerPage + 1} to{' '}
                {Math.min(currentPage * itemsPerPage, filteredItems.length)} of {filteredItems.length} menu items
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </Button>

                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum
                    if (totalPages <= 5) {
                      pageNum = i + 1
                    } else if (currentPage <= 3) {
                      pageNum = i + 1
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i
                    } else {
                      pageNum = currentPage - 2 + i
                    }

                    return (
                      <Button
                        key={pageNum}
                        variant={currentPage === pageNum ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setCurrentPage(pageNum)}
                        className="w-8 h-8 p-0"
                      >
                        {pageNum}
                      </Button>
                    )
                  })}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmDialog
        isOpen={!!deleteConfirmItem}
        onOpenChange={open => !open && setDeleteConfirmItem(null)}
        content={`Are you sure you want to delete this item? This action cannot be undone.`}
        onConfirmDelete={confirmDelete}
      />

      {/* Bulk Delete Confirmation Dialog */}
      <AlertDialog open={bulkDeleteConfirm} onOpenChange={() => setBulkDeleteConfirm(false)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Selected Menu Items</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {selectedItems.size} selected menu items? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmBulkDelete}
              className="bg-red-600 hover:bg-red-700"
              disabled={isBulkOperationLoading || bulkDeleteMenuItemsMutation.isPending}
            >
              {isBulkOperationLoading || bulkDeleteMenuItemsMutation.isPending
                ? 'Deleting...'
                : `Delete ${selectedItems.size} Items`}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Bulk Menu Assign Dialog */}
      <AlertDialog open={bulkMenuAssign} onOpenChange={() => setBulkMenuAssign(false)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Assign to Menu</AlertDialogTitle>
            <AlertDialogDescription>
              Select a menu to assign {selectedItems.size} selected menu items to:
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="py-4">
            <select
              value={bulkMenuId}
              onChange={e => setBulkMenuId(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Menu</option>
              {menus.map(menu => (
                <option key={menu.id} value={menu.id}>
                  {menu.name}
                </option>
              ))}
            </select>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmBulkMenuAssign} disabled={!bulkMenuId || isBulkOperationLoading}>
              {isBulkOperationLoading ? 'Assigning...' : 'Assign to Menu'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
