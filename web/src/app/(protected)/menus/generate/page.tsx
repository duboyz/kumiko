'use client'
import { useRouter } from "next/navigation";
import { LoadingSpinner } from "@/components";
import { RestaurantRequired } from "@/stories/Components/RestaurantRequired/RestaurantRequired";
import { NoLocation } from "@/stories/Components/NoLocation/NoLocation";
import { useLocationSelection, useGenerateMenuFromImage } from "@shared";
import { SimpleImportWizard } from "../import/components/SimpleImportWizard";
import { ContentContainer } from "@/components/ContentContainer";
import { ImportWizard } from "../import/components/ImportWizard";

export default function GenerateMenuPage() {
    const router = useRouter();
    const { selectedLocation, isLoading, hasNoLocations } = useLocationSelection()
    const generateMenuMutation = useGenerateMenuFromImage()

    const handleGenerateMenu = async (file: File, restaurantId: string) => {
        try {
            console.log('Generating menu from image...', file.name, 'for restaurant:', restaurantId)

            // Call the backend API to generate menu from image
            const result = await generateMenuMutation.mutateAsync({ file, restaurantId })

            console.log('Menu generated successfully:', result)
            // Redirect to the created menu
            router.push(`/menus/${result?.id}`)
        } catch (error) {
            console.error('Failed to generate menu:', error)
            throw error // Let SimpleImportWizard handle the error display
        }
    }

    if (isLoading) return <LoadingSpinner />
    if (hasNoLocations) return <NoLocation />
    if (!selectedLocation || selectedLocation.type !== 'Restaurant') return <RestaurantRequired />

    return <ContentContainer><SimpleImportWizard onGenerateMenu={handleGenerateMenu} />
        <ImportWizard />
    </ContentContainer>
}