import { LabeledInput } from '@/stories/LabeledInput/LabeledInput'
import { Button } from '@/components/ui/button'
import { IconButton } from '@/stories/IconButton'
import { Plus, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { UpsertMenuCategory } from '../UpsertMenuCategory/UpsertMenuCategory'

interface MenuItem {
  id: string
  name: string
  descripton: string
  price: number
  isAvailable: boolean
}

interface Category {
  id: string
  name: string
  items: MenuItem[]
}

export const UpsertMenu = () => {
  const [menuName, setMenuName] = useState('')
  const [categories, setCategories] = useState<Category[]>([
    {
      id: '1',
      name: 'Appetizers',
      items: [
        { id: '1', name: 'Våruller', descripton: 'Some tasty spring rolls', price: 199, isAvailable: true },
        { id: '2', name: 'Kebab', descripton: 'Some tasty kebab', price: 299, isAvailable: true },
      ],
    },
    {
      id: '2',
      name: 'Main Courses',
      items: [
        { id: '3', name: 'Pizza', descripton: 'Some tasty pizza', price: 399, isAvailable: true },
        { id: '4', name: 'Pasta', descripton: 'Some tasty pasta', price: 349, isAvailable: true },
      ],
    },
  ])

  const addCategory = () => {
    const newCategory: Category = {
      id: Date.now().toString(),
      name: 'New Category',
      items: [],
    }
    setCategories(prev => [...prev, newCategory])
  }

  const removeCategory = (categoryId: string) => {
    setCategories(prev => prev.filter(cat => cat.id !== categoryId))
  }

  const updateCategoryName = (categoryId: string, newName: string) => {
    setCategories(prev => prev.map(cat => (cat.id === categoryId ? { ...cat, name: newName } : cat)))
  }

  const addMenuItem = (categoryId: string) => {
    const newItem: MenuItem = {
      id: Date.now().toString(),
      name: 'New Item',
      descripton: 'Item description',
      price: 0,
      isAvailable: true,
    }
    setCategories(prev => prev.map(cat => (cat.id === categoryId ? { ...cat, items: [...cat.items, newItem] } : cat)))
  }

  const updateMenuItem = (categoryId: string, item: MenuItem) => {
    setCategories(prev =>
      prev.map(cat =>
        cat.id === categoryId ? { ...cat, items: cat.items.map(i => (i.id === item.id ? item : i)) } : cat
      )
    )
  }

  const deleteMenuItem = (categoryId: string, itemId: string) => {
    setCategories(prev =>
      prev.map(cat => (cat.id === categoryId ? { ...cat, items: cat.items.filter(i => i.id !== itemId) } : cat))
    )
  }

  return (
    <div className="border-1 border-gray-300 p-8 border-dashed flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <LabeledInput
          label="Menu Name"
          placeholder="Menu Name"
          type="text"
          value={menuName}
          onChange={e => setMenuName(e)}
          id="menuName"
        />
        <IconButton icon={Plus} onClick={addCategory}>
          Add Category
        </IconButton>
      </div>

      <div className="flex flex-col gap-8">
        {categories.map(category => (
          <div key={category.id} className="relative">
            <UpsertMenuCategory
              categoryName={category.name}
              setCategoryName={name => updateCategoryName(category.id, name)}
              items={category.items}
              onRowSave={item => updateMenuItem(category.id, item)}
              onRowDelete={item => deleteMenuItem(category.id, item.id)}
              onRowEdit={item => console.log('Editing item:', item)}
              onAddItem={() => addMenuItem(category.id)}
            />
            <div className="mt-4 flex gap-2">
              <IconButton icon={Trash2} variant="destructive" size="sm" onClick={() => removeCategory(category.id)}>
                Remove Category
              </IconButton>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
