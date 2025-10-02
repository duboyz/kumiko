import { MenuItemDto, useDeleteMenuItem, useUpdateMenuItem } from '@shared'
import { Edit, Save, Trash } from 'lucide-react'
import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { FormField } from '@/components'

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

  const handleChange = (property: keyof MenuItemDto, value: MenuItemDto[keyof MenuItemDto]) => {
    setEditableMenuItem(prev => ({
      ...prev,
      [property]: value,
    }))
  }

  const { mutate: updateItem } = useUpdateMenuItem()

  const { mutate: deleteItem } = useDeleteMenuItem()

  const handleSave = () => {
    updateItem({
      id: menuItem.id,
      name: editableMenuItem.name,
      description: editableMenuItem.description,
      price: editableMenuItem.price,
      isAvailable: editableMenuItem.isAvailable,
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

        <FormField label="Price" htmlFor="itemPrice">
          <Input
            id="itemPrice"
            placeholder="0.00"
            type="number"
            value={editableMenuItem.price.toString()}
            onChange={e => handleChange('price', parseFloat(e.target.value))}
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
          <span className="text-base text-muted-foreground">${menuItem.price.toFixed(2)}</span>
        </div>
        {menuItem.description && <p className="text-sm text-muted-foreground">{menuItem.description}</p>}
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
