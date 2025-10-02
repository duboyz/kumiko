'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Plus, Eye, Edit, Save, Trash2, GripVertical } from 'lucide-react'
import {
  usePages,
  useAddSectionWithDefaults,
  useUpdateHeroSection,
  useUpdateTextSection,
  useUpdateRestaurantMenuSection,
  useDeleteSection,
  useRestaurantMenus,
  useReorderSections,
  HeroSectionType,
  TextAlignment,
} from '@shared'
import { LoadingState, ErrorState, EmptyState } from '@/components'
import { ContentContainer } from '@/components'
import { WebsitePage, HeroSection, TextSection, SectionSelectionModal } from '@/stories/websites'
import { RestaurantMenuSection } from '@/stories/menus/RestaurantMenuSection/RestaurantMenuSection'
import type { WebsiteSectionDto, HeroSectionDto, TextSectionDto, RestaurantMenuSectionDto } from '@shared'
import { FileText } from 'lucide-react'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragStartEvent,
  DragOverlay,
} from '@dnd-kit/core'
import { arrayMove, SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { toast } from 'sonner'

// Sortable Section Component
interface SortableSectionProps {
  section: WebsiteSectionDto
  isEditing: boolean
  sectionUpdates: Record<string, Partial<HeroSectionDto> | Partial<TextSectionDto> | Partial<RestaurantMenuSectionDto>>
  menusData: any
  onEdit: (sectionId: string) => void
  onUpdate: (sectionId: string, field: string, value: string | boolean) => void
  onTypeChange: (sectionId: string, newType: HeroSectionType) => void
}

function SortableSection({ section, isEditing, sectionUpdates, menusData, onEdit, onUpdate, onTypeChange }: SortableSectionProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: section.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group relative border-2 overflow-hidden bg-white transition-all duration-200 ${
        isEditing
          ? 'border-primary shadow-lg ring-2 ring-primary/20'
          : 'border-transparent hover:border-gray-200 shadow-sm hover:shadow-md'
      }`}
    >
      {/* Drag Handle */}
      {!isEditing && (
        <div
          {...attributes}
          {...listeners}
          className="absolute left-3 top-3 z-20 cursor-grab active:cursor-grabbing bg-white/95 backdrop-blur-sm border-2 border-gray-300 rounded-lg p-2 opacity-0 group-hover:opacity-100 transition-all hover:border-primary hover:bg-primary/5 shadow-md"
          title="Drag to reorder"
        >
          <GripVertical className="w-4 h-4 text-gray-600" />
        </div>
      )}

      {/* Edit overlay */}
      {!isEditing && (
        <div
          className="absolute inset-0 bg-gradient-to-b from-black/0 via-black/0 to-black/5 transition-all cursor-pointer z-10 flex items-center justify-center opacity-0 group-hover:opacity-100"
          onClick={() => onEdit(section.id)}
        >
          <div className="bg-white shadow-xl p-4 border-2 border-primary rounded-lg transform scale-95 group-hover:scale-100 transition-transform">
            <div className="flex items-center gap-2">
              <Edit className="w-5 h-5 text-primary" />
              <span className="text-sm font-medium text-primary">Click to edit</span>
            </div>
          </div>
        </div>
      )}

      {/* Editing indicator */}
      {isEditing && (
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-primary/80 to-primary animate-pulse" />
      )}

      {/* Section content */}
      {section.heroSection && (
        <HeroSection
          section={{
            ...section.heroSection,
            ...(sectionUpdates[section.id] as Partial<HeroSectionDto>),
          }}
          isEditing={isEditing}
          onUpdate={(field, value) => onUpdate(section.id, field, value)}
          onTypeChange={newType => onTypeChange(section.id, newType)}
        />
      )}

      {section.textSection && (
        <TextSection
          title={(sectionUpdates[section.id] as Partial<TextSectionDto>)?.title ?? section.textSection.title}
          text={(sectionUpdates[section.id] as Partial<TextSectionDto>)?.text ?? section.textSection.text}
          alignText={
            ((sectionUpdates[section.id] as Partial<TextSectionDto>)?.alignText as TextAlignment) ??
            section.textSection.alignText
          }
          textColor={(sectionUpdates[section.id] as Partial<TextSectionDto>)?.textColor ?? section.textSection.textColor}
          isEditing={isEditing}
          onUpdate={(field, value) => onUpdate(section.id, field, value)}
        />
      )}

      {section.restaurantMenuSection &&
        (() => {
          const menuSection = section.restaurantMenuSection
          const menuUpdates = sectionUpdates[section.id] as Partial<RestaurantMenuSectionDto>

          const currentMenuId = menuUpdates?.restaurantMenuId ?? menuSection.restaurantMenuId
          const currentAllowOrdering = menuUpdates?.allowOrdering ?? menuSection.allowOrdering

          const menu = menusData?.menus?.find((m: any) => m.id === currentMenuId)

          if (!menu) {
            return (
              <div className="py-12 px-4 text-center text-gray-500">
                <h3 className="text-lg font-semibold mb-2">Menu Not Found</h3>
                <p>The selected menu (ID: {currentMenuId}) could not be loaded.</p>
                {isEditing && <p className="mt-2 text-sm">Please select a different menu in the section settings.</p>}
              </div>
            )
          }

          return (
            <RestaurantMenuSection
              restaurantMenu={menu}
              allowOrdering={currentAllowOrdering}
              currentMenuId={currentMenuId}
              isEditing={isEditing}
              availableMenus={menusData?.menus || []}
              onUpdate={(field, value) => onUpdate(section.id, field, value)}
            />
          )
        })()}
    </div>
  )
}

interface PageEditorProps {
  websiteId: string
  pageId: string
  restaurantId: string | null
  onBack?: () => void
}

export function PageEditor({ websiteId, pageId, restaurantId, onBack }: PageEditorProps) {
  const [isAddSectionModalOpen, setIsAddSectionModalOpen] = useState(false)
  const [viewMode, setViewMode] = useState<'edit' | 'preview'>('edit')
  const [editingSectionId, setEditingSectionId] = useState<string | null>(null)
  const [activeDragId, setActiveDragId] = useState<string | null>(null)
  const [sectionUpdates, setSectionUpdates] = useState<
    Record<string, Partial<HeroSectionDto> | Partial<TextSectionDto> | Partial<RestaurantMenuSectionDto>>
  >({})

  const { data: pagesData, isLoading, error } = usePages(websiteId)

  const page = pagesData?.pages.find(p => p.id === pageId)

  const { data: menusData, isLoading: isLoadingMenus } = useRestaurantMenus(restaurantId || '')
  const firstMenuId = menusData?.menus && menusData.menus.length > 0 ? menusData.menus[0].id : undefined

  const {
    addHeroSection,
    addTextSection,
    addRestaurantMenuSection,
    isLoading: isAddingSection,
  } = useAddSectionWithDefaults(websiteId, pageId, firstMenuId)

  const updateHeroSection = useUpdateHeroSection(websiteId, () => {
    if (editingSectionId) {
      setEditingSectionId(null)
      setSectionUpdates(prev => {
        const { [editingSectionId]: _, ...rest } = prev
        return rest
      })
    }
  })

  const updateTextSection = useUpdateTextSection(websiteId, () => {
    if (editingSectionId) {
      setEditingSectionId(null)
      setSectionUpdates(prev => {
        const { [editingSectionId]: _, ...rest } = prev
        return rest
      })
    }
  })

  const updateRestaurantMenuSection = useUpdateRestaurantMenuSection(websiteId, () => {
    if (editingSectionId) {
      setEditingSectionId(null)
      setSectionUpdates(prev => {
        const { [editingSectionId]: _, ...rest } = prev
        return rest
      })
    }
  })

  const deleteSection = useDeleteSection(websiteId)
  const reorderSections = useReorderSections(websiteId)

  // Drag and drop sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const handleDragStart = (event: DragStartEvent) => {
    setActiveDragId(event.active.id as string)
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    setActiveDragId(null)

    if (!over || active.id === over.id || !page) {
      return
    }

    const oldIndex = page.sections.findIndex(s => s.id === active.id)
    const newIndex = page.sections.findIndex(s => s.id === over.id)

    if (oldIndex !== -1 && newIndex !== -1) {
      const reorderedSections = arrayMove([...page.sections].sort((a, b) => a.sortOrder - b.sortOrder), oldIndex, newIndex)

      const sectionOrders = reorderedSections.map((section, index) => ({
        sectionId: section.id,
        sortOrder: index,
      }))

      reorderSections.mutate(
        {
          websiteId,
          sectionOrders,
        },
        {
          onSuccess: () => {
            toast.success('Section reordered')
          },
          onError: () => {
            toast.error('Failed to reorder section')
          },
        }
      )
    }
  }

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault()
        if (editingSectionId) {
          handleSaveSection(editingSectionId)
          toast.success('Section saved')
        }
      }

      if (e.key === 'Escape' && editingSectionId) {
        setEditingSectionId(null)
        setSectionUpdates(prev => {
          const { [editingSectionId]: _, ...rest } = prev
          return rest
        })
        toast.info('Editing cancelled')
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [editingSectionId])

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
    } else if (section.textSection) {
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
    } else if (section.restaurantMenuSection) {
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
      deleteSection.mutate(sectionId, {
        onSuccess: () => {
          toast.success('Section deleted')
          setEditingSectionId(null)
          setSectionUpdates(prev => {
            const { [sectionId]: _, ...rest } = prev
            return rest
          })
        },
        onError: () => {
          toast.error('Failed to delete section')
        },
      })
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
          {onBack && (
            <Button variant="ghost" size="sm" onClick={onBack}>
              <ArrowLeft />
              Back
            </Button>
          )}
          <div>
            <h1 className="text-3xl font-light">{page.title}</h1>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {editingSectionId && (
            <>
              <div className="text-xs text-muted-foreground mr-2 hidden md:block">
                <kbd className="px-2 py-1 bg-muted rounded border text-xs">Ctrl+S</kbd> to save,{' '}
                <kbd className="px-2 py-1 bg-muted rounded border text-xs">Esc</kbd> to cancel
              </div>
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
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
              >
                <SortableContext
                  items={page.sections.map(s => s.id)}
                  strategy={verticalListSortingStrategy}
                >
                  <div className="space-y-6">
                    {page.sections
                      .sort((a, b) => a.sortOrder - b.sortOrder)
                      .map(section => (
                        <SortableSection
                          key={section.id}
                          section={section}
                          isEditing={editingSectionId === section.id}
                          sectionUpdates={sectionUpdates}
                          menusData={menusData}
                          onEdit={handleSectionEdit}
                          onUpdate={handleSectionUpdate}
                          onTypeChange={handleTypeChange}
                        />
                      ))}
                  </div>
                </SortableContext>
                <DragOverlay>
                  {activeDragId ? (
                    <div className="opacity-80 rotate-2 scale-105 transition-transform">
                      {(() => {
                        const section = page.sections.find(s => s.id === activeDragId)
                        if (!section) return null
                        return (
                          <div className="border-2 border-primary bg-white shadow-2xl overflow-hidden rounded-lg">
                            <div className="p-4 bg-primary/10 border-b border-primary/20">
                              <div className="flex items-center gap-2">
                                <GripVertical className="w-4 h-4 text-primary" />
                                <span className="text-sm font-medium text-primary">
                                  {section.heroSection && 'Hero Section'}
                                  {section.textSection && 'Text Section'}
                                  {section.restaurantMenuSection && 'Menu Section'}
                                </span>
                              </div>
                            </div>
                            <div className="p-4 text-sm text-muted-foreground">
                              Drag to reorder this section
                            </div>
                          </div>
                        )
                      })()}
                    </div>
                  ) : null}
                </DragOverlay>
              </DndContext>
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
