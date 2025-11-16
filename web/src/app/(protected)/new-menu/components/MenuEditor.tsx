import { useEffect, useState, useRef } from "react";
import { MenuItem } from "./MenuItem";
import { MenuItemForm } from "./MenuItemForm";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { MenuCategoryDto, MenuCategoryItemDto, useReorderMenuItems } from "@shared";
import { toast } from "sonner";
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    TouchSensor,
    useSensor,
    useSensors,
    DragEndEvent,
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';

export const MenuEditor = ({ selectedCategory }: { selectedCategory: MenuCategoryDto | null }) => {
    const items = selectedCategory?.menuCategoryItems || [];
    const [isNewMenuItemFormVisible, setIsNewMenuItemFormVisible] = useState(false);

    useEffect(() => {
        if (selectedCategory) setIsNewMenuItemFormVisible(false);
    }, [selectedCategory]);

    if (!selectedCategory) {
        return (
            <div className="flex items-center justify-center h-full text-muted-foreground">
                Select a category to view and edit menu items
            </div>
        );
    }

    return (
        <div className="space-y-4 md:space-y-6">
            <div className="pb-3 md:pb-4">
                <h2 className="text-2xl md:text-3xl font-bold">{selectedCategory.name}</h2>
                {selectedCategory.description && (
                    <p className="text-sm md:text-base text-muted-foreground mt-1">{selectedCategory.description}</p>
                )}
                <p className="text-xs md:text-sm text-muted-foreground mt-2">
                    {items.length} {items.length === 1 ? 'item' : 'items'}
                </p>
            </div>
            <MenuItemsList items={items} selectedCategory={selectedCategory} />
        </div>
    );
};

export const MenuItemsList = ({
    items,
    selectedCategory,
}: {
    items: MenuCategoryItemDto[];
    selectedCategory: MenuCategoryDto | null;
}) => {
    const [isAddingItem, setIsAddingItem] = useState(false);
    const [localItems, setLocalItems] = useState(items);
    const { mutate: reorderItems } = useReorderMenuItems();
    const addItemRef = useRef<HTMLDivElement>(null);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8, // Require 8px movement before activating
            },
        }),
        useSensor(TouchSensor, {
            activationConstraint: {
                delay: 200, // 200ms delay before activating
                tolerance: 8, // Allow 8px of movement during delay
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    // Update local items when props change
    useEffect(() => {
        setLocalItems(items);
    }, [items]);

    // Scroll to add item form when it opens
    useEffect(() => {
        if (isAddingItem && addItemRef.current) {
            setTimeout(() => {
                addItemRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
            }, 100);
        }
    }, [isAddingItem]);

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (over && active.id !== over.id && selectedCategory) {
            const oldIndex = localItems.findIndex((item) => item.id === active.id);
            const newIndex = localItems.findIndex((item) => item.id === over.id);

            const newOrder = arrayMove(localItems, oldIndex, newIndex);
            setLocalItems(newOrder);

            reorderItems(
                {
                    categoryId: selectedCategory.id,
                    categoryItemIds: newOrder.map((item) => item.id),
                },
                {
                    onError: () => {
                        toast.error('Failed to reorder menu items');
                        setLocalItems(items);
                    },
                }
            );
        }
    };

    return (
        <div className="flex flex-col gap-3">
            {localItems.length > 0 ? (
                <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                    <SortableContext items={localItems.map((item) => item.id)} strategy={verticalListSortingStrategy}>
                        <div className="flex flex-col gap-3">
                            {localItems.map((item) => (
                                <MenuItem key={item.id} item={item} />
                            ))}
                        </div>
                    </SortableContext>
                </DndContext>
            ) : (
                !isAddingItem && (
                    <div className="flex items-center justify-center p-12 border-2 border-dashed rounded-lg">
                        <div className="text-center">
                            <p className="text-muted-foreground mb-2">No items in this category yet</p>
                            <p className="text-sm text-muted-foreground">Add your first item to get started</p>
                        </div>
                    </div>
                )
            )}

            <div ref={addItemRef}>
                {isAddingItem ? (
                    <MenuItemForm
                        selectedCategory={selectedCategory}
                        onCancel={() => setIsAddingItem(false)}
                    />
                ) : (
                    <Button variant="outline" onClick={() => setIsAddingItem(true)} className="w-full">
                        <Plus className="w-4 h-4 mr-2" />
                        Add Item
                    </Button>
                )}
            </div>
        </div>
    );
};