import { Editable } from './Editable'
import { NonEditable } from './NonEditable'
export interface MenuItemRow {
  id: string
  name: string
  descripton: string
  price: number
  isAvailable: boolean
}

interface MenuItemRowProps {
  isEditable: boolean
  menuItem: MenuItemRow
  handleChange: (property: keyof MenuItemRow, value: MenuItemRow[keyof MenuItemRow]) => void
  onEdit: () => void
  onDelete: () => void
  onSave: () => void
}
export const MenuItemRow = ({ isEditable, menuItem, handleChange, onEdit, onDelete, onSave }: MenuItemRowProps) => {
  if (!isEditable) return <NonEditable menuItem={menuItem} onEdit={onEdit} onDelete={onDelete} />
  return <Editable menuItem={menuItem} handleChange={handleChange} onSave={onSave} />
}
