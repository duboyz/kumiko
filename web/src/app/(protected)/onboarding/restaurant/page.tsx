'use client'

import { useRouter } from 'next/navigation'
import { ContentContainer } from '@/components'
import { RestaurantOnboarding } from '@/stories/onboarding'

export default function RestaurantOnboardingPage() {
  const router = useRouter()

  return (
    <ContentContainer>
      <div className="max-w-4xl mx-auto">
        <RestaurantOnboarding onComplete={() => router.push('/dashboard')} />
      </div>
    </ContentContainer>
  )
}
