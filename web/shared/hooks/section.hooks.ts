import { useMutation, useQueryClient } from '@tanstack/react-query'
import { sectionApi } from '../api'
import type {
  CreateHeroSectionCommand,
  UpdateHeroSectionCommand,
  CreateTextSectionCommand,
  UpdateTextSectionCommand,
  CreateRestaurantMenuSectionCommand,
  UpdateRestaurantMenuSectionCommand,
  CreateTextAndImageSectionCommand,
  UpdateTextAndImageSectionCommand,
  ReorderSectionsCommand,
} from '../types'
import { HeroSectionType } from '../types/website.types'
import { TextAlignment } from '../types'

export const useCreateHeroSection = (websiteId: string) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (command: CreateHeroSectionCommand) => sectionApi.createHeroSection(command),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['pages', websiteId],
      })
    },
  })
}

export const useUpdateHeroSection = (websiteId: string, onSuccess?: () => void) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ heroSectionId, updates }: { heroSectionId: string; updates: UpdateHeroSectionCommand }) =>
      sectionApi.updateHeroSection(heroSectionId, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['pages', websiteId],
      })
      onSuccess?.()
    },
    onError: error => {
      console.error('Failed to save section:', error)
    },
  })
}

// Text Section hooks
export const useCreateTextSection = (websiteId: string) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (command: CreateTextSectionCommand) => sectionApi.createTextSection(command),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['pages', websiteId],
      })
    },
  })
}

export const useUpdateTextSection = (websiteId: string, onSuccess?: () => void) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ textSectionId, updates }: { textSectionId: string; updates: UpdateTextSectionCommand }) =>
      sectionApi.updateTextSection(textSectionId, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['pages', websiteId],
      })
      onSuccess?.()
    },
    onError: error => {
      console.error('Failed to save text section:', error)
    },
  })
}

// Restaurant Menu Section hooks
export const useCreateRestaurantMenuSection = (websiteId: string) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (command: CreateRestaurantMenuSectionCommand) => sectionApi.createRestaurantMenuSection(command),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['pages', websiteId],
      })
    },
  })
}

export const useUpdateRestaurantMenuSection = (websiteId: string, onSuccess?: () => void) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      restaurantMenuSectionId,
      updates,
    }: {
      restaurantMenuSectionId: string
      updates: UpdateRestaurantMenuSectionCommand
    }) => sectionApi.updateRestaurantMenuSection(restaurantMenuSectionId, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['pages', websiteId],
      })
      onSuccess?.()
    },
    onError: error => {
      console.error('Failed to save restaurant menu section:', error)
    },
  })
}

// Text and Image Section hooks
export const useCreateTextAndImageSection = (websiteId: string) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (command: CreateTextAndImageSectionCommand) => sectionApi.createTextAndImageSection(command),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['pages', websiteId],
      })
    },
  })
}

export const useUpdateTextAndImageSection = (websiteId: string, onSuccess?: () => void) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      textAndImageSectionId,
      updates,
    }: {
      textAndImageSectionId: string
      updates: UpdateTextAndImageSectionCommand
    }) => sectionApi.updateTextAndImageSection(textAndImageSectionId, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['pages', websiteId],
      })
      onSuccess?.()
    },
    onError: error => {
      console.error('Failed to save text and image section:', error)
    },
  })
}

export const useAddSectionWithDefaults = (websiteId: string, pageId: string, defaultMenuId?: string) => {
  const createHeroSection = useCreateHeroSection(websiteId)
  const createTextSection = useCreateTextSection(websiteId)
  const createRestaurantMenuSection = useCreateRestaurantMenuSection(websiteId)
  const createTextAndImageSection = useCreateTextAndImageSection(websiteId)

  const addHeroSection = (sortOrder: number) => {
    const defaultHeroSection: CreateHeroSectionCommand = {
      websitePageId: pageId,
      sortOrder,
      title: 'Your Awesome Title',
      description:
        "Add a compelling description that captures your audience's attention and clearly explains what you offer.",
      imageUrl: 'https://images.pexels.com/photos/2014773/pexels-photo-2014773.jpeg',
      backgroundImageUrl: 'https://images.pexels.com/photos/2014773/pexels-photo-2014773.jpeg',
      backgroundOverlayColor: 'rgba(0, 0, 0, 0.5)',
      imageAlt: 'Your Awesome Image',
      type: HeroSectionType.ImageRight,
      backgroundColor: '#ffffff',
      textColor: '#1f2937',
      buttonText: 'Get Started',
      buttonBackgroundColor: '#3b82f6',
      buttonTextColor: '#ffffff',
    }

    createHeroSection.mutate(defaultHeroSection)
  }

  const addTextSection = (sortOrder: number) => {
    const defaultTextSection: CreateTextSectionCommand = {
      websitePageId: pageId,
      sortOrder,
      title: 'Your Section Title',
      text: 'Add your text content here. This section supports rich text formatting and different alignments.',
      alignText: TextAlignment.Left,
      textColor: '#1f2937',
    }

    createTextSection.mutate(defaultTextSection)
  }

  const addRestaurantMenuSection = (sortOrder: number, menuId?: string) => {
    if (!menuId && !defaultMenuId) {
      console.error('No menu ID provided for restaurant menu section')
      return
    }

    const defaultRestaurantMenuSection: CreateRestaurantMenuSectionCommand = {
      websitePageId: pageId,
      sortOrder,
      restaurantMenuId: menuId || defaultMenuId!,
      allowOrdering: true,
    }

    createRestaurantMenuSection.mutate(defaultRestaurantMenuSection)
  }

  const addTextAndImageSection = (sortOrder: number) => {
    const defaultTextAndImageSection: CreateTextAndImageSectionCommand = {
      websitePageId: pageId,
      sortOrder,
      title: 'Your Section Title',
      content: 'Add compelling content that describes your product or service. This section allows you to combine text with a beautiful image.',
      buttonText: 'Learn More',
      buttonUrl: '#',
      imageUrl: 'https://images.pexels.com/photos/2014773/pexels-photo-2014773.jpeg',
      imageAlt: 'Section image',
      textColor: '#1f2937',
      buttonColor: '#3b82f6',
      buttonTextColor: '#ffffff',
      alignment: TextAlignment.Left,
      imageOnLeft: false,
    }

    createTextAndImageSection.mutate(defaultTextAndImageSection)
  }

  return {
    addHeroSection,
    addTextSection,
    addRestaurantMenuSection,
    addTextAndImageSection,
    isLoading: createHeroSection.isPending || createTextSection.isPending || createRestaurantMenuSection.isPending || createTextAndImageSection.isPending,
  }
}

// Delete Section hook
export const useDeleteSection = (websiteId: string, onSuccess?: () => void) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (sectionId: string) => sectionApi.deleteSection(sectionId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['pages', websiteId],
      })
      onSuccess?.()
    },
    onError: error => {
      console.error('Failed to delete section:', error)
    },
  })
}

// Reorder Sections hook with optimistic updates
export const useReorderSections = (websiteId: string) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (command: ReorderSectionsCommand) => sectionApi.reorderSections(command),
    onMutate: async (command) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['pages', websiteId] })

      // Snapshot previous value
      const previousPages = queryClient.getQueryData(['pages', websiteId])

      // Optimistically update
      queryClient.setQueryData(['pages', websiteId], (old: any) => {
        if (!old?.pages) return old

        return {
          ...old,
          pages: old.pages.map((page: any) => {
            // Update sections with new sort orders
            const updatedSections = page.sections.map((section: any) => {
              const newOrder = command.sectionOrders.find((so) => so.sectionId === section.id)
              return newOrder ? { ...section, sortOrder: newOrder.sortOrder } : section
            })

            return { ...page, sections: updatedSections }
          })
        }
      })

      return { previousPages }
    },
    onError: (error, variables, context) => {
      // Rollback on error
      if (context?.previousPages) {
        queryClient.setQueryData(['pages', websiteId], context.previousPages)
      }
      console.error('Failed to reorder sections:', error)
    },
    onSettled: () => {
      // Refetch to ensure consistency
      queryClient.invalidateQueries({
        queryKey: ['pages', websiteId],
      })
    },
  })
}
