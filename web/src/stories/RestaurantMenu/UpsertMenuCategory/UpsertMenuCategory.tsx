import { LabeledInput } from '@/stories/LabeledInput/LabeledInput'
import { IconButton } from '@/stories/IconButton'
import { Plus } from 'lucide-react'
import { useState } from 'react'
import { MenuItemRow, MenuItem } from '../MenuItemRow/MenuItemRow'

interface UpsertMenuCategoryProps {
  categoryName: string
  setCategoryName: (name: string) => void
  items: MenuItem[]
  onRowSave: (item: MenuItem) => void
  onRowDelete: (item: MenuItem) => void
  onRowEdit: (item: MenuItem) => void
  onAddItem: () => void
}

export const UpsertMenuCategory = ({
  categoryName,
  setCategoryName,
  items,
  onRowSave,
  onRowDelete,
  onRowEdit,
  onAddItem,
}: UpsertMenuCategoryProps) => {
  const [editingItemId, setEditingItemId] = useState<string | null>(null)
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null)

  const handleRowEdit = (item: MenuItem) => {
    setEditingItemId(item.id)
    setEditingItem({ ...item })
    onRowEdit(item)
  }

  const handleRowSave = (item: MenuItem) => {
    setEditingItemId(null)
    setEditingItem(null)
    onRowSave(item)
  }

  const handleRowDelete = (item: MenuItem) => {
    setEditingItemId(null)
    setEditingItem(null)
    onRowDelete(item)
  }

  const handleItemChange = (property: keyof MenuItem, value: MenuItem[keyof MenuItem]) => {
    if (editingItem) {
      setEditingItem(prev => (prev ? { ...prev, [property]: value } : null))
    }
  }

  return (
    <div className="border-1 border-gray-300 p-8 border-dashed flex flex-col gap-4">
      <LabeledInput
        id="categoryName"
        label="Category Name"
        placeholder="Category Name"
        type="text"
        value={categoryName}
        onChange={e => setCategoryName(e)}
      />

      <div className="grid grid-cols-12 text-xs gap-4 text-gray-500 mt-4 uppercase">
        <p className="col-span-3">Name</p>
        <p className="col-span-6">Description</p>
        <p className="col-span-1">Price</p>
        <p className="col-span-2 text-right">Actions</p>
      </div>

      <div className="flex flex-col gap-6">
        {items?.map(item => (
          <MenuItemRow
            key={item.id}
            isEditable={editingItemId === item.id}
            menuItem={editingItemId === item.id ? editingItem! : item}
            handleChange={handleItemChange}
            onEdit={() => handleRowEdit(item)}
            onDelete={() => handleRowDelete(item)}
            onSave={() => editingItem && handleRowSave(editingItem)}
          />
        ))}
      </div>

      <div className="mt-4">
        <IconButton icon={Plus} variant="outline" size="sm" onClick={onAddItem}>
          Add Item
        </IconButton>
      </div>
    </div>
  )
}
