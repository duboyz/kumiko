'use client'

import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Plus, FileText, ArrowLeft, Edit } from 'lucide-react'
import { usePages, useCreatePage } from '@shared'
import { LoadingSpinner } from '@/components'
import { ErrorMessage } from '@/components'
import { ContentContainer } from '@/components/ContentContainer'

export default function WebsitePagesPage() {
  const params = useParams()
  const router = useRouter()
  const websiteId = params.websiteId as string

  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [formData, setFormData] = useState({
    slug: '',
    title: '',
    seoTitle: '',
    seoDescription: '',
    seoKeywords: ''
  })

  const { data: pagesData, isLoading, error } = usePages(websiteId)
  const createPage = useCreatePage()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      await createPage.mutateAsync({
        slug: formData.slug,
        title: formData.title,
        seoTitle: formData.seoTitle || undefined,
        seoDescription: formData.seoDescription || undefined,
        seoKeywords: formData.seoKeywords || undefined,
        websiteId
      })

      setIsCreateOpen(false)
      setFormData({ slug: '', title: '', seoTitle: '', seoDescription: '', seoKeywords: '' })
    } catch (error) {
      console.error('Failed to create page:', error)
    }
  }

  if (isLoading) {
    return (
      <ContentContainer>
        <div className="flex items-center justify-center h-64">
          <LoadingSpinner />
        </div>
      </ContentContainer>
    )
  }

  if (error) {
    return (
      <ContentContainer>
        <ErrorMessage
          title="Failed to load pages"
          message="There was an error loading your website pages. Please try again."
        />
      </ContentContainer>
    )
  }

  const pages = pagesData?.pages || []

  return (
    <ContentContainer>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            onClick={() => router.push('/websites')}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Websites
          </Button>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Website Pages</h1>
            <p className="text-muted-foreground">
              Create and manage pages for your website. Build pages using prebuilt sections.
            </p>
          </div>

          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create Page
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create New Page</DialogTitle>
                <DialogDescription>
                  Create a new page for your website. You can add sections to it afterwards.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="slug">Page Slug</Label>
                    <Input
                      id="slug"
                      value={formData.slug}
                      onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                      placeholder="about-us"
                      required
                    />
                    <p className="text-xs text-muted-foreground">
                      URL-friendly version (e.g., about-us, contact, menu)
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="title">Page Title</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="About Us"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="seoTitle">SEO Title (optional)</Label>
                  <Input
                    id="seoTitle"
                    value={formData.seoTitle}
                    onChange={(e) => setFormData(prev => ({ ...prev, seoTitle: e.target.value }))}
                    placeholder="About Us - Your Restaurant Name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="seoDescription">SEO Description (optional)</Label>
                  <Textarea
                    id="seoDescription"
                    value={formData.seoDescription}
                    onChange={(e) => setFormData(prev => ({ ...prev, seoDescription: e.target.value }))}
                    placeholder="Learn more about our restaurant, our story, and our commitment to quality."
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="seoKeywords">SEO Keywords (optional)</Label>
                  <Input
                    id="seoKeywords"
                    value={formData.seoKeywords}
                    onChange={(e) => setFormData(prev => ({ ...prev, seoKeywords: e.target.value }))}
                    placeholder="restaurant, about, story, quality"
                  />
                </div>

                <div className="flex justify-end space-x-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsCreateOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={createPage.isPending}>
                    {createPage.isPending ? <LoadingSpinner size="sm" /> : 'Create Page'}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pages.map((page) => (
            <Card key={page.id}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  {page.title}
                </CardTitle>
                <CardDescription>
                  /{page.slug}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {page.seoDescription && (
                    <p className="text-sm text-muted-foreground">{page.seoDescription}</p>
                  )}

                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{page.sections.length} section{page.sections.length !== 1 ? 's' : ''}</span>
                    <span className="px-2 py-1 rounded-full bg-blue-100 text-blue-800">
                      Draft
                    </span>
                  </div>

                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1"
                      onClick={() => router.push(`/websites/${websiteId}/pages/${page.id}`)}
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Edit Content
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {pages.length === 0 && (
            <Card className="col-span-full">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <FileText className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No pages yet</h3>
                <p className="text-muted-foreground text-center mb-6">
                  Create your first page to start building your website content.
                </p>
                <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Create Your First Page
                    </Button>
                  </DialogTrigger>
                </Dialog>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </ContentContainer>
  )
}