import { useState } from "react";
import { useCreateMenuItem, useAddMenuItemToCategory, MenuCategoryDto, UpdateMenuItemOptionDto } from "@shared";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { AllergensSelect } from "./AllergensSelect";
import { useQueryClient } from "@tanstack/react-query";

interface NewMenuItemFormProps {
    selectedCategory: MenuCategoryDto | null;
    isVisible: boolean;
    setIsVisible: (isVisible: boolean) => void;
}

export const NewMenuItemForm = ({ selectedCategory, isVisible, setIsVisible }: NewMenuItemFormProps) => {
    const queryClient = useQueryClient();
    const { mutateAsync: createMenuItem, isPending: isCreating } = useCreateMenuItem();
    const { mutateAsync: addItemToCategory, isPending: isAdding } = useAddMenuItemToCategory();

    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState(0);
    const [hasOptions, setHasOptions] = useState(false);
    const [options, setOptions] = useState<Omit<UpdateMenuItemOptionDto, 'id'>[]>([]);
    const [allergenIds, setAllergenIds] = useState<string[]>([]);

    const isPending = isCreating || isAdding;

    const handleAddOption = (newOption: Omit<UpdateMenuItemOptionDto, 'orderIndex' | 'id'>) => {
        setOptions([...options, { ...newOption, orderIndex: options.length }]);
    };

    const handleRemoveOption = (index: number) => {
        const updatedOptions = options
            .filter((_, i) => i !== index)
            .map((opt, i) => ({ ...opt, orderIndex: i }));
        setOptions(updatedOptions);
    };

    const handleAddAllergens = (newAllergenIds: string[]) => {
        setAllergenIds((prev) => [...prev, ...newAllergenIds]);
    };

    const handleRemoveAllergen = (allergenId: string) => {
        setAllergenIds((prev) => prev.filter((id) => id !== allergenId));
    };

    const handleSave = async () => {
        if (!selectedCategory) return;
        if (!name.trim()) return toast.error('Please enter a menu item name');
        if (!hasOptions && price <= 0) return toast.error('Please enter a valid price');
        if (hasOptions && options.length === 0) return toast.error('Please add at least one option or switch to simple item');

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

            // Reset form
            setName('');
            setDescription('');
            setPrice(0);
            setHasOptions(false);
            setOptions([]);
            setAllergenIds([]);

            // Close form after successful creation
            setIsVisible(false);
        } catch (error) {
            toast.error('Failed to create menu item');
            console.error('Error creating menu item:', error);
        }
    };

    if (!selectedCategory) return null;

    return (
        <Card>
            <CardContent className="flex flex-col gap-4 pt-6">
                <h3 className="text-lg font-semibold">New Menu Item</h3>

                {/* Item Type Selection */}
                <div className="flex flex-col gap-2">
                    <Label>Item Type</Label>
                    <RadioGroup
                        value={hasOptions ? 'options' : 'simple'}
                        onValueChange={(value) => setHasOptions(value === 'options')}
                        className="flex flex-row items-center gap-6"
                    >
                        <div className="flex items-center gap-2">
                            <RadioGroupItem value="simple" id="new-simple" />
                            <Label htmlFor="new-simple" className="cursor-pointer">
                                Simple Item
                            </Label>
                        </div>
                        <div className="flex items-center gap-2">
                            <RadioGroupItem value="options" id="new-options" />
                            <Label htmlFor="new-options" className="cursor-pointer">
                                Item with Options
                            </Label>
                        </div>
                    </RadioGroup>
                </div>

                {/* Basic Information */}
                <div className="flex flex-col gap-4">
                    <LabeledInput
                        id="new-name"
                        label="Name"
                        value={name}
                        onChange={setName}
                        placeholder="e.g., Margherita Pizza"
                    />
                    <LabeledInput
                        id="new-description"
                        label="Description"
                        value={description}
                        onChange={setDescription}
                        placeholder="e.g., Classic tomato sauce and mozzarella"
                    />
                    {!hasOptions && (
                        <LabeledInput
                            id="new-price"
                            label="Price"
                            value={price.toString()}
                            type="number"
                            onChange={(value) => setPrice(Number(value))}
                            placeholder="0.00"
                        />
                    )}
                </div>

                {/* Allergens */}
                <div>
                    <AllergensSelect
                        selectedAllergenIds={allergenIds}
                        onAddAllergens={handleAddAllergens}
                        onRemoveAllergen={handleRemoveAllergen}
                    />
                </div>

                {/* Options Management */}
                {hasOptions && (
                    <div className="flex flex-col gap-2">
                        <Label>Options</Label>
                        <NewOptionsList
                            options={options}
                            onAddOption={handleAddOption}
                            onRemoveOption={handleRemoveOption}
                        />
                    </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-2 items-center justify-end pt-2">
                    <Button variant="outline" onClick={() => setIsVisible(false)} disabled={isPending}>
                        Cancel
                    </Button>
                    <Button onClick={handleSave} disabled={isPending}>
                        {isPending ? 'Creating...' : 'Create Item'}
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
};

interface NewOptionsListProps {
    options: Omit<UpdateMenuItemOptionDto, 'id'>[];
    onAddOption: (option: Omit<UpdateMenuItemOptionDto, 'orderIndex' | 'id'>) => void;
    onRemoveOption: (index: number) => void;
}

const NewOptionsList = ({ options, onAddOption, onRemoveOption }: NewOptionsListProps) => {
    const [showAddOptionCard, setShowAddOptionCard] = useState(false);

    const handleAddOption = (option: Omit<UpdateMenuItemOptionDto, 'orderIndex' | 'id'>) => {
        onAddOption(option);
        setShowAddOptionCard(false);
    };

    return (
        <div className="flex flex-col gap-3">
            {/* Existing Options */}
            {options.length > 0 && (
                <div className="flex flex-col gap-2">
                    {options.map((option, index) => (
                        <div
                            key={index}
                            className="flex items-center justify-between p-3 border rounded-lg bg-muted/50"
                        >
                            <div className="flex-1">
                                <div className="font-medium">{option.name}</div>
                                {option.description && (
                                    <div className="text-sm text-muted-foreground">{option.description}</div>
                                )}
                                <div className="text-sm font-medium mt-1">${option.price.toFixed(2)}</div>
                            </div>
                            <Button variant="destructive" size="sm" onClick={() => onRemoveOption(index)}>
                                Remove
                            </Button>
                        </div>
                    ))}
                </div>
            )}

            {/* Add Option Card or Button */}
            {showAddOptionCard ? (
                <AddOptionCard onDone={handleAddOption} onCancel={() => setShowAddOptionCard(false)} />
            ) : (
                <Button className="w-full" variant="outline" onClick={() => setShowAddOptionCard(true)}>
                    + Add Option
                </Button>
            )}
        </div>
    );
};

interface AddOptionCardProps {
    onDone: (option: Omit<UpdateMenuItemOptionDto, 'orderIndex' | 'id'>) => void;
    onCancel: () => void;
}

const AddOptionCard = ({ onDone, onCancel }: AddOptionCardProps) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');

    const handleDone = () => {
        if (!name.trim()) {
            toast.error('Please enter an option name');
            return;
        }

        const priceNum = parseFloat(price);
        if (isNaN(priceNum) || priceNum < 0) {
            toast.error('Please enter a valid price');
            return;
        }

        onDone({
            name: name.trim(),
            description: description.trim(),
            price: priceNum,
        });
    };

    return (
        <Card className="border-dashed">
            <CardContent className="flex flex-col gap-3 pt-6">
                <Label className="text-base">Add New Option</Label>
                <LabeledInput
                    id="new-optionName"
                    label="Name"
                    value={name}
                    onChange={setName}
                    placeholder="e.g., Large"
                />
                <LabeledInput
                    id="new-optionDescription"
                    label="Description"
                    value={description}
                    onChange={setDescription}
                    placeholder="e.g., 14 inch (optional)"
                />
                <LabeledInput
                    id="new-optionPrice"
                    label="Price"
                    value={price}
                    type="number"
                    onChange={setPrice}
                    placeholder="0.00"
                />
                <div className="flex gap-2 pt-2">
                    <Button className="flex-1" variant="outline" onClick={onCancel}>
                        Cancel
                    </Button>
                    <Button className="flex-1" onClick={handleDone}>
                        Add Option
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
};

interface LabeledInputProps {
    id: string;
    label: string;
    value: string;
    type?: 'text' | 'number';
    onChange: (value: string) => void;
    placeholder?: string;
}

const LabeledInput = ({ id, label, value, type = 'text', onChange, placeholder }: LabeledInputProps) => {
    return (
        <div className="flex flex-col gap-2">
            <Label htmlFor={id}>{label}</Label>
            <Input
                id={id}
                value={value}
                type={type}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                step={type === 'number' ? '0.01' : undefined}
                min={type === 'number' ? '0' : undefined}
            />
        </div>
    );
};