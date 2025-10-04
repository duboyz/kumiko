import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { MenuCategoryDto, useCreateMenuItem, useAddMenuItemToCategory, CreateMenuItemOptionDto } from '@shared'
import { useState } from 'react'
import { FormField } from '@/components'
import { AllergenSelector } from '@/stories/menus/AllergenSelector'
import { Plus, Trash2 } from 'lucide-react'

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

  const { mutate: createMenuItem } = useCreateMenuItem()
  const { mutate: addItemToCategory } = useAddMenuItemToCategory()

  const handleCreateMenuItem = () => {
    const parsedPrice = hasOptions ? null : parseFloat(price)

    // Validation
    if (!name.trim()) return
    if (!hasOptions && (!parsedPrice || parsedPrice <= 0)) return
    if (hasOptions) {
      const validOptions = options.filter(o => o.name.trim() && o.price > 0)
      if (validOptions.length < 2) return
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
              onCancel()
            },
          }
        )
      },
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

  if (!isVisible)
    return (
      <Button onClick={() => setIsVisible(true)} variant="secondary">
        Add New Item
      </Button>
    )

  return (
    <div className="pb-6 mb-6 border-b">
      <div className="flex flex-col gap-6">
        <h4 className="text-sm font-semibold uppercase text-muted-foreground">New Menu Item</h4>

        <div className="flex flex-col gap-4">
          <FormField label="Item Name" htmlFor="newItemName">
            <Input
              id="newItemName"
              placeholder="Enter item name"
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
            />
          </FormField>

          <FormField label="Item Description" htmlFor="newItemDescription">
            <Input
              id="newItemDescription"
              placeholder="Enter item description"
              type="text"
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

          {!hasOptions ? (
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
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Options (minimum 2 required)</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addOption}
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Add Option
                </Button>
              </div>

              {options.map((option, index) => (
                <div key={index} className="flex gap-2 p-3 border rounded-lg">
                  <div className="flex-1 space-y-2">
                    <Input
                      placeholder="Option name (e.g., Small, Large)"
                      value={option.name}
                      onChange={e => updateOption(index, 'name', e.target.value)}
                    />
                    <Input
                      placeholder="Option description (optional)"
                      value={option.description}
                      onChange={e => updateOption(index, 'description', e.target.value)}
                    />
                  </div>
                  <div className="w-32">
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
          )}

          <FormField label="Allergens" htmlFor="allergens">
            <AllergenSelector
              selectedAllergenIds={selectedAllergenIds}
              onChange={setSelectedAllergenIds}
            />
          </FormField>
        </div>

        <div className="flex gap-3">
          <Button onClick={onCancel} variant="secondary">
            Cancel
          </Button>
          <Button onClick={handleCreateMenuItem} variant="default">
            Save
          </Button>
        </div>
      </div>
    </div>
  )
}