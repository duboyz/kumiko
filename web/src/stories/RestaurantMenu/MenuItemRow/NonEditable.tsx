import { Edit, Save, Trash } from 'lucide-react'
import { MenuItem } from './MenuItemRow'
interface NonEditableProps {
  menuItem: MenuItem
  onEdit: () => void
  onDelete: () => void
}
export const NonEditable = ({ menuItem, onEdit, onDelete }: NonEditableProps) => {
  return (
    <div className="grid grid-cols-12 gap-4 w-full">
      <p className="col-span-3">{menuItem.name}</p>
      <p className="col-span-6">{menuItem.descripton}</p>
      <p className="col-span-1">{menuItem.price}</p>
      <div className="col-span-2 flex items-center gap-4 justify-end">
        <Edit className="w-4 h-4 cursor-pointer hover:text-blue-600" onClick={onEdit} />
        <Trash className="w-4 h-4 cursor-pointer hover:text-red-600" onClick={onDelete} />
      </div>
    </div>
  )
}
