'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { LoadingSpinner } from '@/components'

export default function OnboardingPage() {
  const router = useRouter()

  useEffect(() => {
    // Redirect directly to restaurant onboarding
    router.push('/onboarding/restaurant')
  }, [router])

  return (
    <div className="flex items-center justify-center min-h-screen">
      <LoadingSpinner />
    </div>
  )
}
