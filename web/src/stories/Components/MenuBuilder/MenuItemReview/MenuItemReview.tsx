'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Trash2, Plus, Check, AlertTriangle, TrendingUp } from 'lucide-react'

interface ParsedMenuItem {
  id: string
  name: string
  description: string
  price: number
  confidence?: number
}

interface MenuCategory {
  id: string
  name: string
  description: string
  orderIndex: number
  restaurantMenuId: string
}

interface MenuItemReviewProps {
  initialItems: ParsedMenuItem[]
  categories: MenuCategory[]
  selectedCategoryId: string
  onCategoryChange: (categoryId: string) => void
  onConfirm: (items: ParsedMenuItem[]) => void
  onCancel: () => void
  isLoading?: boolean
}

export function MenuItemReview({
  initialItems,
  categories,
  selectedCategoryId,
  onCategoryChange,
  onConfirm,
  onCancel,
  isLoading = false,
}: MenuItemReviewProps) {
  const [items, setItems] = useState<ParsedMenuItem[]>(initialItems)

  const updateItem = (id: string, field: keyof ParsedMenuItem, value: string | number) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, [field]: field === 'price' ? Number(value) : value }
          : item
      )
    )
  }

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id))
  }

  const addNewItem = () => {
    const newItem: ParsedMenuItem = {
      id: Date.now().toString(),
      name: '',
      description: '',
      price: 0,
    }
    setItems((prev) => [...prev, newItem])
  }

  const getConfidenceBadge = (confidence?: number) => {
    if (!confidence) return null

    const variant = confidence >= 0.8 ? 'default' : confidence >= 0.6 ? 'secondary' : 'destructive'
    const icon = confidence >= 0.8 ? <Check className="w-3 h-3" /> :
                 confidence >= 0.6 ? <TrendingUp className="w-3 h-3" /> :
                 <AlertTriangle className="w-3 h-3" />

    return (
      <Badge variant={variant} className="flex items-center gap-1">
        {icon}
        {Math.round(confidence * 100)}%
      </Badge>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Review Menu Items</h2>
          <p className="text-muted-foreground">
            Review and edit the extracted menu items before adding them to your menu.
          </p>
        </div>
        <div className="text-sm text-muted-foreground">
          {items.length} items
        </div>
      </div>

      {categories.length > 0 && (
        <div className="space-y-2">
          <Label>Category</Label>
          <Select value={selectedCategoryId} onValueChange={onCategoryChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      <div className="space-y-4">
        {items.map((item, index) => (
          <Card key={item.id}>
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-muted-foreground">
                    Item {index + 1}
                  </span>
                  {getConfidenceBadge(item.confidence)}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeItem(item.id)}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>

              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor={`name-${item.id}`}>Name</Label>
                  <Input
                    id={`name-${item.id}`}
                    value={item.name}
                    onChange={(e) => updateItem(item.id, 'name', e.target.value)}
                    placeholder="Item name"
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor={`description-${item.id}`}>Description</Label>
                  <Textarea
                    id={`description-${item.id}`}
                    value={item.description}
                    onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                    placeholder="Item description"
                    rows={2}
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor={`price-${item.id}`}>Price ($)</Label>
                  <Input
                    id={`price-${item.id}`}
                    type="number"
                    step="0.01"
                    min="0"
                    value={item.price}
                    onChange={(e) => updateItem(item.id, 'price', e.target.value)}
                    placeholder="0.00"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex items-center justify-between">
        <Button variant="outline" onClick={addNewItem} className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Add Item
        </Button>

        <div className="flex gap-2">
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button
            onClick={() => onConfirm(items)}
            disabled={isLoading || items.length === 0}
          >
            {isLoading ? 'Adding Items...' : `Add ${items.length} Items`}
          </Button>
        </div>
      </div>
    </div>
  )
}