'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { GripVertical, Edit2, Check, Trash2 } from 'lucide-react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { MenuCategoryDto, MenuItemDto, MenuCategoryItemDto, CreateMenuItemCommand } from "../../../shared/types/menu.types"
import { SortableMenuItem } from './SortableMenuItem'
import { AddItemPopover } from './AddItemPopover'
import { AddExistingItemForm } from './AddExistingItemForm'
import { AddNewItemForm } from './AddNewItemForm'

interface SortableCategoryProps {
    category: MenuCategoryDto
    editingCategory: string | null
    editingItem: string | null
    showNewItemForm: string | null
    addItemMode: 'existing' | 'new' | null
    selectedExistingItem: string
    newItem: CreateMenuItemCommand & { categoryId: string }
    popoverOpen: string | null
    onEditCategory: () => void
    onDeleteCategory: () => void
    onAddItemClick: (categoryId: string) => void
    onModeSelect: (mode: 'existing' | 'new', categoryId: string) => void
    onEditItem: (itemId: string) => void
    onDeleteItem: (categoryItemId: string) => void
    onUpdateCategory: (categoryId: string, updates: Partial<MenuCategoryDto>) => void
    onUpdateMenuItem: (categoryId: string, itemId: string, updates: Partial<MenuItemDto>) => void
    onAddExistingMenuItem: (categoryId: string) => void
    onAddMenuItem: (categoryId: string) => void
    onCloseAddItemForm: () => void
    onSetSelectedExistingItem: (value: string) => void
    onSetNewItem: (item: CreateMenuItemCommand & { categoryId: string }) => void
    onSetPopoverOpen: (value: string | null) => void
    getAvailableExistingItems: () => MenuItemDto[]
    getMenuItemsForCategory: (category: MenuCategoryDto) => MenuItemDto[]
}

export function SortableCategory(props: SortableCategoryProps) {
    const {
        category,
        editingCategory,
        editingItem,
        showNewItemForm,
        addItemMode,
        selectedExistingItem,
        newItem,
        popoverOpen,
        onEditCategory,
        onDeleteCategory,
        onAddItemClick,
        onModeSelect,
        onEditItem,
        onDeleteItem,
        onUpdateCategory,
        onUpdateMenuItem,
        onAddExistingMenuItem,
        onAddMenuItem,
        onCloseAddItemForm,
        onSetSelectedExistingItem,
        onSetNewItem,
        onSetPopoverOpen,
        getAvailableExistingItems,
        getMenuItemsForCategory,
    } = props

    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: category.id })

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    }

    const menuItems = getMenuItemsForCategory(category)

    return (
        <Card ref={setNodeRef} style={style} className={isDragging ? 'shadow-lg' : ''}>
            <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 flex-1">
                        <div
                            {...attributes}
                            {...listeners}
                            className="cursor-grab active:cursor-grabbing p-1 hover:bg-gray-100 rounded"
                        >
                            <GripVertical className="w-4 h-4 text-gray-400" />
                        </div>
                        <div className="flex-1">
                            {editingCategory === category.id ? (
                                <div className="grid grid-cols-2 gap-4">
                                    <Input
                                        defaultValue={category.name}
                                        onBlur={(e) => onUpdateCategory(category.id, { name: e.target.value })}
                                        className="h-8 font-semibold"
                                        placeholder="Category name"
                                    />
                                    <Input
                                        defaultValue={category.description}
                                        onBlur={(e) => onUpdateCategory(category.id, { description: e.target.value })}
                                        className="h-8"
                                        placeholder="Category description"
                                    />
                                </div>
                            ) : (
                                <div>
                                    <CardTitle className="flex items-center gap-2">
                                        {category.name}
                                        <Badge variant="secondary">{category.menuCategoryItems.length} items</Badge>
                                    </CardTitle>
                                    <p className="text-sm text-muted-foreground mt-1">{category.description}</p>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="flex gap-2">
                        {editingCategory === category.id ? (
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => onUpdateCategory(category.id, {})}
                            >
                                <Check className="w-4 h-4" />
                            </Button>
                        ) : (
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={onEditCategory}
                            >
                                <Edit2 className="w-4 h-4" />
                            </Button>
                        )}
                        <AddItemPopover
                            categoryId={category.id}
                            categoryName={category.name}
                            isOpen={popoverOpen === category.id}
                            onOpenChange={(open) => onSetPopoverOpen(open ? category.id : null)}
                            onModeSelect={onModeSelect}
                            getAvailableExistingItems={getAvailableExistingItems}
                        />
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={onDeleteCategory}
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
                            <AddExistingItemForm
                                selectedItemId={selectedExistingItem}
                                availableItems={getAvailableExistingItems()}
                                onSelectItem={onSetSelectedExistingItem}
                                onSave={() => onAddExistingMenuItem(category.id)}
                                onCancel={onCloseAddItemForm}
                            />
                        )}

                        {/* Create New Item Form Row */}
                        {showNewItemForm === category.id && addItemMode === 'new' && (
                            <AddNewItemForm
                                newItem={newItem}
                                onUpdateItem={(updates) => onSetNewItem({ ...newItem, ...updates })}
                                onSave={() => onAddMenuItem(category.id)}
                                onCancel={onCloseAddItemForm}
                            />
                        )}

                        {/* Menu Items Rows */}
                        {menuItems.map((item) => {
                            const categoryItem = category.menuCategoryItems.find(ci => ci.menuItemId === item.id)
                            if (!categoryItem) return null

                            return (
                                <SortableMenuItem
                                    key={categoryItem.id}
                                    categoryItem={categoryItem}
                                    item={item}
                                    category={category}
                                    editingItem={editingItem}
                                    onUpdateMenuItem={onUpdateMenuItem}
                                    onEditItem={onEditItem}
                                    onDeleteItem={onDeleteItem}
                                />
                            )
                        })}

                        {/* Empty state for category with no items */}
                        {category.menuCategoryItems.length === 0 && showNewItemForm !== category.id && (
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
    )
}
