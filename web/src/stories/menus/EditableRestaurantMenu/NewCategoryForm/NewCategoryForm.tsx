import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { RestaurantMenuDto, useCreateMenuCategory } from '@shared'
import { useState } from 'react'
import { FormField } from '@/components'
import { Plus, X } from 'lucide-react'
import { toast } from 'sonner'

interface NewCategoryFormProps {
  onCancel: () => void
  menu: RestaurantMenuDto
  isVisible: boolean
  setIsVisible: (isVisible: boolean) => void
}

export const NewCategoryForm = ({ onCancel, menu, isVisible, setIsVisible }: NewCategoryFormProps) => {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')

  const { mutate: createCategory, isPending } = useCreateMenuCategory()

  const resetForm = () => {
    setName('')
    setDescription('')
  }

  const handleSubmit = () => {
    if (!name.trim()) {
      toast.error('Please enter a category name')
      return
    }

    createCategory(
      {
        name: name.trim(),
        description: description.trim(),
        orderIndex: menu.categories.length,
        restaurantMenuId: menu.id,
      },
      {
        onSuccess: () => {
          toast.success('Category added successfully')
          resetForm()
          setIsVisible(false)
          onCancel()
        },
        onError: () => {
          toast.error('Failed to create category')
        }
      }
    )
  }

  const handleCancel = () => {
    resetForm()
    setIsVisible(false)
    onCancel()
  }

  if (!isVisible) {
    return (
      <Button variant="outline" onClick={() => setIsVisible(true)}>
        <Plus className="w-4 h-4 mr-2" />
        Add Category
      </Button>
    )
  }

  return (
    <div className="py-4 px-4 bg-muted/30 rounded-lg border-2 border-dashed border-primary/20">
      <div className="space-y-4">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-sm font-semibold text-muted-foreground">NEW CATEGORY</h4>
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
          <FormField label="Category Name" htmlFor="newCategoryName">
            <Input
              id="newCategoryName"
              placeholder="e.g., Appetizers, Main Courses, Desserts"
              value={name}
              onChange={e => setName(e.target.value)}
            />
          </FormField>
          <FormField label="Category Description" htmlFor="newCategoryDescription">
            <Input
              id="newCategoryDescription"
              placeholder="Optional description"
              value={description}
              onChange={e => setDescription(e.target.value)}
            />
          </FormField>
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <Button variant="outline" onClick={handleCancel} disabled={isPending}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isPending}>
            {isPending ? 'Adding...' : 'Add Category'}
          </Button>
        </div>
      </div>
    </div>
  )
}
