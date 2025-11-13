import { TableCell, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
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
import { ChevronDown, ChevronRight, Edit, GripVertical, Trash2, Save, X, CornerDownRight, Plus } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { MenuCategoryItemDto, useUpdateMenuItem, useAllergens, formatPrice, useLocationSelection, Currency } from '@shared'
import { toast } from 'sonner'
import { useTranslations } from 'next-intl'

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
  const t = useTranslations('menus')
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
  const [showRemoveOptionDialog, setShowRemoveOptionDialog] = useState(false)
  const [optionToRemove, setOptionToRemove] = useState<number | null>(null)

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
        toast.success(t('menuItemUpdated'))
        setSavedOptions([]) // Clear saved options on successful save
        stopEditing()
      },
      onError: (error: any) => {
        const message = error?.response?.data?.message || t('failedToUpdate')
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
    setEditedData(prev => {
      // If no options exist, add 2 (minimum required)
      if (prev.options.length === 0) {
        const basePrice = prev.price || 0
        return {
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
        }
      }

      // Otherwise add 1 option
      return {
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
      }
    })
  }

  const removeOption = (index: number) => {
    // If removing this option would leave us with only 1 option, show confirmation dialog
    if (editedData.options.length === 2) {
      setOptionToRemove(index)
      setShowRemoveOptionDialog(true)
    } else {
      // Safe to remove, more than 2 options
      setEditedData(prev => ({
        ...prev,
        options: prev.options.filter((_, i) => i !== index),
      }))
    }
  }

  const confirmRemoveOption = () => {
    if (optionToRemove !== null) {
      // Convert to simple item by removing all options
      const priceToUse = editedData.options[optionToRemove === 0 ? 1 : 0].price
      setEditedData(prev => ({
        ...prev,
        options: [],
        price: priceToUse,
      }))
      setShowRemoveOptionDialog(false)
      setOptionToRemove(null)
      toast.info(t('convertedToSimple'))
    }
  }

  const cancelRemoveOption = () => {
    setShowRemoveOptionDialog(false)
    setOptionToRemove(null)
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
      // Otherwise create 2 default options (minimum required)
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
              <div className="flex items-center gap-2">
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
                <span className="text-xs text-muted-foreground whitespace-nowrap">
                  {editedData.options.length > 0 ? t('options') : t('noOptions')}
                </span>
              </div>
            </TableCell>
            <TableCell>
              <Switch
                checked={editedData.isAvailable}
                onCheckedChange={(checked) => setEditedData(prev => ({ ...prev, isAvailable: checked as boolean }))}
              />
            </TableCell>
            <TableCell>
              <div className="flex gap-2">
                <Button variant="outline" className="bg-green-600 text-white hover:bg-green-700 hover:text-white flex-1" size="sm" onClick={handleSave}>
                  <Save className="h-4 w-4" />
                  <p>Save</p>
                </Button>
                <Button variant="destructive" size="sm" onClick={handleCancel} className="flex-1">
                  <X className="h-4 w-4" />
                  Cancel
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
                  return `${formatPrice(minPrice, currency)} - ${formatPrice(maxPrice, currency)}`
                })()
              ) : item.menuItem.price ? (
                formatPrice(item.menuItem.price, currency)
              ) : (
                '-'
              )}
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                <Switch
                  checked={hasOptions}
                  disabled
                />
                <span className="text-xs text-muted-foreground whitespace-nowrap">
                  {hasOptions ? t('options') : t('noOptions')}
                </span>
              </div>
            </TableCell>
            <TableCell>
              <Switch
                checked={item.menuItem.isAvailable}
                disabled
              />
            </TableCell>
            <TableCell>
              <div className="flex gap-2">
                <Button variant="secondary" size="sm" onClick={() => startEditing(item.id)}>
                  <Edit className="h-4 w-4" />
                </Button>
                <Button variant="destructive" size="sm"><Trash2 className="h-4 w-4" /></Button>
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
                  <TableRow key={option.id || `option-${index}`} className="bg-gray-50">
                    <TableCell></TableCell>
                    <TableCell>
                      <CornerDownRight className="h-4 w-4" />
                    </TableCell>
                    <TableCell>
                      <Input
                        value={option.name}
                        onChange={(e) => updateOption(index, 'name', e.target.value)}
                        placeholder={t('optionNamePlaceholder')}
                        className="w-full"
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        value={option.description || ''}
                        onChange={(e) => updateOption(index, 'description', e.target.value)}
                        placeholder={t('optionDescriptionPlaceholder')}
                        className="w-full"
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        step="0.01"
                        value={option.price || 0}
                        onChange={(e) => updateOption(index, 'price', parseFloat(e.target.value) || 0)}
                        placeholder={t('pricePlaceholder')}
                        className="w-24"
                      />
                    </TableCell>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeOption(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                <TableRow key={`${item.id}-add-option`} className="bg-gray-50">
                  <TableCell colSpan={8} className="py-2">
                    <Button onClick={addOption} className="w-full" variant="outline" size="sm">
                      <Plus className="h-4 w-4 mr-1" />
                      {t('addOption')}
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

      {/* Remove Option Confirmation Dialog */}
      <AlertDialog open={showRemoveOptionDialog} onOpenChange={setShowRemoveOptionDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('removeOptionTitle')}</AlertDialogTitle>
            <AlertDialogDescription className="text-lg">
              <p>
                {t('removeOptionDescription')}
              </p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={cancelRemoveOption}>{t('cancel')}</AlertDialogCancel>
            <AlertDialogAction onClick={confirmRemoveOption}>
              {t('removeAndConvert')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
