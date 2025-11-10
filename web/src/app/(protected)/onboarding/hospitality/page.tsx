'use client'

import { useRouter } from 'next/navigation'
import { ContentContainer } from '@/components'
import { HospitalityOnboarding } from '@/stories/onboarding'
import { useTranslations } from 'next-intl'

export default function HospitalityOnboardingPage() {
  const router = useRouter()
  const t = useTranslations('onboarding.restaurantOnboarding')

  return (
    <ContentContainer>
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">{t('setupHospitality')}</h1>
          <p className="text-muted-foreground">{t('findYourBusiness')}</p>
        </div>

        <HospitalityOnboarding
          onBack={() => router.push('/onboarding')}
          onComplete={() => router.push('/dashboard')}
        />
      </div>
    </ContentContainer>
  )
}
