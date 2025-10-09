import { TableCell, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { ChevronDown, ChevronRight, Edit, GripVertical, Trash2, Save, X } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { MenuCategoryItemDto, useUpdateMenuItem, useAllergens, formatPrice, useLocationSelection, Currency } from '@shared'
import { toast } from 'sonner'
import { MenuItemOptions } from './MenuItemOptions'
import { MenuItemAllergens } from './MenuItemAllergens'

interface MenuItemRowProps {
  item: MenuCategoryItemDto
  isExpanded: boolean
  isEditing: boolean
  toggleRow: (id: string) => void
  startEditing: (id: string) => void
  stopEditing: () => void
}

export const MenuItemRow = ({
  item,
  isExpanded,
  isEditing,
  toggleRow,
  startEditing,
  stopEditing,
}: MenuItemRowProps) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: item.id })
  const updateMutation = useUpdateMenuItem()
  const { data: allergensData } = useAllergens()
  const { selectedLocation } = useLocationSelection()
  const currency = selectedLocation?.currency ?? Currency.USD

  const [editedData, setEditedData] = useState({
    name: item.menuItem.name,
    description: item.menuItem.description || '',
    price: item.menuItem.price || 0,
    isAvailable: item.menuItem.isAvailable,
    options: item.menuItem.options || [],
    allergenIds: item.menuItem.allergens?.map(a => a.id) || [],
  })

  // Reset edited data when item changes
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

  const handleSave = () => {
    const hasOptions = editedData.options.length > 0

    // Validation
    if (!editedData.name.trim()) {
      toast.error('Name is required')
      return
    }

    if (hasOptions) {
      if (editedData.options.length < 2) {
        toast.error('Items with options must have at least 2 options')
        return
      }

      const invalidOptions = editedData.options.filter(opt => !opt.name.trim())
      if (invalidOptions.length > 0) {
        toast.error('All options must have a name')
        return
      }
    } else {
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
      options: hasOptions ? editedData.options.map((opt, idx) => ({
        id: undefined,
        name: opt.name,
        description: opt.description || '',
        price: opt.price || 0,
        orderIndex: idx,
      })) : [],
      allergenIds: editedData.allergenIds,
    }

    updateMutation.mutate(payload, {
      onSuccess: () => {
        toast.success('Menu item updated successfully')
        stopEditing()
      },
      onError: (error: any) => {
        const message = error?.response?.data?.message || 'Failed to update menu item'
        toast.error(message)
      },
    })
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
                formatPrice(item.menuItem.price, currency)
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
          <TableCell colSpan={7} className="bg-gradient-to-br from-gray-50 to-gray-100/50">
            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <MenuItemOptions
                  options={isEditing ? editedData.options : item.menuItem.options || []}
                  isEditing={isEditing}
                  onAddOption={addOption}
                  onRemoveOption={removeOption}
                  onUpdateOption={updateOption}
                />

                <MenuItemAllergens
                  allergens={item.menuItem.allergens || []}
                  selectedAllergenIds={editedData.allergenIds}
                  isEditing={isEditing}
                  allAllergens={allergensData || undefined}
                  onToggleAllergen={toggleAllergen}
                />
              </div>
            </div>
          </TableCell>
        </TableRow>
      )}
    </>
  )
}
