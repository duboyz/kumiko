'use client'

import { useRouter } from 'next/navigation'
import { ContentContainer } from '@/components'
import { HospitalityOnboarding } from '@/stories/onboarding'

export default function HospitalityOnboardingPage() {
  const router = useRouter()

  return (
    <ContentContainer>
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Set up your hospitality business</h1>
          <p className="text-muted-foreground">Find your business to get started on our platform</p>
        </div>

        <HospitalityOnboarding
          onBack={() => router.push('/onboarding')}
          onComplete={() => router.push('/dashboard')}
        />
      </div>
    </ContentContainer>
  )
}
