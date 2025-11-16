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

interface MenuEditorProps {
    selectedCategory: MenuCategoryDto | null;
    onUnsavedChangesChange?: (hasChanges: boolean) => void;
    onSaveAllHandlerReady?: (saveAllHandler: () => void) => void;
}

export const MenuEditor = ({ selectedCategory, onUnsavedChangesChange, onSaveAllHandlerReady }: MenuEditorProps) => {
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
            <MenuItemsList
                items={items}
                selectedCategory={selectedCategory}
                onUnsavedChangesChange={onUnsavedChangesChange}
                onSaveAllHandlerReady={onSaveAllHandlerReady}
            />
        </div>
    );
};

interface MenuItemsListProps {
    items: MenuCategoryItemDto[];
    selectedCategory: MenuCategoryDto | null;
    onUnsavedChangesChange?: (hasChanges: boolean) => void;
    onSaveAllHandlerReady?: (saveAllHandler: () => void) => void;
}

export const MenuItemsList = ({
    items,
    selectedCategory,
    onUnsavedChangesChange,
    onSaveAllHandlerReady,
}: MenuItemsListProps) => {
    const [isAddingItem, setIsAddingItem] = useState(false);
    const [isAddingItemDirty, setIsAddingItemDirty] = useState(false);
    const [dirtyItemIds, setDirtyItemIds] = useState<Set<string>>(new Set());
    const [localItems, setLocalItems] = useState(items);
    const { mutate: reorderItems } = useReorderMenuItems();
    const addItemRef = useRef<HTMLDivElement>(null);
    const saveHandlersRef = useRef<Map<string, () => void>>(new Map());

    // Close add item form when category changes
    useEffect(() => {
        setIsAddingItem(false);
        setIsAddingItemDirty(false);
    }, [selectedCategory?.id]);

    // Notify parent about unsaved changes
    useEffect(() => {
        const hasChanges = (isAddingItem && isAddingItemDirty) || dirtyItemIds.size > 0;
        onUnsavedChangesChange?.(hasChanges);
    }, [isAddingItem, isAddingItemDirty, dirtyItemIds.size, onUnsavedChangesChange]);

    const handleItemDirtyChange = (itemId: string, isDirty: boolean) => {
        setDirtyItemIds((prev) => {
            const newSet = new Set(prev);
            if (isDirty) {
                newSet.add(itemId);
            } else {
                newSet.delete(itemId);
            }
            return newSet;
        });
    };

    const handleItemSaveHandlerReady = (itemId: string, saveHandler: (() => void) | null) => {
        if (saveHandler) {
            saveHandlersRef.current.set(itemId, saveHandler);
        } else {
            saveHandlersRef.current.delete(itemId);
        }
    };

    const handleAddItemSaveHandlerReady = (saveHandler: () => void) => {
        saveHandlersRef.current.set('__adding__', saveHandler);
    };

    // Register save all handler with parent
    useEffect(() => {
        const saveAll = () => {
            // Trigger all registered save handlers
            saveHandlersRef.current.forEach((handler) => handler());
        };
        onSaveAllHandlerReady?.(saveAll);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

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
                                <MenuItem
                                    key={item.id}
                                    item={item}
                                    onDirtyChange={(isDirty) => handleItemDirtyChange(item.id, isDirty)}
                                    onSaveHandlerReady={(handler) => handleItemSaveHandlerReady(item.id, handler)}
                                />
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
                        onCancel={() => {
                            setIsAddingItem(false);
                            saveHandlersRef.current.delete('__adding__');
                        }}
                        onDirtyChange={setIsAddingItemDirty}
                        onSaveHandlerReady={handleAddItemSaveHandlerReady}
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