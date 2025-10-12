'use client'

import { useParams } from 'next/navigation'
import { useRestaurantMenus, useLocationSelection, useCreateMenuCategory, useReorderCategories } from '@shared'
import { LoadingSpinner } from '@/components'
import { ContentLoadingError } from '@/stories/shared/ContentLoadingError/ContentLoadingError'
import { ContentNotFound } from '@/stories/shared/ContentNotFound/ContentNotFound'
import { ContentContainer } from '@/components'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { useState, useEffect } from 'react'
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core'
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { toast } from 'sonner'
import { useTranslations } from 'next-intl'
import { AddCategoryForm, SortableCategory } from './components'

export default function MenuEditPage() {
  const t = useTranslations('menus')
  const params = useParams()
  const { selectedLocation } = useLocationSelection()

  const menuId = params.id as string
  const restaurantId = selectedLocation?.type === 'Restaurant' ? selectedLocation.id : null

  const { data: menusData, isLoading, error } = useRestaurantMenus(restaurantId || '')

  const menu = menusData?.menus?.find(m => m.id === menuId)

  const [showAddCategoryForm, setShowAddCategoryForm] = useState(false)
  const createCategoryMutation = useCreateMenuCategory()
  const reorderCategoriesMutation = useReorderCategories()

  const [categories, setCategories] = useState(menu?.categories || [])

  useEffect(() => {
    if (menu?.categories) {
      setCategories(menu.categories)
    }
  }, [menu?.categories])

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

  const handleAddCategory = () => {
    setShowAddCategoryForm(true)
  }

  const handleCancelAddCategory = () => {
    setShowAddCategoryForm(false)
  }

  const handleCreateCategory = (data: { name: string; description: string }) => {
    if (!data.name.trim()) {
      toast.error(t('nameRequired'))
      return
    }

    createCategoryMutation.mutate(
      {
        name: data.name,
        description: data.description,
        orderIndex: 0,
        restaurantMenuId: menu?.id || '',
      },
      {
        onSuccess: () => {
          toast.success(t('categoryCreated'))
          setShowAddCategoryForm(false)
        },
        onError: (error) => {
          console.error('Create category error:', error)
          toast.error(t('failedToCreateCategory'))
        },
      }
    )
  }

  const handleCategoryDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (!over || active.id === over.id) {
      return
    }

    const oldIndex = categories.findIndex(cat => cat.id === active.id)
    const newIndex = categories.findIndex(cat => cat.id === over.id)

    if (oldIndex === -1 || newIndex === -1) {
      return
    }

    const newCategories = arrayMove(categories, oldIndex, newIndex)
    setCategories(newCategories)

    const categoryIds = newCategories.map(cat => cat.id)
    reorderCategoriesMutation.mutate(categoryIds, {
      onError: () => {
        setCategories(categories)
        toast.error('Failed to reorder categories')
      },
      onSuccess: () => {
        toast.success('Categories reordered successfully')
      },
    })
  }

  if (isLoading) return <LoadingSpinner />
  if (error)
    return (
      <ContentLoadingError
        message={error.message}
        title="Error Loading Menu"
        backToText="Back to Menus"
        backToLink="/menus"
      />
    )
  if (!menu)
    return (
      <ContentNotFound
        message="The menu you're looking for doesn't exist or you don't have access to it."
        title="Menu Not Found"
        backToText="Back to Menus"
        backToLink="/menus"
      />
    )

  return (
    <ContentContainer className="bg-white">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold">{menu.name}</h1>
            {menu.description && (
              <p className="text-gray-600 mt-2">{menu.description}</p>
            )}
          </div>
          <Button
            onClick={handleAddCategory}
            disabled={showAddCategoryForm}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Category
          </Button>
        </div>

        {showAddCategoryForm && (
          <AddCategoryForm
            onSubmit={handleCreateCategory}
            onCancel={handleCancelAddCategory}
            isSubmitting={createCategoryMutation.isPending}
          />
        )}
      </div>

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleCategoryDragEnd}>
        <div className="space-y-6 min-h-[200px]">
          <SortableContext items={categories.map(cat => cat.id)} strategy={verticalListSortingStrategy}>
            {categories.map(category => (
              <SortableCategory key={category.id} menuCategory={category} />
            ))}
          </SortableContext>
        </div>
      </DndContext>
    </ContentContainer>
  )
}
