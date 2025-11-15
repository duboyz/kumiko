import { useEffect, useState } from "react";
import { MenuItem } from "./MenuItem";
import { NewMenuItemForm } from "./NewMenuItemCard";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { MenuCategoryDto, MenuCategoryItemDto } from "@shared";

export const MenuEditor = ({ selectedCategory }: { selectedCategory: MenuCategoryDto | null }) => {
    const items = selectedCategory?.menuCategoryItems || [];
    const [isNewMenuItemFormVisible, setIsNewMenuItemFormVisible] = useState(false);

    useEffect(() => {
        if (selectedCategory) setIsNewMenuItemFormVisible(false);
    }, [selectedCategory]);

    return <div className="space-y-4">
        <h2 className="text-2xl font-bold">
            {selectedCategory?.name}
        </h2>
        <MenuItemsList items={items} selectedCategory={selectedCategory} />
    </div>;
}


export const MenuItemsList = ({ items, selectedCategory }: { items: MenuCategoryItemDto[], selectedCategory: MenuCategoryDto | null }) => {

    const [isAddingItem, setIsAddingItem] = useState(false);

    return <div className="flex flex-col gap-2">
        {items.map((item) => <MenuItem key={item.id} item={item} />)}
        {isAddingItem
            ? <NewMenuItemForm selectedCategory={selectedCategory} isVisible={isAddingItem} setIsVisible={setIsAddingItem} />
            : <Button variant="outline" onClick={() => setIsAddingItem(true)}>
                <Plus className="w-4 h-4" />
                Add Item
            </Button>}


    </div>;
}