'use client'

import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Plus, Eye, Edit, Save, Trash2 } from 'lucide-react'
import { usePages, useAddSectionWithDefaults, useUpdateHeroSection, useUpdateTextSection, useUpdateRestaurantMenuSection, useDeleteSection, useRestaurantMenus, useLocationSelection, HeroSectionType, TextAlignment } from '@shared'
import { LoadingSpinner } from '@/components'
import { ErrorMessage } from '@/components/ErrorMessage'
import { ContentContainer } from '@/components/ContentContainer'
import { WebsitePage, HeroSection, TextSection, SectionSelectionModal } from '@/components/sections'
import { RestaurantMenuSection } from '@/stories/WebsiteSections/RestaurantMenuSection/RestaurantMenuSection'
import type { WebsiteSectionDto, HeroSectionDto, TextSectionDto, RestaurantMenuSectionDto } from '@shared'

export default function PageEditorPage() {
  const params = useParams()
  const router = useRouter()
  const websiteId = params.websiteId as string
  const pageId = params.pageId as string

  const [isAddSectionModalOpen, setIsAddSectionModalOpen] = useState(false)
  const [viewMode, setViewMode] = useState<'edit' | 'preview'>('edit')
  const [editingSectionId, setEditingSectionId] = useState<string | null>(null)
  const [sectionUpdates, setSectionUpdates] = useState<Record<string, Partial<HeroSectionDto> | Partial<TextSectionDto> | Partial<RestaurantMenuSectionDto>>>({})

  const { data: pagesData, isLoading, error } = usePages(websiteId)

  const page = pagesData?.pages.find(p => p.id === pageId)

  // Get the selected location and its menus (if it's a restaurant)
  const { selectedLocation } = useLocationSelection()
  const restaurantId = selectedLocation?.type === 'Restaurant' ? selectedLocation.id : null
  const { data: menusData, isLoading: isLoadingMenus } = useRestaurantMenus(restaurantId || '')
  const firstMenuId = menusData?.menus && menusData.menus.length > 0 ? menusData.menus[0].id : undefined


  const { addHeroSection, addTextSection, addRestaurantMenuSection, isLoading: isAddingSection } = useAddSectionWithDefaults(websiteId, pageId, firstMenuId)

  const updateHeroSection = useUpdateHeroSection(websiteId, () => {
    // Clear editing state after successful save
    if (editingSectionId) {
      setEditingSectionId(null)
      setSectionUpdates(prev => {
        const { [editingSectionId]: _, ...rest } = prev
        return rest
      })
    }
  })

  const updateTextSection = useUpdateTextSection(websiteId, () => {
    // Clear editing state after successful save
    if (editingSectionId) {
      setEditingSectionId(null)
      setSectionUpdates(prev => {
        const { [editingSectionId]: _, ...rest } = prev
        return rest
      })
    }
  })

  const updateRestaurantMenuSection = useUpdateRestaurantMenuSection(websiteId, () => {
    // Clear editing state after successful save
    if (editingSectionId) {
      setEditingSectionId(null)
      setSectionUpdates(prev => {
        const { [editingSectionId]: _, ...rest } = prev
        return rest
      })
    }
  })

  const deleteSection = useDeleteSection(websiteId)

  const handleAddSection = (sectionType: string) => {
    if (page) {
      const nextSortOrder = Math.max(...page.sections.map(s => s.sortOrder), 0) + 1
      if (sectionType === 'hero') {
        addHeroSection(nextSortOrder)
      } else if (sectionType === 'text') {
        addTextSection(nextSortOrder)
      } else if (sectionType === 'restaurant-menu') {
        if (!firstMenuId) {
          alert('No menus available. Please create a menu first before adding a menu section.')
          return
        }
        addRestaurantMenuSection(nextSortOrder, firstMenuId)
      }
    }
  }

  const handleSectionEdit = (sectionId: string) => {
    setEditingSectionId(sectionId)
    setViewMode('edit')
  }

  const handleSectionUpdate = (sectionId: string, field: string, value: string | boolean) => {
    setSectionUpdates(prev => ({
      ...prev,
      [sectionId]: {
        ...prev[sectionId],
        [field]: value
      }
    }));
  }

  const handleTypeChange = (sectionId: string, newType: HeroSectionType) => {
    setSectionUpdates(prev => ({
      ...prev,
      [sectionId]: {
        ...prev[sectionId],
        type: newType
      }
    }))
  }

  const handleSaveSection = (sectionId: string) => {
    const section = page?.sections.find(s => s.id === sectionId)
    const updates = sectionUpdates[sectionId]

    if (!section || !updates) {
      console.error('Section not found or no updates')
      return
    }

    // Handle Hero Section
    if (section.heroSection) {
      const heroUpdates = updates as Partial<HeroSectionDto>
      const updateCommand = {
        title: heroUpdates.title ?? section.heroSection.title,
        description: heroUpdates.description ?? section.heroSection.description,
        imageUrl: heroUpdates.imageUrl ?? section.heroSection.imageUrl,
        imageAlt: heroUpdates.imageAlt ?? section.heroSection.imageAlt,
        backgroundColor: heroUpdates.backgroundColor ?? section.heroSection.backgroundColor,
        textColor: heroUpdates.textColor ?? section.heroSection.textColor,
        backgroundOverlayColor: heroUpdates.backgroundOverlayColor ?? section.heroSection.backgroundOverlayColor,
        backgroundImageUrl: heroUpdates.backgroundImageUrl ?? section.heroSection.backgroundImageUrl,
        buttonText: heroUpdates.buttonText ?? section.heroSection.buttonText,
        buttonUrl: heroUpdates.buttonUrl ?? section.heroSection.buttonUrl,
        buttonTextColor: heroUpdates.buttonTextColor ?? section.heroSection.buttonTextColor,
        buttonBackgroundColor: heroUpdates.buttonBackgroundColor ?? section.heroSection.buttonBackgroundColor,
        type: (heroUpdates.type as string) ?? section.heroSection.type,
      }

      updateHeroSection.mutate({
        heroSectionId: section.heroSection.id,
        updates: updateCommand
      })
    }
    // Handle Text Section
    else if (section.textSection) {
      const textUpdates = updates as Partial<TextSectionDto>
      const updateCommand = {
        title: textUpdates.title ?? section.textSection.title,
        text: textUpdates.text ?? section.textSection.text,
        alignText: (textUpdates.alignText as TextAlignment) ?? section.textSection.alignText,
        textColor: textUpdates.textColor ?? section.textSection.textColor,
      }

      updateTextSection.mutate({
        textSectionId: section.textSection.id,
        updates: updateCommand
      })
    }
    // Handle Restaurant Menu Section
    else if (section.restaurantMenuSection) {
      const menuUpdates = updates as Partial<RestaurantMenuSectionDto>
      const updateCommand = {
        restaurantMenuSectionId: section.restaurantMenuSection.id,
        restaurantMenuId: menuUpdates.restaurantMenuId ?? section.restaurantMenuSection.restaurantMenuId,
        allowOrdering: menuUpdates.allowOrdering ?? section.restaurantMenuSection.allowOrdering,
      }

      updateRestaurantMenuSection.mutate({
        restaurantMenuSectionId: section.restaurantMenuSection.id,
        updates: updateCommand
      })
    }
  }

  const handleDeleteSection = (sectionId: string) => {
    if (confirm('Are you sure you want to delete this section? This action cannot be undone.')) {
      deleteSection.mutate(sectionId)
    }
  }

  if (isLoading) return <LoadingSpinner />
  if (error) return <ErrorMessage message={error instanceof Error ? error.message : 'An error occurred'} />
  if (!page) return <ErrorMessage message="Page not found" />

  return (
    <ContentContainer>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push(`/websites/${websiteId}/pages`)}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Pages
          </Button>
          <div>
            <h1 className="text-2xl font-semibold">{page.title}</h1>
            <p className="text-gray-500 text-sm">Edit your page content</p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {editingSectionId && (
            <>
              <Button
                onClick={() => handleDeleteSection(editingSectionId)}
                disabled={deleteSection.isPending}
                variant="destructive"
                size="sm"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                {deleteSection.isPending ? 'Deleting...' : 'Delete'}
              </Button>
              <Button
                onClick={() => handleSaveSection(editingSectionId)}
                disabled={updateHeroSection.isPending || updateTextSection.isPending || updateRestaurantMenuSection.isPending}
                className="bg-green-600 hover:bg-green-700"
              >
                <Save className="w-4 h-4 mr-2" />
                {(updateHeroSection.isPending || updateTextSection.isPending || updateRestaurantMenuSection.isPending) ? 'Saving...' : 'Save Changes'}
              </Button>
            </>
          )}

          <div className="flex items-center border rounded-lg p-1">
            <Button
              variant={viewMode === 'edit' ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('edit')}
            >
              <Edit className="w-4 h-4 mr-2" />
              Edit
            </Button>
            <Button
              variant={viewMode === 'preview' ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('preview')}
            >
              <Eye className="w-4 h-4 mr-2" />
              Preview
            </Button>
          </div>

          <Button
            onClick={() => setIsAddSectionModalOpen(true)}
            disabled={isAddingSection}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Section
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="space-y-6">
        {viewMode === 'preview' ? (
          <div className="border rounded-lg overflow-hidden bg-white">
            <WebsitePage page={page} availableMenus={menusData?.menus || []} />
          </div>
        ) : (
          <div className="space-y-4">
            {page.sections.length === 0 ? (
              <div className="text-center py-16 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
                <div className="space-y-4">
                  <div className="w-16 h-16 mx-auto bg-gray-200 rounded-full flex items-center justify-center">
                    <Plus className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-600">No sections yet</h3>
                  <p className="text-gray-500 max-w-sm mx-auto">
                    Start building your page by adding sections with different types of content.
                  </p>
                  <Button
                    onClick={() => setIsAddSectionModalOpen(true)}
                    className="mt-4"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Your First Section
                  </Button>
                </div>
              </div>
            ) : (
              page.sections
                .sort((a, b) => a.sortOrder - b.sortOrder)
                .map((section) => (
                  <div
                    key={section.id}
                    className="group relative border rounded-lg overflow-hidden bg-white"
                    onClick={() => handleSectionEdit(section.id)}
                  >
                    {/* Edit overlay */}
                    {editingSectionId !== section.id && (
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all cursor-pointer z-10 flex items-center justify-center opacity-0 group-hover:opacity-100">
                        <div className="bg-white shadow-lg rounded-lg p-3">
                          <Edit className="w-5 h-5 text-gray-600" />
                        </div>
                      </div>
                    )}

                    {/* Section content */}
                    {section.heroSection && (
                      <HeroSection
                        title={(sectionUpdates[section.id] as Partial<HeroSectionDto>)?.title ?? section.heroSection.title}
                        description={(sectionUpdates[section.id] as Partial<HeroSectionDto>)?.description ?? section.heroSection.description}
                        imageUrl={(sectionUpdates[section.id] as Partial<HeroSectionDto>)?.imageUrl ?? section.heroSection.imageUrl}
                        imageAlt={(sectionUpdates[section.id] as Partial<HeroSectionDto>)?.imageAlt ?? section.heroSection.imageAlt}
                        backgroundColor={(sectionUpdates[section.id] as Partial<HeroSectionDto>)?.backgroundColor ?? section.heroSection.backgroundColor}
                        textColor={(sectionUpdates[section.id] as Partial<HeroSectionDto>)?.textColor ?? section.heroSection.textColor}
                        backgroundOverlayColor={(sectionUpdates[section.id] as Partial<HeroSectionDto>)?.backgroundOverlayColor ?? section.heroSection.backgroundOverlayColor}
                        backgroundImageUrl={(sectionUpdates[section.id] as Partial<HeroSectionDto>)?.backgroundImageUrl ?? section.heroSection.backgroundImageUrl}
                        buttonText={(sectionUpdates[section.id] as Partial<HeroSectionDto>)?.buttonText ?? section.heroSection.buttonText}
                        buttonUrl={(sectionUpdates[section.id] as Partial<HeroSectionDto>)?.buttonUrl ?? section.heroSection.buttonUrl}
                        buttonTextColor={(sectionUpdates[section.id] as Partial<HeroSectionDto>)?.buttonTextColor ?? section.heroSection.buttonTextColor}
                        buttonBackgroundColor={(sectionUpdates[section.id] as Partial<HeroSectionDto>)?.buttonBackgroundColor ?? section.heroSection.buttonBackgroundColor}
                        type={(sectionUpdates[section.id] as Partial<HeroSectionDto>)?.type as HeroSectionType ?? section.heroSection.type}
                        isEditing={editingSectionId === section.id}
                        onUpdate={(field, value) => handleSectionUpdate(section.id, field, value)}
                        onTypeChange={(newType) => handleTypeChange(section.id, newType)}
                      />
                    )}

                    {section.textSection && (
                      <TextSection
                        title={(sectionUpdates[section.id] as Partial<TextSectionDto>)?.title ?? section.textSection.title}
                        text={(sectionUpdates[section.id] as Partial<TextSectionDto>)?.text ?? section.textSection.text}
                        alignText={(sectionUpdates[section.id] as Partial<TextSectionDto>)?.alignText as TextAlignment ?? section.textSection.alignText}
                        textColor={(sectionUpdates[section.id] as Partial<TextSectionDto>)?.textColor ?? section.textSection.textColor}
                        isEditing={editingSectionId === section.id}
                        onUpdate={(field, value) => handleSectionUpdate(section.id, field, value)}
                      />
                    )}

                    {section.restaurantMenuSection && (() => {
                      const menuSection = section.restaurantMenuSection;
                      const menuUpdates = sectionUpdates[section.id] as Partial<RestaurantMenuSectionDto>;

                      // Use updated values if they exist, otherwise use original values
                      const currentMenuId = menuUpdates?.restaurantMenuId ?? menuSection.restaurantMenuId;
                      const currentAllowOrdering = menuUpdates?.allowOrdering ?? menuSection.allowOrdering;

                      const menu = menusData?.menus?.find(m => m.id === currentMenuId);

                      if (!menu) {
                        return (
                          <div className="py-12 px-4 text-center text-gray-500">
                            <h3 className="text-lg font-semibold mb-2">Menu Not Found</h3>
                            <p>The selected menu (ID: {currentMenuId}) could not be loaded.</p>
                            {editingSectionId === section.id && (
                              <p className="mt-2 text-sm">Please select a different menu in the section settings.</p>
                            )}
                          </div>
                        );
                      }

                      return (
                        <RestaurantMenuSection
                          restaurantMenu={menu}
                          allowOrdering={currentAllowOrdering}
                          currentMenuId={currentMenuId}
                          isEditing={editingSectionId === section.id}
                          availableMenus={menusData?.menus || []}
                          onUpdate={(field, value) => handleSectionUpdate(section.id, field, value)}
                        />
                      );
                    })()}
                  </div>
                ))
            )}
          </div>
        )}
      </div>

      {/* Section Selection Modal */}
      <SectionSelectionModal
        open={isAddSectionModalOpen}
        onOpenChange={setIsAddSectionModalOpen}
        onSelectSection={handleAddSection}
        hasMenusAvailable={!!firstMenuId}
        isLoadingMenus={isLoadingMenus}
      />
    </ContentContainer>
  )
}