'use client'
import { useLocationSelection } from "@shared/hooks/locationSelection.hooks"
import { useRestaurantMenus, useDeleteRestaurantMenu } from "@shared/hooks/menu.hooks"
import { RestaurantMenuDto } from "@shared/types/menu.types"
import { Button } from "../atoms/Button/Button"
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime"

interface RestaurantMenusProps {
    router: AppRouterInstance
}

export const RestaurantMenus = ({ router }: RestaurantMenusProps) => {
    const { selectedLocation } = useLocationSelection()
    const { data: menusData, isLoading, error } = useRestaurantMenus(selectedLocation?.id || '')
    return <div className="flex flex-col gap-8">
        {menusData?.menus.map(menu => <RestaurantMenuCard key={menu.id} menu={menu} router={router} />)}
    </div>
}

export const RestaurantMenuCard = ({ menu, router }: { menu: RestaurantMenuDto, router: AppRouterInstance }) => {
    const { mutate: deleteMenu } = useDeleteRestaurantMenu()
    const handleDelete = () => {
        if (confirm(`Are you sure you want to delete "${menu.name}"? This action cannot be undone.`)) {
            deleteMenu(menu.id)
        }
    }
    return <div className="border-1 border-gray-200 p-8 flex flex-col gap-8">
        <h1>{menu.name}</h1>
        <p>{menu.description}</p>

        <div className="flex gap-2">
            <Button variant="default" onClick={() => router.push(`/menus/${menu.id}`)}>View</Button>
            <Button variant="secondary">Edit</Button>
            <Button variant="destructive" onClick={handleDelete}>Delete</Button>
        </div>
    </div>
}
