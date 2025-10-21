'use client'

import { useState, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import {
  ArrowLeft,
  ArrowRight,
  Trash2,
  Plus,
  Loader2,
  ChevronDown,
  ChevronRight,
  FolderOpen,
  DollarSign,
  Edit3,
  Save,
  GripVertical,
} from 'lucide-react'
import {
  ParsedMenuStructure,
  ParsedCategory,
  ParsedMenuItem,
  CreateMenuStructureRequest,
} from '@shared/types/menu-structure.types'
import { useCreateMenuStructure, Currency, formatPrice, useLocationSelection } from '@shared'

interface StructureReviewStepProps {
  parsedStructure: ParsedMenuStructure
  onConfirm: () => void
  onBack: () => void
  restaurantId: string
}

export function StructureReviewStep({ parsedStructure, onConfirm, onBack, restaurantId }: StructureReviewStepProps) {
  const { selectedLocation } = useLocationSelection()
  const currency = selectedLocation?.currency ?? Currency.USD
  const [isCreating, setIsCreating] = useState(false)
  const [expandedCategories, setExpandedCategories] = useState<Set<number>>(new Set([0])) // Expand first category by default
  const [editableStructure, setEditableStructure] = useState<ParsedMenuStructure>(parsedStructure)
  const [editingItem, setEditingItem] = useState<{ categoryIndex: number; itemIndex: number } | null>(null)
  const [editingCategory, setEditingCategory] = useState<number | null>(null)

  const createMenuStructureMutation = useCreateMenuStructure()

  const toggleCategory = (index: number) => {
    const newExpanded = new Set(expandedCategories)
    if (newExpanded.has(index)) {
      newExpanded.delete(index)
    } else {
      newExpanded.add(index)
    }
    setExpandedCategories(newExpanded)
  }

  const updateCategory = useCallback((categoryIndex: number, field: keyof ParsedCategory, value: string | number) => {
    setEditableStructure(prev => ({
      ...prev,
      categories: prev.categories.map((cat, index) => (index === categoryIndex ? { ...cat, [field]: value } : cat)),
    }))
  }, [])

  const updateItem = useCallback(
    (categoryIndex: number, itemIndex: number, field: keyof ParsedMenuItem, value: string | number) => {
      setEditableStructure(prev => ({
        ...prev,
        categories: prev.categories.map((cat, catIndex) =>
          catIndex === categoryIndex
            ? {
                ...cat,
                items: cat.items.map((item, idx) => (idx === itemIndex ? { ...item, [field]: value } : item)),
              }
            : cat
        ),
      }))
    },
    []
  )

  const removeItem = useCallback((categoryIndex: number, itemIndex: number) => {
    setEditableStructure(prev => ({
      ...prev,
      categories: prev.categories.map((cat, catIndex) =>
        catIndex === categoryIndex
          ? {
              ...cat,
              items: cat.items.filter((_, idx) => idx !== itemIndex),
            }
          : cat
      ),
    }))
  }, [])

  const addNewItem = useCallback(
    (categoryIndex: number) => {
      const newItem: ParsedMenuItem = {
        name: '',
        description: '',
        price: 0,
        orderIndex: editableStructure.categories[categoryIndex].items.length,
      }

      setEditableStructure(prev => ({
        ...prev,
        categories: prev.categories.map((cat, catIndex) =>
          catIndex === categoryIndex
            ? {
                ...cat,
                items: [...cat.items, newItem],
              }
            : cat
        ),
      }))
    },
    [editableStructure.categories]
  )

  const moveItem = useCallback((categoryIndex: number, fromIndex: number, toIndex: number) => {
    setEditableStructure(prev => ({
      ...prev,
      categories: prev.categories.map((cat, catIdx) =>
        catIdx === categoryIndex
          ? {
              ...cat,
              items: (() => {
                const items = [...cat.items]
                const [movedItem] = items.splice(fromIndex, 1)
                items.splice(toIndex, 0, movedItem)
                // Update order indices
                return items.map((item, idx) => ({ ...item, orderIndex: idx }))
              })(),
            }
          : cat
      ),
    }))
  }, [])

  const handleConfirm = async () => {
    setIsCreating(true)

    try {
      console.log('StructureReviewStep: Creating menu with restaurantId:', restaurantId)
      // Create the entire menu structure in one API call
      const request: CreateMenuStructureRequest = {
        restaurantId: restaurantId,
        menuName: editableStructure.suggestedMenuName,
        menuDescription: editableStructure.suggestedMenuDescription,
        categories: editableStructure.categories.map(category => ({
          name: category.name,
          description: category.description,
          orderIndex: category.orderIndex,
          items: category.items.map(item => ({
            name: item.name,
            description: item.description,
            price: item.price,
            orderIndex: item.orderIndex,
            isAvailable: true,
          })),
        })),
      }

      console.log('StructureReviewStep: Full request being sent:', request)
      const result = await createMenuStructureMutation.mutateAsync(request)

      console.log('Menu structure created successfully:', result)
      onConfirm()
    } catch (error) {
      console.error('Failed to create menu structure:', error)
      alert('Failed to create menu structure. Please try again.')
    } finally {
      setIsCreating(false)
    }
  }

  const totalItems = editableStructure.categories.reduce((sum, cat) => sum + cat.items.length, 0)

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Review Menu Structure</h2>
        <p className="text-muted-foreground">Review the parsed menu structure before creating it</p>
      </div>

      {/* Menu Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FolderOpen className="w-5 h-5" />
            Menu Overview
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label htmlFor="menu-name" className="text-sm font-medium">
                Menu Name
              </Label>
              <Input
                id="menu-name"
                value={editableStructure.suggestedMenuName}
                onChange={e => setEditableStructure(prev => ({ ...prev, suggestedMenuName: e.target.value }))}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="menu-description" className="text-sm font-medium">
                Menu Description
              </Label>
              <Input
                id="menu-description"
                value={editableStructure.suggestedMenuDescription}
                onChange={e => setEditableStructure(prev => ({ ...prev, suggestedMenuDescription: e.target.value }))}
                className="mt-1"
              />
            </div>
          </div>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <FolderOpen className="w-4 h-4" />
              {editableStructure.categories.length} categories
            </div>
            <div className="flex items-center gap-1">
              <DollarSign className="w-4 h-4" />
              {totalItems} items
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Categories and Items */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Menu Structure</h3>

        {editableStructure.categories.map((category, categoryIndex) => {
          const isExpanded = expandedCategories.has(categoryIndex)
          const isEditingCategory = editingCategory === categoryIndex

          return (
            <Card key={categoryIndex} className="overflow-hidden">
              <CardHeader
                className="cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => !isEditingCategory && toggleCategory(categoryIndex)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {isExpanded ? (
                      <ChevronDown className="w-4 h-4 text-muted-foreground" />
                    ) : (
                      <ChevronRight className="w-4 h-4 text-muted-foreground" />
                    )}
                    <div className="flex-1">
                      {isEditingCategory ? (
                        <div className="space-y-2">
                          <Input
                            value={category.name}
                            onChange={e => updateCategory(categoryIndex, 'name', e.target.value)}
                            className="font-semibold text-lg"
                            placeholder="Category name"
                          />
                          <Input
                            value={category.description}
                            onChange={e => updateCategory(categoryIndex, 'description', e.target.value)}
                            className="text-sm"
                            placeholder="Category description"
                          />
                        </div>
                      ) : (
                        <div>
                          <CardTitle className="text-lg">{category.name}</CardTitle>
                          <p className="text-sm text-muted-foreground mt-1">{category.description}</p>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-xs">
                      {category.items.length} items
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      Order: {category.orderIndex}
                    </Badge>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={e => {
                        e.stopPropagation()
                        if (isEditingCategory) {
                          setEditingCategory(null)
                        } else {
                          setEditingCategory(categoryIndex)
                        }
                      }}
                    >
                      {isEditingCategory ? <Save className="w-4 h-4" /> : <Edit3 className="w-4 h-4" />}
                    </Button>
                  </div>
                </div>
              </CardHeader>

              {isExpanded && (
                <CardContent className="pt-0">
                  <Separator className="mb-4" />
                  <div className="space-y-3">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-sm font-medium text-muted-foreground">Items</h4>
                      <Button variant="outline" size="sm" onClick={() => addNewItem(categoryIndex)}>
                        <Plus className="w-4 h-4 mr-1" />
                        Add Item
                      </Button>
                    </div>

                    {category.items.map((item, itemIndex) => {
                      const isEditingItem =
                        editingItem?.categoryIndex === categoryIndex && editingItem?.itemIndex === itemIndex

                      return (
                        <div key={itemIndex} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                          <div className="cursor-move text-muted-foreground hover:text-foreground">
                            <GripVertical className="w-4 h-4" />
                          </div>

                          <div className="flex-1">
                            {isEditingItem ? (
                              <div className="space-y-2">
                                <Input
                                  value={item.name}
                                  onChange={e => updateItem(categoryIndex, itemIndex, 'name', e.target.value)}
                                  placeholder="Item name"
                                  className="font-medium"
                                />
                                <Textarea
                                  value={item.description}
                                  onChange={e => updateItem(categoryIndex, itemIndex, 'description', e.target.value)}
                                  placeholder="Item description"
                                  rows={2}
                                  className="resize-none"
                                />
                                <div className="flex items-center gap-2">
                                  <Label className="text-sm">Price:</Label>
                                  <Input
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    value={item.price}
                                    onChange={e =>
                                      updateItem(categoryIndex, itemIndex, 'price', parseFloat(e.target.value) || 0)
                                    }
                                    placeholder="0.00"
                                    className="w-24"
                                  />
                                </div>
                              </div>
                            ) : (
                              <div>
                                <div className="flex items-center gap-2 mb-1">
                                  <h4 className="font-medium">{item.name}</h4>
                                  <Badge variant="outline" className="text-xs">
                                    Order: {item.orderIndex}
                                  </Badge>
                                </div>
                                {item.description && (
                                  <p className="text-sm text-muted-foreground mb-2">{item.description}</p>
                                )}
                              </div>
                            )}
                          </div>

                          <div className="flex items-center gap-2">
                            {!isEditingItem && (
                              <div className="text-right">
                                <div className="font-semibold text-lg">{formatPrice(item.price, currency)}</div>
                              </div>
                            )}

                            <div className="flex items-center gap-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  if (isEditingItem) {
                                    setEditingItem(null)
                                  } else {
                                    setEditingItem({ categoryIndex, itemIndex })
                                  }
                                }}
                              >
                                {isEditingItem ? <Save className="w-4 h-4" /> : <Edit3 className="w-4 h-4" />}
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => removeItem(categoryIndex, itemIndex)}
                                className="text-destructive hover:text-destructive"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      )
                    })}

                    {category.items.length === 0 && (
                      <div className="text-center py-8 text-muted-foreground">
                        <p>No items in this category</p>
                        <Button variant="outline" size="sm" onClick={() => addNewItem(categoryIndex)} className="mt-2">
                          <Plus className="w-4 h-4 mr-1" />
                          Add First Item
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              )}
            </Card>
          )
        })}
      </div>

      {/* Action Buttons */}
      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack} disabled={isCreating}>
          <ArrowLeft />
          Back
        </Button>
        <Button onClick={handleConfirm} disabled={isCreating || totalItems === 0} size="lg">
          {isCreating ? (
            <>
              <Loader2 className="animate-spin" />
              Creating Menu...
            </>
          ) : (
            <>
              Create Menu with {totalItems} Items
              <ArrowRight />
            </>
          )}
        </Button>
      </div>
    </div>
  )
}
