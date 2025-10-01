import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { useCreatePage, WebsitePageDto } from '@shared'
import Link from 'next/link'
import { useState } from 'react'
import { FileText, ExternalLink } from 'lucide-react'
import { EmptyState } from '@/components/EmptyState'
import { FormField } from '@/components/FormField'

interface WebsitePagesProps {
  websitePages: WebsitePageDto[]
  websiteId: string
}
export function WebsitePages({ websitePages, websiteId }: WebsitePagesProps) {
  return (
    <div className="space-y-6">
      {websitePages.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="No pages yet"
          description="Start building your website by creating your first page."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {websitePages.map(websitePage => (
            <WebsitePageCard key={websitePage.id} websitePage={websitePage} />
          ))}
        </div>
      )}
      <div className="flex justify-start">
        <CreateWebPageModal websiteId={websiteId} />
      </div>
    </div>
  )
}

const WebsitePageCard = ({ websitePage }: { websitePage: WebsitePageDto }) => {
  return (
    <Link href={`/websites/${websitePage.websiteId}/pages/${websitePage.id}`}>
      <Card className="hover:shadow-lg transition-shadow cursor-pointer group">
        <CardHeader>
          <div className="flex items-start justify-between mb-2">
            <FileText className="w-5 h-5 text-muted-foreground" />
            <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
          </div>
          <CardTitle className="text-lg">{websitePage.title}</CardTitle>
          <CardDescription>/{websitePage.slug}</CardDescription>
          {websitePage.sections && (
            <p className="text-xs text-muted-foreground mt-2">
              {websitePage.sections.length} {websitePage.sections.length === 1 ? 'section' : 'sections'}
            </p>
          )}
        </CardHeader>
      </Card>
    </Link>
  )
}

interface CreateWebPageModalProps {
  websiteId: string
}
export const CreateWebPageModal = ({ websiteId }: CreateWebPageModalProps) => {
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const { mutate: createPage } = useCreatePage()
  const [formData, setFormData] = useState({
    slug: '',
    title: '',
    seoTitle: '',
    seoDescription: '',
    seoKeywords: '',
  })
  const handleCreatePage = () => {
    createPage(
      {
        slug: formData.slug,
        title: formData.title,
        seoTitle: formData.seoTitle,
        seoDescription: formData.seoDescription,
        seoKeywords: formData.seoKeywords,
        websiteId,
      },
      {
        onSuccess: () => {
          setIsCreateOpen(false)
          setFormData({ slug: '', title: '', seoTitle: '', seoDescription: '', seoKeywords: '' })
        },
      }
    )
  }
  return (
    <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
      <DialogTrigger asChild>
        <Button>Add Page</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create Page</DialogTitle>
          <DialogDescription>Create a new page for your website.</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 mt-4">
          <FormField label="Page Title" htmlFor="pageTitle">
            <Input
              id="pageTitle"
              placeholder="Home"
              type="text"
              value={formData.title}
              onChange={e => setFormData({ ...formData, title: e.target.value })}
            />
          </FormField>

          <FormField label="Page Slug" htmlFor="pageSlug" helperText="This will be the URL path for your page">
            <Input
              id="pageSlug"
              placeholder="home"
              type="text"
              value={formData.slug}
              onChange={e => setFormData({ ...formData, slug: e.target.value })}
            />
          </FormField>

          <FormField label="SEO Title (optional)" htmlFor="pageSeoTitle">
            <Input
              id="pageSeoTitle"
              placeholder="Your Restaurant Name - Home"
              type="text"
              value={formData.seoTitle}
              onChange={e => setFormData({ ...formData, seoTitle: e.target.value })}
            />
          </FormField>

          <FormField label="SEO Description (optional)" htmlFor="pageSeoDescription">
            <Input
              id="pageSeoDescription"
              placeholder="Brief description for search engines"
              type="text"
              value={formData.seoDescription}
              onChange={e => setFormData({ ...formData, seoDescription: e.target.value })}
            />
          </FormField>

          <FormField label="SEO Keywords (optional)" htmlFor="pageSeoKeywords">
            <Input
              id="pageSeoKeywords"
              placeholder="restaurant, sushi, japanese"
              type="text"
              value={formData.seoKeywords}
              onChange={e => setFormData({ ...formData, seoKeywords: e.target.value })}
            />
          </FormField>

          <div className="flex justify-end gap-3 pt-4">
            <Button variant="secondary" type="button" onClick={() => setIsCreateOpen(false)}>
              Cancel
            </Button>
            <Button variant="default" type="submit" onClick={handleCreatePage}>
              Create Page
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
