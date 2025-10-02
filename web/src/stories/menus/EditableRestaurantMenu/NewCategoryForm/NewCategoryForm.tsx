import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { RestaurantMenuDto, useCreateMenuCategory } from '@shared'
import { useState } from 'react'
import { FormField } from '@/components'

interface NewCategoryFormProps {
  onCancel: () => void
  menu: RestaurantMenuDto
  isVisible: boolean
  setIsVisible: (isVisible: boolean) => void
}

export const NewCategoryForm = ({ onCancel, menu, isVisible, setIsVisible }: NewCategoryFormProps) => {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')

  const { mutate: createCategory } = useCreateMenuCategory()

  const handleCreateCategory = (categoryData: { name: string; description: string }) => {
    createCategory(
      {
        name: categoryData.name,
        description: categoryData.description,
        orderIndex: menu.categories.length,
        restaurantMenuId: menu.id,
      },
      { onSuccess: () => onCancel() }
    )
  }

  const handleSubmit = () => {
    if (name.trim()) {
      handleCreateCategory({ name: name.trim(), description: description.trim() })

      setName('')
      setDescription('')
    }
  }

  if (!isVisible)
    return (
      <Button onClick={() => setIsVisible(true)} variant="secondary">
        Add New Category
      </Button>
    )

  return (
    <div className="pb-8 mb-8 border-b">
      <div className="flex flex-col gap-6">
        <h4 className="text-sm font-semibold uppercase text-muted-foreground">New Category</h4>

        <div className="flex flex-col gap-4">
          <FormField label="Category Name" htmlFor="newCategoryName">
            <Input
              id="newCategoryName"
              placeholder="Enter category name"
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
            />
          </FormField>
          <FormField label="Category Description" htmlFor="newCategoryDescription">
            <Input
              id="newCategoryDescription"
              placeholder="Enter category description"
              type="text"
              value={description}
              onChange={e => setDescription(e.target.value)}
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
