import { useState, useEffect, useRef } from "react";
import {
    useCreateMenuItem,
    useAddMenuItemToCategory,
    useUpdateMenuItem,
    MenuCategoryDto,
    MenuCategoryItemDto,
    UpdateMenuItemOptionDto,
} from "@shared";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AllergensSelect } from "./AllergensSelect";
import { useQueryClient } from "@tanstack/react-query";
import { Trash, Plus } from "lucide-react";
import { LabeledInput } from "@/stories/forms/LabeledInput";
import { ItemTypeSwitch } from "@/stories/forms/ItemTypeSwitch";

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
    const [allergenIds, setAllergenIds] = useState<string[]>(
        existingItem?.menuItem?.allergens?.map((a) => a.id) || []
    );
    const [validationErrors, setValidationErrors] = useState<{
        name?: string;
        price?: string;
        options?: string;
        optionErrors?: Map<number, { name?: string; price?: string }>;
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
                JSON.stringify(sortedCurrentAllergens) !== JSON.stringify(sortedInitialAllergens);

            onDirtyChange?.(isDirty);
        } else {
            // For new items, always consider dirty if form has content
            const hasContent = !!(name.trim() || description.trim() || price > 0 || options.length > 0 || allergenIds.length > 0);
            onDirtyChange?.(hasContent);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [name, description, price, hasOptions, options, allergenIds, isEditMode]);

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
        setOptions([...options, { ...newOption, orderIndex: options.length }]);
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
                { name: '', description: '', price: 0, orderIndex: 0 },
                { name: '', description: '', price: 0, orderIndex: 1 },
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

        updateMenuItem(
            {
                id: existingItem.menuItem?.id || '',
                name: name.trim(),
                description: description.trim(),
                price: hasOptions ? null : price,
                hasOptions,
                options: hasOptions ? options : undefined,
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
            // Create the menu item
            const result = await createMenuItem({
                name: name.trim(),
                description: description.trim(),
                price: hasOptions ? null : price,
                hasOptions,
                options: hasOptions ? options : undefined,
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
                        disabled={hasOptions}
                        error={validationErrors.price}
                    />
                </div>

                {/* Allergens */}
                <div>
                    <AllergensSelect
                        selectedAllergenIds={allergenIds}
                        onAddAllergens={handleAddAllergens}
                        onRemoveAllergen={handleRemoveAllergen}
                    />
                </div>

                {/* Item Type Switch */}
                <ItemTypeSwitch
                    value={hasOptions ? 'options' : 'simple'}
                    onChange={handleHasOptionsChange}
                />

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
                            onRemoveOption={handleRemoveOption}
                            optionErrors={validationErrors.optionErrors}
                        />
                    </div>
                )}

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
    optionErrors?: Map<number, { name?: string; price?: string }>;
}

const OptionsList = ({ options, onAddOption, onUpdateOption, onRemoveOption, optionErrors }: OptionsListProps) => {
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

    return (
        <div className="flex flex-col gap-3">
            {/* Options List */}
            {options.map((option, index) => (
                <div key={option.id || index} className="p-4 border rounded-lg bg-gray-100">
                    <div className="flex flex-col md:flex-row gap-3 items-start">
                        <div className="flex-1 flex flex-col md:flex-row gap-3">
                            <div className="flex-1">
                                <LabeledInput
                                    id={`option-name-${index}`}
                                    label="Option Name"
                                    value={option.name}
                                    onChange={(value) => handleOptionChange(index, 'name', value)}
                                    placeholder="Add Bacon"
                                    error={optionErrors?.get(index)?.name}
                                />
                            </div>
                            <div className="flex-1">
                                <LabeledInput
                                    id={`option-desc-${index}`}
                                    label="Description (optional)"
                                    value={option.description}
                                    onChange={(value) => handleOptionChange(index, 'description', value)}
                                    placeholder="Two strips of crispy bacon"
                                />
                            </div>
                            <div className="w-full md:w-32">
                                <LabeledInput
                                    id={`option-price-${index}`}
                                    label="Price"
                                    value={option.price.toString()}
                                    type="number"
                                    onChange={(value) => handleOptionChange(index, 'price', value)}
                                    placeholder="0.00"
                                    error={optionErrors?.get(index)?.price}
                                />
                            </div>
                        </div>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => onRemoveOption(index)}
                            className="text-destructive hover:text-destructive hover:bg-destructive/10 mt-6"
                        >
                            <Trash className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
            ))}

            {/* Add Option Button */}
            <Button className="w-full" variant="outline" onClick={handleAddOption}>
                <Plus className="w-4 h-4 mr-2" />
                Add Option
            </Button>
        </div>
    );
};

