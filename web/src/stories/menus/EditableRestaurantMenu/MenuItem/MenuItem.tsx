import { MenuItemDto, useDeleteMenuItem, useUpdateMenuItem, UpdateMenuItemOptionDto } from '@shared'
import { Edit, Trash, Plus, Trash2, AlertCircle, GripVertical, X, Check } from 'lucide-react'
import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { FormField } from '@/components'
import { AllergenSelector } from '@/stories/menus/AllergenSelector'
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

export const MenuItem = ({ item }: { item: MenuItemDto }) => {
  const [isEditing, setIsEditing] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [editableMenuItem, setEditableMenuItem] = useState(item)
  const [options, setOptions] = useState<UpdateMenuItemOptionDto[]>(
    item.hasOptions && item.options.length > 0
      ? item.options.map(o => ({
          id: o.id,
          name: o.name,
          description: o.description,
          price: o.price,
          orderIndex: o.orderIndex
        }))
      : [
          { name: '', description: '', price: 0, orderIndex: 0 },
          { name: '', description: '', price: 0, orderIndex: 1 }
        ]
  )
  const [selectedAllergenIds, setSelectedAllergenIds] = useState<string[]>(
    item.allergens?.map(a => a.id) || []
  )

  const { mutate: updateItem, isPending: isUpdating } = useUpdateMenuItem()
  const { mutate: deleteItem, isPending: isDeleting } = useDeleteMenuItem()

  const handleChange = (property: keyof MenuItemDto, value: MenuItemDto[keyof MenuItemDto]) => {
    setEditableMenuItem(prev => ({
      ...prev,
      [property]: value,
    }))
  }

  const addOption = () => {
    setOptions([...options, { name: '', description: '', price: 0, orderIndex: options.length }])
  }

  const removeOption = (index: number) => {
    if (options.length <= 2) return
    setOptions(options.filter((_, i) => i !== index))
  }

  const updateOption = (index: number, field: keyof UpdateMenuItemOptionDto, value: string | number) => {
    const newOptions = [...options]
    newOptions[index] = { ...newOptions[index], [field]: value }
    setOptions(newOptions)
  }

  const handleSave = () => {
    // Validation
    if (!editableMenuItem.name.trim()) {
      toast.error('Please enter a name for the menu item')
      return
    }
    if (editableMenuItem.hasOptions) {
      const validOptions = options.filter(o => o.name.trim() && o.price > 0)
      if (validOptions.length < 2) {
        toast.error('Please add at least 2 valid options')
        return
      }
    } else {
      if (!editableMenuItem.price || editableMenuItem.price <= 0) {
        toast.error('Please enter a valid price')
        return
      }
    }

    updateItem(
      {
        id: item.id,
        name: editableMenuItem.name,
        description: editableMenuItem.description,
        price: editableMenuItem.hasOptions ? null : editableMenuItem.price,
        hasOptions: editableMenuItem.hasOptions,
        options: editableMenuItem.hasOptions
          ? options
              .filter(o => o.name.trim() && o.price > 0)
              .map((o, idx) => ({ ...o, orderIndex: idx }))
          : undefined,
        isAvailable: editableMenuItem.isAvailable,
        allergenIds: selectedAllergenIds.length > 0 ? selectedAllergenIds : undefined,
      },
      {
        onSuccess: () => {
          toast.success('Menu item updated successfully')
          setIsEditing(false)
        },
        onError: () => {
          toast.error('Failed to update menu item')
        }
      }
    )
  }

  const handleDelete = () => {
    deleteItem(item.id, {
      onSuccess: () => {
        toast.success('Menu item deleted successfully')
        setIsDeleteDialogOpen(false)
      },
      onError: () => {
        toast.error('Failed to delete menu item')
      }
    })
  }

  const handleStartEdit = () => {
    // Reset form to current item state
    setEditableMenuItem(item)
    setOptions(
      item.hasOptions && item.options.length > 0
        ? item.options.map(o => ({
            id: o.id,
            name: o.name,
            description: o.description,
            price: o.price,
            orderIndex: o.orderIndex
          }))
        : [
            { name: '', description: '', price: 0, orderIndex: 0 },
            { name: '', description: '', price: 0, orderIndex: 1 }
          ]
    )
    setSelectedAllergenIds(item.allergens?.map(a => a.id) || [])
    setIsEditing(true)
  }

  const handleCancel = () => {
    setIsEditing(false)
  }

  if (isEditing) {
    return (
      <>
        <div className="py-4 px-4 bg-muted/30 rounded-lg border-2 border-primary/20">
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-sm font-semibold text-muted-foreground">EDITING MENU ITEM</h4>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCancel}
                  disabled={isUpdating}
                >
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </Button>
                <Button
                  size="sm"
                  onClick={handleSave}
                  disabled={isUpdating}
                >
                  <Check className="w-4 h-4 mr-2" />
                  {isUpdating ? 'Saving...' : 'Save'}
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField label="Item Name" htmlFor="itemName">
                <Input
                  id="itemName"
                  placeholder="Item Name"
                  value={editableMenuItem.name}
                  onChange={e => handleChange('name', e.target.value)}
                />
              </FormField>

              {!editableMenuItem.hasOptions && (
                <FormField label="Price" htmlFor="itemPrice">
                  <Input
                    id="itemPrice"
                    placeholder="0.00"
                    type="number"
                    step="0.01"
                    value={editableMenuItem.price?.toString() || ''}
                    onChange={e => handleChange('price', parseFloat(e.target.value) || null)}
                  />
                </FormField>
              )}
            </div>

            <FormField label="Description" htmlFor="itemDescription">
              <Input
                id="itemDescription"
                placeholder="Item Description"
                value={editableMenuItem.description}
                onChange={e => handleChange('description', e.target.value)}
              />
            </FormField>

            <div className="flex items-center space-x-2">
              <Switch
                id="hasOptions"
                checked={editableMenuItem.hasOptions}
                onCheckedChange={checked => handleChange('hasOptions', checked)}
              />
              <Label htmlFor="hasOptions">Has size/option variants</Label>
            </div>

            {editableMenuItem.hasOptions && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium">Options (minimum 2 required)</Label>
                  <Button type="button" variant="outline" size="sm" onClick={addOption}>
                    <Plus className="w-4 h-4 mr-1" />
                    Add Option
                  </Button>
                </div>

                <div className="space-y-2">
                  {options.map((option, index) => (
                    <div key={index} className="flex gap-2 p-2 border rounded-md bg-background">
                      <div className="flex-1 space-y-2">
                        <Input
                          placeholder="Option name (e.g., Small, Large)"
                          value={option.name}
                          onChange={e => updateOption(index, 'name', e.target.value)}
                        />
                        <Input
                          placeholder="Description (optional)"
                          value={option.description}
                          onChange={e => updateOption(index, 'description', e.target.value)}
                        />
                      </div>
                      <div className="w-24">
                        <Input
                          placeholder="Price"
                          type="number"
                          step="0.01"
                          value={option.price || ''}
                          onChange={e => updateOption(index, 'price', parseFloat(e.target.value) || 0)}
                        />
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeOption(index)}
                        disabled={options.length <= 2}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <FormField label="Allergens" htmlFor="allergens">
              <AllergenSelector
                selectedAllergenIds={selectedAllergenIds}
                onChange={setSelectedAllergenIds}
              />
            </FormField>
          </div>
        </div>

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Menu Item?</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete &quot;{item.name}&quot;? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDelete}
                disabled={isDeleting}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                {isDeleting ? 'Deleting...' : 'Delete'}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </>
    )
  }

  return (
    <>
      <div className="group flex justify-between items-start gap-4 py-3 hover:bg-muted/30 rounded-lg px-3 -mx-3 transition-colors">
        <div className="flex items-start gap-3 flex-1 min-w-0">
          <div className="opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing pt-1">
            <GripVertical className="w-4 h-4 text-muted-foreground" />
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-baseline gap-4 mb-1">
              <div className="flex items-baseline gap-2 flex-1 min-w-0">
                <h4 className="text-base font-medium">{item.name}</h4>
                {item.description && (
                  <span className="text-sm text-muted-foreground truncate">— {item.description}</span>
                )}
              </div>
              {!item.hasOptions && item.price !== null && (
                <span className="text-base font-medium text-muted-foreground whitespace-nowrap">
                  ${item.price.toFixed(2)}
                </span>
              )}
            </div>

            {item.hasOptions && item.options.length > 0 && (
              <div className="mt-2 space-y-1">
                {item.options
                  .sort((a, b) => a.orderIndex - b.orderIndex)
                  .map(option => (
                    <div key={option.id} className="flex justify-between items-baseline text-sm">
                      <span className="text-muted-foreground">
                        {option.name}
                        {option.description && (
                          <span className="text-xs ml-2 opacity-70">({option.description})</span>
                        )}
                      </span>
                      <span className="text-muted-foreground font-medium whitespace-nowrap ml-2">
                        ${option.price.toFixed(2)}
                      </span>
                    </div>
                  ))}
              </div>
            )}

            {item.allergens && item.allergens.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1.5 items-center">
                <AlertCircle className="w-3.5 h-3.5 text-orange-500" />
                {item.allergens.map(allergen => (
                  <Badge key={allergen.id} variant="secondary" className="text-xs">
                    {allergen.name}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 pt-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={handleStartEdit}
          >
            <Edit className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:text-destructive"
            onClick={() => setIsDeleteDialogOpen(true)}
          >
            <Trash className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Menu Item?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete &quot;{item.name}&quot;? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
