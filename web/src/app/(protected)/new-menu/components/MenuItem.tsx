import { Currency, MenuCategoryItemDto, useRemoveMenuItemFromCategory } from "@shared";
import { formatPrice } from "@shared";
import { Edit, GripVertical, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { MenuItemForm } from "./MenuItemForm";
import { Card, CardContent } from "@/components/ui/card";
import { useState, useEffect, useRef } from "react";
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Badge } from "@/components/ui/badge";

interface MenuItemProps {
    item: MenuCategoryItemDto;
    onDirtyChange?: (isDirty: boolean) => void;
}

export const MenuItem = ({ item, onDirtyChange }: MenuItemProps) => {
    const [isEditing, setIsEditing] = useState(false);
    const { mutate: deleteItem, isPending: isDeleting } = useRemoveMenuItemFromCategory();
    const editRef = useRef<HTMLDivElement>(null);

    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: item.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    const handleDelete = () => {
        if (confirm(`Delete "${item.menuItem?.name}" from this category?`)) {
            deleteItem(item.id, {
                onSuccess: () => toast.success('Item removed from category'),
                onError: () => toast.error('Failed to remove item'),
            });
        }
    };

    // Scroll to edit form when editing mode is enabled
    useEffect(() => {
        if (isEditing && editRef.current) {
            setTimeout(() => {
                editRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 100);
        }
    }, [isEditing]);

    // Reset dirty state when closing edit form
    useEffect(() => {
        if (!isEditing) {
            onDirtyChange?.(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isEditing]);

    const getMinMaxPrice = () => {
        if (!item.menuItem?.hasOptions) return [item.menuItem?.price, item.menuItem?.price];
        return [
            Math.min(...(item.menuItem?.options?.map((option) => option.price) || [])),
            Math.max(...(item.menuItem?.options?.map((option) => option.price) || [])),
        ];
    };

    if (isEditing) {
        return (
            <div ref={setNodeRef} style={style}>
                <div ref={editRef}>
                    <MenuItemForm
                        selectedCategory={null}
                        onCancel={() => setIsEditing(false)}
                        existingItem={item}
                        onDirtyChange={onDirtyChange}
                    />
                </div>
            </div>
        );
    }

    return (
        <Card ref={setNodeRef} style={style}>
            <CardContent>
                <div className="flex items-start gap-2 md:gap-3">
                    {/* Drag handle */}
                    <div
                        {...attributes}
                        {...listeners}
                        className="cursor-grab active:cursor-grabbing touch-none pt-1"
                    >
                        <GripVertical className="w-4 h-4 md:w-5 md:h-5 text-muted-foreground" />
                    </div>

                    {/* Content */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between flex-1 gap-2 md:gap-4 min-w-0">
                        {/* Item info */}
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                                <h3 className="font-semibold text-sm md:text-base">{item.menuItem?.name ?? 'No item'}</h3>
                                {!item.menuItem?.isAvailable && (
                                    <Badge variant="secondary" className="text-xs">
                                        Unavailable
                                    </Badge>
                                )}
                                {item.menuItem?.hasOptions && (
                                    <Badge variant="default" className="text-xs">Has Options</Badge>
                                )}
                            </div>
                            {item.menuItem?.description && (
                                <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                                    {item.menuItem.description}
                                </p>
                            )}

                            {item.menuItem?.allergens && item.menuItem.allergens.length > 0 && (
                                <div className="flex gap-1 mt-2 flex-wrap text-xs text-muted-foreground">
                                    <p>Allergens:</p>
                                    <p>
                                        {item.menuItem.allergens.map((allergen) => allergen.name).join(', ')}
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Price and actions */}
                        <div className="flex items-center justify-between md:justify-end gap-2 md:gap-3 shrink-0">
                            {/* Price */}
                            <div className="text-left md:text-right text-muted-foreground/80">
                                {!item.menuItem?.hasOptions && item.menuItem?.price !== null && (
                                    <p className="font-bold text-xs md:text-sm">
                                        {formatPrice(item.menuItem.price, Currency.NOK)}
                                    </p>
                                )}

                                {item.menuItem?.hasOptions && (
                                    <p className="font-bold text-xs md:text-sm">
                                        {formatPrice(getMinMaxPrice()[0] || 0, Currency.NOK)} -{' '}
                                        {formatPrice(getMinMaxPrice()[1] || 0, Currency.NOK)}
                                    </p>
                                )}
                            </div>

                            {/* Action buttons */}
                            <div className="flex items-center gap-1">
                                <Button variant="ghost" size="icon" className="h-8 w-8 md:h-10 md:w-10" onClick={() => setIsEditing(true)}>
                                    <Edit className="w-3 h-3 md:w-4 md:h-4" />
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 md:h-10 md:w-10 text-destructive hover:text-destructive hover:bg-destructive/10"
                                    onClick={handleDelete}
                                    disabled={isDeleting}
                                >
                                    <Trash className="w-3 h-3 md:w-4 md:h-4" />
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};