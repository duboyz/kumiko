import { MenuCategoryItemDto, MenuItemOptionDto, UpdateMenuItemOptionDto, useUpdateMenuItem } from "@shared";
import { useState } from "react";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { AllergensSelect } from "./AllergensSelect";

interface EditMenuItemCardProps {
    item: MenuCategoryItemDto;
    setIsEditing: (isEditing: boolean) => void;
}

export const EditMenuItemCard = ({ item, setIsEditing }: EditMenuItemCardProps) => {
    const [name, setName] = useState(item.menuItem?.name || '');
    const [description, setDescription] = useState(item.menuItem?.description || '');
    const [price, setPrice] = useState(item.menuItem?.price || 0);
    const [hasOptions, setHasOptions] = useState(item.menuItem?.hasOptions || false);
    const [options, setOptions] = useState<UpdateMenuItemOptionDto[]>(
        item.menuItem?.options?.map((opt, index) => ({
            id: opt.id,
            name: opt.name,
            description: opt.description,
            price: opt.price,
            orderIndex: index,
        })) || []
    );
    const [allergenIds, setAllergenIds] = useState<string[]>(
        item.menuItem?.allergens?.map((a) => a.id) || []
    );

    const { mutate: updateMenuItem, isPending } = useUpdateMenuItem();

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

    const handleSave = () => {
        // Validation
        if (!name.trim()) {
            toast.error('Please enter a menu item name');
            return;
        }

        if (!hasOptions && price <= 0) {
            toast.error('Please enter a valid price');
            return;
        }

        if (hasOptions && options.length === 0) {
            toast.error('Please add at least one option or switch to simple item');
            return;
        }

        updateMenuItem(
            {
                id: item.menuItem?.id || '',
                name: name.trim(),
                description: description.trim(),
                price: hasOptions ? null : price,
                hasOptions,
                options: hasOptions ? options : undefined,
                isAvailable: item.menuItem?.isAvailable ?? true,
                allergenIds: allergenIds,
            },
            {
                onSuccess: () => {
                    toast.success('Menu item updated successfully');
                    setIsEditing(false);
                },
                onError: () => {
                    toast.error('Failed to update menu item');
                },
            }
        );
    };

    return (
        <Card>
            <CardContent className="flex flex-col gap-4 pt-6">
                {/* Item Type Selection */}
                <div className="flex flex-col gap-2">
                    <Label>Item Type</Label>
                    <RadioGroup
                        value={hasOptions ? 'options' : 'simple'}
                        onValueChange={(value) => setHasOptions(value === 'options')}
                        className="flex flex-row items-center gap-6"
                    >
                        <div className="flex items-center gap-2">
                            <RadioGroupItem value="simple" id="simple" />
                            <Label htmlFor="simple" className="cursor-pointer">
                                Simple Item
                            </Label>
                        </div>
                        <div className="flex items-center gap-2">
                            <RadioGroupItem value="options" id="options" />
                            <Label htmlFor="options" className="cursor-pointer">
                                Item with Options
                            </Label>
                        </div>
                    </RadioGroup>
                </div>

                {/* Basic Information */}
                <div className="flex flex-col gap-4">
                    <LabeledInput
                        id="name"
                        label="Name"
                        value={name}
                        onChange={setName}
                        placeholder="e.g., Margherita Pizza"
                    />
                    <LabeledInput
                        id="description"
                        label="Description"
                        value={description}
                        onChange={setDescription}
                        placeholder="e.g., Classic tomato sauce and mozzarella"
                    />
                    {!hasOptions && (
                        <LabeledInput
                            id="price"
                            label="Price"
                            value={price.toString()}
                            type="number"
                            onChange={(value) => setPrice(Number(value))}
                            placeholder="0.00"
                        />
                    )}
                </div>


                <div>
                    <AllergensSelect
                        menuItem={item}
                        onAddAllergens={handleAddAllergens}
                        onRemoveAllergen={handleRemoveAllergen}
                    />
                </div>

                {/* Options Management */}
                {hasOptions && (
                    <div className="flex flex-col gap-2">
                        <Label>Options</Label>
                        <EditOptionsList
                            options={options}
                            onAddOption={handleAddOption}
                            onRemoveOption={handleRemoveOption}
                        />
                    </div>
                )}


                {/* Action Buttons */}
                <div className="flex gap-2 items-center justify-end pt-2">
                    <Button variant="outline" onClick={() => setIsEditing(false)} disabled={isPending}>
                        Cancel
                    </Button>
                    <Button onClick={handleSave} disabled={isPending}>
                        {isPending ? 'Saving...' : 'Save Changes'}
                    </Button>
                </div>
            </CardContent>
        </Card >
    );
};

interface EditOptionsListProps {
    options: UpdateMenuItemOptionDto[];
    onAddOption: (option: Omit<UpdateMenuItemOptionDto, 'orderIndex' | 'id'>) => void;
    onRemoveOption: (index: number) => void;
}

export const EditOptionsList = ({ options, onAddOption, onRemoveOption }: EditOptionsListProps) => {
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
                            key={option.id || index}
                            className="flex items-center justify-between p-3 border rounded-lg bg-muted/50"
                        >
                            <div className="flex-1">
                                <div className="font-medium">{option.name}</div>
                                {option.description && (
                                    <div className="text-sm text-muted-foreground">{option.description}</div>
                                )}
                                <div className="text-sm font-medium mt-1">${option.price.toFixed(2)}</div>
                            </div>
                            <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => onRemoveOption(index)}
                            >
                                Remove
                            </Button>
                        </div>
                    ))}
                </div>
            )}

            {/* Add Option Card or Button */}
            {showAddOptionCard ? (
                <AddOptionCard
                    onDone={handleAddOption}
                    onCancel={() => setShowAddOptionCard(false)}
                />
            ) : (
                <Button
                    className="w-full"
                    variant="outline"
                    onClick={() => setShowAddOptionCard(true)}
                >
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

export const AddOptionCard = ({ onDone, onCancel }: AddOptionCardProps) => {
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
                    id="optionName"
                    label="Name"
                    value={name}
                    onChange={setName}
                    placeholder="e.g., Large"
                />
                <LabeledInput
                    id="optionDescription"
                    label="Description"
                    value={description}
                    onChange={setDescription}
                    placeholder="e.g., 14 inch (optional)"
                />
                <LabeledInput
                    id="optionPrice"
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

export const LabeledInput = ({
    id,
    label,
    value,
    type = 'text',
    onChange,
    placeholder,
}: LabeledInputProps) => {
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