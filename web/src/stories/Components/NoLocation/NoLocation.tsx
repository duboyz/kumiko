import { Building2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { EmptyState } from '@/components/EmptyState'

export const NoLocation = () => {
  const router = useRouter()

  return (
    <div className="container mx-auto py-6">
      <EmptyState
        icon={Building2}
        title="No Restaurants Found"
        description="You need to add a restaurant before you can manage menus."
        action={{
          label: 'Add Restaurant',
          onClick: () => router.push('/onboarding/restaurant'),
        }}
      />
    </div>
  )
}
