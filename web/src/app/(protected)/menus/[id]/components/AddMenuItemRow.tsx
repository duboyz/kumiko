import { TableCell, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { Save, X } from 'lucide-react'
import { useState } from 'react'

interface AddMenuItemRowProps {
  onSave: (data: {
    name: string
    description: string
    price: string
    isAvailable: boolean
  }) => void
  onCancel: () => void
  isSubmitting: boolean
}

export const AddMenuItemRow = ({ onSave, onCancel, isSubmitting }: AddMenuItemRowProps) => {
  const [data, setData] = useState({
    name: '',
    description: '',
    price: '',
    isAvailable: true,
  })

  const handleSave = () => {
    onSave(data)
  }

  return (
    <TableRow className="bg-blue-50/50 border-l-4 border-l-blue-500">
      <TableCell></TableCell>
      <TableCell></TableCell>
      <TableCell>
        <Input
          value={data.name}
          onChange={(e) => setData(prev => ({ ...prev, name: e.target.value }))}
          placeholder="Menu item name"
          className="w-full"
          autoFocus
        />
      </TableCell>
      <TableCell>
        <Input
          value={data.description}
          onChange={(e) => setData(prev => ({ ...prev, description: e.target.value }))}
          placeholder="Description (optional)"
          className="w-full"
        />
      </TableCell>
      <TableCell>
        <Input
          type="number"
          step="0.01"
          value={data.price}
          onChange={(e) => setData(prev => ({ ...prev, price: e.target.value }))}
          placeholder="0.00"
          className="w-24"
        />
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-2">
          <Checkbox
            checked={data.isAvailable}
            onCheckedChange={(checked) => setData(prev => ({ ...prev, isAvailable: checked as boolean }))}
          />
          <span className="text-sm">Available</span>
        </div>
      </TableCell>
      <TableCell>
        <div className="flex gap-2">
          <Button
            variant="default"
            size="sm"
            onClick={handleSave}
            disabled={isSubmitting}
          >
            <Save className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  )
}
