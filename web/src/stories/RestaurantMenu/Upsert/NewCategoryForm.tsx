import { Button } from "@/stories/atoms/Button/Button";
import { LabeledInput } from "@/stories/atoms/LabeledInput/LabeledInput";
import { RestaurantMenuDto, useCreateMenuCategory } from "@shared";
import { useState } from "react";

interface NewCategoryFormProps {
    onCancel: () => void
    menu: RestaurantMenuDto
    isVisible: boolean
    setIsVisible: (isVisible: boolean) => void
}

export const NewCategoryForm = ({ onCancel, menu, isVisible, setIsVisible }: NewCategoryFormProps) => {
    const [name, setName] = useState('')
    const [description, setDescription] = useState('')

    const { mutate: createCategory } = useCreateMenuCategory()

    const handleCreateCategory = (categoryData: { name: string; description: string }) => {
        createCategory({
            name: categoryData.name,
            description: categoryData.description,
            orderIndex: menu.categories.length,
            restaurantMenuId: menu.id,
        }, {
            onSuccess: () => {
                onCancel()
            }
        })
    }

    const handleSubmit = () => {
        if (name.trim()) {
            handleCreateCategory({ name: name.trim(), description: description.trim() })
            setName('')
            setDescription('')
        }
    }

    if (!isVisible) return <Button onClick={() => setIsVisible(true)} variant="outline"> Add New Category</Button>

    return (
        <div className="border-2 border-dashed border-gray-300 p-4 rounded-lg">
            <div className="flex flex-row gap-2">
                <LabeledInput
                    srOnly={false}
                    label="Category Name"
                    placeholder="Enter category name"
                    type="text"
                    value={name}
                    onChange={setName}
                    id="newCategoryName"
                />
                <LabeledInput
                    srOnly={false}
                    label="Category Description"
                    placeholder="Enter category description"
                    type="text"
                    value={description}
                    onChange={setDescription}
                    id="newCategoryDescription"
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
