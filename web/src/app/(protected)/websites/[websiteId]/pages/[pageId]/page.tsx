'use client'

import { useParams, useRouter } from 'next/navigation'
import { useLocationSelection } from '@shared'
import { PageEditor } from '@/stories/websites'

export default function PageEditorPage() {
  const params = useParams()
  const router = useRouter()
  const websiteId = params.websiteId as string
  const pageId = params.pageId as string

  const { selectedLocation } = useLocationSelection()
  const restaurantId = selectedLocation?.type === 'Restaurant' ? selectedLocation.id : null

  return (
    <PageEditor
      websiteId={websiteId}
      pageId={pageId}
      restaurantId={restaurantId}
      onBack={() => router.push(`/websites/${websiteId}/pages`)}
    />
  )
}
