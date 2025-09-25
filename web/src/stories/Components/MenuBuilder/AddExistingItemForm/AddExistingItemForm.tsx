'use client'

import { TableRow, TableCell } from '@/components/ui/table'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'
import { Save, X } from 'lucide-react'
import { MenuItemDto } from '@shared'

interface AddExistingItemFormProps {
  selectedItemId: string
  availableItems: MenuItemDto[]
  onSelectItem: (itemId: string) => void
  onSave: () => void
  onCancel: () => void
}

export function AddExistingItemForm({
  selectedItemId,
  availableItems,
  onSelectItem,
  onSave,
  onCancel,
}: AddExistingItemFormProps) {
  const selectedItem = availableItems.find(item => item.id === selectedItemId)

  return (
    <TableRow className="bg-yellow-50/50">
      <TableCell>
        <Select value={selectedItemId} onValueChange={onSelectItem}>
          <SelectTrigger className="h-8">
            <SelectValue placeholder="Select existing item..." />
          </SelectTrigger>
          <SelectContent>
            {availableItems.map(item => (
              <SelectItem key={item.id} value={item.id}>
                {item.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </TableCell>
      <TableCell>
        <Input
          value={selectedItem?.description || ''}
          readOnly
          disabled
          className="h-8 bg-muted/50 text-muted-foreground cursor-not-allowed"
          placeholder="Description will appear here..."
        />
      </TableCell>
      <TableCell>
        <Input
          value={selectedItem ? selectedItem.price.toFixed(2) : ''}
          readOnly
          disabled
          className="h-8 bg-muted/50 text-muted-foreground cursor-not-allowed"
          placeholder="Price will appear here..."
        />
      </TableCell>
      <TableCell>
        <Checkbox checked={selectedItem?.isAvailable || false} disabled className="cursor-not-allowed" />
      </TableCell>
      <TableCell>
        <div className="flex gap-1">
          <Button variant="ghost" size="sm" onClick={onSave} disabled={!selectedItemId}>
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