import { MenuItemDto, useDeleteMenuItem, useUpdateMenuItem, UpdateMenuItemOptionDto } from '@shared'
import { Edit, Save, Trash, Plus, Trash2, AlertCircle } from 'lucide-react'
import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { FormField } from '@/components'
import { AllergenSelector } from '@/stories/menus/AllergenSelector'

export const MenuItem = ({ item }: { item: MenuItemDto }) => {
  const [isEditable, setIsEditable] = useState(false)
  if (isEditable) return <Editable menuItem={item} setIsEditable={setIsEditable} />
  return <NonEditable menuItem={item} setIsEditable={setIsEditable} />
}

interface EditableProps {
  menuItem: MenuItemDto
  setIsEditable: (isEditable: boolean) => void
}

const Editable = ({ menuItem, setIsEditable }: EditableProps) => {
  const [editableMenuItem, setEditableMenuItem] = useState(menuItem)
  const [options, setOptions] = useState<UpdateMenuItemOptionDto[]>(
    menuItem.hasOptions && menuItem.options.length > 0
      ? menuItem.options.map(o => ({
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
    menuItem.allergens?.map(a => a.id) || []
  )

  const handleChange = (property: keyof MenuItemDto, value: MenuItemDto[keyof MenuItemDto]) => {
    setEditableMenuItem(prev => ({
      ...prev,
      [property]: value,
    }))
  }

  const { mutate: updateItem } = useUpdateMenuItem()
  const { mutate: deleteItem } = useDeleteMenuItem()

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
    if (!editableMenuItem.name.trim()) return
    if (editableMenuItem.hasOptions) {
      const validOptions = options.filter(o => o.name.trim() && o.price > 0)
      if (validOptions.length < 2) return
    } else {
      if (!editableMenuItem.price || editableMenuItem.price <= 0) return
    }

    updateItem({
      id: menuItem.id,
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
    })
    setIsEditable(false)
  }

  return (
    <div className="flex flex-col gap-6 pb-6 border-b">
      <div className="flex flex-col gap-4">
        <FormField label="Name" htmlFor="itemName">
          <Input
            id="itemName"
            placeholder="Item Name"
            type="text"
            value={editableMenuItem.name}
            onChange={e => handleChange('name', e.target.value)}
          />
        </FormField>

        <FormField label="Description" htmlFor="itemDescription">
          <Input
            id="itemDescription"
            placeholder="Item Description"
            type="text"
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

        {!editableMenuItem.hasOptions ? (
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
        <Button variant="secondary" onClick={() => setIsEditable(false)}>
          Cancel
        </Button>
        <Button variant="default" onClick={handleSave}>
          Save
        </Button>
        <Button variant="destructive" onClick={() => deleteItem(menuItem.id)}>
          Delete
        </Button>
      </div>
    </div>
  )
}

interface NonEditableProps {
  menuItem: MenuItemDto
  setIsEditable: (isEditable: boolean) => void
}

export const NonEditable = ({ menuItem, setIsEditable }: NonEditableProps) => {
  const { mutate: deleteItem } = useDeleteMenuItem()

  return (
    <div className="flex justify-between items-start gap-6">
      <div className="flex-1">
        <div className="flex justify-between items-baseline mb-2">
          <h4 className="text-lg font-medium">{menuItem.name}</h4>
          {!menuItem.hasOptions && menuItem.price !== null && (
            <span className="text-base text-muted-foreground">${menuItem.price.toFixed(2)}</span>
          )}
        </div>
        {menuItem.description && <p className="text-sm text-muted-foreground">{menuItem.description}</p>}

        {menuItem.hasOptions && menuItem.options.length > 0 && (
          <div className="mt-3 space-y-1">
            {menuItem.options
              .sort((a, b) => a.orderIndex - b.orderIndex)
              .map(option => (
                <div key={option.id} className="flex justify-between items-baseline text-sm">
                  <span className="text-muted-foreground">
                    {option.name}
                    {option.description && <span className="text-xs ml-2">({option.description})</span>}
                  </span>
                  <span className="text-muted-foreground">${option.price.toFixed(2)}</span>
                </div>
              ))}
          </div>
        )}

        {menuItem.allergens && menuItem.allergens.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            <AlertCircle className="w-3.5 h-3.5 text-orange-500 mt-0.5" />
            {menuItem.allergens.map(allergen => (
              <Badge key={allergen.id} variant="secondary" className="text-xs">
                {allergen.name}
              </Badge>
            ))}
          </div>
        )}
      </div>
      <div className="flex items-center gap-3 pt-1">
        <Edit
          className="w-4 h-4 cursor-pointer text-muted-foreground hover:text-foreground transition-colors"
          onClick={() => setIsEditable(true)}
        />
        <Trash
          className="w-4 h-4 cursor-pointer text-muted-foreground hover:text-destructive transition-colors"
          onClick={() => deleteItem(menuItem.id)}
        />
      </div>
    </div>
  )
}