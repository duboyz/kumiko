import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { AlertCircle, ArrowLeft } from "lucide-react"

interface ContentNotFoundProps {
    title: string
    message: string
    backToText: string
    backToLink: string
    onBackClick?: () => void
}

export const ContentNotFound = ({
    title,
    message,
    backToText,
    backToLink,
    onBackClick
}: ContentNotFoundProps) => {
    const handleBackClick = () => {
        if (onBackClick) {
            onBackClick()
        } else {
            // Default behavior if no handler provided
            console.log('Navigate to:', backToLink)
        }
    }

    return <div className="container mx-auto py-6">
        <Card>
            <CardContent className="text-center py-12">
                <AlertCircle className="w-12 h-12 text-amber-500 mx-auto mb-4" />
                <h2 className="text-xl font-semibold mb-2">{title}</h2>
                <p className="text-muted-foreground mb-6">{message}</p>
                <Button onClick={handleBackClick}>
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    {backToText}
                </Button>
            </CardContent>
        </Card>
    </div>
}
