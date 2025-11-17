'use client'

import { useEffect, useState } from 'react'
import { MenuCategoryDto, RestaurantMenuDto } from '@shared'
import { MenuEditor } from '@/app/(protected)/menus/[id]/components/MenuEditor'
import { CategoriesSidebar } from '@/app/(protected)/menus/[id]/components/CategoriesSidebar'
import { Menu } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'

interface MenuBuilderProps {
  menu: RestaurantMenuDto
  onUnsavedChangesChange?: (hasChanges: boolean) => void
  onSaveAllHandlerReady?: (saveAllHandler: () => void) => void
  className?: string
}

export function MenuBuilder({ menu, onUnsavedChangesChange, onSaveAllHandlerReady, className = '' }: MenuBuilderProps) {
  const categories = menu.categories || []
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(categories[0]?.id ?? null)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  // Keep the selected category in sync with the latest data
  const selectedCategory = categories.find(cat => cat.id === selectedCategoryId) || null

  useEffect(() => {
    if (categories.length > 0 && !selectedCategoryId) {
      setSelectedCategoryId(categories[0].id)
    }
  }, [categories, selectedCategoryId])

  const handleCategorySelect = (cat: MenuCategoryDto | null) => {
    setSelectedCategoryId(cat?.id ?? null)
    setIsMobileMenuOpen(false) // Close mobile menu when category is selected
  }

  return (
    <div className={`flex flex-col ${className}`}>
      {/* Mobile Menu Button */}
      <div className="md:hidden border-b p-4 flex items-center justify-between bg-background">
        <h3 className="font-semibold">{menu.name}</h3>
        <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-80 p-0">
            <div className="flex flex-col h-full">
              <div className="p-4 border-b">
                <h2 className="text-lg font-semibold">Categories</h2>
              </div>
              <div className="flex-1 overflow-y-auto p-4">
                <CategoriesSidebar
                  categories={categories}
                  selectedCategory={selectedCategory}
                  setSelectedCategory={handleCategorySelect}
                  restaurantMenuId={menu.id}
                />
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Desktop Sidebar */}
        <div className="hidden md:flex w-64 border-r bg-white flex-col">
          <div className="p-4 border-b">
            <h2 className="text-lg font-semibold">Categories</h2>
          </div>
          <div className="flex-1 overflow-y-auto p-4">
            <CategoriesSidebar
              categories={categories}
              selectedCategory={selectedCategory}
              setSelectedCategory={handleCategorySelect}
              restaurantMenuId={menu.id}
            />
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 bg-background">
          <MenuEditor
            selectedCategory={selectedCategory}
            onUnsavedChangesChange={onUnsavedChangesChange}
            onSaveAllHandlerReady={onSaveAllHandlerReady}
          />
        </div>
      </div>
    </div>
  )
}
