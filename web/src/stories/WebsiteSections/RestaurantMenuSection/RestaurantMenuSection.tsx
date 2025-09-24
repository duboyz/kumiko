import { RestaurantMenuSection as MainRestaurantMenuSection } from '@/components/sections/RestaurantMenuSection'
import { RestaurantMenuDto } from '@shared/types'

interface RestaurantMenuSectionProps {
  restaurantMenu: RestaurantMenuDto
  allowOrdering?: boolean
  className?: string
  isEditing?: boolean
  availableMenus?: RestaurantMenuDto[]
  currentMenuId?: string
  onUpdate?: (field: string, value: string | boolean) => void
}

export const RestaurantMenuSection = ({
  restaurantMenu,
  allowOrdering,
  className,
  isEditing,
  availableMenus,
  currentMenuId,
  onUpdate,
}: RestaurantMenuSectionProps) => {
  return (
    <MainRestaurantMenuSection
      restaurantMenu={restaurantMenu}
      allowOrdering={allowOrdering}
      className={className}
      isEditing={isEditing}
      availableMenus={availableMenus}
      currentMenuId={currentMenuId}
      onUpdate={onUpdate}
    />
  )
}