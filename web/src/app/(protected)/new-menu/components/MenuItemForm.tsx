import { useState } from "react";
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
}

export const MenuItemForm = ({ selectedCategory, onCancel, existingItem }: MenuItemFormProps) => {
    const queryClient = useQueryClient();
    const isEditMode = !!existingItem;

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

    const isPending = isCreating || isAdding || isUpdating;

    // Option handlers
    const handleAddOption = (newOption: Omit<UpdateMenuItemOptionDto, 'orderIndex' | 'id'>) => {
        setOptions([...options, { ...newOption, orderIndex: options.length }]);
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

    // Validation
    const validate = (): boolean => {
        if (!name.trim()) {
            toast.error('Please enter a menu item name');
            return false;
        }
        if (!hasOptions && price <= 0) {
            toast.error('Please enter a valid price');
            return false;
        }
        if (hasOptions && options.length === 0) {
            toast.error('Please add at least one option or switch to simple item');
            return false;
        }
        if (hasOptions && options.some((opt) => !opt.name.trim())) {
            toast.error('Please fill in all option names');
            return false;
        }
        return true;
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

    const handleSave = () => {
        if (isEditMode) {
            handleUpdate();
        } else {
            handleCreate();
        }
    };

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
                        onChange={setName}
                        placeholder="e.g., Margherita Pizza"
                        className="md:flex-1"
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
                        onChange={(value) => setPrice(Number(value))}
                        placeholder="0.00"
                        disabled={hasOptions}
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
                    onChange={(value) => setHasOptions(value === 'options')}
                />

                {/* Options Management */}
                {hasOptions && (
                    <div className="flex flex-col gap-2">
                        <OptionsList
                            options={options}
                            onAddOption={handleAddOption}
                            onUpdateOption={handleUpdateOption}
                            onRemoveOption={handleRemoveOption}
                        />
                    </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-2 items-center justify-end pt-2">
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
}

const OptionsList = ({ options, onAddOption, onUpdateOption, onRemoveOption }: OptionsListProps) => {
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

