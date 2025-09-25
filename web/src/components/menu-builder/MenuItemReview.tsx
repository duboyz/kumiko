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
    setItems(prev => prev.map(item => (item.id === id ? { ...item, [field]: value } : item)))
  }

  const removeItem = (id: string) => {
    setItems(prev => prev.filter(item => item.id !== id))
  }

  const addNewItem = () => {
    const newItem: ParsedMenuItem = {
      id: `new-${Date.now()}`,
      name: '',
      description: '',
      price: 0,
    }
    setItems(prev => [...prev, newItem])
  }

  const handleConfirm = () => {
    // Filter out items with empty names
    const validItems = items.filter(item => item.name.trim() !== '')
    onConfirm(validItems)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Review Menu Items</h3>
          <p className="text-sm text-muted-foreground">
            Review and edit the parsed menu items before adding them to your menu
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={addNewItem}>
            <Plus className="w-4 h-4 mr-2" />
            Add Item
          </Button>
        </div>
      </div>

      {/* Category Selection */}
      <div className="space-y-2">
        <Label htmlFor="category-select" className="text-sm font-medium">
          Select Category *
        </Label>
        <Select value={selectedCategoryId} onValueChange={onCategoryChange}>
          <SelectTrigger id="category-select">
            <SelectValue placeholder="Choose a category for these items" />
          </SelectTrigger>
          <SelectContent>
            {categories.map(category => (
              <SelectItem key={category.id} value={category.id}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {categories.length === 0 && (
          <p className="text-sm text-muted-foreground">No categories available. Please create a category first.</p>
        )}
      </div>

      <div className="space-y-3 max-h-80 overflow-y-auto">
        {items.map((item, index) => (
          <Card key={item.id} className="relative">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="flex-1 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-muted-foreground">Item {index + 1}</span>
                    <div className="flex items-center gap-2">
                      {item.confidence && (
                        <Badge
                          variant={
                            item.confidence > 0.8 ? 'default' : item.confidence > 0.6 ? 'secondary' : 'destructive'
                          }
                          className="text-xs"
                        >
                          {item.confidence > 0.8 ? (
                            <TrendingUp className="w-3 h-3 mr-1" />
                          ) : (
                            <AlertTriangle className="w-3 h-3 mr-1" />
                          )}
                          {Math.round(item.confidence * 100)}% confidence
                        </Badge>
                      )}
                      {item.name.trim() && (
                        <Badge variant="secondary" className="text-xs">
                          <Check className="w-3 h-3 mr-1" />
                          Valid
                        </Badge>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeItem(item.id)}
                        className="text-destructive hover:text-destructive h-6 w-6 p-0"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>

                  <div className="grid gap-3 md:grid-cols-2">
                    <div className="space-y-1">
                      <Label htmlFor={`name-${item.id}`} className="text-xs">
                        Name *
                      </Label>
                      <Input
                        id={`name-${item.id}`}
                        value={item.name}
                        onChange={e => updateItem(item.id, 'name', e.target.value)}
                        placeholder="Enter item name"
                        className="h-8"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor={`price-${item.id}`} className="text-xs">
                        Price
                      </Label>
                      <Input
                        id={`price-${item.id}`}
                        type="number"
                        step="0.01"
                        min="0"
                        value={item.price}
                        onChange={e => updateItem(item.id, 'price', parseFloat(e.target.value) || 0)}
                        placeholder="0.00"
                        className="h-8"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <Label htmlFor={`description-${item.id}`} className="text-xs">
                      Description
                    </Label>
                    <Textarea
                      id={`description-${item.id}`}
                      value={item.description}
                      onChange={e => updateItem(item.id, 'description', e.target.value)}
                      placeholder="Enter item description"
                      rows={1}
                      className="resize-none"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {items.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-muted-foreground mb-4">No menu items found</p>
            <Button onClick={addNewItem} variant="outline">
              <Plus className="w-4 h-4 mr-2" />
              Add First Item
            </Button>
          </CardContent>
        </Card>
      )}

      <div className="flex justify-end gap-2 pt-4 border-t">
        <Button variant="outline" onClick={onCancel} disabled={isLoading}>
          Cancel
        </Button>
        <Button
          onClick={handleConfirm}
          disabled={isLoading || items.filter(item => item.name.trim()).length === 0 || !selectedCategoryId}
        >
          {isLoading ? 'Adding Items...' : `Add ${items.filter(item => item.name.trim()).length} Items`}
        </Button>
      </div>
    </div>
  )
}
