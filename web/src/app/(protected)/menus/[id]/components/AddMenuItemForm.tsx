import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Save, Plus, X, Package, AlertTriangle } from 'lucide-react'
import { useState } from 'react'
import { useAllergens } from '@shared'

interface MenuItemOption {
  name: string
  description: string
  price: number
}

interface AddMenuItemFormProps {
  onSubmit: (data: {
    name: string
    description: string
    price: string
    isAvailable: boolean
    allergenIds: string[]
    options: MenuItemOption[]
  }) => void
  onCancel: () => void
  isSubmitting: boolean
}

export const AddMenuItemForm = ({ onSubmit, onCancel, isSubmitting }: AddMenuItemFormProps) => {
  const { data: allergensData } = useAllergens()
  const [data, setData] = useState({
    name: '',
    description: '',
    price: '',
    isAvailable: true,
    allergenIds: [] as string[],
    options: [] as MenuItemOption[],
  })

  const handleSubmit = () => {
    onSubmit(data)
  }

  const addOption = () => {
    setData(prev => ({
      ...prev,
      options: [
        ...prev.options,
        {
          name: '',
          description: '',
          price: 0,
        },
      ],
    }))
  }

  const removeOption = (index: number) => {
    setData(prev => ({
      ...prev,
      options: prev.options.filter((_, i) => i !== index),
    }))
  }

  const updateOption = (index: number, field: keyof MenuItemOption, value: string | number) => {
    setData(prev => ({
      ...prev,
      options: prev.options.map((opt, i) =>
        i === index ? { ...opt, [field]: value } : opt
      ),
    }))
  }

  const toggleAllergen = (allergenId: string) => {
    setData(prev => ({
      ...prev,
      allergenIds: prev.allergenIds.includes(allergenId)
        ? prev.allergenIds.filter(id => id !== allergenId)
        : [...prev.allergenIds, allergenId],
    }))
  }

  const hasOptions = data.options.length > 0

  return (
    <div className="mb-6 p-6 border rounded-lg bg-gradient-to-br from-gray-50 to-gray-100/50 shadow-sm">
      <h3 className="text-xl font-bold mb-6">Add New Menu Item</h3>

      {/* Basic Information */}
      <div className="bg-white p-4 rounded-lg border border-gray-200 mb-6">
        <h4 className="font-semibold mb-4 text-gray-900">Basic Information</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium mb-1">Name *</label>
            <Input
              value={data.name}
              onChange={(e) => setData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Menu item name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <Input
              value={data.description}
              onChange={(e) => setData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Description (optional)"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Price {hasOptions && <span className="text-xs text-gray-500">(optional if using options)</span>}
            </label>
            <Input
              type="number"
              step="0.01"
              value={data.price}
              onChange={(e) => setData(prev => ({ ...prev, price: e.target.value }))}
              placeholder="0.00"
              disabled={hasOptions}
            />
            {hasOptions && (
              <p className="text-xs text-gray-500 mt-1">Price will be set by options</p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Checkbox
            checked={data.isAvailable}
            onCheckedChange={(checked) => setData(prev => ({ ...prev, isAvailable: checked as boolean }))}
          />
          <label className="text-sm">Available</label>
        </div>
      </div>

      {/* Options & Sizes Section */}
      <div className="bg-white p-4 rounded-lg border border-gray-200 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Package className="h-4 w-4 text-blue-600" />
            </div>
            <h4 className="font-semibold text-gray-900">Options & Sizes</h4>
          </div>
          <Button variant="outline" size="sm" onClick={addOption} type="button">
            <Plus className="h-4 w-4 mr-1" />
            Add Option
          </Button>
        </div>

        {data.options.length > 0 ? (
          <div className="space-y-3">
            {data.options.map((option, idx) => (
              <div key={idx} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <div className="grid grid-cols-12 gap-3">
                  <div className="col-span-5">
                    <label className="text-xs font-medium text-gray-700 mb-1 block">Name *</label>
                    <Input
                      placeholder="e.g., Small, Medium"
                      value={option.name}
                      onChange={(e) => updateOption(idx, 'name', e.target.value)}
                      className="h-9"
                    />
                  </div>
                  <div className="col-span-4">
                    <label className="text-xs font-medium text-gray-700 mb-1 block">Description</label>
                    <Input
                      placeholder="Optional"
                      value={option.description}
                      onChange={(e) => updateOption(idx, 'description', e.target.value)}
                      className="h-9"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="text-xs font-medium text-gray-700 mb-1 block">Price *</label>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      value={option.price}
                      onChange={(e) => updateOption(idx, 'price', parseFloat(e.target.value) || 0)}
                      className="h-9"
                    />
                  </div>
                  <div className="col-span-1 flex items-end">
                    <Button
                      variant="ghost"
                      size="sm"
                      type="button"
                      onClick={() => removeOption(idx)}
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
          <p className="text-sm text-gray-500 text-center py-4">
            No options added. Click "Add Option" to create size variants.
          </p>
        )}
      </div>

      {/* Allergens Section */}
      {allergensData && allergensData.length > 0 && (
        <div className="bg-white p-4 rounded-lg border border-gray-200 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="p-2 bg-orange-100 rounded-lg">
              <AlertTriangle className="h-4 w-4 text-orange-600" />
            </div>
            <h4 className="font-semibold text-gray-900">Allergen Information</h4>
          </div>

          <p className="text-xs text-gray-600 mb-3">Select all allergens present in this item</p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {allergensData.map(allergen => (
              <div
                key={allergen.id}
                className={`flex items-center gap-2 p-2 rounded-md transition-colors ${
                  data.allergenIds.includes(allergen.id)
                    ? 'bg-orange-50 border border-orange-200'
                    : 'hover:bg-gray-50'
                }`}
              >
                <Checkbox
                  id={`new-allergen-${allergen.id}`}
                  checked={data.allergenIds.includes(allergen.id)}
                  onCheckedChange={() => toggleAllergen(allergen.id)}
                />
                <label
                  htmlFor={`new-allergen-${allergen.id}`}
                  className="text-sm cursor-pointer flex-1"
                >
                  {allergen.name}
                </label>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-2">
        <Button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="flex items-center gap-2"
          type="button"
        >
          <Save className="h-4 w-4" />
          {isSubmitting ? 'Creating...' : 'Create Menu Item'}
        </Button>
        <Button
          variant="outline"
          onClick={onCancel}
          disabled={isSubmitting}
          type="button"
        >
          Cancel
        </Button>
      </div>
    </div>
  )
}
