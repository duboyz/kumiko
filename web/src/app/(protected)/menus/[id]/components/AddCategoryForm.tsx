import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Save } from 'lucide-react'
import { useState } from 'react'

interface AddCategoryFormProps {
  onSubmit: (data: { name: string; description: string }) => void
  onCancel: () => void
  isSubmitting: boolean
}

export const AddCategoryForm = ({ onSubmit, onCancel, isSubmitting }: AddCategoryFormProps) => {
  const [data, setData] = useState({
    name: '',
    description: '',
  })

  const handleSubmit = () => {
    onSubmit(data)
  }

  return (
    <div className="mb-6 p-4 border rounded-lg bg-gray-50">
      <h3 className="text-lg font-semibold mb-4">Add New Category</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium mb-1">Name *</label>
          <Input
            value={data.name}
            onChange={(e) => setData(prev => ({ ...prev, name: e.target.value }))}
            placeholder="Category name"
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
      </div>

      <div className="flex gap-2">
        <Button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="flex items-center gap-2"
        >
          <Save className="h-4 w-4" />
          {isSubmitting ? 'Creating...' : 'Create Category'}
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
