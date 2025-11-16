import { useState, useEffect, useRef } from "react";
import {
    useCreateMenuItem,
    useAddMenuItemToCategory,
    useUpdateMenuItem,
    MenuCategoryDto,
    MenuCategoryItemDto,
    UpdateMenuItemOptionDto,
    UpdateMenuItemAdditionalOptionDto,
} from "@shared";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AllergensSelect } from "./AllergensSelect";
import { useQueryClient } from "@tanstack/react-query";
import { Trash, Plus, GripVertical } from "lucide-react";
import { LabeledInput } from "@/stories/forms/LabeledInput";
import { ItemTypeSwitch } from "@/stories/forms/ItemTypeSwitch";
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

interface MenuItemFormProps {
    selectedCategory: MenuCategoryDto | null;
    onCancel: () => void;
    existingItem?: MenuCategoryItemDto; // If provided, we're editing
    onDirtyChange?: (isDirty: boolean) => void;
    onSaveHandlerReady?: (saveHandler: () => boolean) => void; // Returns true if saved, false if validation failed
}

export const MenuItemForm = ({ selectedCategory, onCancel, existingItem, onDirtyChange, onSaveHandlerReady }: MenuItemFormProps) => {
    const queryClient = useQueryClient();
    const isEditMode = !!existingItem;
    const actionButtonsRef = useRef<HTMLDivElement>(null);
    const handleSaveRef = useRef<() => boolean>(() => false);

    // Store initial values for dirty checking
    const initialValues = useRef({
        name: existingItem?.menuItem?.name || '',
        description: existingItem?.menuItem?.description || '',
        price: existingItem?.menuItem?.price || 0,
        hasOptions: existingItem?.menuItem?.hasOptions || false,
        options: existingItem?.menuItem?.options?.map((opt, index) => ({
            id: opt.id,
            name: opt.name,
            description: opt.description,
            price: opt.price,
            orderIndex: index,
        })) || [],
        additionalOptions: existingItem?.menuItem?.additionalOptions?.map((opt, index) => ({
            id: opt.id,
            name: opt.name,
            description: opt.description,
            price: opt.price,
            orderIndex: index,
            isAvailable: opt.isAvailable,
        })) || [],
        allergenIds: existingItem?.menuItem?.allergens?.map((a) => a.id) || [],
    });

    // Create/Update hooks
    const { mutateAsync: createMenuItem, isPending: isCreating } = useCreateMenuItem();
    const { mutateAsync: addItemToCategory, isPending: isAdding } = useAddMenuItemToCategory();
    const { mutate: updateMenuItem, isPending: isUpdating } = useUpdateMenuItem();

    // Form state
    const [name, setName] = useState(existingItem?.menuItem?.name || '');
    const [description, setDescription] = useState(existingItem?.menuItem?.description || '');
    const [price, setPrice] = useState(existingItem?.menuItem?.price || 0);
    const [hasOptions, setHasOptions] = useState(existingItem?.menuItem?.hasOptions || false);
    const [options, setOptions] = useState<UpdateMenuItemOptionDto[]>(
        existingItem?.menuItem?.options?.map((opt, index) => ({
            id: opt.id,
            name: opt.name,
            description: opt.description,
            price: opt.price,
            orderIndex: index,
        })) || []
    );
    const [additionalOptions, setAdditionalOptions] = useState<UpdateMenuItemAdditionalOptionDto[]>(
        existingItem?.menuItem?.additionalOptions?.map((opt, index) => ({
            id: opt.id,
            name: opt.name,
            description: opt.description,
            price: opt.price,
            orderIndex: index,
            isAvailable: opt.isAvailable,
        })) || []
    );
    const [allergenIds, setAllergenIds] = useState<string[]>(
        existingItem?.menuItem?.allergens?.map((a) => a.id) || []
    );
    const [validationErrors, setValidationErrors] = useState<{
        name?: string;
        price?: string;
        options?: string;
        optionErrors?: Map<number, { name?: string; price?: string }>;
        additionalOptionErrors?: Map<number, { name?: string; price?: string }>;
    }>({});

    const isPending = isCreating || isAdding || isUpdating;

    // Check if form is dirty (has changes)
    useEffect(() => {
        if (isEditMode) {
            const sortedCurrentAllergens = [...allergenIds].sort();
            const sortedInitialAllergens = [...initialValues.current.allergenIds].sort();

            const isDirty =
                name !== initialValues.current.name ||
                description !== initialValues.current.description ||
                price !== initialValues.current.price ||
                hasOptions !== initialValues.current.hasOptions ||
                JSON.stringify(options) !== JSON.stringify(initialValues.current.options) ||
                JSON.stringify(additionalOptions) !== JSON.stringify(initialValues.current.additionalOptions) ||
                JSON.stringify(sortedCurrentAllergens) !== JSON.stringify(sortedInitialAllergens);

            onDirtyChange?.(isDirty);
        } else {
            // For new items, always consider dirty if form has content
            const hasContent = !!(name.trim() || description.trim() || price > 0 || options.length > 0 || additionalOptions.length > 0 || allergenIds.length > 0);
            onDirtyChange?.(hasContent);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [name, description, price, hasOptions, options, additionalOptions, allergenIds, isEditMode]);

    // Scroll to action buttons when hasOptions becomes true
    useEffect(() => {
        if (hasOptions && actionButtonsRef.current) {
            setTimeout(() => {
                actionButtonsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
            }, 100);
        }
    }, [hasOptions]);

    // Option handlers
    const handleAddOption = (newOption: Omit<UpdateMenuItemOptionDto, 'orderIndex' | 'id'>) => {
        const newOpt = {
            ...newOption,
            orderIndex: options.length,
            // Add stable temp ID for new options
            id: `temp-${Date.now()}-${Math.random()}`
        };
        setOptions([...options, newOpt]);
        // Scroll to action buttons after adding option
        setTimeout(() => {
            actionButtonsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
        }, 100);
    };

    const handleUpdateOption = (index: number, updatedOption: Omit<UpdateMenuItemOptionDto, 'orderIndex' | 'id'>) => {
        const updatedOptions = options.map((opt, i) =>
            i === index ? { ...opt, ...updatedOption } : opt
        );
        setOptions(updatedOptions);
    };

    const handleRemoveOption = (index: number) => {
        const updatedOptions = options
            .filter((_, i) => i !== index)
            .map((opt, i) => ({ ...opt, orderIndex: i }));
        setOptions(updatedOptions);
    };

    const handleReorderOptions = (reorderedOptions: UpdateMenuItemOptionDto[]) => {
        const updatedOptions = reorderedOptions.map((opt, i) => ({ ...opt, orderIndex: i }));
        setOptions(updatedOptions);
    };

    // Additional Option handlers
    const handleAddAdditionalOption = (newOption: Omit<UpdateMenuItemAdditionalOptionDto, 'orderIndex' | 'id'>) => {
        const newOpt = {
            ...newOption,
            orderIndex: additionalOptions.length,
            id: `temp-${Date.now()}-${Math.random()}`
        };
        setAdditionalOptions([...additionalOptions, newOpt]);
    };

    const handleUpdateAdditionalOption = (index: number, updatedOption: Omit<UpdateMenuItemAdditionalOptionDto, 'orderIndex' | 'id'>) => {
        const updatedAdditionalOptions = additionalOptions.map((opt, i) =>
            i === index ? { ...opt, ...updatedOption } : opt
        );
        setAdditionalOptions(updatedAdditionalOptions);
    };

    const handleRemoveAdditionalOption = (index: number) => {
        const updatedAdditionalOptions = additionalOptions
            .filter((_, i) => i !== index)
            .map((opt, i) => ({ ...opt, orderIndex: i }));
        setAdditionalOptions(updatedAdditionalOptions);
    };

    const handleReorderAdditionalOptions = (reorderedOptions: UpdateMenuItemAdditionalOptionDto[]) => {
        const updatedAdditionalOptions = reorderedOptions.map((opt, i) => ({ ...opt, orderIndex: i }));
        setAdditionalOptions(updatedAdditionalOptions);
    };

    // Allergen handlers
    const handleAddAllergens = (newAllergenIds: string[]) => {
        setAllergenIds((prev) => [...prev, ...newAllergenIds]);
    };

    const handleRemoveAllergen = (allergenId: string) => {
        setAllergenIds((prev) => prev.filter((id) => id !== allergenId));
    };

    // Handle has options toggle
    const handleHasOptionsChange = (value: 'simple' | 'options') => {
        const newHasOptions = value === 'options';

        // If toggling to options and there are no options, create 2 empty ones
        if (newHasOptions && options.length === 0) {
            setOptions([
                { name: '', description: '', price: 0, orderIndex: 0, id: `temp-${Date.now()}-0` },
                { name: '', description: '', price: 0, orderIndex: 1, id: `temp-${Date.now()}-1` },
            ]);
        }

        setHasOptions(newHasOptions);
    };

    // Validation
    const validate = (): boolean => {
        const errors: {
            name?: string;
            price?: string;
            options?: string;
            optionErrors?: Map<number, { name?: string; price?: string }>;
        } = {};

        if (!name.trim()) {
            errors.name = 'Name is required';
        }
        if (!hasOptions && price <= 0) {
            errors.price = 'Price must be greater than 0';
        }
        if (hasOptions && options.length < 2) {
            errors.options = 'Items with options must have at least 2 options';
        }

        // Validate individual options
        if (hasOptions && options.length >= 2) {
            const optionErrors = new Map<number, { name?: string; price?: string }>();
            options.forEach((opt, index) => {
                const optError: { name?: string; price?: string } = {};
                if (!opt.name.trim()) {
                    optError.name = 'Option name is required';
                }
                if (opt.price <= 0) {
                    optError.price = 'Price must be greater than 0';
                }
                if (optError.name || optError.price) {
                    optionErrors.set(index, optError);
                }
            });

            if (optionErrors.size > 0) {
                errors.optionErrors = optionErrors;
            }
        }

        setValidationErrors(errors);
        return Object.keys(errors).length === 0 && !errors.optionErrors;
    };

    // Save handler for editing
    const handleUpdate = () => {
        if (!validate() || !existingItem) return;

        // Filter out temp IDs from options before sending to backend
        const cleanedOptions = hasOptions ? options.map(opt => {
            const cleanOpt = { ...opt };
            // Remove temp IDs (they start with "temp-")
            if (cleanOpt.id?.startsWith('temp-')) {
                delete cleanOpt.id;
            }
            return cleanOpt;
        }) : undefined;

        // Filter out temp IDs from additional options
        const cleanedAdditionalOptions = additionalOptions.length > 0 ? additionalOptions.map(opt => {
            const cleanOpt = { ...opt };
            if (cleanOpt.id?.startsWith('temp-')) {
                delete cleanOpt.id;
            }
            return cleanOpt;
        }) : undefined;

        updateMenuItem(
            {
                id: existingItem.menuItem?.id || '',
                name: name.trim(),
                description: description.trim(),
                price: hasOptions ? null : price,
                hasOptions,
                options: cleanedOptions,
                additionalOptions: cleanedAdditionalOptions,
                isAvailable: existingItem.menuItem?.isAvailable ?? true,
                allergenIds: allergenIds,
            },
            {
                onSuccess: () => {
                    toast.success('Menu item updated successfully');
                    onCancel();
                },
                onError: () => {
                    toast.error('Failed to update menu item');
                },
            }
        );
    };

    // Save handler for creating
    const handleCreate = async () => {
        if (!validate() || !selectedCategory) return;

        try {
            // Filter out temp IDs from options before sending to backend
            const cleanedOptions = hasOptions ? options.map(opt => {
                const cleanOpt = { ...opt };
                // Remove temp IDs (they start with "temp-")
                if (cleanOpt.id?.startsWith('temp-')) {
                    delete cleanOpt.id;
                }
                return cleanOpt;
            }) : undefined;

            // Filter out temp IDs from additional options
            const cleanedAdditionalOptions = additionalOptions.length > 0 ? additionalOptions.map(opt => {
                const cleanOpt = { ...opt };
                if (cleanOpt.id?.startsWith('temp-')) {
                    delete cleanOpt.id;
                }
                return cleanOpt;
            }) : undefined;

            // Create the menu item
            const result = await createMenuItem({
                name: name.trim(),
                description: description.trim(),
                price: hasOptions ? null : price,
                hasOptions,
                options: cleanedOptions,
                additionalOptions: cleanedAdditionalOptions,
                isAvailable: true,
                restaurantMenuId: selectedCategory.restaurantMenuId,
                allergenIds,
            });

            if (!result) {
                toast.error('Failed to create menu item');
                return;
            }

            // Add it to the category
            await addItemToCategory({
                menuItemId: result.id,
                menuCategoryId: selectedCategory.id,
                orderIndex: selectedCategory.menuCategoryItems.length,
            });

            // Wait for the query to refetch to ensure UI updates
            await queryClient.refetchQueries({ queryKey: ['restaurant-menus'] });

            toast.success('Menu item created successfully');
            onCancel();
        } catch (error) {
            toast.error('Failed to create menu item');
            console.error('Error creating menu item:', error);
        }
    };

    const handleSave = (): boolean => {
        if (!validate()) {
            return false; // Validation failed
        }

        if (isEditMode) {
            handleUpdate();
        } else {
            handleCreate();
        }
        return true; // Validation passed, save triggered
    };

    // Keep the save handler ref up to date
    handleSaveRef.current = handleSave;

    // Register save handler with parent (registers a function that calls the ref)
    useEffect(() => {
        const saveWrapper = () => {
            return handleSaveRef.current();
        };
        onSaveHandlerReady?.(saveWrapper);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Only require selectedCategory for create mode
    if (!isEditMode && !selectedCategory) return null;

    return (
        <Card>
            <CardContent className="flex flex-col gap-8">
                <h3 className="text-lg font-semibold">
                    {isEditMode ? 'Edit Menu Item' : 'New Menu Item'}
                </h3>

                {/* Basic Information */}
                <div className="space-y-4">
                    <LabeledInput
                        id={`${isEditMode ? 'edit' : 'new'}-name`}
                        label="Name"
                        value={name}
                        onChange={(value) => {
                            setName(value);
                            if (validationErrors.name) {
                                setValidationErrors(prev => ({ ...prev, name: undefined }));
                            }
                        }}
                        placeholder="e.g., Margherita Pizza"
                        className="md:flex-1"
                        error={validationErrors.name}
                    />
                    <LabeledInput
                        id={`${isEditMode ? 'edit' : 'new'}-description`}
                        label="Description"
                        value={description}
                        onChange={setDescription}
                        placeholder="e.g., Classic tomato sauce and mozzarella"
                        className="md:flex-1"
                    />

                    <ItemTypeSwitch
                        value={hasOptions ? 'options' : 'simple'}
                        onChange={handleHasOptionsChange}
                    />

                    {
                        !hasOptions ? (
                            <LabeledInput
                                id={`${isEditMode ? 'edit' : 'new'}-price`}
                                label="Price"
                                value={price.toString()}
                                type="number"
                                onChange={(value) => {
                                    setPrice(Number(value));
                                    if (validationErrors.price) {
                                        setValidationErrors(prev => ({ ...prev, price: undefined }));
                                    }
                                }}
                                placeholder="0.00"
                                error={validationErrors.price}
                            />
                        ) : null
                    }

                </div>

                {/* Options Management */}
                {hasOptions && (
                    <div className="flex flex-col gap-2">
                        {validationErrors.options && (
                            <p className="text-sm text-destructive">{validationErrors.options}</p>
                        )}
                        <OptionsList
                            options={options}
                            onAddOption={(opt) => {
                                handleAddOption(opt);
                                if (validationErrors.options || validationErrors.optionErrors) {
                                    setValidationErrors(prev => ({ ...prev, options: undefined, optionErrors: undefined }));
                                }
                            }}
                            onUpdateOption={(idx, opt) => {
                                handleUpdateOption(idx, opt);
                                // Clear errors for this specific option
                                if (validationErrors.optionErrors) {
                                    const newOptionErrors = new Map(validationErrors.optionErrors);
                                    newOptionErrors.delete(idx);
                                    setValidationErrors(prev => ({
                                        ...prev,
                                        optionErrors: newOptionErrors.size > 0 ? newOptionErrors : undefined
                                    }));
                                }
                            }}
                            onRemoveOption={(idx) => {
                                handleRemoveOption(idx);
                                // Clear errors for removed option
                                if (validationErrors.optionErrors) {
                                    const newOptionErrors = new Map(validationErrors.optionErrors);
                                    newOptionErrors.delete(idx);
                                    setValidationErrors(prev => ({
                                        ...prev,
                                        optionErrors: newOptionErrors.size > 0 ? newOptionErrors : undefined
                                    }));
                                }
                            }}
                            onReorderOptions={handleReorderOptions}
                            optionErrors={validationErrors.optionErrors}
                        />
                    </div>
                )}

                {/* Allergens */}
                <div>
                    <AllergensSelect
                        selectedAllergenIds={allergenIds}
                        onAddAllergens={handleAddAllergens}
                        onRemoveAllergen={handleRemoveAllergen}
                    />
                </div>

                {/* Additional Options */}
                <div className="flex flex-col gap-2">
                    <h4 className="text-sm font-medium">Additional Options (Optional)</h4>
                    <p className="text-sm text-muted-foreground">
                        Add extra items that customers can optionally add, like &quot;Extra Cheese&quot; or &quot;Extra Fries&quot;
                    </p>
                    <AdditionalOptionsList
                        additionalOptions={additionalOptions}
                        onAddAdditionalOption={handleAddAdditionalOption}
                        onUpdateAdditionalOption={handleUpdateAdditionalOption}
                        onRemoveAdditionalOption={handleRemoveAdditionalOption}
                        onReorderAdditionalOptions={handleReorderAdditionalOptions}
                        additionalOptionErrors={validationErrors.additionalOptionErrors}
                    />
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 items-center justify-end pt-2" ref={actionButtonsRef}>
                    <Button variant="outline" onClick={onCancel} disabled={isPending}>
                        Cancel
                    </Button>
                    <Button onClick={handleSave} disabled={isPending}>
                        {isPending
                            ? isEditMode
                                ? 'Saving...'
                                : 'Creating...'
                            : isEditMode
                                ? 'Save Changes'
                                : 'Create Item'}
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
};

interface OptionsListProps {
    options: UpdateMenuItemOptionDto[];
    onAddOption: (option: Omit<UpdateMenuItemOptionDto, 'orderIndex' | 'id'>) => void;
    onUpdateOption: (index: number, option: Omit<UpdateMenuItemOptionDto, 'orderIndex' | 'id'>) => void;
    onRemoveOption: (index: number) => void;
    onReorderOptions: (reorderedOptions: UpdateMenuItemOptionDto[]) => void;
    optionErrors?: Map<number, { name?: string; price?: string }>;
}

const OptionsList = ({ options, onAddOption, onUpdateOption, onRemoveOption, onReorderOptions, optionErrors }: OptionsListProps) => {

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        }),
        useSensor(TouchSensor, {
            activationConstraint: {
                delay: 200,
                tolerance: 8,
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleAddOption = () => {
        onAddOption({
            name: '',
            description: '',
            price: 0,
        });
    };

    const handleOptionChange = (index: number, field: 'name' | 'description' | 'price', value: string) => {
        const option = options[index];
        onUpdateOption(index, {
            ...option,
            [field]: field === 'price' ? parseFloat(value) || 0 : value,
        });
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (over && active.id !== over.id) {
            const oldIndex = options.findIndex((opt) => (opt.id || `idx-${opt.orderIndex}`) === active.id);
            const newIndex = options.findIndex((opt) => (opt.id || `idx-${opt.orderIndex}`) === over.id);

            const reordered = arrayMove(options, oldIndex, newIndex);

            // Pass the reordered array to parent
            onReorderOptions(reordered);
        }
    };

    return (
        <div className="flex flex-col gap-3">
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <SortableContext
                    items={options.map((opt) => opt.id || `idx-${opt.orderIndex}`)}
                    strategy={verticalListSortingStrategy}
                >
                    {/* Options List */}
                    {options.map((option, index) => (
                        <OptionRow
                            key={option.id || `idx-${option.orderIndex}`}
                            sortableId={option.id || `idx-${option.orderIndex}`}
                            option={option}
                            index={index}
                            onOptionChange={handleOptionChange}
                            onRemove={() => onRemoveOption(index)}
                            optionError={optionErrors?.get(index)}
                            canRemove={options.length > 2}
                        />
                    ))}
                </SortableContext>
            </DndContext>

            {/* Add Option Button */}
            <Button className="w-full" variant="outline" onClick={handleAddOption}>
                <Plus className="w-4 h-4 mr-2" />
                Add Option
            </Button>
        </div>
    );
};

interface OptionRowProps {
    sortableId: string;
    option: UpdateMenuItemOptionDto;
    index: number;
    onOptionChange: (index: number, field: 'name' | 'description' | 'price', value: string) => void;
    onRemove: () => void;
    optionError?: { name?: string; price?: string };
    canRemove: boolean;
}

const OptionRow = ({ sortableId, option, index, onOptionChange, onRemove, optionError, canRemove }: OptionRowProps) => {
    const [showRemoveDialog, setShowRemoveDialog] = useState(false);

    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: sortableId });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    return (
        <div ref={setNodeRef} style={style} className="p-4 border rounded-lg bg-gray-100">
            <div className="flex flex-col md:flex-row gap-3 items-start">
                {/* Drag handle */}
                <div
                    {...attributes}
                    {...listeners}
                    className="cursor-grab active:cursor-grabbing touch-none pt-1"
                >
                    <GripVertical className="w-4 h-4 md:w-5 md:h-5 text-muted-foreground" />
                </div>

                <div className="flex-1 flex flex-col md:flex-row gap-3">
                    <div className="flex-1">
                        <LabeledInput
                            id={`option-name-${index}`}
                            label="Option Name"
                            value={option.name}
                            onChange={(value) => onOptionChange(index, 'name', value)}
                            placeholder="Add Bacon"
                            error={optionError?.name}
                        />
                    </div>
                    <div className="flex-1">
                        <LabeledInput
                            id={`option-desc-${index}`}
                            label="Description (optional)"
                            value={option.description}
                            onChange={(value) => onOptionChange(index, 'description', value)}
                            placeholder="Two strips of crispy bacon"
                        />
                    </div>
                    <div className="w-full md:w-32">
                        <LabeledInput
                            id={`option-price-${index}`}
                            label="Price"
                            value={option.price.toString()}
                            type="number"
                            onChange={(value) => onOptionChange(index, 'price', value)}
                            placeholder="0.00"
                            error={optionError?.price}
                        />
                    </div>
                </div>
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setShowRemoveDialog(true)}
                    disabled={!canRemove}
                    className="text-destructive hover:text-destructive hover:bg-destructive/10 mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
                    title={!canRemove ? "Items with options must have at least 2 options" : "Remove option"}
                >
                    <Trash className="w-4 h-4" />
                </Button>
            </div>

            <ConfirmDialog
                open={showRemoveDialog}
                onOpenChange={setShowRemoveDialog}
                title="Remove Option"
                description={`Are you sure you want to remove the option "${option.name || 'this option'}"?`}
                confirmText="Remove"
                cancelText="Cancel"
                onConfirm={() => {
                    onRemove();
                    setShowRemoveDialog(false);
                }}
                variant="destructive"
            />
        </div>
    );
};

interface AdditionalOptionsListProps {
    additionalOptions: UpdateMenuItemAdditionalOptionDto[];
    onAddAdditionalOption: (option: Omit<UpdateMenuItemAdditionalOptionDto, 'orderIndex' | 'id'>) => void;
    onUpdateAdditionalOption: (index: number, option: Omit<UpdateMenuItemAdditionalOptionDto, 'orderIndex' | 'id'>) => void;
    onRemoveAdditionalOption: (index: number) => void;
    onReorderAdditionalOptions: (reorderedOptions: UpdateMenuItemAdditionalOptionDto[]) => void;
    additionalOptionErrors?: Map<number, { name?: string; price?: string }>;
}

const AdditionalOptionsList = ({
    additionalOptions,
    onAddAdditionalOption,
    onUpdateAdditionalOption,
    onRemoveAdditionalOption,
    onReorderAdditionalOptions,
    additionalOptionErrors
}: AdditionalOptionsListProps) => {
    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        }),
        useSensor(TouchSensor, {
            activationConstraint: {
                delay: 200,
                tolerance: 8,
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleAddAdditionalOption = () => {
        onAddAdditionalOption({
            name: '',
            description: '',
            price: 0,
            isAvailable: true,
        });
    };

    const handleAdditionalOptionChange = (index: number, field: 'name' | 'description' | 'price' | 'isAvailable', value: string | boolean) => {
        const option = additionalOptions[index];
        onUpdateAdditionalOption(index, {
            ...option,
            [field]: field === 'price' ? parseFloat(value as string) || 0 : value,
        });
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (over && active.id !== over.id) {
            const oldIndex = additionalOptions.findIndex((opt) => (opt.id || `idx-${opt.orderIndex}`) === active.id);
            const newIndex = additionalOptions.findIndex((opt) => (opt.id || `idx-${opt.orderIndex}`) === over.id);

            const reordered = arrayMove(additionalOptions, oldIndex, newIndex);
            onReorderAdditionalOptions(reordered);
        }
    };

    return (
        <div className="flex flex-col gap-3">
            {additionalOptions.length > 0 && (
                <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                    <SortableContext
                        items={additionalOptions.map((opt) => opt.id || `idx-${opt.orderIndex}`)}
                        strategy={verticalListSortingStrategy}
                    >
                        {additionalOptions.map((option, index) => (
                            <AdditionalOptionRow
                                key={option.id || `idx-${option.orderIndex}`}
                                sortableId={option.id || `idx-${option.orderIndex}`}
                                option={option}
                                index={index}
                                onOptionChange={handleAdditionalOptionChange}
                                onRemove={() => onRemoveAdditionalOption(index)}
                                optionError={additionalOptionErrors?.get(index)}
                            />
                        ))}
                    </SortableContext>
                </DndContext>
            )}

            <Button className="w-full" variant="outline" onClick={handleAddAdditionalOption}>
                <Plus className="w-4 h-4 mr-2" />
                Add Additional Option
            </Button>
        </div>
    );
};

interface AdditionalOptionRowProps {
    sortableId: string;
    option: UpdateMenuItemAdditionalOptionDto;
    index: number;
    onOptionChange: (index: number, field: 'name' | 'description' | 'price' | 'isAvailable', value: string | boolean) => void;
    onRemove: () => void;
    optionError?: { name?: string; price?: string };
}

const AdditionalOptionRow = ({ sortableId, option, index, onOptionChange, onRemove, optionError }: AdditionalOptionRowProps) => {
    const [showRemoveDialog, setShowRemoveDialog] = useState(false);

    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: sortableId });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    return (
        <div ref={setNodeRef} style={style} className="p-4 border rounded-lg bg-gray-100">
            <div className="flex flex-col md:flex-row gap-3 items-start">
                <div
                    {...attributes}
                    {...listeners}
                    className="cursor-grab active:cursor-grabbing touch-none pt-1"
                >
                    <GripVertical className="w-4 h-4 md:w-5 md:h-5 text-muted-foreground" />
                </div>

                <div className="flex-1 flex flex-col md:flex-row gap-3">
                    <div className="flex-1">
                        <LabeledInput
                            id={`additional-option-name-${index}`}
                            label="Option Name"
                            value={option.name}
                            onChange={(value) => onOptionChange(index, 'name', value)}
                            placeholder="Extra Cheese"
                            error={optionError?.name}
                        />
                    </div>
                    <div className="flex-1">
                        <LabeledInput
                            id={`additional-option-desc-${index}`}
                            label="Description (optional)"
                            value={option.description}
                            onChange={(value) => onOptionChange(index, 'description', value)}
                            placeholder="Add extra cheese"
                        />
                    </div>
                    <div className="w-full md:w-32">
                        <LabeledInput
                            id={`additional-option-price-${index}`}
                            label="Price"
                            value={option.price.toString()}
                            type="number"
                            onChange={(value) => onOptionChange(index, 'price', value)}
                            placeholder="0.00"
                            error={optionError?.price}
                        />
                    </div>
                    <div className="flex items-end pb-2">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={option.isAvailable}
                                onChange={(e) => onOptionChange(index, 'isAvailable', e.target.checked)}
                                className="h-4 w-4"
                            />
                            <span className="text-sm">Available</span>
                        </label>
                    </div>
                </div>
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setShowRemoveDialog(true)}
                    className="text-destructive hover:text-destructive hover:bg-destructive/10 mt-6"
                    title="Remove additional option"
                >
                    <Trash className="w-4 h-4" />
                </Button>
            </div>

            <ConfirmDialog
                open={showRemoveDialog}
                onOpenChange={setShowRemoveDialog}
                title="Remove Additional Option"
                description={`Are you sure you want to remove "${option.name || 'this option'}"?`}
                confirmText="Remove"
                cancelText="Cancel"
                onConfirm={() => {
                    onRemove();
                    setShowRemoveDialog(false);
                }}
                variant="destructive"
            />
        </div>
    );
};

