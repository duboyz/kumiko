import { Currency, MenuCategoryItemDto, useRemoveMenuItemFromCategory } from "@shared";
import { formatPrice } from "@shared";
import { Edit, GripVertical, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { EditMenuItemCard } from "./EditMenuItemCard";
import { Card, CardContent } from "@/components/ui/card";
import { useState } from "react";
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Badge } from "@/components/ui/badge";

export const MenuItem = ({ item }: { item: MenuCategoryItemDto }) => {
    const [isEditing, setIsEditing] = useState(false);
    const { mutate: deleteItem, isPending: isDeleting } = useRemoveMenuItemFromCategory();

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

    if (isEditing) return <EditMenuItemCard item={item} setIsEditing={setIsEditing} />;

    const getMinMaxPrice = () => {
        if (!item.menuItem?.hasOptions) return [item.menuItem?.price, item.menuItem?.price];
        return [
            Math.min(...(item.menuItem?.options?.map((option) => option.price) || [])),
            Math.max(...(item.menuItem?.options?.map((option) => option.price) || [])),
        ];
    };

    return (
        <Card ref={setNodeRef} style={style}>
            <CardContent>
                <div className="flex items-center  gap-3">
                    {/* Drag handle */}
                    <div
                        {...attributes}
                        {...listeners}
                        className="cursor-grab active:cursor-grabbing touch-none"
                    >
                        <GripVertical className="w-5 h-5 text-muted-foreground" />
                    </div>

                    {/* Content */}
                    <div className="flex justify-between items-center flex-1 gap-4">
                        {/* Item info */}
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                                <h3 className="font-semibold truncate">{item.menuItem?.name ?? 'No item'}</h3>
                                {!item.menuItem?.isAvailable && (
                                    <Badge variant="secondary" className="text-xs">
                                        Unavailable
                                    </Badge>
                                )}
                            </div>
                            {item.menuItem?.description && (
                                <p className="text-sm text-muted-foreground line-clamp-2">
                                    {item.menuItem.description}
                                </p>
                            )}

                            {
                                item.menuItem?.allergens && item.menuItem.allergens.length > 0 && (
                                    <div className="flex gap-1 mt-1 flex-wrap text-xs text-muted-foreground mt-4">
                                        <p>Allergens:</p>
                                        <p>
                                            {item.menuItem?.allergens.map((allergen) => allergen.name).join(', ')}
                                        </p>
                                    </div>
                                )
                            }
                        </div>

                        {/* Price and actions */}
                        <div className="flex items-center gap-3">
                            {
                                item.menuItem?.hasOptions && (
                                    <Badge variant="default" className="text-xs">Has Options</Badge>
                                )
                            }
                            {/* Price */}
                            <div className="text-right">


                                {!item.menuItem?.hasOptions && item.menuItem?.price !== null && (
                                    <p className="font-medium">
                                        {formatPrice(item.menuItem.price, Currency.NOK)}
                                    </p>
                                )}


                                {item.menuItem?.hasOptions && (
                                    <p className="font-medium text-sm">
                                        {formatPrice(getMinMaxPrice()[0] || 0, Currency.NOK)} -{' '}
                                        {formatPrice(getMinMaxPrice()[1] || 0, Currency.NOK)}
                                    </p>
                                )}
                            </div>

                            {/* Action buttons */}
                            <div className="flex items-center gap-1">
                                <Button variant="ghost" size="icon" onClick={() => setIsEditing(true)}>
                                    <Edit className="w-4 h-4" />
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={handleDelete}
                                    disabled={isDeleting}
                                >
                                    <Trash className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};