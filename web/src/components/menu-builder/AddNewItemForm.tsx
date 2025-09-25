'use client'

import { TableRow, TableCell } from '@/components/ui/table'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'
import { Save, X } from 'lucide-react'
import { CreateMenuItemCommand } from '../../../shared/types/menu.types'

interface AddNewItemFormProps {
  newItem: CreateMenuItemCommand & { categoryId: string }
  onUpdateItem: (updates: Partial<CreateMenuItemCommand & { categoryId: string }>) => void
  onSave: () => void
  onCancel: () => void
}

export function AddNewItemForm({ newItem, onUpdateItem, onSave, onCancel }: AddNewItemFormProps) {
  return (
    <TableRow className="bg-green-50/50">
      <TableCell>
        <Input
          placeholder="Item name"
          value={newItem.name}
          onChange={e => onUpdateItem({ name: e.target.value })}
          className="h-8"
        />
      </TableCell>
      <TableCell>
        <Input
          placeholder="Description"
          value={newItem.description}
          onChange={e => onUpdateItem({ description: e.target.value })}
          className="h-8"
        />
      </TableCell>
      <TableCell>
        <Input
          type="number"
          placeholder="0.00"
          value={newItem.price || ''}
          onChange={e => onUpdateItem({ price: parseFloat(e.target.value) || 0 })}
          className="h-8"
        />
      </TableCell>
      <TableCell>
        <Checkbox checked={newItem.isAvailable} onCheckedChange={checked => onUpdateItem({ isAvailable: !!checked })} />
      </TableCell>
      <TableCell>
        <div className="flex gap-1">
          <Button variant="ghost" size="sm" onClick={onSave}>
            <Save className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={onCancel}>
            <X className="w-4 h-4" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  )
}
