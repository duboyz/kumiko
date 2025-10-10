import { TableCell, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { ChevronDown, ChevronRight, Edit, GripVertical, Trash2, Save, X, CornerDownRight } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { MenuCategoryItemDto, useUpdateMenuItem, useAllergens, formatPrice, useLocationSelection, Currency } from '@shared'
import { toast } from 'sonner'

import { cn } from '@/lib/utils'

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

  // Store options temporarily when converting to simple item
  const [savedOptions, setSavedOptions] = useState<typeof editedData.options>([])


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
      setSavedOptions([]) // Clear saved options when exiting edit mode
    }
  }, [item.menuItem, isEditing])

  // Auto-expand when entering edit mode
  useEffect(() => {
    if (isEditing && !isExpanded) {
      toggleRow(item.id)
    }
  }, [isEditing])

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  const hasOptions = item.menuItem.options && item.menuItem.options.length > 0
  const canExpand = hasOptions || isEditing

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
        setSavedOptions([]) // Clear saved options on successful save
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
    setSavedOptions([]) // Clear saved options on cancel
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

  const convertToOptions = () => {
    // If we have saved options, restore them
    if (savedOptions.length > 0) {
      setEditedData(prev => ({
        ...prev,
        options: savedOptions,
      }))
    } else {
      // Otherwise create default options
      const basePrice = editedData.price || 0
      setEditedData(prev => ({
        ...prev,
        options: [
          {
            id: `temp-${Date.now()}-1`,
            name: '',
            description: '',
            price: basePrice,
            orderIndex: 0,
            menuItemId: item.menuItem.id,
          },
          {
            id: `temp-${Date.now()}-2`,
            name: '',
            description: '',
            price: basePrice,
            orderIndex: 1,
            menuItemId: item.menuItem.id,
          },
        ],
      }))
    }
    // Expand the row to show the options
    if (!isExpanded) {
      toggleRow(item.id)
    }
  }

  const convertToSimpleItem = () => {
    // Save current options before removing them
    if (editedData.options.length > 0) {
      setSavedOptions(editedData.options)
    }
    // Use the first option's price or 0
    const priceToUse = editedData.options.length > 0 ? editedData.options[0].price : 0
    setEditedData(prev => ({
      ...prev,
      options: [],
      price: priceToUse,
    }))
  }


  return (
    <>
      <TableRow ref={setNodeRef} style={style} className={cn(
        "hover:bg-gray-50",
        isExpanded && hasOptions && "bg-gray-100"
      )} >
        <TableCell>
          <div {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing p-1 hover:bg-gray-200 rounded transition-colors">
            <GripVertical className="h-4 w-4 text-gray-400" />
          </div>
        </TableCell>
        <TableCell>
          {
            canExpand && (
              <button
                onClick={() => toggleRow(item.id)}
                className="p-1 hover:bg-gray-200 rounded transition-colors"
              >
                {isExpanded ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </button>
            )
          }
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
            </TableCell>
            <TableCell>
              <Switch
                checked={editedData.options.length > 0}
                onCheckedChange={(checked) => {
                  if (checked) {
                    convertToOptions()
                  } else {
                    convertToSimpleItem()
                  }
                }}
              />
            </TableCell>
            <TableCell>
              <Switch
                checked={editedData.isAvailable}
                onCheckedChange={(checked) => setEditedData(prev => ({ ...prev, isAvailable: checked as boolean }))}
              />
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
              <Switch
                checked={hasOptions}
                disabled
              />
            </TableCell>
            <TableCell>
              <Switch
                checked={item.menuItem.isAvailable}
                disabled
              />
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

      {
        isExpanded && (
          <>
            {isEditing ? (
              // Edit mode - show input fields
              <>
                {editedData.options.map((option, index) => (
                  <TableRow key={option.id || `option-${index}`} className="pl-8">
                    <TableCell className="bg-gray-50"></TableCell>
                    <TableCell className="bg-gray-100"><CornerDownRight className="h-4 w-4" /></TableCell>
                    <TableCell className="bg-gray-100">
                      <Input
                        value={option.name}
                        onChange={(e) => updateOption(index, 'name', e.target.value)}
                        placeholder="Option name"
                        className="w-full"
                      />
                    </TableCell>
                    <TableCell className="bg-gray-100">
                      <Input
                        value={option.description || ''}
                        onChange={(e) => updateOption(index, 'description', e.target.value)}
                        placeholder="Description (optional)"
                        className="w-full"
                      />
                    </TableCell>
                    <TableCell className="bg-gray-100">
                      <Input
                        type="number"
                        step="0.01"
                        value={option.price || 0}
                        onChange={(e) => updateOption(index, 'price', parseFloat(e.target.value) || 0)}
                        placeholder="0.00"
                        className="w-24"
                      />
                    </TableCell>
                    <TableCell className="bg-gray-50"></TableCell>
                    <TableCell className="bg-gray-50"></TableCell>
                    <TableCell className="bg-gray-100">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeOption(index)}
                        disabled={editedData.options.length <= 2}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                <TableRow key={`${item.id}-add-option`} className="pl-8">
                  <TableCell colSpan={8} className="bg-gray-50">
                    <Button onClick={addOption} className="w-full" variant="ghost">
                      Add option
                    </Button>
                  </TableCell>
                </TableRow>
              </>
            ) : (
              // View mode - show read-only data
              <>
                {hasOptions && item.menuItem.options.map((option, index) => (
                  <TableRow key={option.id || `option-${index}`} className="pl-8">
                    <TableCell className="bg-gray-50"></TableCell>
                    <TableCell className="bg-gray-50"><CornerDownRight className="ml-2 h-4 w-4 text-gray-600" /></TableCell>
                    <TableCell className="bg-gray-50">
                      <p className="font-medium">{option.name}</p>
                    </TableCell>
                    <TableCell className="bg-gray-50">
                      <p className="text-gray-600">{option.description || '-'}</p>
                    </TableCell>
                    <TableCell className="bg-gray-50">
                      <p>{formatPrice(option.price, currency)}</p>
                    </TableCell>
                    <TableCell className="bg-gray-50"></TableCell>
                    <TableCell className="bg-gray-50"></TableCell>
                    <TableCell className="bg-gray-50"></TableCell>
                  </TableRow>
                ))}
              </>
            )}
          </>
        )
      }

      {/* {isExpanded && (
        <TableRow key={`${item.id}-details`}>
            <TableCell colSpan={8} className="bg-gray-100">
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
      )} */}
    </>
  )
}
