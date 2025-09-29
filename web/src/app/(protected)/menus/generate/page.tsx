'use client'
import { LoadingSpinner, MenuList } from "@/components";
import { ContentLoadingError } from "@/stories/Components/ContentLoadingError/ContentLoadingError";
import { RestaurantRequired } from "@/stories/Components/RestaurantRequired/RestaurantRequired";
import { useLocationSelection, useRestaurantMenus } from "@shared";

export default function GenerateMenuPage() {
    const { selectedLocation } = useLocationSelection()
    const restaurantId = selectedLocation?.type === 'Restaurant' ? selectedLocation.id : null
    const { data: menusData, isLoading: menusLoading, error } = useRestaurantMenus(restaurantId || '')

    if (menusLoading) return <LoadingSpinner />
    if (error) return <ContentLoadingError message={error.message} title="Error Loading Menus" backToText="Back to Menus" backToLink="/menus" />
    if (!selectedLocation || selectedLocation.type !== 'Restaurant') return <RestaurantRequired />


    return <div><MenuList menus={menusData?.menus || []} restaurantId={restaurantId || ''} restaurantName={selectedLocation?.name || 'Restaurant'} isLoading={menusLoading} onCreateMenu={() => { }} onDeleteMenu={() => { }} createMenuLoading={false} /></div>
}   