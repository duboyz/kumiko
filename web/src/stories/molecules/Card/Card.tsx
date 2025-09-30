import { Card as ShadCard, CardHeader, CardFooter, CardTitle, CardDescription, CardContent } from "@/components/ui/card"

interface CardProps {
    title?: React.ReactNode
    description?: React.ReactNode
    children: React.ReactNode
    footer?: React.ReactNode
}
export const Card = ({ title, description, children, footer }: CardProps) => {
    return <ShadCard className="border-1 shadow-none rounded-none">
        {(title || description) && (
            <CardHeader>
                {title && <CardTitle>{title}</CardTitle>}
                {description && <CardDescription>{description}</CardDescription>}
            </CardHeader>
        )}
        <CardContent>
            {children}
        </CardContent>

        {footer && <CardFooter>{footer}</CardFooter>}
    </ShadCard>
}