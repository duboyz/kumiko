import { useState } from "react";
import { useCreateMenuItem } from "@shared";
import { useAddMenuItemToCategory } from "@shared";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MenuCategoryDto } from "@shared";
import { Card, CardContent } from "@/components/ui/card";


export const NewMenuItemForm = ({ selectedCategory, isVisible, setIsVisible }: { selectedCategory: MenuCategoryDto | null, isVisible: boolean, setIsVisible: (isVisible: boolean) => void }) => {
    const { mutate: createMenuItem } = useCreateMenuItem();
    const { mutate: addItemToCategory } = useAddMenuItemToCategory();
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState(0);
    const handleSave = () => {
        if (!selectedCategory) return;
        createMenuItem({
            name: name,
            description: description,
            price: price,
            hasOptions: false,
            isAvailable: true,
            restaurantMenuId: selectedCategory.restaurantMenuId,
            allergenIds: [],
        }, {
            onSuccess: (result) => {
                if (!result) return;
                toast.success('Menu item created successfully');
                setIsVisible(false);
                addItemToCategory({
                    menuItemId: result.id,
                    menuCategoryId: selectedCategory.id,
                    orderIndex: selectedCategory.menuCategoryItems.length,
                }, {
                    onSuccess: () => {
                        toast.success('Menu item added to category successfully');
                    },
                    onError: () => {
                        toast.error('Failed to add menu item to category');
                    }
                });
            },
            onError: () => {
                toast.error('Failed to create menu item');
            }
        });
    }
    if (!selectedCategory) return null;

    return <Card>
        <CardContent className="flex flex-col gap-4">
            <h3 className="font-bold">New Menu Item</h3>
            <Input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
            <Input type="text" placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
            <Input type="number" placeholder="Price" value={price} onChange={(e) => setPrice(Number(e.target.value))} />

            <div className="flex gap-2 items-center justify-end">
                <Button onClick={handleSave}>Save</Button>
                <Button onClick={() => setIsVisible(false)}>Cancel</Button>
            </div>
        </CardContent>
    </Card>

}