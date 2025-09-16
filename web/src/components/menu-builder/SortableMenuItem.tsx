'use client'

import { TableRow, TableCell } from '@/components/ui/table'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'
import { GripVertical, Edit2, Check, Trash2 } from 'lucide-react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { MenuItemDto, MenuCategoryItemDto, MenuCategoryDto } from "../../../shared/types/menu.types"

interface SortableMenuItemProps {
    categoryItem: MenuCategoryItemDto
    item: MenuItemDto
    category: MenuCategoryDto
    editingItem: string | null
    onUpdateMenuItem: (categoryId: string, itemId: string, updates: Partial<MenuItemDto>) => void
    onEditItem: (itemId: string) => void
    onDeleteItem: (categoryItemId: string) => void
}

export function SortableMenuItem({
    categoryItem,
    item,
    category,
    editingItem,
    onUpdateMenuItem,
    onEditItem,
    onDeleteItem,
}: SortableMenuItemProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: categoryItem.id })

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    }

    return (
        <TableRow
            ref={setNodeRef}
            style={style}
            className={`hover:bg-muted/30 ${isDragging ? 'shadow-lg z-50' : ''}`}
        >
            <TableCell>
                <div className="flex items-center gap-2">
                    <div
                        {...attributes}
                        {...listeners}
                        className="cursor-grab active:cursor-grabbing p-1 hover:bg-gray-100 rounded flex-shrink-0"
                    >
                        <GripVertical className="w-3 h-3 text-gray-400" />
                    </div>
                    {editingItem === item.id ? (
                        <Input
                            defaultValue={item.name}
                            onBlur={(e) => onUpdateMenuItem(category.id, item.id, { name: e.target.value })}
                            className="h-8 flex-1"
                        />
                    ) : (
                        <span className="font-medium">{item.name}</span>
                    )}
                </div>
            </TableCell>
            <TableCell>
                {editingItem === item.id ? (
                    <Input
                        defaultValue={item.description}
                        onBlur={(e) => onUpdateMenuItem(category.id, item.id, { description: e.target.value })}
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
                        onBlur={(e) => onUpdateMenuItem(category.id, item.id, { price: parseFloat(e.target.value) || 0 })}
                        className="h-8"
                    />
                ) : (
                    <span className="font-semibold text-green-600">${item.price.toFixed(2)}</span>
                )}
            </TableCell>
            <TableCell>
                <Checkbox
                    checked={item.isAvailable}
                    onCheckedChange={(checked) => onUpdateMenuItem(category.id, item.id, { isAvailable: !!checked })}
                />
            </TableCell>
            <TableCell>
                <div className="flex gap-1">
                    {editingItem === item.id ? (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onUpdateMenuItem(category.id, item.id, {})}
                        >
                            <Check className="w-4 h-4" />
                        </Button>
                    ) : (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onEditItem(item.id)}
                        >
                            <Edit2 className="w-4 h-4" />
                        </Button>
                    )}
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDeleteItem(categoryItem.id)}
                    >
                        <Trash2 className="w-4 h-4" />
                    </Button>
                </div>
            </TableCell>
        </TableRow>
    )
}
