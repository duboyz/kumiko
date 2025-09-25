import { Editable } from './Editable'
import { NonEditable } from './NonEditable'

export interface MenuItem {
  id: string
  name: string
  descripton: string
  price: number
  isAvailable: boolean
}

interface MenuItemRowProps {
  isEditable: boolean
  menuItem: MenuItem
  handleChange: (property: keyof MenuItem, value: MenuItem[keyof MenuItem]) => void
  onEdit: () => void
  onDelete: () => void
  onSave: () => void
}

export const MenuItemRow = ({ isEditable, menuItem, handleChange, onEdit, onDelete, onSave }: MenuItemRowProps) => {
  if (!isEditable) return <NonEditable menuItem={menuItem} onEdit={onEdit} onDelete={onDelete} />
  return <Editable menuItem={menuItem} handleChange={handleChange} onSave={onSave} onDelete={onDelete} />
}
