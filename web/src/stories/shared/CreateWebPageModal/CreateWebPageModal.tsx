'use client'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Plus, Sparkles } from 'lucide-react'
import { PAGE_TEMPLATES, replaceTemplatePlaceholders, convertTemplateToApiSections } from '@shared/consts/pageTemplates'
import { PageTemplateSelector } from '../PageTemplateSelector/PageTemplateSelector'
import { FormField } from '../FormField/FormField'

interface CreateWebPageModalProps {
  websiteId: string
  restaurantName?: string
  existingSlugs?: string[]
  onPageCreate: (pageData: {
    slug: string
    title: string
    seoTitle: string
    seoDescription: string
    seoKeywords?: string
    templateId?: string
    sections?: any[]
  }) => void
  isLoading?: boolean
}

export const CreateWebPageModal = ({
  websiteId,
  restaurantName = 'Your Restaurant',
  existingSlugs = [],
  onPageCreate,
  isLoading = false,
}: CreateWebPageModalProps) => {
  const [open, setOpen] = useState(false)
  const [creationMode, setCreationMode] = useState<'template' | 'custom'>('template')
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('')
  const [formData, setFormData] = useState({
    slug: '',
    title: '',
    seoTitle: '',
    seoDescription: '',
    seoKeywords: '',
  })

  // Generate a unique slug by appending numbers if needed
  const generateUniqueSlug = (baseSlug: string): string => {
    if (!existingSlugs.includes(baseSlug)) {
      return baseSlug
    }

    let counter = 1
    let uniqueSlug = `${baseSlug}-${counter}`

    while (existingSlugs.includes(uniqueSlug)) {
      counter++
      uniqueSlug = `${baseSlug}-${counter}`
    }

    return uniqueSlug
  }

  const handleTemplateCreate = () => {
    if (!selectedTemplateId) return

    const template = PAGE_TEMPLATES.find(t => t.id === selectedTemplateId)
    if (!template) return

    const processedTemplate = replaceTemplatePlaceholders(template, { restaurantName })
    const sections = convertTemplateToApiSections(processedTemplate)
    const uniqueSlug = generateUniqueSlug(processedTemplate.slug)

    onPageCreate({
      slug: uniqueSlug,
      title: processedTemplate.name,
      seoTitle: processedTemplate.seoTitle,
      seoDescription: processedTemplate.seoDescription,
      templateId: template.id,
      sections,
    })

    setOpen(false)
    setSelectedTemplateId('')
  }

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onPageCreate(formData)
    setOpen(false)
    setFormData({ slug: '', title: '', seoTitle: '', seoDescription: '', seoKeywords: '' })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Create Page
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Page</DialogTitle>
          <DialogDescription>Choose a template or create a custom page from scratch</DialogDescription>
        </DialogHeader>

        <Tabs value={creationMode} onValueChange={v => setCreationMode(v as 'template' | 'custom')} className="mt-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="template" className="flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              Use Template
            </TabsTrigger>
            <TabsTrigger value="custom">Custom Page</TabsTrigger>
          </TabsList>

          <TabsContent value="template" className="mt-6">
            <PageTemplateSelector
              templates={PAGE_TEMPLATES}
              selectedTemplateId={selectedTemplateId}
              onSelectTemplate={setSelectedTemplateId}
              onCreatePage={handleTemplateCreate}
              showCreateButton={true}
            />
          </TabsContent>

          <TabsContent value="custom" className="mt-6">
            <form onSubmit={handleCustomSubmit} className="space-y-4">
              <FormField label="Page Title" htmlFor="pageTitle" required>
                <Input
                  id="pageTitle"
                  placeholder="About Us"
                  type="text"
                  value={formData.title}
                  onChange={e => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </FormField>

              <FormField
                label="Page Slug"
                htmlFor="pageSlug"
                helperText="This will be the URL path for your page"
                required
              >
                <Input
                  id="pageSlug"
                  placeholder="about-us"
                  type="text"
                  value={formData.slug}
                  onChange={e => setFormData({ ...formData, slug: e.target.value })}
                  required
                />
              </FormField>

              <FormField label="SEO Title (optional)" htmlFor="pageSeoTitle">
                <Input
                  id="pageSeoTitle"
                  placeholder="About Us - Your Restaurant Name"
                  type="text"
                  value={formData.seoTitle}
                  onChange={e => setFormData({ ...formData, seoTitle: e.target.value })}
                />
              </FormField>

              <FormField label="SEO Description (optional)" htmlFor="pageSeoDescription">
                <Textarea
                  id="pageSeoDescription"
                  placeholder="Brief description for search engines"
                  value={formData.seoDescription}
                  onChange={e => setFormData({ ...formData, seoDescription: e.target.value })}
                  rows={3}
                />
              </FormField>

              <FormField label="SEO Keywords (optional)" htmlFor="pageSeoKeywords">
                <Input
                  id="pageSeoKeywords"
                  placeholder="restaurant, fine dining, cuisine"
                  type="text"
                  value={formData.seoKeywords}
                  onChange={e => setFormData({ ...formData, seoKeywords: e.target.value })}
                />
              </FormField>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? 'Creating...' : 'Create Page'}
                </Button>
              </DialogFooter>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
