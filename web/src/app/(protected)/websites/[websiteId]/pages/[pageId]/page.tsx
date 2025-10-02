'use client'

import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Plus, Eye, Edit, Save, Trash2 } from 'lucide-react'
import {
  usePages,
  useAddSectionWithDefaults,
  useUpdateHeroSection,
  useUpdateTextSection,
  useUpdateRestaurantMenuSection,
  useDeleteSection,
  useRestaurantMenus,
  useLocationSelection,
  HeroSectionType,
  TextAlignment,
} from '@shared'
import { LoadingState, ErrorState, EmptyState } from '@/components'
import { ContentContainer } from '@/stories/shared/ContentContainer/ContentContainer'
import { WebsitePage, HeroSection, TextSection, SectionSelectionModal } from '@/components/sections'
import { RestaurantMenuSection } from '@/stories/features/RestaurantMenuSection/RestaurantMenuSection'
import type { WebsiteSectionDto, HeroSectionDto, TextSectionDto, RestaurantMenuSectionDto } from '@shared'
import { FileText } from 'lucide-react'

export default function PageEditorPage() {
  const params = useParams()
  const router = useRouter()
  const websiteId = params.websiteId as string
  const pageId = params.pageId as string

  const [isAddSectionModalOpen, setIsAddSectionModalOpen] = useState(false)
  const [viewMode, setViewMode] = useState<'edit' | 'preview'>('edit')
  const [editingSectionId, setEditingSectionId] = useState<string | null>(null)
  const [sectionUpdates, setSectionUpdates] = useState<
    Record<string, Partial<HeroSectionDto> | Partial<TextSectionDto> | Partial<RestaurantMenuSectionDto>>
  >({})

  const { data: pagesData, isLoading, error } = usePages(websiteId)

  const page = pagesData?.pages.find(p => p.id === pageId)

  // Get the selected location and its menus (if it's a restaurant)
  const { selectedLocation } = useLocationSelection()
  const restaurantId = selectedLocation?.type === 'Restaurant' ? selectedLocation.id : null
  const { data: menusData, isLoading: isLoadingMenus } = useRestaurantMenus(restaurantId || '')
  const firstMenuId = menusData?.menus && menusData.menus.length > 0 ? menusData.menus[0].id : undefined

  const {
    addHeroSection,
    addTextSection,
    addRestaurantMenuSection,
    isLoading: isAddingSection,
  } = useAddSectionWithDefaults(websiteId, pageId, firstMenuId)

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
        [field]: value,
      },
    }))
  }

  const handleTypeChange = (sectionId: string, newType: HeroSectionType) => {
    setSectionUpdates(prev => ({
      ...prev,
      [sectionId]: {
        ...prev[sectionId],
        type: newType,
      },
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
        updates: updateCommand,
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
        updates: updateCommand,
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
        updates: updateCommand,
      })
    }
  }

  const handleDeleteSection = (sectionId: string) => {
    if (confirm('Are you sure you want to delete this section? This action cannot be undone.')) {
      deleteSection.mutate(sectionId)
    }
  }

  if (isLoading) return <LoadingState variant="page" />
  if (error) return <ErrorState message={error instanceof Error ? error.message : 'An error occurred'} />
  if (!page) return <ErrorState message="Page not found" />

  return (
    <ContentContainer className="bg-white">
      {/* Header */}
      <div className="flex items-center justify-between pb-8 border-b">
        <div className="flex items-center gap-6">
          <Button variant="ghost" size="sm" onClick={() => router.push(`/websites/${websiteId}/pages`)}>
            <ArrowLeft />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-light">{page.title}</h1>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {editingSectionId && (
            <>
              <Button
                onClick={() => handleDeleteSection(editingSectionId)}
                disabled={deleteSection.isPending}
                variant="destructive"
                size="sm"
              >
                <Trash2 />
                {deleteSection.isPending ? 'Deleting...' : 'Delete'}
              </Button>
              <Button
                onClick={() => handleSaveSection(editingSectionId)}
                disabled={
                  updateHeroSection.isPending || updateTextSection.isPending || updateRestaurantMenuSection.isPending
                }
                variant="default"
              >
                <Save />
                {updateHeroSection.isPending || updateTextSection.isPending || updateRestaurantMenuSection.isPending
                  ? 'Saving...'
                  : 'Save'}
              </Button>
            </>
          )}

          <div className="flex items-center border bg-white">
            <Button variant={viewMode === 'edit' ? 'secondary' : 'ghost'} size="sm" onClick={() => setViewMode('edit')}>
              <Edit />
              Edit
            </Button>
            <Button
              variant={viewMode === 'preview' ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('preview')}
            >
              <Eye />
              Preview
            </Button>
          </div>

          <Button onClick={() => setIsAddSectionModalOpen(true)} disabled={isAddingSection} variant="default">
            <Plus />
            Add Section
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="space-y-8">
        {viewMode === 'preview' ? (
          <div className="border overflow-hidden bg-white shadow-sm">
            <WebsitePage page={page} availableMenus={menusData?.menus || []} />
          </div>
        ) : (
          <div className="space-y-6">
            {page.sections.length === 0 ? (
              <div className="text-center py-20 bg-white border-2 border-dashed">
                <EmptyState
                  icon={FileText}
                  title="No sections yet"
                  description="Start building your page by adding sections with different types of content."
                  action={{
                    label: 'Add Your First Section',
                    onClick: () => setIsAddSectionModalOpen(true),
                  }}
                />
              </div>
            ) : (
              page.sections
                .sort((a, b) => a.sortOrder - b.sortOrder)
                .map(section => (
                  <div
                    key={section.id}
                    className="group relative border overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow"
                    onClick={() => handleSectionEdit(section.id)}
                  >
                    {/* Edit overlay */}
                    {editingSectionId !== section.id && (
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-all cursor-pointer z-10 flex items-center justify-center opacity-0 group-hover:opacity-100">
                        <div className="bg-white shadow-lg p-4 border">
                          <Edit className="w-5 h-5 text-muted-foreground" />
                        </div>
                      </div>
                    )}

                    {/* Section content */}
                    {section.heroSection && (
                      <HeroSection
                        section={section.heroSection}
                        isEditing={editingSectionId === section.id}
                        onUpdate={(field, value) => handleSectionUpdate(section.id, field, value)}
                        onTypeChange={newType => handleTypeChange(section.id, newType)}
                      />
                    )}

                    {section.textSection && (
                      <TextSection
                        title={
                          (sectionUpdates[section.id] as Partial<TextSectionDto>)?.title ?? section.textSection.title
                        }
                        text={(sectionUpdates[section.id] as Partial<TextSectionDto>)?.text ?? section.textSection.text}
                        alignText={
                          ((sectionUpdates[section.id] as Partial<TextSectionDto>)?.alignText as TextAlignment) ??
                          section.textSection.alignText
                        }
                        textColor={
                          (sectionUpdates[section.id] as Partial<TextSectionDto>)?.textColor ??
                          section.textSection.textColor
                        }
                        isEditing={editingSectionId === section.id}
                        onUpdate={(field, value) => handleSectionUpdate(section.id, field, value)}
                      />
                    )}

                    {section.restaurantMenuSection &&
                      (() => {
                        const menuSection = section.restaurantMenuSection
                        const menuUpdates = sectionUpdates[section.id] as Partial<RestaurantMenuSectionDto>

                        // Use updated values if they exist, otherwise use original values
                        const currentMenuId = menuUpdates?.restaurantMenuId ?? menuSection.restaurantMenuId
                        const currentAllowOrdering = menuUpdates?.allowOrdering ?? menuSection.allowOrdering

                        const menu = menusData?.menus?.find(m => m.id === currentMenuId)

                        if (!menu) {
                          return (
                            <div className="py-12 px-4 text-center text-gray-500">
                              <h3 className="text-lg font-semibold mb-2">Menu Not Found</h3>
                              <p>The selected menu (ID: {currentMenuId}) could not be loaded.</p>
                              {editingSectionId === section.id && (
                                <p className="mt-2 text-sm">Please select a different menu in the section settings.</p>
                              )}
                            </div>
                          )
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
                        )
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
