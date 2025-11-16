import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Plus, X, Package } from 'lucide-react'
import { Currency, formatPrice, useLocationSelection } from '@shared'

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
  const { selectedLocation } = useLocationSelection()
  const currency = selectedLocation?.currency ?? Currency.USD
  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Package className="h-4 w-4 text-blue-600" />
          </div>
          <h4 className="font-semibold text-base text-gray-900">Options & Sizes</h4>
        </div>
        {isEditing && onAddOption && (
          <Button variant="outline" size="sm" onClick={onAddOption} className="shadow-sm">
            <Plus className="h-4 w-4 mr-1" />
            Add
          </Button>
        )}
      </div>

      {isEditing ? (
        options.length > 0 ? (
          <div className="space-y-3">
            {options.map((option, idx) => (
              <div key={idx} className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="grid grid-cols-12 gap-3">
                  <div className="col-span-5">
                    <label className="text-xs font-medium text-gray-700 mb-1 block">Name</label>
                    <Input
                      placeholder="e.g., Small, Medium"
                      value={option.name}
                      onChange={(e) => onUpdateOption?.(idx, 'name', e.target.value)}
                      className="h-9"
                    />
                  </div>
                  <div className="col-span-4">
                    <label className="text-xs font-medium text-gray-700 mb-1 block">Description</label>
                    <Input
                      placeholder="Optional"
                      value={option.description}
                      onChange={(e) => onUpdateOption?.(idx, 'description', e.target.value)}
                      className="h-9"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="text-xs font-medium text-gray-700 mb-1 block">Price</label>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      value={option.price}
                      onChange={(e) => onUpdateOption?.(idx, 'price', parseFloat(e.target.value) || 0)}
                      className="h-9"
                    />
                  </div>
                  <div className="col-span-1 flex items-end">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onRemoveOption?.(idx)}
                      className="h-9 w-9 p-0 hover:bg-red-50 hover:text-red-600"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center p-8 bg-white rounded-lg border-2 border-dashed border-gray-200">
            <div className="text-center">
              <Package className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-500">No options added yet</p>
              <p className="text-xs text-gray-400 mt-1">Click "Add" to create size variants</p>
            </div>
          </div>
        )
      ) : options.length > 0 ? (
        <div className="space-y-2">
          {options.map(option => (
            <div
              key={option.id}
              className="flex items-center justify-between bg-white p-3 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors"
            >
              <div className="flex-1">
                <p className="font-medium text-gray-900">{option.name}</p>
                {option.description && (
                  <p className="text-sm text-gray-500 mt-0.5">{option.description}</p>
                )}
              </div>
              <Badge variant="secondary" className="ml-3 font-semibold">
                +{formatPrice(option.price, currency)}
              </Badge>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center p-8 bg-white rounded-lg border border-gray-200">
          <div className="text-center">
            <Package className="h-8 w-8 text-gray-300 mx-auto mb-2" />
            <p className="text-sm text-gray-400">No options configured</p>
          </div>
        </div>
      )}
    </div>
  )
}
