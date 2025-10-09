import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Save } from 'lucide-react'
import { useState } from 'react'

interface AddMenuItemFormProps {
  onSubmit: (data: {
    name: string
    description: string
    price: string
    isAvailable: boolean
    allergenIds: string[]
  }) => void
  onCancel: () => void
  isSubmitting: boolean
}

export const AddMenuItemForm = ({ onSubmit, onCancel, isSubmitting }: AddMenuItemFormProps) => {
  const [data, setData] = useState({
    name: '',
    description: '',
    price: '',
    isAvailable: true,
    allergenIds: [] as string[],
  })

  const handleSubmit = () => {
    onSubmit(data)
  }

  return (
    <div className="mb-6 p-4 border rounded-lg bg-gray-50">
      <h3 className="text-lg font-semibold mb-4">Add New Menu Item</h3>
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
          <label className="block text-sm font-medium mb-1">Price *</label>
          <Input
            type="number"
            step="0.01"
            value={data.price}
            onChange={(e) => setData(prev => ({ ...prev, price: e.target.value }))}
            placeholder="0.00"
          />
        </div>
      </div>

      <div className="flex items-center gap-4 mb-4">
        <div className="flex items-center gap-2">
          <Checkbox
            checked={data.isAvailable}
            onCheckedChange={(checked) => setData(prev => ({ ...prev, isAvailable: checked as boolean }))}
          />
          <label className="text-sm">Available</label>
        </div>
      </div>

      <div className="flex gap-2">
        <Button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="flex items-center gap-2"
        >
          <Save className="h-4 w-4" />
          {isSubmitting ? 'Creating...' : 'Create Menu Item'}
        </Button>
        <Button
          variant="outline"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
      </div>
    </div>
  )
}
