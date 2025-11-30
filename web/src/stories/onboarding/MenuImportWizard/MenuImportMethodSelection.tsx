'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Sparkles, PenTool } from 'lucide-react'
import { cn } from '@/lib/utils'

interface MenuImportMethodSelectionProps {
  onSelectAI: () => void
  onSelectManual: () => void
  onBack: () => void
}

export function MenuImportMethodSelection({ onSelectAI, onSelectManual, onBack }: MenuImportMethodSelectionProps) {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Import Your Menu</h2>
        <p className="text-muted-foreground">Choose how you'd like to import your menu</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        {/* AI Import Card */}
        <Card
          className={cn(
            'cursor-pointer transition-all hover:shadow-lg hover:border-primary/50',
            'group relative overflow-hidden'
          )}
          onClick={onSelectAI}
        >
          <div className="absolute top-4 right-4">
            <Badge variant="secondary" className="bg-orange-500/10 text-orange-600 border-orange-500/20">
              Beta
            </Badge>
          </div>
          <CardHeader className="pb-4">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
              <Sparkles className="w-6 h-6 text-primary" />
            </div>
            <CardTitle className="text-xl">Automatic AI Import</CardTitle>
            <CardDescription className="text-base mt-2">
              Upload photos of your menu and let AI automatically extract items, prices, and categories
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-primary mt-0.5">•</span>
                <span>Upload menu photos</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-0.5">•</span>
                <span>AI extracts menu items automatically</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-0.5">•</span>
                <span>Review and edit as needed</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Manual Import Card */}
        <Card
          className={cn(
            'cursor-pointer transition-all hover:shadow-lg hover:border-primary/50',
            'group relative'
          )}
          onClick={onSelectManual}
        >
          <CardHeader className="pb-4">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
              <PenTool className="w-6 h-6 text-primary" />
            </div>
            <CardTitle className="text-xl">Manual Import</CardTitle>
            <CardDescription className="text-base mt-2">
              Build your menu from scratch with full control over every item and category
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-primary mt-0.5">•</span>
                <span>Create categories and items manually</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-0.5">•</span>
                <span>Full control over pricing and descriptions</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-0.5">•</span>
                <span>Add options, allergens, and more</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

