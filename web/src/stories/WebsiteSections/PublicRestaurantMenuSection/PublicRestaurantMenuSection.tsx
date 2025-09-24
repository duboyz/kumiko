import { PublicRestaurantMenuSection as MainPublicRestaurantMenuSection } from '@/components/sections/PublicRestaurantMenuSection'

interface PublicRestaurantMenuSectionProps {
  restaurantMenuSectionId: string
  restaurantMenuId: string
  allowOrdering?: boolean
  className?: string
}

export const PublicRestaurantMenuSection = ({
  restaurantMenuSectionId,
  restaurantMenuId,
  allowOrdering,
  className,
}: PublicRestaurantMenuSectionProps) => {
  return (
    <MainPublicRestaurantMenuSection
      restaurantMenuSectionId={restaurantMenuSectionId}
      restaurantMenuId={restaurantMenuId}
      allowOrdering={allowOrdering}
      className={className}
    />
  )
}