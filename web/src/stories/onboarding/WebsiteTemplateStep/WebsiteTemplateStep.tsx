'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Globe, Layout, Menu, Check } from 'lucide-react'
import { PageTemplate } from '@shared'
import { cn } from '@/lib/utils'

interface WebsiteTemplateStepProps {
  onTemplatesSelected: (templates: PageTemplate[]) => void
  onSkip: () => void
  selectedMenuId?: string
}

type WebsiteOption = 'full' | 'menu-only'

const WEBSITE_OPTIONS = {
  full: {
    icon: Layout,
    title: 'Full Website',
    description: 'Complete website with all pages',
    pages: ['Home Page', 'Menu Page', 'About Us', 'Contact'],
    templates: [PageTemplate.FrontPage, PageTemplate.MenuPage, PageTemplate.AboutPage, PageTemplate.ContactPage],
  },
  'menu-only': {
    icon: Menu,
    title: 'Menu Page Only',
    description: 'Simple website with just your menu',
    pages: ['Menu Page'],
    templates: [PageTemplate.MenuPage],
  },
}

export function WebsiteTemplateStep({ onTemplatesSelected, onSkip, selectedMenuId }: WebsiteTemplateStepProps) {
  const [selectedOption, setSelectedOption] = useState<WebsiteOption | null>(null)

  console.log('WebsiteTemplateStep: selectedMenuId =', selectedMenuId)

  const handleOptionSelect = (option: WebsiteOption) => {
    setSelectedOption(option)
  }

  const handleContinue = () => {
    if (selectedOption) {
      onTemplatesSelected(WEBSITE_OPTIONS[selectedOption].templates)
    }
  }

  const isMenuOnlyDisabled = !selectedMenuId

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Choose Your Website</h2>
        <p className="text-muted-foreground">Select the type of website you'd like to create</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="w-5 h-5" />
            Website Options
          </CardTitle>
          <CardDescription>Choose between a full website or just a menu page</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Object.entries(WEBSITE_OPTIONS).map(([key, option]) => {
              const Icon = option.icon
              const isSelected = selectedOption === key
              const isDisabled = key === 'menu-only' && isMenuOnlyDisabled

              return (
                <Card
                  key={key}
                  className={cn(
                    'cursor-pointer transition-all hover:shadow-md',
                    isSelected ? 'border-primary ring-2 ring-primary/20' : 'hover:border-primary',
                    isDisabled && 'opacity-50 cursor-not-allowed'
                  )}
                  onClick={() => !isDisabled && handleOptionSelect(key as WebsiteOption)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <Icon className="w-6 h-6 text-primary" />
                        <div>
                          <CardTitle className="text-lg">{option.title}</CardTitle>
                          <CardDescription className="text-sm">{option.description}</CardDescription>
                        </div>
                      </div>
                      {isSelected && <Check className="w-5 h-5 text-primary" />}
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="text-sm text-muted-foreground">
                      <p className="font-medium mb-2">Includes:</p>
                      <ul className="space-y-1">
                        {option.pages.map((page, idx) => (
                          <li key={idx} className="flex items-center gap-2">
                            <Check className="w-4 h-4 text-green-600 flex-shrink-0" />
                            <span>{page}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    {isDisabled && (
                      <p className="text-sm text-amber-600 mt-3 p-2 bg-amber-50 rounded">
                        Requires menu to be imported first
                      </p>
                    )}
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {selectedOption && (
            <div className="mt-6 p-4 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground">
                <strong>Selected:</strong> {WEBSITE_OPTIONS[selectedOption].title} -{' '}
                {WEBSITE_OPTIONS[selectedOption].pages.join(', ')}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex items-center justify-between pt-6">
        <Button onClick={onSkip} variant="outline">
          Skip for now
        </Button>

        <Button onClick={handleContinue} disabled={!selectedOption}>
          Complete Setup
        </Button>
      </div>
    </div>
  )
}
