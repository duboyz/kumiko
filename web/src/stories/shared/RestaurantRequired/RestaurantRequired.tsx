import { EmptyState } from '@/stories/shared/EmptyState/EmptyState'
import { AlertCircle } from 'lucide-react'

export const RestaurantRequired = () => {
  return (
    <div className="container mx-auto py-6">
      <EmptyState
        icon={AlertCircle}
        title="Restaurant Required"
        description="Menu management is only available for restaurant locations. Please select a restaurant from the sidebar."
      />
    </div>
  )
}
