import { Card, CardContent } from "@/components/ui/card"
import { AlertCircle } from "lucide-react"

export const RestaurantRequired = () => {
    return <div className="container mx-auto py-6">
        <Card>
            <CardContent className="text-center py-12">
                <AlertCircle className="w-12 h-12 text-amber-500 mx-auto mb-4" />
                <h2 className="text-xl font-semibold mb-2">Restaurant Required</h2>
                <p className="text-muted-foreground mb-6">
                    Menu management is only available for restaurant locations. Please select a restaurant from the sidebar.
                </p>
            </CardContent>
        </Card>
    </div>
}
