import { ContentContainer } from '@/components/ContentContainer'
import { useTranslations } from 'next-intl'
import { LanguageSelector } from '@/components/LanguageSelector'
import { MenuItemRow } from '@/stories/RestaurantMenu/MenuItemRow/MenuItemRow'
import { LabeledInput } from '@/stories/molecules/LabeledInput/LabeledInput'

export default function DashboardPage() {
  const t = useTranslations('navigation')

  return (
    <ContentContainer>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">{t('dashboard')}</h1>
        <LanguageSelector />
      </div>
      <p>Welcome to your dashboard!</p>
    </ContentContainer>
  )
}
