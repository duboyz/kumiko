import { MenuCategoryDto, useReorderCategories, useCreateMenuCategory, useUpdateMenuCategory, useDeleteMenuCategory } from "@shared";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { GripVertical, Plus, Edit2, Trash, Check, X } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { ConfirmDialog } from "@/stories/dialogs/ConfirmDialog";
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
    useSortable,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface CategoriesSidebarProps {
    categories: MenuCategoryDto[];
    selectedCategory: MenuCategoryDto | null;
    setSelectedCategory: (category: MenuCategoryDto | null) => void;
    restaurantMenuId: string;
}

export const CategoriesSidebar = ({ categories, selectedCategory, setSelectedCategory, restaurantMenuId }: CategoriesSidebarProps) => {
    const [isAddingCategory, setIsAddingCategory] = useState(false);
    const [localCategories, setLocalCategories] = useState(categories);
    const { mutate: reorderCategories } = useReorderCategories();

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

    // Update local categories when props change
    useEffect(() => {
        setLocalCategories(categories);
    }, [categories]);

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (over && active.id !== over.id) {
            const oldIndex = localCategories.findIndex((cat) => cat.id === active.id);
            const newIndex = localCategories.findIndex((cat) => cat.id === over.id);

            const newOrder = arrayMove(localCategories, oldIndex, newIndex);
            setLocalCategories(newOrder);

            // Save to backend
            reorderCategories(newOrder.map((cat) => cat.id), {
                onError: () => {
                    toast.error('Failed to reorder categories');
                    setLocalCategories(categories);
                },
            });
        }
    };

    return (
        <div className="flex flex-col gap-2 h-full">
            {localCategories.length > 0 ? (
                <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                    <SortableContext items={localCategories.map((cat) => cat.id)} strategy={verticalListSortingStrategy}>
                        <div className="flex flex-col gap-1 flex-1 overflow-y-auto">
                            {localCategories.map((category) => (
                                <CategoryItem
                                    key={category.id}
                                    category={category}
                                    isSelected={selectedCategory?.id === category.id}
                                    onSelect={() => setSelectedCategory(category)}
                                />
                            ))}
                        </div>
                    </SortableContext>
                </DndContext>
            ) : (
                !isAddingCategory && (
                    <div className="flex-1 flex items-center justify-center p-4">
                        <div className="text-center">
                            <p className="text-sm text-muted-foreground mb-2">No categories yet</p>
                            <p className="text-xs text-muted-foreground">Create your first category</p>
                        </div>
                    </div>
                )
            )}

            {isAddingCategory ? (
                <NewCategoryForm
                    restaurantMenuId={restaurantMenuId}
                    orderIndex={categories.length}
                    onCancel={() => setIsAddingCategory(false)}
                    onSuccess={() => setIsAddingCategory(false)}
                />
            ) : (
                <Button variant="outline" onClick={() => setIsAddingCategory(true)} className="w-full mt-2">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Category
                </Button>
            )}
        </div>
    );
};

interface CategoryItemProps {
    category: MenuCategoryDto;
    isSelected: boolean;
    onSelect: () => void;
}

const CategoryItem = ({ category, isSelected, onSelect }: CategoryItemProps) => {
    const [isEditing, setIsEditing] = useState(false);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [name, setName] = useState(category.name);
    const [description, setDescription] = useState(category.description);
    const { mutate: updateCategory, isPending: isUpdating } = useUpdateMenuCategory();
    const { mutate: deleteCategory, isPending: isDeleting } = useDeleteMenuCategory();

    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: category.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    const handleSave = () => {
        if (!name.trim()) {
            toast.error('Category name cannot be empty');
            return;
        }

        updateCategory(
            {
                id: category.id,
                name: name.trim(),
                description: description.trim(),
                orderIndex: category.orderIndex,
            },
            {
                onSuccess: () => {
                    toast.success('Category updated');
                    setIsEditing(false);
                },
                onError: () => {
                    toast.error('Failed to update category');
                },
            }
        );
    };

    const handleDelete = () => {
        deleteCategory(category.id, {
            onSuccess: () => {
                toast.success('Category deleted');
                setShowDeleteDialog(false);
            },
            onError: () => {
                toast.error('Failed to delete category');
            },
        });
    };

    if (isEditing) {
        return (
            <div ref={setNodeRef} style={style} className="p-2 border rounded-md bg-muted">
                <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Category name"
                    className="mb-2"
                    autoFocus
                />
                <Input
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Description (optional)"
                    className="mb-2"
                />
                <div className="flex gap-1">
                    <Button size="sm" onClick={handleSave} disabled={isUpdating} className="flex-1">
                        <Check className="w-3 h-3" />
                    </Button>
                    <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                            setIsEditing(false);
                            setName(category.name);
                            setDescription(category.description);
                        }}
                        disabled={isUpdating}
                        className="flex-1"
                    >
                        <X className="w-3 h-3" />
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={cn(
                'flex items-center gap-2 p-2 rounded-md cursor-pointer group transition-colors',
                isSelected ? 'bg-primary/20 text-primary' : 'hover:bg-accent'
            )}
        >
            <div {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing">
                <GripVertical className="w-4 h-4 text-muted-foreground" />
            </div>
            <div onClick={onSelect} className="flex-1 min-w-0">
                <div className="font-medium truncate">{category.name}</div>
                {category.description && (
                    <div className="text-xs text-muted-foreground truncate">{category.description}</div>
                )}
            </div>
            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                    size="icon"
                    variant="ghost"
                    className="h-6 w-6"
                    onClick={(e) => {
                        e.stopPropagation();
                        setIsEditing(true);
                    }}
                >
                    <Edit2 className="w-3 h-3" />
                </Button>
                <Button
                    size="icon"
                    variant="ghost"
                    className="h-6 w-6"
                    onClick={(e) => {
                        e.stopPropagation();
                        setShowDeleteDialog(true);
                    }}
                    disabled={isDeleting}
                >
                    <Trash className="w-3 h-3" />
                </Button>
            </div>

            <ConfirmDialog
                open={showDeleteDialog}
                onOpenChange={setShowDeleteDialog}
                title="Delete Category"
                description={`Are you sure you want to delete "${category.name}"? All items will be removed from this category. This action cannot be undone.`}
                confirmText="Delete"
                cancelText="Cancel"
                onConfirm={handleDelete}
                variant="destructive"
            />
        </div>
    );
};

interface NewCategoryFormProps {
    restaurantMenuId: string;
    orderIndex: number;
    onCancel: () => void;
    onSuccess: () => void;
}

const NewCategoryForm = ({ restaurantMenuId, orderIndex, onCancel, onSuccess }: NewCategoryFormProps) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const { mutate: createCategory, isPending } = useCreateMenuCategory();

    const handleCreate = () => {
        if (!name.trim()) {
            toast.error('Category name cannot be empty');
            return;
        }

        createCategory(
            {
                name: name.trim(),
                description: description.trim(),
                orderIndex,
                restaurantMenuId,
            },
            {
                onSuccess: () => {
                    toast.success('Category created');
                    onSuccess();
                },
                onError: () => {
                    toast.error('Failed to create category');
                },
            }
        );
    };

    return (
        <div className="p-2 border rounded-md bg-muted">
            <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Category name"
                className="mb-2"
                autoFocus
            />
            <Input
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Description (optional)"
                className="mb-2"
            />
            <div className="flex gap-1">
                <Button size="sm" onClick={handleCreate} disabled={isPending} className="flex-1">
                    <Check className="w-3 h-3 mr-1" />
                    Create
                </Button>
                <Button size="sm" variant="outline" onClick={onCancel} disabled={isPending} className="flex-1">
                    <X className="w-3 h-3 mr-1" />
                    Cancel
                </Button>
            </div>
        </div>
    );
};
