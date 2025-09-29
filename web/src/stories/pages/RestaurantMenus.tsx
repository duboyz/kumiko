'use client'
import { useLocationSelection } from "@shared/hooks/locationSelection.hooks"
import { useRestaurantMenus } from "@shared/hooks/menu.hooks"
import { RestaurantMenuDto } from "@shared/types/menu.types"
import { Button } from "../Button/Button"
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
    return <div className="border-1 border-gray-200 p-8 flex flex-col gap-8">
        <h1>{menu.name}</h1>
        <p>{menu.description}</p>

        <Button variant="default" onClick={() => router.push(`/menus/${menu.id}`)}>View</Button>
        <Button variant="secondary">Edit</Button>
    </div>
}
