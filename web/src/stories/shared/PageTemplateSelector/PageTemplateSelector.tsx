'use client'
import { PageTemplate } from '@shared/types'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Check, Home, Menu, Info } from 'lucide-react'
import { cn } from '@/lib/utils'

interface PageTemplateSelectorProps {
  templates: PageTemplate[]
  selectedTemplateId?: string
  onSelectTemplate: (templateId: string) => void
  onCreatePage?: () => void
  showCreateButton?: boolean
}

const getTemplateIcon = (templateId: string) => {
  switch (templateId) {
    case 'frontpage':
      return Home
    case 'menu':
      return Menu
    case 'about':
      return Info
    default:
      return Home
  }
}

export const PageTemplateSelector = ({
  templates,
  selectedTemplateId,
  onSelectTemplate,
  onCreatePage,
  showCreateButton = true,
}: PageTemplateSelectorProps) => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Choose a Template</h3>
        <p className="text-sm text-muted-foreground">Select a pre-built template to get started quickly</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {templates.map(template => {
          const Icon = getTemplateIcon(template.id)
          const isSelected = selectedTemplateId === template.id

          return (
            <Card
              key={template.id}
              className={cn('cursor-pointer transition-all hover:shadow-md', isSelected && 'border-primary border-2')}
              onClick={() => onSelectTemplate(template.id)}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={cn(
                        'w-10 h-10 rounded-lg flex items-center justify-center',
                        isSelected ? 'bg-primary text-primary-foreground' : 'bg-muted'
                      )}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <CardTitle className="text-base">{template.name}</CardTitle>
                    </div>
                  </div>
                  {isSelected && (
                    <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                      <Check className="w-4 h-4 text-primary-foreground" />
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm">{template.description}</CardDescription>

                <div className="mt-4 pt-4 border-t">
                  <p className="text-xs text-muted-foreground mb-2">Includes:</p>
                  <ul className="space-y-1">
                    {template.sections.map((section, index) => (
                      <li key={index} className="text-xs text-muted-foreground flex items-center gap-2">
                        <div className="w-1 h-1 rounded-full bg-primary" />
                        {section.type === 'hero' && 'Hero section'}
                        {section.type === 'text' && 'Text content'}
                        {section.type === 'menu' && 'Menu display'}
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {showCreateButton && selectedTemplateId && (
        <div className="flex justify-end pt-4">
          <Button onClick={onCreatePage} size="lg">
            Create Page from Template
          </Button>
        </div>
      )}
    </div>
  )
}
