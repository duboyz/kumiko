'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useCreatePage, useCreatePageFromTemplate, useRestaurantMenus, useLocationSelection, PageTemplate } from '@shared'
import { useState } from 'react'
import { FormField } from '@/components'
import { Plus, Layout, FileText, Info, Menu, Phone } from 'lucide-react'

interface CreateWebPageModalProps {
  websiteId: string
}

const TEMPLATE_INFO = {
  [PageTemplate.FrontPage]: {
    icon: Layout,
    title: 'Front Page',
    description: 'Home page with hero section and about text',
    sections: ['Hero Section', 'Text Section'],
  },
  [PageTemplate.MenuPage]: {
    icon: Menu,
    title: 'Menu Page',
    description: 'Display your restaurant menu',
    sections: ['Menu Section'],
  },
  [PageTemplate.AboutPage]: {
    icon: Info,
    title: 'About Page',
    description: 'Tell your story with hero and text sections',
    sections: ['Hero Section (Image Right)', 'Text Section'],
  },
  [PageTemplate.ContactPage]: {
    icon: Phone,
    title: 'Contact Page',
    description: 'Contact information and details',
    sections: ['Text Section'],
  },
  [PageTemplate.Blank]: {
    icon: FileText,
    title: 'Blank Page',
    description: 'Start with an empty page',
    sections: ['No sections - add your own'],
  },
}

export const CreateWebPageModal = ({ websiteId }: CreateWebPageModalProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<'template' | 'custom'>('template')
  const { mutate: createPage } = useCreatePage()
  const { mutate: createPageFromTemplate } = useCreatePageFromTemplate()
  const { selectedLocation } = useLocationSelection()
  const { data: menusData } = useRestaurantMenus(selectedLocation?.id || '')

  const [customFormData, setCustomFormData] = useState({
    slug: '',
    title: '',
    seoTitle: '',
    seoDescription: '',
    seoKeywords: '',
  })

  const [templateFormData, setTemplateFormData] = useState({
    template: PageTemplate.FrontPage,
    customTitle: '',
    customSlug: '',
    restaurantMenuId: '',
  })

  const handleCreateCustomPage = () => {
    createPage(
      {
        slug: customFormData.slug,
        title: customFormData.title,
        seoTitle: customFormData.seoTitle,
        seoDescription: customFormData.seoDescription,
        seoKeywords: customFormData.seoKeywords,
        websiteId,
      },
      {
        onSuccess: () => {
          setIsOpen(false)
          setCustomFormData({ slug: '', title: '', seoTitle: '', seoDescription: '', seoKeywords: '' })
        },
      }
    )
  }

  const handleCreateFromTemplate = () => {
    // Validate menu selection for MenuPage template
    if (templateFormData.template === PageTemplate.MenuPage && !templateFormData.restaurantMenuId) {
      alert('Please select a menu for the Menu Page template')
      return
    }

    createPageFromTemplate(
      {
        websiteId,
        template: templateFormData.template,
        customTitle: templateFormData.customTitle || undefined,
        customSlug: templateFormData.customSlug || undefined,
        restaurantMenuId: templateFormData.restaurantMenuId || undefined,
      },
      {
        onSuccess: () => {
          setIsOpen(false)
          setTemplateFormData({
            template: PageTemplate.FrontPage,
            customTitle: '',
            customSlug: '',
            restaurantMenuId: '',
          })
        },
      }
    )
  }

  const selectedTemplateInfo = TEMPLATE_INFO[templateFormData.template]
  const TemplateIcon = selectedTemplateInfo.icon

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Add Page
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create Page</DialogTitle>
          <DialogDescription>Create a new page for your website using a template or start from scratch.</DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={value => setActiveTab(value as 'template' | 'custom')} className="mt-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="template">From Template</TabsTrigger>
            <TabsTrigger value="custom">Custom Page</TabsTrigger>
          </TabsList>

          <TabsContent value="template" className="space-y-4 mt-4">
            <div>
              <Label htmlFor="template">Select Template</Label>
              <Select
                value={templateFormData.template}
                onValueChange={value => setTemplateFormData({ ...templateFormData, template: value as PageTemplate })}
              >
                <SelectTrigger id="template" className="mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(TEMPLATE_INFO).map(([key, info]) => (
                    <SelectItem key={key} value={key}>
                      <div className="flex items-center gap-2">
                        <info.icon className="w-4 h-4" />
                        {info.title}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <TemplateIcon className="w-5 h-5" />
                  {selectedTemplateInfo.title}
                </CardTitle>
                <CardDescription>{selectedTemplateInfo.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-sm">
                  <p className="font-medium mb-2">Included Sections:</p>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                    {selectedTemplateInfo.sections.map((section, idx) => (
                      <li key={idx}>{section}</li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>

            {templateFormData.template === PageTemplate.MenuPage && (
              <FormField label="Select Menu" htmlFor="menuSelect">
                <Select
                  value={templateFormData.restaurantMenuId}
                  onValueChange={value => setTemplateFormData({ ...templateFormData, restaurantMenuId: value })}
                >
                  <SelectTrigger id="menuSelect">
                    <SelectValue placeholder="Choose a menu..." />
                  </SelectTrigger>
                  <SelectContent>
                    {menusData?.menus?.map((menu: any) => (
                      <SelectItem key={menu.id} value={menu.id}>
                        {menu.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormField>
            )}

            <FormField label="Custom Title (optional)" htmlFor="templateTitle" helperText="Leave empty to use default">
              <Input
                id="templateTitle"
                placeholder={`Default: ${TEMPLATE_INFO[templateFormData.template].title}`}
                value={templateFormData.customTitle}
                onChange={e => setTemplateFormData({ ...templateFormData, customTitle: e.target.value })}
              />
            </FormField>

            <FormField label="Custom Slug (optional)" htmlFor="templateSlug" helperText="Leave empty to use default">
              <Input
                id="templateSlug"
                placeholder="custom-slug"
                value={templateFormData.customSlug}
                onChange={e => setTemplateFormData({ ...templateFormData, customSlug: e.target.value })}
              />
            </FormField>

            <div className="flex justify-end gap-3 pt-4">
              <Button variant="secondary" type="button" onClick={() => setIsOpen(false)}>
                Cancel
              </Button>
              <Button variant="default" type="submit" onClick={handleCreateFromTemplate}>
                Create Page
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="custom" className="space-y-4 mt-4">
            <FormField label="Page Title" htmlFor="pageTitle">
              <Input
                id="pageTitle"
                placeholder="Home"
                value={customFormData.title}
                onChange={e => setCustomFormData({ ...customFormData, title: e.target.value })}
              />
            </FormField>

            <FormField label="Page Slug" htmlFor="pageSlug" helperText="This will be the URL path for your page">
              <Input
                id="pageSlug"
                placeholder="home"
                value={customFormData.slug}
                onChange={e => setCustomFormData({ ...customFormData, slug: e.target.value })}
              />
            </FormField>

            <FormField label="SEO Title (optional)" htmlFor="pageSeoTitle">
              <Input
                id="pageSeoTitle"
                placeholder="Your Restaurant Name - Home"
                value={customFormData.seoTitle}
                onChange={e => setCustomFormData({ ...customFormData, seoTitle: e.target.value })}
              />
            </FormField>

            <FormField label="SEO Description (optional)" htmlFor="pageSeoDescription">
              <Input
                id="pageSeoDescription"
                placeholder="Brief description for search engines"
                value={customFormData.seoDescription}
                onChange={e => setCustomFormData({ ...customFormData, seoDescription: e.target.value })}
              />
            </FormField>

            <FormField label="SEO Keywords (optional)" htmlFor="pageSeoKeywords">
              <Input
                id="pageSeoKeywords"
                placeholder="restaurant, sushi, japanese"
                value={customFormData.seoKeywords}
                onChange={e => setCustomFormData({ ...customFormData, seoKeywords: e.target.value })}
              />
            </FormField>

            <div className="flex justify-end gap-3 pt-4">
              <Button variant="secondary" type="button" onClick={() => setIsOpen(false)}>
                Cancel
              </Button>
              <Button variant="default" type="submit" onClick={handleCreateCustomPage}>
                Create Page
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
