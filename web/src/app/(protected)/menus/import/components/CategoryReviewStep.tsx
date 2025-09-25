'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, ArrowRight, Plus, Trash2, Edit3, Check, FolderOpen, GripVertical } from 'lucide-react'
import { ParsedMenuStructure, EditableMenuStructure, EditableCategory } from '@shared/types/menu-structure.types'

interface CategoryReviewStepProps {
  parsedStructure: ParsedMenuStructure
  onConfirm: (editableStructure: EditableMenuStructure) => void
  onBack: () => void
}

export function CategoryReviewStep({ parsedStructure, onConfirm, onBack }: CategoryReviewStepProps) {
  const [editableStructure, setEditableStructure] = useState<EditableMenuStructure | null>(null)
  const [editingCategory, setEditingCategory] = useState<string | null>(null)
  const [newCategoryName, setNewCategoryName] = useState('')
  const [newCategoryDescription, setNewCategoryDescription] = useState('')

  // Initialize editable structure from parsed structure
  useEffect(() => {
    if (parsedStructure) {
      const editable: EditableMenuStructure = {
        menuName: parsedStructure.suggestedMenuName,
        menuDescription: parsedStructure.suggestedMenuDescription,
        categories: parsedStructure.categories.map((category, index) => ({
          id: `cat-${index}`,
          name: category.name,
          description: category.description,
          orderIndex: category.orderIndex,
          items: category.items.map((item, itemIndex) => ({
            id: `item-${index}-${itemIndex}`,
            name: item.name,
            description: item.description,
            price: item.price,
            orderIndex: item.orderIndex,
            isAvailable: true,
            categoryId: `cat-${index}`,
          })),
          isExpanded: true,
        })),
      }
      setEditableStructure(editable)
    }
  }, [parsedStructure])

  const updateCategory = (categoryId: string, updates: Partial<EditableCategory>) => {
    if (!editableStructure) return

    setEditableStructure({
      ...editableStructure,
      categories: editableStructure.categories.map(cat => (cat.id === categoryId ? { ...cat, ...updates } : cat)),
    })
  }

  const addCategory = () => {
    if (!editableStructure || !newCategoryName.trim()) return

    const newCategory: EditableCategory = {
      id: `cat-${Date.now()}`,
      name: newCategoryName.trim(),
      description: newCategoryDescription.trim(),
      orderIndex: editableStructure.categories.length,
      items: [],
      isExpanded: true,
    }

    setEditableStructure({
      ...editableStructure,
      categories: [...editableStructure.categories, newCategory],
    })

    setNewCategoryName('')
    setNewCategoryDescription('')
  }

  const removeCategory = (categoryId: string) => {
    if (!editableStructure) return

    setEditableStructure({
      ...editableStructure,
      categories: editableStructure.categories.filter(cat => cat.id !== categoryId),
    })
  }

  const moveCategory = (categoryId: string, direction: 'up' | 'down') => {
    if (!editableStructure) return

    const categories = [...editableStructure.categories]
    const index = categories.findIndex(cat => cat.id === categoryId)

    if ((direction === 'up' && index > 0) || (direction === 'down' && index < categories.length - 1)) {
      const newIndex = direction === 'up' ? index - 1 : index + 1
      ;[categories[index], categories[newIndex]] = [categories[newIndex], categories[index]]

      // Update order indices
      categories.forEach((cat, i) => {
        cat.orderIndex = i
      })

      setEditableStructure({
        ...editableStructure,
        categories,
      })
    }
  }

  const handleConfirm = () => {
    if (editableStructure) {
      onConfirm(editableStructure)
    }
  }

  if (!editableStructure) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading categories...</p>
        </div>
      </div>
    )
  }

  const totalItems = editableStructure.categories.reduce((sum, cat) => sum + cat.items.length, 0)

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Review Categories</h2>
        <p className="text-muted-foreground">
          AI detected {editableStructure.categories.length} categories with {totalItems} items
        </p>
        <p className="text-sm text-muted-foreground mt-2">
          Edit category names, descriptions, and order before proceeding
        </p>
      </div>

      {/* Menu Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FolderOpen className="w-5 h-5" />
            Menu Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium">Menu Name</label>
            <Input
              value={editableStructure.menuName}
              onChange={e =>
                setEditableStructure({
                  ...editableStructure,
                  menuName: e.target.value,
                })
              }
              className="mt-1"
            />
          </div>
          <div>
            <label className="text-sm font-medium">Menu Description</label>
            <Textarea
              value={editableStructure.menuDescription}
              onChange={e =>
                setEditableStructure({
                  ...editableStructure,
                  menuDescription: e.target.value,
                })
              }
              className="mt-1"
              rows={2}
            />
          </div>
        </CardContent>
      </Card>

      {/* Categories */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Categories</h3>
          <div className="flex items-center gap-2">
            <Input
              placeholder="New category name"
              value={newCategoryName}
              onChange={e => setNewCategoryName(e.target.value)}
              className="w-48"
            />
            <Button onClick={addCategory} disabled={!newCategoryName.trim()} size="sm">
              <Plus className="w-4 h-4 mr-1" />
              Add
            </Button>
          </div>
        </div>

        <div className="space-y-3">
          {editableStructure.categories.map((category, index) => (
            <Card key={category.id}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <GripVertical className="w-4 h-4 text-muted-foreground" />
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">#{index + 1}</Badge>
                      {editingCategory === category.id ? (
                        <div className="flex items-center gap-2">
                          <Input
                            value={category.name}
                            onChange={e =>
                              updateCategory(category.id, {
                                name: e.target.value,
                              })
                            }
                            className="font-semibold"
                            autoFocus
                          />
                          <Button size="sm" variant="ghost" onClick={() => setEditingCategory(null)}>
                            <Check className="w-4 h-4" />
                          </Button>
                        </div>
                      ) : (
                        <h4
                          className="font-semibold cursor-pointer hover:text-primary"
                          onClick={() => setEditingCategory(category.id)}
                        >
                          {category.name}
                        </h4>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">{category.items.length} items</Badge>
                    <div className="flex items-center gap-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => moveCategory(category.id, 'up')}
                        disabled={index === 0}
                      >
                        ↑
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => moveCategory(category.id, 'down')}
                        disabled={index === editableStructure.categories.length - 1}
                      >
                        ↓
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => setEditingCategory(category.id)}>
                        <Edit3 className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => removeCategory(category.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div>
                    <label className="text-sm font-medium">Description</label>
                    <Textarea
                      value={category.description}
                      onChange={e =>
                        updateCategory(category.id, {
                          description: e.target.value,
                        })
                      }
                      className="mt-1"
                      rows={2}
                      placeholder="Category description..."
                    />
                  </div>

                  {/* Preview of items in this category */}
                  {category.items.length > 0 && (
                    <div>
                      <label className="text-sm font-medium">Items Preview</label>
                      <div className="mt-1 space-y-1">
                        {category.items.slice(0, 3).map(item => (
                          <div key={item.id} className="text-sm text-muted-foreground bg-gray-50 px-2 py-1 rounded">
                            {item.name} - ${item.price}
                          </div>
                        ))}
                        {category.items.length > 3 && (
                          <div className="text-xs text-muted-foreground">+{category.items.length - 3} more items</div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between pt-6">
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <Button onClick={handleConfirm}>
          Continue to Items
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  )
}
