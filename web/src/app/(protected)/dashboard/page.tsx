import { ContentContainer } from '@/components/ContentContainer'
import { PageHeader } from '@/components/PageHeader'
import { useTranslations } from 'next-intl'
import { LanguageSelector } from '@/components/LanguageSelector'
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'

export default function DashboardPage() {
  const t = useTranslations('navigation')

  return (
    <ContentContainer>
      <PageHeader
        title={t('dashboard')}
        description="Overview of your restaurant management platform."
        action={<LanguageSelector />}
      />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Welcome</CardTitle>
            <CardDescription>Get started by creating menus and building your restaurant website.</CardDescription>
          </CardHeader>
        </Card>
      </div>
    </ContentContainer>
  )
}
