import { ContentContainer } from "@/components/ContentContainer";
import { Select, SelectItem, SelectTrigger } from "@/components/ui/select";
import { SelectValue } from "@/components/ui/select";
import { SelectContent } from "@/components/ui/select";
import { Button } from "@/stories/atoms/Button/Button";
import { HeroSection } from "@/stories/WebsiteSections/HeroSection";
import { useLocationSelection, usePages, useRestaurantWebsites, WebsiteDto, WebsitePageDto } from "@shared";
import { useMemo, useState, useEffect } from "react";
import Link from "next/link";
import { WebsitePages } from "@/stories/organisms/WebsitePages";

export function Websites() {
    const { selectedLocation } = useLocationSelection()
    const { data: websites, isLoading, error } = useRestaurantWebsites(selectedLocation?.id, selectedLocation?.type || 'Restaurant')
    const [selectedWebsiteId, setSelectedWebsiteId] = useState<string>('')

    const { data: websitePages, isLoading: isLoadingWebsitePages, error: errorWebsitePages } = usePages(selectedWebsiteId || '')

    useEffect(() => {
        if (websites?.length === 1 && !selectedWebsiteId) {
            setSelectedWebsiteId(websites[0].id)
        }
    }, [websites, selectedWebsiteId])

    return (
        <ContentContainer>

            {
                (websites?.length || 0) > 1 && (<SelectWebsite websites={websites || []} selectedWebsiteId={selectedWebsiteId} onSelectWebsite={setSelectedWebsiteId} />)
            }

            {
                selectedWebsiteId && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

                        <WebsitePages websitePages={websitePages?.pages || []} websiteId={selectedWebsiteId} />
                        <p>http://{websites?.find(w => w.id === selectedWebsiteId)?.subdomain}.{process.env.NEXT_PUBLIC_SITE_URL?.split('//')[1]}</p>

                    </div>
                )
            }

        </ContentContainer>
    )
}



interface SelectWebsiteProps {
    websites: WebsiteDto[]
    selectedWebsiteId: string
    onSelectWebsite: (websiteId: string) => void
}
export const SelectWebsite = ({ websites, selectedWebsiteId, onSelectWebsite }: SelectWebsiteProps) => {
    return (
        <Select onValueChange={onSelectWebsite} value={selectedWebsiteId}>
            <SelectTrigger>
                <SelectValue placeholder="Select a website" />
            </SelectTrigger>
            <SelectContent>
                {websites.map(website => (
                    <SelectItem key={website.id} value={website.id}>{website.name}</SelectItem>
                ))}
            </SelectContent>
        </Select>
    )
}