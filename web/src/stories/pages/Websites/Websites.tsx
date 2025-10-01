import { useLocationSelection, usePages, useRestaurantWebsites } from '@shared'
import { useState, useEffect } from 'react'
import { WebsitePages } from '@/stories/organisms/WebsitePages'
import { Globe } from 'lucide-react'
import { FormField } from '@/components/FormField'
import { EmptyState } from '@/components/EmptyState'
import { SelectWebsite } from '@/stories/components/SelectWebsite/SelectWebsite'

export function Websites() {
    const { selectedLocation } = useLocationSelection()
    const { data: websites } = useRestaurantWebsites(selectedLocation?.id, selectedLocation?.type || 'Restaurant')
    const [selectedWebsiteId, setSelectedWebsiteId] = useState<string>('')

    const { data: websitePages } = usePages(selectedWebsiteId || '')

    useEffect(() => {
        if (websites && websites.length === 1 && !selectedWebsiteId) {
            setSelectedWebsiteId(websites[0].id)
        }
    }, [websites, selectedWebsiteId])

    if (websites && websites.length === 0) {
        return (
            <EmptyState
                icon={Globe}
                title="No websites yet"
                description="Create your first website to start building your online presence."
                variant="compact"
            />
        )
    }

    return (
        <div className="space-y-8">
            {(websites?.length || 0) > 1 && (
                <div className="bg-white border p-6">
                    <FormField label="Select Website" htmlFor="selectWebsite">
                        <SelectWebsite
                            websites={websites || []}
                            selectedWebsiteId={selectedWebsiteId}
                            onSelectWebsite={setSelectedWebsiteId}
                        />
                    </FormField>
                </div>
            )}

            {selectedWebsiteId && <WebsitePages websitePages={websitePages?.pages || []} websiteId={selectedWebsiteId} />}
        </div>
    )
}

