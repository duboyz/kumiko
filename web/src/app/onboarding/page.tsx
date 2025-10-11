'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function OnboardingRedirectPage() {
  const router = useRouter()

  useEffect(() => {
    router.replace('/onboarding/business')
  }, [router])

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Setting up your restaurant...</h1>
        <p className="text-muted-foreground">Redirecting to onboarding...</p>
      </div>
    </div>
  )
}
