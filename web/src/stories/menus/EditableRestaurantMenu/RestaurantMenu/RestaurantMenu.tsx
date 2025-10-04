import { RestaurantMenuDto, useUpdateRestaurantMenu } from '@shared'
import { useState } from 'react'
import { MenuCategory } from '../MenuCategory'
import { NewCategoryForm } from '../NewCategoryForm'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Edit, X, Check } from 'lucide-react'
import { toast } from 'sonner'

interface RestaurantMenuProps {
  menu?: RestaurantMenuDto
}

export const RestaurantMenu = ({ menu }: RestaurantMenuProps) => {
  const [showNewCategoryForm, setShowNewCategoryForm] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [menuName, setMenuName] = useState(menu?.name || '')
  const [menuDescription, setMenuDescription] = useState(menu?.description || '')

  const { mutate: updateMenu, isPending: isUpdating } = useUpdateRestaurantMenu()

  if (!menu) return <div className="text-center py-20 text-muted-foreground">No menu found, create a new menu</div>

  const handleCancelNewCategory = () => setShowNewCategoryForm(false)

  const handleSave = () => {
    if (!menuName.trim()) {
      toast.error('Please enter a menu name')
      return
    }

    updateMenu(
      {
        id: menu.id,
        name: menuName,
        description: menuDescription,
      },
      {
        onSuccess: () => {
          toast.success('Menu updated successfully')
          setIsEditing(false)
        },
        onError: () => {
          toast.error('Failed to update menu')
        }
      }
    )
  }

  const handleStartEdit = () => {
    setMenuName(menu.name || '')
    setMenuDescription(menu.description || '')
    setIsEditing(true)
  }

  const handleCancel = () => {
    setIsEditing(false)
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-row gap-6 justify-between items-start pb-6 border-b">
        {isEditing ? (
          <div className="flex-1 flex items-center gap-4">
            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                placeholder="Menu Name"
                value={menuName}
                onChange={e => setMenuName(e.target.value)}
              />
              <Input
                placeholder="Menu Description"
                value={menuDescription}
                onChange={e => setMenuDescription(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCancel}
                disabled={isUpdating}
              >
                <X className="w-4 h-4" />
              </Button>
              <Button
                size="sm"
                onClick={handleSave}
                disabled={isUpdating}
              >
                <Check className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ) : (
          <>
            <div className="flex-1">
              <h2 className="text-3xl font-bold mb-2">{menu.name}</h2>
              {menu.description && (
                <p className="text-base text-muted-foreground">{menu.description}</p>
              )}
            </div>
            
            <Button variant="outline" onClick={handleStartEdit}>
              <Edit className="w-4 h-4 mr-2" />
              Edit
            </Button>
          </>
        )}
      </div>

      <div className="space-y-6">
        {menu.categories.map(category => (
          <MenuCategory key={category.id} category={category} />
        ))}
      </div>

      <NewCategoryForm
        onCancel={handleCancelNewCategory}
        menu={menu}
        isVisible={showNewCategoryForm}
        setIsVisible={setShowNewCategoryForm}
      />
    </div>
  )
}
