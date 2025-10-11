'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import OnboardingWizard from '@/src/stories/onboarding/OnboardingWizard/OnboardingWizard'
import { OnboardingStep } from '@shared/types/onboarding.types'

interface OnboardingPageProps {
  params: {
    step?: string[]
  }
}

export default function OnboardingPage({ params }: OnboardingPageProps) {
  const router = useRouter()
  const step = params.step?.[0] as OnboardingStep

  useEffect(() => {
    // Redirect to business step if no step specified
    if (!step) {
      router.replace('/onboarding/business')
    }
  }, [step, router])

  const handleComplete = () => {
    router.push('/dashboard')
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <OnboardingWizard step={step} onComplete={handleComplete} />
    </div>
  )
}
