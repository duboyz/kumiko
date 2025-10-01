import { MenuCategoryDto, useUpdateMenuCategory } from '@shared'
import { useMemo, useState } from 'react'
import { MenuItem } from '../MenuItem'
import { NewMenuItemForm } from '../NewMenuItemForm'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { FormField } from '@/components/FormField'

export const MenuCategory = ({ category }: { category: MenuCategoryDto }) => {
  const [categoryName, setCategoryName] = useState(category.name || '')
  const [categoryDescription, setCategoryDescription] = useState(category.description || '')

  const menuItems = useMemo(() => category.menuCategoryItems.map(item => item.menuItem), [category])
  const [isEditable, setIsEditable] = useState(false)
  const [showNewItemForm, setShowNewItemForm] = useState(false)

  const { mutate: updateCategory } = useUpdateMenuCategory()

  const handleSave = () => {
    updateCategory({
      id: category.id,
      name: categoryName,
      description: categoryDescription,
      orderIndex: category.orderIndex,
    })
    setIsEditable(false)
  }

  const handleCancelNewItem = () => setShowNewItemForm(false)

  if (isEditable) {
    return (
      <div className="flex flex-col gap-6 pb-6 border-b">
        <div className="flex flex-row gap-6">
          <FormField label="Category Name" htmlFor="categoryName" className="flex-1">
            <Input
              id="categoryName"
              placeholder="Category Name"
              type="text"
              value={categoryName}
              onChange={e => setCategoryName(e.target.value)}
            />
          </FormField>
          <FormField label="Category Description" htmlFor="categoryDescription" className="flex-1">
            <Input
              id="categoryDescription"
              placeholder="Category Description"
              type="text"
              value={categoryDescription}
              onChange={e => setCategoryDescription(e.target.value)}
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
        </div>
      </div>
    )
  }

  return (
    <div className="pb-10 mb-10 border-b flex flex-col gap-8">
      <div className="flex flex-row justify-between items-start">
        <div className="flex-1">
          <h3 className="text-2xl font-semibold uppercase mb-2">{category.name}</h3>
          {category.description && <p className="text-sm text-muted-foreground">{category.description}</p>}
        </div>
        <Button variant="secondary" onClick={() => setIsEditable(true)}>
          Edit
        </Button>
      </div>
      <div className="flex flex-col gap-8">
        {menuItems.map(item => (
          <MenuItem key={item?.id} item={item} />
        ))}
        <NewMenuItemForm
          onCancel={handleCancelNewItem}
          category={category}
          isVisible={showNewItemForm}
          setIsVisible={setShowNewItemForm}
        />
      </div>
    </div>
  )
}
