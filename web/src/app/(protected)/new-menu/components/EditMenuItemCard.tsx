import { MenuCategoryItemDto, MenuItemOptionDto, useUpdateMenuItem } from "@shared";
import { useState } from "react";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export const EditMenuItemCard = ({ item, setIsEditing }: { item: MenuCategoryItemDto, setIsEditing: (isEditing: boolean) => void }) => {
    const [name, setName] = useState(item.menuItem?.name || '');
    const [description, setDescription] = useState(item.menuItem?.description || '');
    const [price, setPrice] = useState(item.menuItem?.price || 0);
    const [hasOptions, setHasOptions] = useState(item.menuItem?.hasOptions || false);
    const { mutate: updateMenuItem } = useUpdateMenuItem();
    const handleSave = () => {
        updateMenuItem({
            id: item.menuItem?.id || '',
            name: name,
            description: description,
            price: price,
            hasOptions: item.menuItem?.hasOptions || false,
            isAvailable: item.menuItem?.isAvailable || true,
            allergenIds: item.menuItem?.allergens?.map((allergen) => allergen.id) || [],
        }, {
            onSuccess: () => {
                toast.success('Menu item updated successfully');
                setIsEditing(false);
            },
            onError: () => {
                toast.error('Failed to update menu item');
            }
        });
    }
    return <Card>
        <CardContent className="flex flex-col gap-4">

            <div className="flex flex-row items-center gap-2">
                <RadioGroup value={hasOptions ? 'options' : 'simple'} onValueChange={(value) => setHasOptions(value === 'options' ? true : false)} className="flex flex-row items-center gap-6">
                    <div className="flex items-center gap-2">
                        <RadioGroupItem value="simple" id="r1" className="border-gray-400" />
                        <Label htmlFor="r1">Simple</Label>
                    </div>
                    <div className="flex items-center gap-2">
                        <RadioGroupItem value="options" id="r2" className="border-gray-400" />
                        <Label htmlFor="r2">With options</Label>
                    </div>
                </RadioGroup>
            </div>

            <div className="flex flex-col gap-4">
                <LabeledInput id="name" label="Name" value={name} onChange={(value) => setName(value)} />
                <LabeledInput id="description" label="Description" value={description} onChange={(value) => setDescription(value)} />
                {!hasOptions && <LabeledInput id="price" label="Price" value={price.toString()} type="number" onChange={(value) => setPrice(Number(value))} />}
            </div>



            {hasOptions && <div className="flex flex-col gap-2">
                <Label>Options</Label>
                <EditOptionsList options={item.menuItem?.options || []} />
            </div>}




            <div className="flex gap-2 items-center justify-end">
                <Button onClick={handleSave}>Save</Button>
                <Button onClick={() => setIsEditing(false)}>Cancel</Button>
            </div>
        </CardContent>
    </Card>
}


export const EditOptionsList = ({ options }: { options: MenuItemOptionDto[] }) => {
    const [showAddOptionCard, setShowAddOptionCard] = useState(false);

    const onDone = () => {
        setShowAddOptionCard(false);
    }

    const onCancel = () => {
        setShowAddOptionCard(false);
    }

    const onRemoveOption = (optionId: string) => {
        console.log(optionId);
    }

    return (
        <div>
            <div className="flex flex-col gap-2">
                {options.map((option) => (
                    <div key={option.id} className="flex flex-row items-center gap-2">
                        <div>{option.name}</div>
                        <Button variant="secondary" size="sm" onClick={() => onRemoveOption(option.id)}>Remove</Button>
                    </div>
                ))}
            </div>

            {showAddOptionCard ? <AddOptionCard onDone={() => setShowAddOptionCard(false)} onCancel={() => setShowAddOptionCard(false)} /> : <Button className="w-full" variant="secondary" onClick={() => setShowAddOptionCard(true)}>Add Option</Button>}

        </div>
    )
}

export const AddOptionCard = ({ onDone, onCancel }: { onDone: () => void, onCancel: () => void }) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState(0);
    return <div className="flex flex-col gap-2">
        <Label>Add new option</Label>
        <LabeledInput id="optionName" label="Name" value={name} onChange={(value) => setName(value)} />
        <LabeledInput id="optionDescription" label="Description" value={description} onChange={(value) => setDescription(value)} />
        <LabeledInput id="optionPrice" label="Price" value={price.toString()} type="number" onChange={(value) => setPrice(Number(value))} />
        <Button className="w-full" variant="secondary" onClick={onDone}>Done</Button>
        <Button className="w-full" variant="secondary" onClick={onCancel}>Cancel</Button>
    </div>
}

export const LabeledInput = ({ id, label, value, type = 'text', onChange }: { id: string, label: string, value: string, type?: 'text' | 'number', onChange: (value: string) => void }) => {
    return <div className="flex flex-col gap-2">
        <Label htmlFor={id}>{label}</Label>
        <Input id={id} value={value} type={type} onChange={(e) => onChange(e.target.value)} />
    </div>
}