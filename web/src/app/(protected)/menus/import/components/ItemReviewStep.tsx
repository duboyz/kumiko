'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import {
  ArrowLeft,
  ArrowRight,
  Plus,
  Trash2,
  Edit3,
  Check,
  X,
  DollarSign,
  GripVertical,
  Move,
  FolderOpen,
} from 'lucide-react'
import { EditableMenuStructure, EditableCategory, EditableMenuItem } from '@shared/types/menu-structure.types'
import { cn } from '@/lib/utils'

interface ItemReviewStepProps {
  editableStructure: EditableMenuStructure
  onConfirm: (editableStructure: EditableMenuStructure) => void
  onBack: () => void
}

export function ItemReviewStep({ editableStructure, onConfirm, onBack }: ItemReviewStepProps) {
  const [structure, setStructure] = useState<EditableMenuStructure>(editableStructure)
  const [editingItem, setEditingItem] = useState<string | null>(null)
  const [draggedItem, setDraggedItem] = useState<string | null>(null)
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set(structure.categories.map(cat => cat.id))
  )

  const updateItem = (itemId: string, updates: Partial<EditableMenuItem>) => {
    setStructure({
      ...structure,
      categories: structure.categories.map(category => ({
        ...category,
        items: category.items.map(item => (item.id === itemId ? { ...item, ...updates } : item)),
      })),
    })
  }

  const moveItemToCategory = (itemId: string, newCategoryId: string) => {
    const item = structure.categories.flatMap(cat => cat.items).find(item => item.id === itemId)

    if (!item) return

    // Remove from old category
    const updatedCategories = structure.categories.map(category => ({
      ...category,
      items: category.items.filter(item => item.id !== itemId),
    }))

    // Add to new category
    const newItem = { ...item, categoryId: newCategoryId }
    const finalCategories = updatedCategories.map(category => {
      if (category.id === newCategoryId) {
        return {
          ...category,
          items: [...category.items, newItem],
        }
      }
      return category
    })

    setStructure({
      ...structure,
      categories: finalCategories,
    })
  }

  const removeItem = (itemId: string) => {
    setStructure({
      ...structure,
      categories: structure.categories.map(category => ({
        ...category,
        items: category.items.filter(item => item.id !== itemId),
      })),
    })
  }

  const addItemToCategory = (categoryId: string) => {
    const newItem: EditableMenuItem = {
      id: `item-${Date.now()}`,
      name: '',
      description: '',
      price: 0,
      orderIndex: structure.categories.find(cat => cat.id === categoryId)?.items.length || 0,
      isAvailable: true,
      categoryId,
    }

    setStructure({
      ...structure,
      categories: structure.categories.map(category =>
        category.id === categoryId ? { ...category, items: [...category.items, newItem] } : category
      ),
    })

    setEditingItem(newItem.id)
  }

  const toggleCategoryExpanded = (categoryId: string) => {
    const newExpanded = new Set(expandedCategories)
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId)
    } else {
      newExpanded.add(categoryId)
    }
    setExpandedCategories(newExpanded)
  }

  const handleConfirm = () => {
    onConfirm(structure)
  }

  const totalItems = structure.categories.reduce((sum, cat) => sum + cat.items.length, 0)

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Review Items</h2>
        <p className="text-muted-foreground">
          Edit item details and organize them across {structure.categories.length} categories
        </p>
        <p className="text-sm text-muted-foreground mt-2">
          Total: {totalItems} items • Drag items between categories to reorganize
        </p>
      </div>

      {/* Categories and Items */}
      <div className="space-y-4">
        {structure.categories.map(category => (
          <Card key={category.id}>
            <CardHeader
              className="pb-3 cursor-pointer hover:bg-gray-50"
              onClick={() => toggleCategoryExpanded(category.id)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FolderOpen className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <h3 className="font-semibold">{category.name}</h3>
                    <p className="text-sm text-muted-foreground">{category.items.length} items</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">{category.items.length} items</Badge>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={e => {
                      e.stopPropagation()
                      addItemToCategory(category.id)
                    }}
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>

            {expandedCategories.has(category.id) && (
              <CardContent>
                <div className="space-y-3">
                  {category.items.map((item, index) => (
                    <div key={item.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <GripVertical className="w-4 h-4 text-muted-foreground" />
                          <div className="flex items-center gap-2">
                            <Badge variant="outline">#{index + 1}</Badge>
                            {editingItem === item.id ? (
                              <div className="flex-1 space-y-2">
                                <Input
                                  value={item.name}
                                  onChange={e =>
                                    updateItem(item.id, {
                                      name: e.target.value,
                                    })
                                  }
                                  placeholder="Item name"
                                  className="font-semibold"
                                />
                                <Textarea
                                  value={item.description}
                                  onChange={e =>
                                    updateItem(item.id, {
                                      description: e.target.value,
                                    })
                                  }
                                  placeholder="Item description"
                                  rows={2}
                                />
                                <div className="flex items-center gap-2">
                                  <DollarSign className="w-4 h-4 text-muted-foreground" />
                                  <Input
                                    type="number"
                                    step="0.01"
                                    value={item.price}
                                    onChange={e =>
                                      updateItem(item.id, {
                                        price: parseFloat(e.target.value) || 0,
                                      })
                                    }
                                    placeholder="0.00"
                                    className="w-24"
                                  />
                                </div>
                                <div className="flex items-center gap-2">
                                  <Button size="sm" onClick={() => setEditingItem(null)}>
                                    <Check className="w-4 h-4 mr-1" />
                                    Save
                                  </Button>
                                  <Button size="sm" variant="ghost" onClick={() => setEditingItem(null)}>
                                    <X className="w-4 h-4" />
                                  </Button>
                                </div>
                              </div>
                            ) : (
                              <div className="flex-1">
                                <h4 className="font-semibold">{item.name}</h4>
                                <p className="text-sm text-muted-foreground mt-1">{item.description}</p>
                                <div className="flex items-center gap-2 mt-2">
                                  <Badge variant="secondary">${item.price.toFixed(2)}</Badge>
                                  <Badge variant={item.isAvailable ? 'default' : 'destructive'}>
                                    {item.isAvailable ? 'Available' : 'Unavailable'}
                                  </Badge>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>

                        {editingItem !== item.id && (
                          <div className="flex items-center gap-1">
                            <Button size="sm" variant="ghost" onClick={() => setEditingItem(item.id)}>
                              <Edit3 className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => removeItem(item.id)}
                              className="text-destructive hover:text-destructive"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        )}
                      </div>

                      {/* Move to category dropdown */}
                      {editingItem !== item.id && (
                        <div className="mt-3 pt-3 border-t">
                          <div className="flex items-center gap-2">
                            <Move className="w-4 h-4 text-muted-foreground" />
                            <span className="text-sm text-muted-foreground">Move to:</span>
                            <select
                              value={item.categoryId}
                              onChange={e => moveItemToCategory(item.id, e.target.value)}
                              className="text-sm border rounded px-2 py-1"
                            >
                              {structure.categories.map(cat => (
                                <option key={cat.id} value={cat.id}>
                                  {cat.name}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}

                  {category.items.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      <FolderOpen className="w-8 h-8 mx-auto mb-2 opacity-50" />
                      <p>No items in this category</p>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => addItemToCategory(category.id)}
                        className="mt-2"
                      >
                        <Plus className="w-4 h-4 mr-1" />
                        Add Item
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            )}
          </Card>
        ))}
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between pt-6">
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Categories
        </Button>
        <Button onClick={handleConfirm}>
          Preview Structure
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  )
}
