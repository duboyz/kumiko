'use client';
import { useEffect, useState } from "react";
import { MenuCategoryDto, useLocationSelection, useRestaurantMenus } from "@shared";
import { MenuEditor } from "../components/MenuEditor";
import { CategoriesSidebar } from "../components/CategoriesSidebar";
import { useParams } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function NewMenuPage() {
    const menuId = useParams().id as string;
    const { selectedLocation } = useLocationSelection();
    const { data: menuData, isLoading, error } = useRestaurantMenus(selectedLocation?.id || '');

    const menu = menuData?.menus.find((menu) => menu.id === menuId);
    const categories = menu?.categories || [];

    const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(categories[0]?.id ?? null);

    // Keep the selected category in sync with the latest data
    const selectedCategory = categories.find((cat) => cat.id === selectedCategoryId) || null;

    useEffect(() => {
        if (categories.length > 0 && !selectedCategoryId) {
            setSelectedCategoryId(categories[0].id);
        }
    }, [categories, selectedCategoryId]);

    // Loading state
    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2" />
                    <p className="text-muted-foreground">Loading menu...</p>
                </div>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <p className="text-destructive mb-2">Failed to load menu</p>
                    <p className="text-sm text-muted-foreground">Please try refreshing the page</p>
                </div>
            </div>
        );
    }

    // Menu not found
    if (!menu) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <p className="text-lg font-semibold mb-2">Menu not found</p>
                    <p className="text-sm text-muted-foreground">
                        The requested menu could not be found
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex h-screen">
            <div className="w-64 border-r bg-muted/30 flex flex-col">
                <div className="p-4 border-b">
                    <h1 className="text-xl font-bold truncate">{menu.name}</h1>
                    {menu.description && (
                        <p className="text-sm text-muted-foreground truncate">{menu.description}</p>
                    )}
                </div>
                <div className="flex-1 overflow-y-auto p-4">
                    <CategoriesSidebar
                        categories={categories}
                        selectedCategory={selectedCategory}
                        setSelectedCategory={(cat) => setSelectedCategoryId(cat?.id ?? null)}
                        restaurantMenuId={menu.id}
                    />
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 bg-background">
                <MenuEditor selectedCategory={selectedCategory} />
            </div>
        </div>
    );
}
