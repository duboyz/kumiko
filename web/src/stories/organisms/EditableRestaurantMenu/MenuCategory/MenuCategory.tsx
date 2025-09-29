import { LabeledInput } from "@/stories/molecules/LabeledInput/LabeledInput"
import { MenuCategoryDto, useUpdateMenuCategory } from "@shared"
import { useMemo, useState } from "react"
import { MenuItem } from "../MenuItem"
import { NewMenuItemForm } from "../NewMenuItemForm"
import { Button } from "@/stories/atoms/Button/Button"

export const MenuCategory = ({ category }: { category: MenuCategoryDto }) => {

    const [categoryName, setCategoryName] = useState(category.name || '')
    const [categoryDescription, setCategoryDescription] = useState(category.description || '')


    const menuItems = useMemo(() => category.menuCategoryItems.map(item => item.menuItem), [category])
    const [isEditable, setIsEditable] = useState(false)
    const [showNewItemForm, setShowNewItemForm] = useState(false)

    const { mutate: updateCategory } = useUpdateMenuCategory()

    const handleSave = () => {
        updateCategory({
            id: category.id,
            name: categoryName,
            description: categoryDescription,
            orderIndex: category.orderIndex,
        })
        setIsEditable(false)
    }

    const handleCancelNewItem = () => setShowNewItemForm(false)

    if (isEditable) {
        return <div className="flex flex-row gap-2">
            <LabeledInput
                srOnly={false}
                label="Category Name"
                placeholder="Category Name"
                type="text"
                value={categoryName}
                onChange={e => setCategoryName(e)}
                id="categoryName"
            />
            <LabeledInput
                srOnly={false}
                label="Category Description"
                placeholder="Category Description"
                type="text"
                value={categoryDescription}
                onChange={e => setCategoryDescription(e)}
                id="categoryDescription"
            />
            <Button onClick={handleSave} variant="outline">Save</Button>
            <Button onClick={() => setIsEditable(false)} variant="outline">Cancel</Button>
        </div>
    }

    return <div className="border-1 border-gray-300 p-8 border-dashed flex flex-col gap-8">
        <div className="text-lg font-bold flex flex-row gap-2">
            {category.name}
            <Button variant="outline" fit onClick={() => setIsEditable(true)}>Edit</Button>
        </div>
        <div className="flex flex-col gap-4">
            {menuItems.map(item => (
                <MenuItem key={item?.id} item={item} />
            ))}
            <NewMenuItemForm onCancel={handleCancelNewItem} category={category} isVisible={showNewItemForm} setIsVisible={setShowNewItemForm} />
        </div>
    </div>
}


