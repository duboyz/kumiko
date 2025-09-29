import { Button } from "@/stories/atoms/Button/Button";
import { LabeledInput } from "@/stories/atoms/LabeledInput/LabeledInput";
import { MenuCategoryDto, useCreateMenuItem, useAddMenuItemToCategory } from "@shared";
import { useState } from "react";

interface NewMenuItemFormProps {
    onCancel: () => void
    category: MenuCategoryDto
    isVisible: boolean
    setIsVisible: (isVisible: boolean) => void
}

export const NewMenuItemForm = ({ onCancel, category, isVisible, setIsVisible }: NewMenuItemFormProps) => {
    const [name, setName] = useState('')
    const [description, setDescription] = useState('')
    const [price, setPrice] = useState('')

    const { mutate: createMenuItem } = useCreateMenuItem()
    const { mutate: addItemToCategory } = useAddMenuItemToCategory()

    const handleCreateMenuItem = (itemData: { name: string; description: string; price: number }) => {
        createMenuItem({
            name: itemData.name,
            description: itemData.description,
            price: itemData.price,
            isAvailable: true,
            restaurantMenuId: category.restaurantMenuId,
        }, {
            onSuccess: (createdItem) => {
                if (!createdItem) return
                addItemToCategory({
                    menuItemId: createdItem.id,
                    menuCategoryId: category.id,
                    orderIndex: category.menuCategoryItems.length,
                }, {
                    onSuccess: () => {
                        onCancel()
                    }
                })
            }
        })
    }

    const handleSubmit = () => {
        const parsedPrice = parseFloat(price)
        if (name.trim() && !isNaN(parsedPrice) && parsedPrice >= 0) {
            handleCreateMenuItem({
                name: name.trim(),
                description: description.trim(),
                price: parsedPrice
            })
            setName('')
            setDescription('')
            setPrice('')
        }
    }

    if (!isVisible) return <Button onClick={() => setIsVisible(true)} variant="outline">Add New Item</Button>

    return (
        <div className="border-2 border-dashed border-gray-300 p-4 rounded-lg">
            <div className="flex flex-row gap-2">
                <LabeledInput
                    srOnly={false}
                    label="Item Name"
                    placeholder="Enter item name"
                    type="text"
                    value={name}
                    onChange={setName}
                    id="newItemName"
                />
                <LabeledInput
                    srOnly={false}
                    label="Item Description"
                    placeholder="Enter item description"
                    type="text"
                    value={description}
                    onChange={setDescription}
                    id="newItemDescription"
                />
                <LabeledInput
                    srOnly={false}
                    label="Price"
                    placeholder="0.00"
                    type="number"
                    value={price}
                    onChange={setPrice}
                    id="newItemPrice"
                />
                <div className="flex gap-2">
                    <Button onClick={handleSubmit} variant="outline">
                        Save
                    </Button>
                    <Button onClick={onCancel} variant="outline">
                        Cancel
                    </Button>
                </div>
            </div>
        </div>
    )
}
