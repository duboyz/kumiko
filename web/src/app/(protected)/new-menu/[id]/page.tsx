'use client'
import { useEffect, useState } from "react";

import { MenuCategoryDto, useLocationSelection, useRestaurantMenus } from "@shared";

import { MenuEditor } from "../components/MenuEditor";
import { CategoriesSidebar } from "../components/CategoriesSidebar";
import { Separator } from "@/components/ui/separator";
import { useParams } from "next/navigation";

export default function NewMenuPage() {


    const menuId = useParams().id;

    const { selectedLocation } = useLocationSelection();
    const { data: menuData } = useRestaurantMenus(selectedLocation?.id || '');

    const menu = menuData?.menus.find((menu) => menu.id === menuId);
    const categories = menu?.categories || [];


    const [selectedCategory, setSelectedCategory] = useState<MenuCategoryDto | null>(categories[0] ?? null);
    useEffect(() => {
        if (categories.length > 0) {
            setSelectedCategory(categories[0]);
        }
    }, [categories]);
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
