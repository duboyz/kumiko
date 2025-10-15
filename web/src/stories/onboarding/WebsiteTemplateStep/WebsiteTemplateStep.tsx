'use client'

import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Globe, Layout, Menu, Check, Star } from 'lucide-react'
import { PageTemplate } from '@shared'
import { cn } from '@/lib/utils'
import { gsap } from 'gsap'

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
  const containerRef = useRef<HTMLDivElement>(null)
  const cardsRef = useRef<HTMLDivElement>(null)

  console.log('WebsiteTemplateStep: selectedMenuId =', selectedMenuId)

  // GSAP animations on mount
  useEffect(() => {
    if (!containerRef.current || !cardsRef.current) return

    const cards = cardsRef.current.querySelectorAll('.website-option-card')

    gsap.set(cards, { y: 30, opacity: 0 })

    gsap.to(cards, {
      y: 0,
      opacity: 1,
      duration: 0.5,
      stagger: 0.15,
      ease: 'power2.out',
    })
  }, [])

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
    <div ref={containerRef} className="space-y-6">
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
          <div ref={cardsRef} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Object.entries(WEBSITE_OPTIONS).map(([key, option]) => {
              const Icon = option.icon
              const isSelected = selectedOption === key
              const isDisabled = key === 'menu-only' && isMenuOnlyDisabled

              return (
                <Card
                  key={key}
                  className={cn(
                    'website-option-card cursor-pointer transition-all hover:shadow-md hover:scale-105 relative',
                    isSelected ? 'border-primary ring-2 ring-primary/20 scale-105' : 'hover:border-primary',
                    isDisabled && 'opacity-50 cursor-not-allowed hover:scale-100'
                  )}
                  onClick={() => !isDisabled && handleOptionSelect(key as WebsiteOption)}
                >
                  {key === 'full' && (
                    <Badge className="absolute -top-2 -right-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white border-none shadow-lg">
                      <Star className="w-3 h-3 mr-1" />
                      Recommended
                    </Badge>
                  )}
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
