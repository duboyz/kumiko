import { LabeledInput } from '@/stories/atoms/LabeledInput/LabeledInput'
import { MenuItem } from './MenuItemRow'
import { Save, Trash } from 'lucide-react'

interface EditableProps {
  menuItem: MenuItem
  handleChange: (property: keyof MenuItem, value: MenuItem[keyof MenuItem]) => void
  onSave: () => void
  onDelete: () => void
}
export const Editable = ({ menuItem, handleChange, onSave, onDelete }: EditableProps) => {
  return (
    <div className="grid grid-cols-12 gap-4 w-full">
      <div className="col-span-3">
        <LabeledInput
          label="Name"
          placeholder="Name"
          type="text"
          value={menuItem.name}
          onChange={e => handleChange('name', e)}
          id="name"
        />
      </div>

      <div className="col-span-6">
        <LabeledInput
          label="Description"
          placeholder="Description"
          type="text"
          value={menuItem.descripton}
          onChange={e => handleChange('descripton', e)}
          id="description"
        />
      </div>

      <div className="col-span-1">
        <LabeledInput
          label="Price"
          placeholder="Price"
          type="number"
          value={menuItem.price.toString()}
          onChange={e => handleChange('price', parseFloat(e))}
          id="price"
        />
      </div>

      <div className="col-span-2 flex items-center gap-4 justify-end">
        <Save className="w-4 h-4 cursor-pointer hover:text-green-600" onClick={onSave} />
        <Trash className="w-4 h-4 cursor-pointer hover:text-red-600" onClick={onDelete} />
      </div>
    </div>
  )
}
