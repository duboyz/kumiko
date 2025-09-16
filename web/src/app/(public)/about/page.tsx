'use client'

import { ContentContainer } from '@/components/ContentContainer'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Checkbox } from '@/components/ui/checkbox'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Separator } from '@/components/ui/separator'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { Trash2, Edit2, Plus, Save, X, Check, Search, AlertTriangle } from 'lucide-react'
import { useState } from 'react'
import { MenuCategoryDto, MenuItemDto, CreateMenuCategoryCommand, CreateMenuItemCommand } from '../../../../shared/types/menuTypes'

// Mock existing menu items (global database of all menu items)
const mockExistingMenuItems: MenuItemDto[] = [
  {
    id: 'existing-1',
    name: 'Caesar Salad',
    description: 'Fresh romaine lettuce with caesar dressing and parmesan cheese',
    price: 14.00,
    isAvailable: true,
    menuCategoryId: '', // Will be set when added to category
    options: [],
    allergens: [],
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01'
  },
  {
    id: 'existing-2',
    name: 'Chicken Wings',
    description: 'Buffalo wings served with blue cheese dressing',
    price: 16.50,
    isAvailable: true,
    menuCategoryId: '',
    options: [],
    allergens: [],
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01'
  },
  {
    id: 'existing-3',
    name: 'Margherita Pizza',
    description: 'Classic pizza with tomato sauce, mozzarella, and fresh basil',
    price: 22.00,
    isAvailable: true,
    menuCategoryId: '',
    options: [],
    allergens: [],
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01'
  },
  {
    id: 'existing-4',
    name: 'Chocolate Cake',
    description: 'Rich chocolate cake with chocolate frosting',
    price: 8.50,
    isAvailable: true,
    menuCategoryId: '',
    options: [],
    allergens: [],
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01'
  },
  {
    id: 'existing-5',
    name: 'Fish and Chips',
    description: 'Beer-battered cod with crispy fries and tartar sauce',
    price: 24.00,
    isAvailable: true,
    menuCategoryId: '',
    options: [],
    allergens: [],
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01'
  }
]

// Mock data
const mockCategories: MenuCategoryDto[] = [
  {
    id: '1',
    name: 'Appetizers',
    description: 'Start your meal with our delicious appetizers',
    restaurantMenuId: 'menu-1',
    menuItems: [
      {
        id: 'item-1',
        name: 'Bruschetta',
        description: 'Toasted bread with fresh tomatoes, garlic, and basil',
        price: 12.50,
        isAvailable: true,
        menuCategoryId: '1',
        options: [],
        allergens: [],
        createdAt: '2024-01-01',
        updatedAt: '2024-01-01'
      },
      {
        id: 'item-2',
        name: 'Calamari Rings',
        description: 'Crispy fried squid rings with marinara sauce',
        price: 15.00,
        isAvailable: true,
        menuCategoryId: '1',
        options: [],
        allergens: [],
        createdAt: '2024-01-01',
        updatedAt: '2024-01-01'
      }
    ],
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01'
  },
  {
    id: '2',
    name: 'Main Courses',
    description: 'Our signature main dishes',
    restaurantMenuId: 'menu-1',
    menuItems: [
      {
        id: 'item-3',
        name: 'Grilled Salmon',
        description: 'Fresh Atlantic salmon with lemon butter sauce',
        price: 28.00,
        isAvailable: true,
        menuCategoryId: '2',
        options: [],
        allergens: [],
        createdAt: '2024-01-01',
        updatedAt: '2024-01-01'
      },
      {
        id: 'item-4',
        name: 'Ribeye Steak',
        description: '12oz ribeye steak cooked to perfection',
        price: 35.00,
        isAvailable: false,
        menuCategoryId: '2',
        options: [],
        allergens: [],
        createdAt: '2024-01-01',
        updatedAt: '2024-01-01'
      }
    ],
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01'
  }
]

export default function AboutPage() {
  return (
    <ContentContainer>
      <h1 className="text-3xl font-bold mb-6">Restaurant Menu Builder Prototype</h1>
      <p className="text-muted-foreground mb-8">
        This is a prototype for building restaurant menus. You can create new categories and menu items,
        as well as manage existing ones.
      </p>

      <MenuBuilder />
    </ContentContainer>
  )
}

function MenuBuilder() {
  const [categories, setCategories] = useState<MenuCategoryDto[]>(mockCategories)
  const [editingCategory, setEditingCategory] = useState<string | null>(null)
  const [editingItem, setEditingItem] = useState<string | null>(null)
  const [newCategory, setNewCategory] = useState<CreateMenuCategoryCommand>({
    name: '',
    description: '',
    restaurantMenuId: 'menu-1'
  })
  const [newItem, setNewItem] = useState<CreateMenuItemCommand & { categoryId: string }>({
    name: '',
    description: '',
    price: 0,
    isAvailable: true,
    menuCategoryId: '',
    categoryId: ''
  })
  const [showNewCategoryForm, setShowNewCategoryForm] = useState(false)
  const [showNewItemForm, setShowNewItemForm] = useState<string | null>(null)
  const [addItemMode, setAddItemMode] = useState<'existing' | 'new' | null>(null)
  const [selectedExistingItem, setSelectedExistingItem] = useState<string>('')
  const [popoverOpen, setPopoverOpen] = useState<string | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<{ type: 'category' | 'item', id: string, categoryId?: string } | null>(null)
  const [editDialogOpen, setEditDialogOpen] = useState<{ type: 'category' | 'item', id: string, categoryId?: string } | null>(null)
  const [menuTitle, setMenuTitle] = useState('Main Menu')
  const [menuDescription, setMenuDescription] = useState('Our carefully crafted selection of dishes')
  const [editingMenu, setEditingMenu] = useState(false)

  const addCategory = () => {
    if (!newCategory.name.trim()) return

    const category: MenuCategoryDto = {
      id: `cat-${Date.now()}`,
      name: newCategory.name,
      description: newCategory.description,
      restaurantMenuId: newCategory.restaurantMenuId,
      menuItems: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    setCategories([...categories, category])
    setNewCategory({ name: '', description: '', restaurantMenuId: 'menu-1' })
    setShowNewCategoryForm(false)
  }

  const confirmDeleteCategory = (categoryId: string) => {
    setCategories(categories.filter(cat => cat.id !== categoryId))
    setDeleteDialogOpen(null)
  }

  const confirmEditCategory = (categoryId: string) => {
    setEditingCategory(categoryId)
    setEditDialogOpen(null)
  }

  const updateCategory = (categoryId: string, updates: Partial<MenuCategoryDto>) => {
    setCategories(categories.map(cat =>
      cat.id === categoryId ? { ...cat, ...updates, updatedAt: new Date().toISOString() } : cat
    ))
    setEditingCategory(null)
  }

  const addMenuItem = (categoryId: string) => {
    if (!newItem.name.trim()) return

    const item: MenuItemDto = {
      id: `item-${Date.now()}`,
      name: newItem.name,
      description: newItem.description,
      price: newItem.price,
      isAvailable: newItem.isAvailable,
      menuCategoryId: categoryId,
      options: [],
      allergens: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    setCategories(categories.map(cat =>
      cat.id === categoryId
        ? { ...cat, menuItems: [...cat.menuItems, item] }
        : cat
    ))
    setNewItem({ name: '', description: '', price: 0, isAvailable: true, menuCategoryId: '', categoryId: '' })
    closeAddItemForm()
  }

  const addExistingMenuItem = (categoryId: string) => {
    if (!selectedExistingItem) return

    const existingItem = mockExistingMenuItems.find(item => item.id === selectedExistingItem)
    if (!existingItem) return

    // Create a new instance with a new ID but same data
    const item: MenuItemDto = {
      ...existingItem,
      id: `item-${Date.now()}`,
      menuCategoryId: categoryId,
      updatedAt: new Date().toISOString()
    }

    setCategories(categories.map(cat =>
      cat.id === categoryId
        ? { ...cat, menuItems: [...cat.menuItems, item] }
        : cat
    ))
    setSelectedExistingItem('')
    closeAddItemForm()
  }

  const handleAddItemClick = (categoryId: string) => {
    setPopoverOpen(categoryId)
    setAddItemMode(null)
    setSelectedExistingItem('')
    setNewItem({ name: '', description: '', price: 0, isAvailable: true, menuCategoryId: '', categoryId: '' })
  }

  const handleModeSelect = (mode: 'existing' | 'new', categoryId: string) => {
    setAddItemMode(mode)
    setShowNewItemForm(categoryId)
    setPopoverOpen(null) // Close popover
  }

  const closeAddItemForm = () => {
    setShowNewItemForm(null)
    setAddItemMode(null)
    setSelectedExistingItem('')
    setNewItem({ name: '', description: '', price: 0, isAvailable: true, menuCategoryId: '', categoryId: '' })
  }

  const getAvailableExistingItems = () => {
    // Filter out items that are already in the current category
    const currentCategoryId = showNewItemForm
    const currentCategory = categories.find(cat => cat.id === currentCategoryId)
    const usedItemNames = currentCategory?.menuItems.map(item => item.name.toLowerCase()) || []

    return mockExistingMenuItems.filter(item =>
      !usedItemNames.includes(item.name.toLowerCase())
    )
  }

  const confirmDeleteMenuItem = (categoryId: string, itemId: string) => {
    setCategories(categories.map(cat =>
      cat.id === categoryId
        ? { ...cat, menuItems: cat.menuItems.filter(item => item.id !== itemId) }
        : cat
    ))
    setDeleteDialogOpen(null)
  }

  const confirmEditMenuItem = (categoryId: string, itemId: string) => {
    setEditingItem(itemId)
    setEditDialogOpen(null)
  }

  const updateMenuItem = (categoryId: string, itemId: string, updates: Partial<MenuItemDto>) => {
    setCategories(categories.map(cat =>
      cat.id === categoryId
        ? {
          ...cat,
          menuItems: cat.menuItems.map(item =>
            item.id === itemId ? { ...item, ...updates, updatedAt: new Date().toISOString() } : item
          )
        }
        : cat
    ))
    setEditingItem(null)
  }

  return (
    <div className="space-y-6">
      {/* Menu Title and Description Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex-1">
              {editingMenu ? (
                <div className="space-y-3">
                  <Input
                    value={menuTitle}
                    onChange={(e) => setMenuTitle(e.target.value)}
                    className="text-2xl font-bold h-12"
                    placeholder="Menu title..."
                  />
                  <Textarea
                    value={menuDescription}
                    onChange={(e) => setMenuDescription(e.target.value)}
                    className="text-base"
                    placeholder="Menu description..."
                    rows={2}
                  />
                </div>
              ) : (
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">{menuTitle}</h1>
                  <p className="text-lg text-muted-foreground mt-2">{menuDescription}</p>
                </div>
              )}
            </div>
            <div className="flex gap-2 ml-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setEditingMenu(!editingMenu)}
              >
                {editingMenu ? <Check className="w-4 h-4" /> : <Edit2 className="w-4 h-4" />}
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Add New Category Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Menu Categories</CardTitle>
            <Button
              onClick={() => setShowNewCategoryForm(!showNewCategoryForm)}
              variant={showNewCategoryForm ? "outline" : "default"}
            >
              {showNewCategoryForm ? <X className="w-4 h-4 mr-2" /> : <Plus className="w-4 h-4 mr-2" />}
              {showNewCategoryForm ? 'Cancel' : 'Add Category'}
            </Button>
          </div>
        </CardHeader>
        {showNewCategoryForm && (
          <CardContent>
            <div className="grid grid-cols-3 gap-4">
              <Input
                placeholder="Category name"
                value={newCategory.name}
                onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
              />
              <Input
                placeholder="Category description"
                value={newCategory.description}
                onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
              />
              <Button onClick={addCategory}>
                <Save className="w-4 h-4 mr-2" />
                Save Category
              </Button>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Category Spreadsheets */}
      <div className="space-y-6">
        {categories.map((category) => (
          <Card key={category.id}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  {editingCategory === category.id ? (
                    <div className="grid grid-cols-2 gap-4">
                      <Input
                        defaultValue={category.name}
                        onBlur={(e) => updateCategory(category.id, { name: e.target.value })}
                        className="h-8 font-semibold"
                        placeholder="Category name"
                      />
                      <Input
                        defaultValue={category.description}
                        onBlur={(e) => updateCategory(category.id, { description: e.target.value })}
                        className="h-8"
                        placeholder="Category description"
                      />
                    </div>
                  ) : (
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        {category.name}
                        <Badge variant="secondary">{category.menuItems.length} items</Badge>
                      </CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">{category.description}</p>
                    </div>
                  )}
                </div>
                <div className="flex gap-2">
                  {editingCategory === category.id ? (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setEditingCategory(null)}
                    >
                      <Check className="w-4 h-4" />
                    </Button>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setEditDialogOpen({ type: 'category', id: category.id })}
                    >
                      <Edit2 className="w-4 h-4" />
                    </Button>
                  )}
                  <Popover open={popoverOpen === category.id} onOpenChange={(open) => setPopoverOpen(open ? category.id : null)}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleAddItemClick(category.id)}
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-80" align="end">
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-medium leading-none">Add Menu Item</h4>
                          <p className="text-sm text-muted-foreground mt-2">
                            Choose how you'd like to add a menu item to {category.name}
                          </p>
                        </div>
                        <Separator />
                        <div className="space-y-3">
                          <Button
                            variant="outline"
                            className="w-full justify-start"
                            onClick={() => handleModeSelect('existing', category.id)}
                          >
                            <Search className="w-4 h-4 mr-2" />
                            Add Existing Item
                            <span className="ml-auto text-xs text-muted-foreground">
                              {getAvailableExistingItems().length} available
                            </span>
                          </Button>
                          <Button
                            variant="outline"
                            className="w-full justify-start"
                            onClick={() => handleModeSelect('new', category.id)}
                          >
                            <Plus className="w-4 h-4 mr-2" />
                            Create New Item
                          </Button>
                        </div>
                      </div>
                    </PopoverContent>
                  </Popover>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setDeleteDialogOpen({ type: 'category', id: category.id })}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="w-[300px]">Item Name</TableHead>
                    <TableHead className="w-[400px]">Description</TableHead>
                    <TableHead className="w-[120px]">Price</TableHead>
                    <TableHead className="w-[100px]">Available</TableHead>
                    <TableHead className="w-[120px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {/* Add Existing Item Form Row */}
                  {showNewItemForm === category.id && addItemMode === 'existing' && (
                    <TableRow className="bg-yellow-50/50">
                      <TableCell>
                        <Select value={selectedExistingItem} onValueChange={setSelectedExistingItem}>
                          <SelectTrigger className="h-8">
                            <SelectValue placeholder="Select existing item..." />
                          </SelectTrigger>
                          <SelectContent>
                            {getAvailableExistingItems().map((item) => (
                              <SelectItem key={item.id} value={item.id}>
                                {item.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>
                        <Input
                          value={selectedExistingItem ? mockExistingMenuItems.find(i => i.id === selectedExistingItem)?.description || '' : ''}
                          readOnly
                          disabled
                          className="h-8 bg-muted/50 text-muted-foreground cursor-not-allowed"
                          placeholder="Description will appear here..."
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          value={selectedExistingItem ? `${mockExistingMenuItems.find(i => i.id === selectedExistingItem)?.price.toFixed(2) || ''}` : ''}
                          readOnly
                          disabled
                          className="h-8 bg-muted/50 text-muted-foreground cursor-not-allowed"
                          placeholder="Price will appear here..."
                        />
                      </TableCell>
                      <TableCell>
                        <Checkbox
                          checked={selectedExistingItem ? mockExistingMenuItems.find(i => i.id === selectedExistingItem)?.isAvailable || false : false}
                          disabled
                          className="cursor-not-allowed"
                        />
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => addExistingMenuItem(category.id)}
                            disabled={!selectedExistingItem}
                          >
                            <Save className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => closeAddItemForm()}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}

                  {/* Create New Item Form Row */}
                  {showNewItemForm === category.id && addItemMode === 'new' && (
                    <TableRow className="bg-green-50/50">
                      <TableCell>
                        <Input
                          placeholder="Item name"
                          value={newItem.name}
                          onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                          className="h-8"
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          placeholder="Description"
                          value={newItem.description}
                          onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                          className="h-8"
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          placeholder="0.00"
                          value={newItem.price || ''}
                          onChange={(e) => setNewItem({ ...newItem, price: parseFloat(e.target.value) || 0 })}
                          className="h-8"
                        />
                      </TableCell>
                      <TableCell>
                        <Checkbox
                          checked={newItem.isAvailable}
                          onCheckedChange={(checked) => setNewItem({ ...newItem, isAvailable: !!checked })}
                        />
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => addMenuItem(category.id)}
                          >
                            <Save className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => closeAddItemForm()}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}

                  {/* Menu Items Rows */}
                  {category.menuItems.map((item) => (
                    <TableRow key={item.id} className="hover:bg-muted/30">
                      <TableCell>
                        {editingItem === item.id ? (
                          <Input
                            defaultValue={item.name}
                            onBlur={(e) => updateMenuItem(category.id, item.id, { name: e.target.value })}
                            className="h-8"
                          />
                        ) : (
                          <span className="font-medium">{item.name}</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {editingItem === item.id ? (
                          <Input
                            defaultValue={item.description}
                            onBlur={(e) => updateMenuItem(category.id, item.id, { description: e.target.value })}
                            className="h-8"
                          />
                        ) : (
                          <span className="text-sm">{item.description}</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {editingItem === item.id ? (
                          <Input
                            type="number"
                            defaultValue={item.price}
                            onBlur={(e) => updateMenuItem(category.id, item.id, { price: parseFloat(e.target.value) || 0 })}
                            className="h-8"
                          />
                        ) : (
                          <span className="font-semibold text-green-600">${item.price.toFixed(2)}</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Checkbox
                          checked={item.isAvailable}
                          onCheckedChange={(checked) => updateMenuItem(category.id, item.id, { isAvailable: !!checked })}
                        />
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          {editingItem === item.id ? (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setEditingItem(null)}
                            >
                              <Check className="w-4 h-4" />
                            </Button>
                          ) : (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setEditDialogOpen({ type: 'item', id: item.id, categoryId: category.id })}
                            >
                              <Edit2 className="w-4 h-4" />
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setDeleteDialogOpen({ type: 'item', id: item.id, categoryId: category.id })}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}

                  {/* Empty state for category with no items */}
                  {category.menuItems.length === 0 && showNewItemForm !== category.id && (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                        No menu items yet. Click the + button above to add your first item.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        ))}

        {categories.length === 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <p className="text-muted-foreground text-lg">No categories yet.</p>
              <p className="text-sm text-muted-foreground mt-2">Add your first category above to get started!</p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteDialogOpen} onOpenChange={(open: boolean) => !open && setDeleteDialogOpen(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-destructive" />
              Confirm Deletion
            </AlertDialogTitle>
            <AlertDialogDescription>
              {deleteDialogOpen?.type === 'category' ? (
                <>
                  Are you sure you want to delete this category? This will permanently remove the category and all {
                    categories.find(cat => cat.id === deleteDialogOpen.id)?.menuItems.length || 0
                  } menu items within it. This action cannot be undone.
                </>
              ) : (
                <>
                  Are you sure you want to delete this menu item? This action cannot be undone.
                </>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (deleteDialogOpen?.type === 'category') {
                  confirmDeleteCategory(deleteDialogOpen.id)
                } else if (deleteDialogOpen?.type === 'item' && deleteDialogOpen.categoryId) {
                  confirmDeleteMenuItem(deleteDialogOpen.categoryId, deleteDialogOpen.id)
                }
              }}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Edit Warning Dialog */}
      <AlertDialog open={!!editDialogOpen} onOpenChange={(open: boolean) => !open && setEditDialogOpen(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-500" />
              Edit Warning
            </AlertDialogTitle>
            <AlertDialogDescription>
              {editDialogOpen?.type === 'category' ? (
                <>
                  You are about to edit this category. Changes to the category name and description will be visible wherever this category is used across your restaurant menus.
                </>
              ) : (
                <>
                  You are about to edit this menu item. This action will affect everywhere this item is used across your restaurant menus. Changes to name, description, and price will be reflected in all locations.
                </>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (editDialogOpen?.type === 'category') {
                  confirmEditCategory(editDialogOpen.id)
                } else if (editDialogOpen?.type === 'item' && editDialogOpen.categoryId) {
                  confirmEditMenuItem(editDialogOpen.categoryId, editDialogOpen.id)
                }
              }}
              className="bg-amber-500 text-white hover:bg-amber-600"
            >
              Continue Editing
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}