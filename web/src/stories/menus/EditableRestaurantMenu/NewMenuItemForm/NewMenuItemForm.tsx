import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { MenuCategoryDto, useCreateMenuItem, useAddMenuItemToCategory, CreateMenuItemOptionDto } from '@shared'
import { useState } from 'react'
import { FormField } from '@/components'
import { AllergenSelector } from '@/stories/menus/AllergenSelector'
import { Plus, Trash2, X } from 'lucide-react'
import { toast } from 'sonner'

interface NewMenuItemFormProps {
  onCancel: () => void
  category: MenuCategoryDto
  isVisible: boolean
  setIsVisible: (isVisible: boolean) => void
}

export const NewMenuItemForm = ({ onCancel, category, isVisible, setIsVisible }: NewMenuItemFormProps) => {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const [hasOptions, setHasOptions] = useState(false)
  const [options, setOptions] = useState<CreateMenuItemOptionDto[]>([
    { name: '', description: '', price: 0, orderIndex: 0 },
    { name: '', description: '', price: 0, orderIndex: 1 }
  ])
  const [selectedAllergenIds, setSelectedAllergenIds] = useState<string[]>([])

  const { mutate: createMenuItem, isPending } = useCreateMenuItem()
  const { mutate: addItemToCategory } = useAddMenuItemToCategory()

  const resetForm = () => {
    setName('')
    setDescription('')
    setPrice('')
    setHasOptions(false)
    setOptions([
      { name: '', description: '', price: 0, orderIndex: 0 },
      { name: '', description: '', price: 0, orderIndex: 1 }
    ])
    setSelectedAllergenIds([])
  }

  const handleCreateMenuItem = () => {
    const parsedPrice = hasOptions ? null : parseFloat(price)

    // Validation
    if (!name.trim()) {
      toast.error('Please enter a name for the menu item')
      return
    }
    if (!hasOptions && (!parsedPrice || parsedPrice <= 0)) {
      toast.error('Please enter a valid price')
      return
    }
    if (hasOptions) {
      const validOptions = options.filter(o => o.name.trim() && o.price > 0)
      if (validOptions.length < 2) {
        toast.error('Please add at least 2 valid options')
        return
      }
    }

    const itemData = {
      name: name.trim(),
      description: description.trim(),
      price: parsedPrice,
      hasOptions,
      options: hasOptions
        ? options
            .filter(o => o.name.trim() && o.price > 0)
            .map((o, idx) => ({ ...o, orderIndex: idx }))
        : undefined,
      isAvailable: true,
      restaurantMenuId: category.restaurantMenuId,
      allergenIds: selectedAllergenIds.length > 0 ? selectedAllergenIds : undefined,
    }

    createMenuItem(itemData, {
      onSuccess: createdItem => {
        if (!createdItem) return
        addItemToCategory(
          {
            menuItemId: createdItem.id,
            menuCategoryId: category.id,
            orderIndex: category.menuCategoryItems.length,
          },
          {
            onSuccess: () => {
              toast.success('Menu item added successfully')
              resetForm()
              setIsVisible(false)
              onCancel()
            },
            onError: () => {
              toast.error('Failed to add menu item to category')
            }
          }
        )
      },
      onError: () => {
        toast.error('Failed to create menu item')
      }
    })
  }

  const addOption = () => {
    setOptions([...options, { name: '', description: '', price: 0, orderIndex: options.length }])
  }

  const removeOption = (index: number) => {
    if (options.length <= 2) return
    setOptions(options.filter((_, i) => i !== index))
  }

  const updateOption = (index: number, field: keyof CreateMenuItemOptionDto, value: string | number) => {
    const newOptions = [...options]
    newOptions[index] = { ...newOptions[index], [field]: value }
    setOptions(newOptions)
  }

  const handleCancel = () => {
    resetForm()
    setIsVisible(false)
    onCancel()
  }

  if (!isVisible) {
    return (
      <Button variant="outline" size="sm" onClick={() => setIsVisible(true)}>
        <Plus className="w-4 h-4 mr-2" />
        Add Menu Item
      </Button>
    )
  }

  return (
    <div className="py-4 px-4 bg-muted/30 rounded-lg border-2 border-dashed border-primary/20">
      <div className="space-y-4">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-sm font-semibold text-muted-foreground">NEW MENU ITEM</h4>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleCancel}
            disabled={isPending}
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField label="Item Name" htmlFor="newItemName">
            <Input
              id="newItemName"
              placeholder="Enter item name"
              value={name}
              onChange={e => setName(e.target.value)}
            />
          </FormField>

          {!hasOptions && (
            <FormField label="Price" htmlFor="newItemPrice">
              <Input
                id="newItemPrice"
                placeholder="0.00"
                type="number"
                step="0.01"
                value={price}
                onChange={e => setPrice(e.target.value)}
              />
            </FormField>
          )}
        </div>

        <FormField label="Description" htmlFor="newItemDescription">
          <Input
            id="newItemDescription"
            placeholder="Enter item description"
            value={description}
            onChange={e => setDescription(e.target.value)}
          />
        </FormField>

        <div className="flex items-center space-x-2">
          <Switch
            id="hasOptions"
            checked={hasOptions}
            onCheckedChange={setHasOptions}
          />
          <Label htmlFor="hasOptions">Has size/option variants</Label>
        </div>

        {hasOptions && (
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

        <div className="flex justify-end gap-2 pt-2">
          <Button variant="outline" onClick={handleCancel} disabled={isPending}>
            Cancel
          </Button>
          <Button onClick={handleCreateMenuItem} disabled={isPending}>
            {isPending ? 'Adding...' : 'Add Item'}
          </Button>
        </div>
      </div>
    </div>
  )
}