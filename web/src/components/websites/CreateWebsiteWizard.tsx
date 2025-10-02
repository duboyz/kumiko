'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { FormField } from '@/components'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
  useCreateWebsite,
  useCreatePageFromTemplate,
  useRestaurantMenus,
  useLocationSelection,
  PageTemplate,
} from '@shared'
import { Layout, FileText, Info, Menu, Phone, Check } from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

interface CreateWebsiteWizardProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
}

const TEMPLATE_INFO: Record<
  PageTemplate,
  {
    icon: any
    title: string
    description: string
    defaultSlug: string
    sections: string[]
    requiresMenu?: boolean
  }
> = {
  [PageTemplate.FrontPage]: {
    icon: Layout,
    title: 'Front Page',
    description: 'Home page with hero section and about text',
    defaultSlug: 'home',
    sections: ['Hero Section', 'Text Section'],
  },
  [PageTemplate.MenuPage]: {
    icon: Menu,
    title: 'Menu Page',
    description: 'Display your restaurant menu',
    defaultSlug: 'menu',
    sections: ['Menu Section'],
    requiresMenu: true,
  },
  [PageTemplate.AboutPage]: {
    icon: Info,
    title: 'About Page',
    description: 'Tell your story with hero and text sections',
    defaultSlug: 'about',
    sections: ['Hero Section (Image Right)', 'Text Section'],
  },
  [PageTemplate.ContactPage]: {
    icon: Phone,
    title: 'Contact Page',
    description: 'Contact information and details',
    defaultSlug: 'contact',
    sections: ['Text Section'],
  },
  [PageTemplate.Blank]: {
    icon: FileText,
    title: 'Blank Page',
    description: 'Start with an empty page',
    defaultSlug: 'blank',
    sections: ['No sections - add your own'],
  },
}

export function CreateWebsiteWizard({ isOpen, onOpenChange }: CreateWebsiteWizardProps) {
  const [subdomain, setSubdomain] = useState('')
  const [selectedTemplates, setSelectedTemplates] = useState<PageTemplate[]>([])
  const [selectedMenuId, setSelectedMenuId] = useState('')

  const { selectedLocation } = useLocationSelection()
  const { data: menusData } = useRestaurantMenus(selectedLocation?.id || '')
  const createWebsite = useCreateWebsite()
  const createPageFromTemplate = useCreatePageFromTemplate()

  const isCreating = createWebsite.isPending

  // Reset on close
  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => {
        setSubdomain('')
        setSelectedTemplates([])
        setSelectedMenuId('')
      }, 200)
    }
  }, [isOpen])

  const toggleTemplate = (template: PageTemplate) => {
    setSelectedTemplates(prev =>
      prev.includes(template) ? prev.filter(t => t !== template) : [...prev, template]
    )
  }

  const handleCreateWebsite = async () => {
    try {
      // Step 1: Create website (use subdomain as name)
      const website = await createWebsite.mutateAsync({
        name: subdomain,
        subdomain: subdomain,
        description: undefined,
        entityId: selectedLocation?.id,
        entityType: selectedLocation?.type || 'Restaurant',
      })

      if (!website) {
        throw new Error('Failed to create website')
      }

      // Step 2: Create selected pages (if any)
      if (selectedTemplates.length > 0) {
        const pageCreationPromises = selectedTemplates.map(template => {
          const info = TEMPLATE_INFO[template]
          return createPageFromTemplate.mutateAsync({
            websiteId: website.websiteId,
            template,
            customTitle: info.title,
            customSlug: info.defaultSlug,
            restaurantMenuId: template === PageTemplate.MenuPage ? selectedMenuId : undefined,
          })
        })

        await Promise.all(pageCreationPromises)
        toast.success(`Website created with ${selectedTemplates.length} pages!`)
      } else {
        toast.success('Website created successfully!')
      }

      onOpenChange(false)
    } catch (error) {
      console.error('Failed to create website:', error)
      toast.error('Failed to create website')
    }
  }

  const canCreate = subdomain.trim() && (!selectedTemplates.includes(PageTemplate.MenuPage) || selectedMenuId)

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create Your Website</DialogTitle>
          <DialogDescription>Choose a subdomain and select which pages to create</DialogDescription>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Subdomain Input */}
          <FormField label="Website Subdomain" htmlFor="subdomain" required>
            <div className="flex items-stretch">
              <Input
                id="subdomain"
                value={subdomain}
                onChange={e => setSubdomain(e.target.value)}
                placeholder="myrestaurant"
                className="flex-1 rounded-r-none"
              />
              <div className="bg-muted px-4 flex items-center text-sm text-muted-foreground border border-l-0 rounded-r-md">
                .kumiko.no
              </div>
            </div>
          </FormField>

          {/* Page Templates Selection */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Select Pages to Create (optional)</Label>
            <div className="grid grid-cols-2 gap-3">
              {Object.entries(TEMPLATE_INFO).map(([key, info]) => {
                const Icon = info.icon
                const isSelected = selectedTemplates.includes(key as PageTemplate)
                return (
                  <Card
                    key={key}
                    className={cn(
                      'cursor-pointer transition-all hover:shadow-md',
                      isSelected ? 'border-primary ring-2 ring-primary/20' : 'hover:border-primary'
                    )}
                    onClick={() => toggleTemplate(key as PageTemplate)}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2">
                          <Icon className="w-5 h-5 text-primary" />
                          <CardTitle className="text-sm">{info.title}</CardTitle>
                        </div>
                        {isSelected && <Check className="w-4 h-4 text-primary" />}
                      </div>
                      <CardDescription className="text-xs">{info.description}</CardDescription>
                    </CardHeader>
                  </Card>
                )
              })}
            </div>

            {selectedTemplates.length > 0 && (
              <p className="text-xs text-muted-foreground">
                {selectedTemplates.length} page{selectedTemplates.length !== 1 ? 's' : ''} selected
              </p>
            )}
          </div>

          {/* Menu Selection (if Menu Page is selected) */}
          {selectedTemplates.includes(PageTemplate.MenuPage) && (
            <div className="p-4 bg-muted rounded-lg">
              <FormField label="Select Menu for Menu Page" htmlFor="menuSelect" required>
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
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="secondary" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateWebsite} disabled={isCreating || !canCreate}>
              {isCreating ? 'Creating...' : 'Create Website'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
