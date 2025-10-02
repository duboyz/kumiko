import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { MenuCategoryDto, useCreateMenuItem, useAddMenuItemToCategory } from '@shared'
import { useState } from 'react'
import { FormField } from '@/stories/shared/FormField/FormField'

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

  const { mutate: createMenuItem } = useCreateMenuItem()
  const { mutate: addItemToCategory } = useAddMenuItemToCategory()

  const handleCreateMenuItem = (itemData: { name: string; description: string; price: number }) => {
    createMenuItem(
      {
        name: itemData.name,
        description: itemData.description,
        price: itemData.price,
        isAvailable: true,
        restaurantMenuId: category.restaurantMenuId,
      },
      {
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
      }
    )
  }

  const handleSubmit = () => {
    const parsedPrice = parseFloat(price)
    if (name.trim() && !isNaN(parsedPrice) && parsedPrice >= 0) {
      handleCreateMenuItem({
        name: name.trim(),
        description: description.trim(),
        price: parsedPrice,
      })
      setName('')
      setDescription('')
      setPrice('')
    }
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
          <FormField label="Price" htmlFor="newItemPrice">
            <Input
              id="newItemPrice"
              placeholder="0.00"
              type="number"
              value={price}
              onChange={e => setPrice(e.target.value)}
            />
          </FormField>
        </div>

        <div className="flex gap-3">
          <Button onClick={onCancel} variant="secondary">
            Cancel
          </Button>
          <Button onClick={handleSubmit} variant="default">
            Save
          </Button>
        </div>
      </div>
    </div>
  )
}
