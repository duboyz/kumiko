import { Currency, MenuCategoryItemDto, useRemoveMenuItemFromCategory } from "@shared";
import { formatPrice } from "@shared";
import { Edit, GripVertical, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { EditMenuItemCard } from "./EditMenuItemCard";
import { Card, CardContent } from "@/components/ui/card";
import { useState } from "react";

export const MenuItem = ({ item }: { item: MenuCategoryItemDto }) => {
    const [isEditing, setIsEditing] = useState(false);

    const { mutate: deleteItem } = useRemoveMenuItemFromCategory();

    const handleDelete = () => {
        deleteItem(item.id, {
            onSuccess: () => toast.success('Item deleted successfully'),
            onError: () => toast.error('Failed to delete menu item', { description: item.id }),
        });
    }

    if (isEditing) return <EditMenuItemCard item={item} setIsEditing={setIsEditing} />;


    const getMinMaxPrice = () => {
        if (!item.menuItem?.hasOptions) return [item.menuItem?.price, item.menuItem?.price];
        return [Math.min(...item.menuItem?.options?.map((option) => option.price) || []), Math.max(...item.menuItem?.options?.map((option) => option.price) || [])];
    }

    return <Card>
        <CardContent>
            <div className="flex items-center gap-2">
                <GripVertical className="w-6 h-6 text-gray-400 -foreground" />
                <div className="flex justify-between items-center flex-1">
                    {/* name and description */}
                    <div>
                        <h3 className="font-bold">{item.menuItem?.name ?? 'No item'}</h3>
                        <p className="text-sm text-muted-foreground">{item.menuItem?.description ?? 'No description'}</p>
                    </div>

                    <div className="flex flex-row items-center gap-2">

                        {/* price */}

                        <div className="text-muted-foreground">
                            {!item.menuItem?.hasOptions && <p>{item.menuItem?.price ? formatPrice(item.menuItem?.price, Currency.NOK) : 'No price'}</p>}
                            {item.menuItem?.hasOptions && <p>{getMinMaxPrice()[0] ? formatPrice(getMinMaxPrice()[0] || 0, Currency.NOK) : 'No price'} - {getMinMaxPrice()[1] ? formatPrice(getMinMaxPrice()[1] || 0, Currency.NOK) : 'No price'}</p>}
                        </div>
                        <div className="flex flex-row items-center gap-2">
                            <Button variant="outline" size="icon" onClick={() => setIsEditing(true)}>
                                <Edit className="w-4 h-4" />
                            </Button>
                            <Button variant="outline" size="icon" onClick={handleDelete}>
                                <Trash className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </CardContent >
    </Card >;
}