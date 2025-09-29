import { RestaurantMenuDto, useUpdateRestaurantMenu } from "@shared"
import { useState } from "react"
import { MenuCategory } from "../MenuCategory"
import { NewCategoryForm } from "../NewCategoryForm"
import { Button } from "@/stories/atoms/Button/Button"
import { LabeledInput } from "@/stories/molecules/LabeledInput/LabeledInput"

interface RestaurantMenuProps {
    menu?: RestaurantMenuDto
}

export const RestaurantMenu = ({ menu }: RestaurantMenuProps) => {
    const [showNewCategoryForm, setShowNewCategoryForm] = useState(false)
    const [isEditable, setIsEditable] = useState(false)
    const [menuName, setMenuName] = useState(menu?.name || '')
    const [menuDescription, setMenuDescription] = useState(menu?.description || '')

    const { mutate: updateMenu } = useUpdateRestaurantMenu()

    if (!menu) return <div>No menu found, create a new menu</div>

    const handleCancelNewCategory = () => setShowNewCategoryForm(false)

    const handleSave = () => {
        updateMenu({
            id: menu.id,
            name: menuName,
            description: menuDescription,
        })
        setIsEditable(false)
    }

    return <div className="flex flex-col gap-4">

        <div className="flex flex-row gap-4 justify-between">


            {
                isEditable ? (
                    <div>
                        <LabeledInput
                            srOnly={false}
                            label="Menu Name"
                            placeholder="Menu Name"
                            type="text"
                            value={menuName}
                            onChange={e => setMenuName(e)}
                            id="menuName"
                        />
                    </div>
                ) : (
                    <div>
                        <p>
                            {menuName}
                        </p>
                    </div>
                )
            }

            <Button variant="outline" onClick={() => setIsEditable(true)}>Edit</Button>

            {
                isEditable && (
                    <div>
                        <Button variant="outline" onClick={handleSave}>Save</Button>
                        <Button variant="outline" onClick={() => setIsEditable(false)}>Cancel</Button>
                    </div>
                )
            }

        </div>

        {
            menu.categories.map(category => <MenuCategory key={category.id} category={category} />)
        }

        <NewCategoryForm onCancel={handleCancelNewCategory} menu={menu} isVisible={showNewCategoryForm} setIsVisible={setShowNewCategoryForm} />
    </div >
}
