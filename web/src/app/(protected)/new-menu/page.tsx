'use client'
import { useState } from "react";

import { MenuCategoryDto, useLocationSelection, useRestaurantMenus } from "@shared";

import { MenuEditor } from "./components/MenuEditor";
import { CategoriesSidebar } from "./components/CategoriesSidebar";
import { Separator } from "@/components/ui/separator";

export default function NewMenuPage() {


    const menuId = "8fafc501-075d-4d88-bfd9-e4f20f573eee";
    const { selectedLocation } = useLocationSelection();
    const { data: menuData } = useRestaurantMenus(selectedLocation?.id || '');
    const menu = menuData?.menus.find((menu) => menu.id === menuId);
    const categories = menu?.categories || [];


    const [selectedCategory, setSelectedCategory] = useState<MenuCategoryDto | null>(null);
    return (
        <div className="flex min-h-full">
            <div className="w-56 min-h-full p-4 border-r border-gray-200">

                <CategoriesSidebar
                    categories={categories}
                    selectedCategory={selectedCategory}
                    setSelectedCategory={setSelectedCategory}
                />
            </div>

            <div className="flex-1 p-4 min-h-full bg-white">
                <MenuEditor selectedCategory={selectedCategory} />
            </div>
        </div>
    );
}
