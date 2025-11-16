'use client';
import { useEffect, useState, useRef } from "react";
import { MenuCategoryDto, useLocationSelection, useRestaurantMenus } from "@shared";
import { MenuEditor } from "./components/MenuEditor";
import { CategoriesSidebar } from "./components/CategoriesSidebar";
import { useParams, useRouter } from "next/navigation";
import { Loader2, Menu, ArrowLeft, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { ConfirmDialog } from "@/stories/dialogs/ConfirmDialog";

export default function NewMenuPage() {
    const router = useRouter();
    const menuId = useParams().id as string;
    const { selectedLocation } = useLocationSelection();
    const { data: menuData, isLoading, error } = useRestaurantMenus(selectedLocation?.id || '');

    const menu = menuData?.menus.find((menu) => menu.id === menuId);
    const categories = menu?.categories || [];

    const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(categories[0]?.id ?? null);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
    const [showSavedIndicator, setShowSavedIndicator] = useState(false);
    const [showBackDialog, setShowBackDialog] = useState(false);
    const saveAllHandlerRef = useRef<(() => void) | null>(null);

    // Keep the selected category in sync with the latest data
    const selectedCategory = categories.find((cat) => cat.id === selectedCategoryId) || null;

    // Show "All changes saved" briefly when unsaved changes become false
    useEffect(() => {
        if (!hasUnsavedChanges && showSavedIndicator) {
            const timer = setTimeout(() => {
                setShowSavedIndicator(false);
            }, 3000); // Show for 3 seconds
            return () => clearTimeout(timer);
        }
    }, [hasUnsavedChanges, showSavedIndicator]);

    const handleUnsavedChangesChange = (hasChanges: boolean) => {
        if (hasUnsavedChanges && !hasChanges) {
            // Transitioning from unsaved to saved - show saved indicator
            setShowSavedIndicator(true);
        }
        setHasUnsavedChanges(hasChanges);
    };

    useEffect(() => {
        if (categories.length > 0 && !selectedCategoryId) {
            setSelectedCategoryId(categories[0].id);
        }
    }, [categories, selectedCategoryId]);

    const handleCategorySelect = (cat: MenuCategoryDto | null) => {
        setSelectedCategoryId(cat?.id ?? null);
        setIsMobileMenuOpen(false); // Close mobile menu when category is selected
    };

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
        <div className="flex flex-col h-screen">
            {/* Top Navigation Bar */}
            <div className="border-b bg-background p-4 flex items-center gap-4 sticky top-0 z-20">

                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                        <h1 className="text-lg font-bold truncate">{menu.name}</h1>
                        {hasUnsavedChanges && (
                            <Badge className="flex items-center gap-1 shrink-0 bg-amber-500 hover:bg-amber-600 text-white">
                                <AlertCircle className="w-3 h-3" />
                                <span className="hidden md:inline">Unsaved changes</span>
                                <span className="md:hidden">Unsaved</span>
                            </Badge>
                        )}
                        {!hasUnsavedChanges && showSavedIndicator && (
                            <Badge className="flex items-center gap-1 shrink-0 bg-green-600 hover:bg-green-700 text-white">
                                ✓ <span className="hidden md:inline">No unsaved changes</span>
                                <span className="md:hidden">Saved</span>
                            </Badge>
                        )}
                    </div>
                    {menu.description && (
                        <p className="text-sm text-muted-foreground truncate hidden md:block">{menu.description}</p>
                    )}
                </div>
                {hasUnsavedChanges && (
                    <Button
                        onClick={() => {
                            if (saveAllHandlerRef.current) {
                                saveAllHandlerRef.current();
                            }
                        }}
                        className="hidden md:flex"
                    >
                        Save All Changes
                    </Button>
                )}
                <div className="md:hidden">
                    <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                        <SheetTrigger asChild>
                            <Button variant="outline" size="icon">
                                <Menu className="h-5 w-5" />
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="left" className="w-80 p-0">
                            <div className="flex flex-col h-full">
                                <div className="p-4 border-b">
                                    <h2 className="text-lg font-semibold">Categories</h2>
                                </div>
                                <div className="flex-1 overflow-y-auto p-4">
                                    <CategoriesSidebar
                                        categories={categories}
                                        selectedCategory={selectedCategory}
                                        setSelectedCategory={handleCategorySelect}
                                        restaurantMenuId={menu.id}
                                    />
                                </div>
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex flex-1 overflow-hidden">
                {/* Desktop Sidebar */}
                <div className="hidden md:flex w-64 border-r bg-white flex-col">
                    <div className="p-4 border-b">
                        <h2 className="text-lg font-semibold">Categories</h2>
                    </div>
                    <div className="flex-1 overflow-y-auto p-4">
                        <CategoriesSidebar
                            categories={categories}
                            selectedCategory={selectedCategory}
                            setSelectedCategory={handleCategorySelect}
                            restaurantMenuId={menu.id}
                        />
                    </div>
                </div>

                {/* Main Content */}
                <div className="flex-1 overflow-y-auto p-4 md:p-6 bg-background">
                    <MenuEditor
                        selectedCategory={selectedCategory}
                        onUnsavedChangesChange={handleUnsavedChangesChange}
                        onSaveAllHandlerReady={(handler) => {
                            saveAllHandlerRef.current = handler;
                        }}
                    />
                </div>
            </div>

            {/* Unsaved Changes Dialog */}
            <ConfirmDialog
                open={showBackDialog}
                onOpenChange={setShowBackDialog}
                title="Unsaved Changes"
                description="You have unsaved changes. Are you sure you want to leave? All unsaved changes will be lost."
                confirmText="Leave Without Saving"
                cancelText="Stay"
                onConfirm={() => router.back()}
                variant="destructive"
            />
        </div>
    );
}
