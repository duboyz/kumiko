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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useCreatePage, useCreatePageFromTemplate, useRestaurantMenus, useLocationSelection, PageTemplate } from '@shared'
import { useState, useEffect } from 'react'
import { FormField } from '@/components'
import { Plus, Layout, FileText, Info, Menu, Phone, Check } from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

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
  const [step, setStep] = useState<'select' | 'customize'>('select')
  const { mutate: createPage, isPending: isCreatingPage } = useCreatePage()
  const { mutate: createPageFromTemplate, isPending: isCreatingFromTemplate } = useCreatePageFromTemplate()
  const { selectedLocation } = useLocationSelection()
  const { data: menusData } = useRestaurantMenus(selectedLocation?.id || '')

  const [selectedTemplate, setSelectedTemplate] = useState<PageTemplate | null>(null)
  const [customTitle, setCustomTitle] = useState('')
  const [customSlug, setCustomSlug] = useState('')
  const [selectedMenuId, setSelectedMenuId] = useState('')

  // Auto-generate slug from title
  useEffect(() => {
    if (customTitle && !customSlug) {
      const slug = customTitle
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '')
      setCustomSlug(slug)
    }
  }, [customTitle, customSlug])

  // Reset form when dialog closes
  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => {
        setStep('select')
        setSelectedTemplate(null)
        setCustomTitle('')
        setCustomSlug('')
        setSelectedMenuId('')
      }, 200)
    }
  }, [isOpen])

  const handleSelectTemplate = (template: PageTemplate) => {
    setSelectedTemplate(template)
    setStep('customize')
    // Set default title and slug based on template
    const info = TEMPLATE_INFO[template]
    setCustomTitle(info.title)
    setCustomSlug(info.title.toLowerCase().replace(/\s+/g, '-'))
  }

  const handleCreatePage = () => {
    if (!selectedTemplate) return

    // Validate menu selection for MenuPage template
    if (selectedTemplate === PageTemplate.MenuPage && !selectedMenuId) {
      toast.error('Please select a menu for the Menu Page template')
      return
    }

    if (!customTitle.trim() || !customSlug.trim()) {
      toast.error('Please provide both title and slug')
      return
    }

    if (selectedTemplate === PageTemplate.Blank) {
      // Create blank page
      createPage(
        {
          slug: customSlug,
          title: customTitle,
          websiteId,
        },
        {
          onSuccess: () => {
            toast.success('Page created successfully!')
            setIsOpen(false)
          },
          onError: () => {
            toast.error('Failed to create page')
          },
        }
      )
    } else {
      // Create from template
      createPageFromTemplate(
        {
          websiteId,
          template: selectedTemplate,
          customTitle: customTitle || undefined,
          customSlug: customSlug || undefined,
          restaurantMenuId: selectedMenuId || undefined,
        },
        {
          onSuccess: () => {
            toast.success('Page created successfully!')
            setIsOpen(false)
          },
          onError: () => {
            toast.error('Failed to create page')
          },
        }
      )
    }
  }

  const isLoading = isCreatingPage || isCreatingFromTemplate

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Add Page
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{step === 'select' ? 'Choose a Page Template' : 'Customize Your Page'}</DialogTitle>
          <DialogDescription>
            {step === 'select'
              ? 'Start with a pre-built template or create a blank page'
              : 'Customize the details for your new page'}
          </DialogDescription>
        </DialogHeader>

        {step === 'select' ? (
          <div className="grid grid-cols-2 gap-3 mt-4">
            {Object.entries(TEMPLATE_INFO).map(([key, info]) => {
              const Icon = info.icon
              return (
                <Card
                  key={key}
                  className={cn(
                    'cursor-pointer transition-all hover:shadow-md hover:border-primary',
                    selectedTemplate === key && 'border-primary ring-2 ring-primary/20'
                  )}
                  onClick={() => handleSelectTemplate(key as PageTemplate)}
                >
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-base">
                      <Icon className="w-5 h-5 text-primary" />
                      {info.title}
                    </CardTitle>
                    <CardDescription className="text-xs">{info.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="text-xs text-muted-foreground">
                      <p className="font-medium mb-1">Includes:</p>
                      <ul className="space-y-0.5">
                        {info.sections.slice(0, 2).map((section, idx) => (
                          <li key={idx} className="flex items-start gap-1">
                            <Check className="w-3 h-3 mt-0.5 text-green-600 flex-shrink-0" />
                            <span className="line-clamp-1">{section}</span>
                          </li>
                        ))}
                        {info.sections.length > 2 && (
                          <li className="text-xs text-muted-foreground">+{info.sections.length - 2} more</li>
                        )}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        ) : (
          <div className="space-y-4 mt-4">
            {selectedTemplate && (
              <div className="p-3 bg-muted rounded-lg flex items-center gap-3">
                {(() => {
                  const Icon = TEMPLATE_INFO[selectedTemplate].icon
                  return <Icon className="w-5 h-5 text-primary" />
                })()}
                <div>
                  <p className="font-medium text-sm">{TEMPLATE_INFO[selectedTemplate].title}</p>
                  <p className="text-xs text-muted-foreground">{TEMPLATE_INFO[selectedTemplate].description}</p>
                </div>
              </div>
            )}

            {selectedTemplate === PageTemplate.MenuPage && (
              <FormField label="Select Menu" htmlFor="menuSelect" required>
                <Select value={selectedMenuId} onValueChange={setSelectedMenuId}>
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

            <FormField label="Page Title" htmlFor="pageTitle" required>
              <Input
                id="pageTitle"
                placeholder="e.g., Home, About Us, Contact"
                value={customTitle}
                onChange={e => setCustomTitle(e.target.value)}
              />
            </FormField>

            <FormField
              label="Page Slug"
              htmlFor="pageSlug"
              required
              helperText="This will be the URL path (e.g., yoursite.com/about-us)"
            >
              <Input
                id="pageSlug"
                placeholder="e.g., about-us"
                value={customSlug}
                onChange={e => setCustomSlug(e.target.value)}
              />
            </FormField>

            <div className="flex justify-between gap-3 pt-4">
              <Button variant="ghost" type="button" onClick={() => setStep('select')}>
                ← Back to Templates
              </Button>
              <div className="flex gap-2">
                <Button variant="secondary" type="button" onClick={() => setIsOpen(false)}>
                  Cancel
                </Button>
                <Button variant="default" onClick={handleCreatePage} disabled={isLoading}>
                  {isLoading ? 'Creating...' : 'Create Page'}
                </Button>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
