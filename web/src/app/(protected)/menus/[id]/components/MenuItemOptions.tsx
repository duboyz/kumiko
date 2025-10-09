import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Plus, X } from 'lucide-react'

interface MenuItemOption {
  id: string
  name: string
  description: string
  price: number
  orderIndex: number
  menuItemId: string
}

interface MenuItemOptionsProps {
  options: MenuItemOption[]
  isEditing: boolean
  onAddOption?: () => void
  onRemoveOption?: (index: number) => void
  onUpdateOption?: (index: number, field: string, value: string | number) => void
}

export const MenuItemOptions = ({
  options,
  isEditing,
  onAddOption,
  onRemoveOption,
  onUpdateOption,
}: MenuItemOptionsProps) => {
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <h4 className="font-semibold text-sm">Options</h4>
        {isEditing && onAddOption && (
          <Button variant="outline" size="sm" onClick={onAddOption}>
            <Plus className="h-4 w-4 mr-1" />
            Add Option
          </Button>
        )}
      </div>

      {isEditing ? (
        options.length > 0 ? (
          <div className="space-y-2">
            {options.map((option, idx) => (
              <div key={idx} className="flex items-center gap-2 bg-white p-3 rounded border">
                <Input
                  placeholder="Option name"
                  value={option.name}
                  onChange={(e) => onUpdateOption?.(idx, 'name', e.target.value)}
                  className="flex-1"
                />
                <Input
                  placeholder="Description"
                  value={option.description}
                  onChange={(e) => onUpdateOption?.(idx, 'description', e.target.value)}
                  className="flex-1"
                />
                <Input
                  type="number"
                  step="0.01"
                  placeholder="Price"
                  value={option.price}
                  onChange={(e) => onUpdateOption?.(idx, 'price', parseFloat(e.target.value) || 0)}
                  className="w-24"
                />
                <Button variant="ghost" size="sm" onClick={() => onRemoveOption?.(idx)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500">No options</p>
        )
      ) : options.length > 0 ? (
        <div className="space-y-2">
          {options.map(option => (
            <div
              key={option.id}
              className="flex items-center justify-between bg-white p-3 rounded border"
            >
              <div>
                <p className="font-medium">{option.name}</p>
                {option.description && (
                  <p className="text-sm text-gray-600">{option.description}</p>
                )}
              </div>
              <span className="font-semibold">
                +${option.price.toFixed(2)}
              </span>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-gray-500">No options</p>
      )}
    </div>
  )
}
