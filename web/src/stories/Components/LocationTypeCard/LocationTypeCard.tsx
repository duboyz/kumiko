import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { LucideProps } from 'lucide-react'

interface LocationTypeCardProps {
  title: string
  description: string
  icon: React.ComponentType<LucideProps>
  available: boolean
  isSelected: boolean
  onClick: () => void
}

export function LocationTypeCard({
  title,
  description,
  icon: Icon,
  available,
  isSelected,
  onClick,
}: LocationTypeCardProps) {
  return (
    <Card
      className={`cursor-pointer transition-all hover:shadow-lg ${
        isSelected ? 'ring-2 ring-primary' : ''
      } ${!available ? 'opacity-60' : ''}`}
      onClick={onClick}
    >
      <CardHeader className="text-center">
        <div className="mx-auto mb-4 p-3 rounded-full bg-primary/10 w-fit">
          <Icon className="h-8 w-8 text-primary" />
        </div>
        <CardTitle className="flex items-center justify-center gap-2">
          {title}
          {!available && (
            <Badge variant="secondary" className="text-xs">
              Coming Soon
            </Badge>
          )}
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        {isSelected && (
          <div className="text-center">
            <Badge variant="default">Selected</Badge>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
