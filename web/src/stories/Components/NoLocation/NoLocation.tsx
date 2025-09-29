import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Building2 } from "lucide-react"
import Link from "next/link"

export const NoLocation = () => {
    return <div className="container mx-auto py-6">
        <Card>
            <CardContent className="text-center py-12">
                <Building2 className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h2 className="text-xl font-semibold mb-2">No Restaurants Found</h2>
                <p className="text-muted-foreground mb-6">You need to add a restaurant before you can manage menus.</p>
                <Button asChild>
                    <Link href="/onboarding/restaurant">Add Restaurant</Link>
                </Button>
            </CardContent>
        </Card>
    </div>
}