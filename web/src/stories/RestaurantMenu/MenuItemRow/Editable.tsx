import { LabeledInput } from '@/stories/LabeledInput/LabeledInput'
import { MenuItemRow } from './MenuItemRow'
import { Save } from 'lucide-react'

interface EditableProps {
  menuItem: MenuItemRow
  handleChange: (property: keyof MenuItemRow, value: MenuItemRow[keyof MenuItemRow]) => void
  onSave: () => void
}
export const Editable = ({ menuItem, handleChange, onSave }: EditableProps) => {
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

      <div className="col-span-2 flex items-center justify-end">
        <Save className="w-4 h-4" onClick={onSave} />
      </div>
    </div>
  )
}
