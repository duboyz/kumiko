'use client'

import { useRouter } from 'next/navigation'
import { ContentContainer } from '@/components'
import { RestaurantOnboarding } from '@/stories/onboarding'

export default function RestaurantOnboardingPage() {
  const router = useRouter()

  return (
    <ContentContainer>
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Set up your restaurant</h1>
          <p className="text-muted-foreground">Follow the steps to get your restaurant set up on our platform</p>
        </div>

        <RestaurantOnboarding
          onComplete={() => router.push('/dashboard')}
        />
      </div>
    </ContentContainer>
  )
}
