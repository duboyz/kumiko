import { RestaurantMenuDto, useUpdateRestaurantMenu } from '@shared'
import { useState } from 'react'
import { MenuCategory } from '../MenuCategory'
import { NewCategoryForm } from '../NewCategoryForm'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { FormField } from '@/components'

interface RestaurantMenuProps {
  menu?: RestaurantMenuDto
}

export const RestaurantMenu = ({ menu }: RestaurantMenuProps) => {
  const [showNewCategoryForm, setShowNewCategoryForm] = useState(false)
  const [isEditable, setIsEditable] = useState(false)
  const [menuName, setMenuName] = useState(menu?.name || '')
  const [menuDescription, setMenuDescription] = useState(menu?.description || '')

  const { mutate: updateMenu } = useUpdateRestaurantMenu()

  if (!menu)
    return <div className="text-center py-20 text-muted-foreground">No menu found, create a new menu</div>

  const handleCancelNewCategory = () => setShowNewCategoryForm(false)

  const handleSave = () => {
    updateMenu({
      id: menu.id,
      name: menuName,
      description: menuDescription,
    })
    setIsEditable(false)
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-row gap-6 justify-between items-start pb-6 border-b">
        {isEditable ? (
          <div className="flex-1 flex flex-col gap-4">
            <FormField label="Menu Name" htmlFor="menuName">
              <Input id="menuName" placeholder="Menu Name" type="text" value={menuName} onChange={e => setMenuName(e.target.value)} />
            </FormField>
            <FormField label="Menu Description" htmlFor="menuDescription">
              <Input
                id="menuDescription"
                placeholder="Menu Description"
                type="text"
                value={menuDescription}
                onChange={e => setMenuDescription(e.target.value)}
              />
            </FormField>
          </div>
        ) : (
          <div className="flex-1">
            <h2 className="text-2xl font-semibold mb-2">{menuName}</h2>
            <p className="text-sm text-muted-foreground">{menuDescription}</p>
          </div>
        )}

        {isEditable ? (
          <div className="flex gap-3">
            <Button variant="secondary" onClick={() => setIsEditable(false)}>
              Cancel
            </Button>
            <Button variant="default" onClick={handleSave}>
              Save
            </Button>
          </div>
        ) : (
          <div>
            <Button variant="secondary" onClick={() => setIsEditable(true)}>
              Edit
            </Button>
          </div>
        )}
      </div>

      {menu.categories.map(category => (
        <MenuCategory key={category.id} category={category} />
      ))}

      <NewCategoryForm
        onCancel={handleCancelNewCategory}
        menu={menu}
        isVisible={showNewCategoryForm}
        setIsVisible={setShowNewCategoryForm}
      />
    </div>
  )
}
