import { LabeledInput } from "@/stories/molecules/LabeledInput/LabeledInput"
import { MenuItemDto, useDeleteMenuItem, useUpdateMenuItem } from "@shared"
import { Edit, Save, Trash } from "lucide-react"
import { useState } from "react"

export const MenuItem = ({ item }: { item: MenuItemDto }) => {
    const [isEditable, setIsEditable] = useState(false)
    if (isEditable) return <Editable menuItem={item} setIsEditable={setIsEditable} />
    return <NonEditable menuItem={item} setIsEditable={setIsEditable} />
}


interface EditableProps {
    menuItem: MenuItemDto
    setIsEditable: (isEditable: boolean) => void
}

const Editable = ({ menuItem, setIsEditable }: EditableProps) => {
    const [editableMenuItem, setEditableMenuItem] = useState(menuItem)

    const handleChange = (property: keyof MenuItemDto, value: MenuItemDto[keyof MenuItemDto]) => {
        setEditableMenuItem(prev => ({
            ...prev,
            [property]: value,
        }))
    }

    const { mutate: updateItem } = useUpdateMenuItem()

    const { mutate: deleteItem } = useDeleteMenuItem()

    const handleSave = () => {
        updateItem({
            id: menuItem.id,
            name: editableMenuItem.name,
            description: editableMenuItem.description,
            price: editableMenuItem.price,
            isAvailable: editableMenuItem.isAvailable,
        })
        setIsEditable(false)
    }

    return (
        <div className="grid grid-cols-12 gap-4 w-full">
            <div className="col-span-3">
                <LabeledInput
                    label="Name"
                    placeholder="Name"
                    type="text"
                    value={editableMenuItem.name}
                    onChange={e => handleChange('name', e)}
                    id="name"
                />
            </div>

            <div className="col-span-6">
                <LabeledInput
                    label="Description"
                    placeholder="Description"
                    type="text"
                    value={editableMenuItem.description}
                    onChange={e => handleChange('description', e)}
                    id="description"
                />
            </div>

            <div className="col-span-1">
                <LabeledInput
                    label="Price"
                    placeholder="Price"
                    type="number"
                    value={editableMenuItem.price.toString()}
                    onChange={e => handleChange('price', parseFloat(e))}
                    id="price"
                />
            </div>

            <div className="col-span-2 flex items-center gap-4 justify-end">
                <Save className="w-4 h-4 cursor-pointer hover:text-green-600" onClick={handleSave} />
                <Trash className="w-4 h-4 cursor-pointer hover:text-red-600" onClick={() => deleteItem(menuItem.id)} />
            </div>
        </div>
    )
}


interface NonEditableProps {
    menuItem: MenuItemDto
    setIsEditable: (isEditable: boolean) => void
}

export const NonEditable = ({ menuItem, setIsEditable }: NonEditableProps) => {
    const { mutate: deleteItem } = useDeleteMenuItem()
    return (
        <div className="grid grid-cols-12 gap-4 w-full">
            <p className="col-span-3">{menuItem.name}</p>
            <p className="col-span-6">{menuItem.description}</p>
            <p className="col-span-1">{menuItem.price}</p>
            <div className="col-span-2 flex items-center gap-4 justify-end">
                <Edit className="w-4 h-4 cursor-pointer hover:text-blue-600" onClick={() => setIsEditable(true)} />
                <Trash className="w-4 h-4 cursor-pointer hover:text-red-600" onClick={() => deleteItem(menuItem.id)} />
            </div>
        </div>
    )
}