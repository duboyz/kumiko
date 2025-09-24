'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface SectionType {
  id: string
  name: string
  description: string
  icon: React.ReactNode
  available: boolean
}

interface SectionSelectionModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSelectSection: (sectionType: string) => void
  hasMenusAvailable?: boolean
  isLoadingMenus?: boolean
}

export function SectionSelectionModal({
  open,
  onOpenChange,
  onSelectSection,
  hasMenusAvailable = false,
  isLoadingMenus = false,
}: SectionSelectionModalProps) {
  const sectionTypes: SectionType[] = [
    {
      id: 'hero',
      name: 'Hero Section',
      description: 'Eye-catching banner with title, description, and call-to-action',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      ),
      available: true,
    },
    {
      id: 'text',
      name: 'Text Section',
      description: 'Rich text content with customizable formatting',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
      ),
      available: true,
    },
    {
      id: 'restaurant-menu',
      name: 'Menu Section',
      description: isLoadingMenus
        ? 'Loading menus...'
        : hasMenusAvailable
          ? 'Display your restaurant menu with categories and items'
          : 'Create a menu first to use this section',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
          />
        </svg>
      ),
      available: hasMenusAvailable && !isLoadingMenus,
    },
  ]

  const handleSectionSelect = (sectionType: SectionType) => {
    if (!sectionType.available) return
    onSelectSection(sectionType.id)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Add Section</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
          {sectionTypes.map(sectionType => (
            <Card
              key={sectionType.id}
              className={`cursor-pointer transition-all hover:shadow-md ${
                !sectionType.available ? 'opacity-60 cursor-not-allowed' : 'hover:border-primary'
              }`}
              onClick={() => handleSectionSelect(sectionType)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="p-2 bg-primary/10 rounded-lg text-primary">{sectionType.icon}</div>
                    <CardTitle className="text-lg">{sectionType.name}</CardTitle>
                  </div>
                  {!sectionType.available && (
                    <Badge variant="secondary" className="text-xs">
                      Coming Soon
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <CardDescription className="text-sm">{sectionType.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
}
