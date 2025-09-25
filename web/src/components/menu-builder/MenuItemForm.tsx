'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { CreateMenuItemCommand, UpdateMenuItemCommand, RestaurantMenuDto } from '@shared'

interface MenuItemFormProps {
  mode: 'create' | 'edit'
  menus: RestaurantMenuDto[]
  initialData?: Partial<CreateMenuItemCommand> | Partial<UpdateMenuItemCommand>
  onSubmit: (data: CreateMenuItemCommand | UpdateMenuItemCommand) => void
  onCancel: () => void
  isLoading: boolean
}

export function MenuItemForm({ mode, menus, initialData, onSubmit, onCancel, isLoading }: MenuItemFormProps) {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    description: initialData?.description || '',
    price: initialData?.price || 0,
    isAvailable: initialData?.isAvailable ?? true,
    restaurantMenuId: (initialData as any)?.restaurantMenuId || menus[0]?.id || '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.name && formData.price > 0 && formData.restaurantMenuId) {
      if (mode === 'create') {
        const createData: CreateMenuItemCommand = {
          ...formData,
          restaurantMenuId: (initialData as Partial<CreateMenuItemCommand>)?.restaurantMenuId || '',
        }
        onSubmit(createData)
      } else {
        const updateData: UpdateMenuItemCommand = {
          id: (initialData as Partial<UpdateMenuItemCommand>)?.id || '',
          ...formData,
        }
        onSubmit(updateData)
      }
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {menus.length > 0 && (
        <div className="space-y-2">
          <Label htmlFor="menu">Menu *</Label>
          <Select
            value={formData.restaurantMenuId}
            onValueChange={value => setFormData({ ...formData, restaurantMenuId: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a menu" />
            </SelectTrigger>
            <SelectContent>
              {menus.map(menu => (
                <SelectItem key={menu.id} value={menu.id}>
                  {menu.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
      <div className="space-y-2">
        <Label htmlFor="name">Name *</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={e => setFormData({ ...formData, name: e.target.value })}
          placeholder="Menu item name"
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={e => setFormData({ ...formData, description: e.target.value })}
          placeholder="Menu item description"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="price">Price *</Label>
        <Input
          id="price"
          type="number"
          step="0.01"
          min="0"
          value={formData.price}
          onChange={e => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
          placeholder="0.00"
          required
        />
      </div>
      <div className="flex items-center space-x-2">
        <Switch
          id="isAvailable"
          checked={formData.isAvailable}
          onCheckedChange={checked => setFormData({ ...formData, isAvailable: checked })}
        />
        <Label htmlFor="isAvailable">Available</Label>
      </div>
      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? (mode === 'create' ? 'Creating...' : 'Updating...') : mode === 'create' ? 'Create' : 'Update'}
        </Button>
      </div>
    </form>
  )
}
