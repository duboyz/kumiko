import { LabeledInput } from '@/stories/LabeledInput/LabeledInput'
import { IconButton } from '@/stories/IconButton'
import { Plus, Trash2 } from 'lucide-react'
import { UpsertMenuCategory } from '../UpsertMenuCategory/UpsertMenuCategory'
import { MenuItem } from '../MenuItemRow/MenuItemRow'
import { useLocationSelection, useRestaurantMenus } from '@shared'

interface Category {
  id: string
  name: string
  items: MenuItem[]
}

interface UpsertMenuProps {
  menuName: string
  setMenuName: (name: string) => void
  categories: Category[]
  onCategoryAdd: () => void
  onCategoryDelete: (categoryId: string) => void
  onCategoryNameChange: (categoryId: string, name: string) => void
  onItemAdd: (categoryId: string) => void
  onItemUpdate: (categoryId: string, item: MenuItem) => void
  onItemDelete: (categoryId: string, itemId: string) => void
}

export const UpsertMenu = ({
  menuName,
  setMenuName,
  categories,
  onCategoryAdd,
  onCategoryDelete,
  onCategoryNameChange,
  onItemAdd,
  onItemUpdate,
  onItemDelete,
}: UpsertMenuProps) => {
  const { selectedLocation } = useLocationSelection()

  const { data: menus, isLoading: menusLoading } = useRestaurantMenus(selectedLocation?.id || '')

  return (
    <div className="border-1 border-gray-300 p-8 border-dashed flex flex-col gap-8">
      <h1 className="text-2xl font-bold">{selectedLocation?.name}</h1>
      <pre>{JSON.stringify(menus, null, 2)}</pre>
      <div className="flex items-center justify-between">
        <LabeledInput
          label="Menu Name"
          placeholder="Menu Name"
          type="text"
          value={menuName}
          onChange={e => setMenuName(e)}
          id="menuName"
        />
        <IconButton icon={Plus} onClick={onCategoryAdd}>
          Add Category
        </IconButton>
      </div>

      <div className="flex flex-col gap-8">
        {categories.map(category => (
          <div key={category.id} className="relative">
            <UpsertMenuCategory
              categoryName={category.name}
              setCategoryName={name => onCategoryNameChange(category.id, name)}
              items={category.items}
              onRowSave={item => onItemUpdate(category.id, item)}
              onRowDelete={item => onItemDelete(category.id, item.id)}
              onRowEdit={item => console.log('Editing item:', item)}
              onAddItem={() => onItemAdd(category.id)}
            />
            <div className="mt-4 flex gap-2">
              <IconButton icon={Trash2} variant="destructive" size="sm" onClick={() => onCategoryDelete(category.id)}>
                Remove Category
              </IconButton>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
