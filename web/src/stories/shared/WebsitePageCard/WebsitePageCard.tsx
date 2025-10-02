import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import { WebsitePageDto } from '@shared'
import Link from 'next/link'
import { FileText, ExternalLink, Layout, Eye } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

interface WebsitePageCardProps {
  websitePage: WebsitePageDto
}

export const WebsitePageCard = ({ websitePage }: WebsitePageCardProps) => {
  const sectionCount = websitePage.sections?.length || 0

  return (
    <Card className="group relative hover:shadow-sm transition-shadow duration-200">
      <CardHeader>
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <FileText className="w-4 h-4 text-muted-foreground flex-shrink-0" />
              <CardTitle className="text-lg truncate">{websitePage.title}</CardTitle>
            </div>
            <CardDescription className="flex items-center gap-1 text-sm">
              <ExternalLink className="w-3 h-3" />
              <span className="truncate">/{websitePage.slug}</span>
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="flex flex-wrap gap-2 mb-3">
          <Badge variant="secondary" className="text-xs">
            <Layout className="w-3 h-3 mr-1" />
            {sectionCount} {sectionCount === 1 ? 'Section' : 'Sections'}
          </Badge>
        </div>

        {websitePage.seoDescription && (
          <p className="text-xs text-muted-foreground line-clamp-2">{websitePage.seoDescription}</p>
        )}
      </CardContent>

      <CardFooter className="pt-3 border-t">
        <Link href={`/websites/${websitePage.websiteId}/pages/${websitePage.id}`} className="w-full">
          <Button variant="outline" size="sm" className="w-full">
            <Eye className="w-4 h-4 mr-2" />
            Edit Page
          </Button>
        </Link>
      </CardFooter>
    </Card>
  )
}
