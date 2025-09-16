import { useMutation, useQueryClient } from '@tanstack/react-query'
import { sectionApi } from '../api'
import type {
  CreateHeroSectionCommand,
  UpdateHeroSectionCommand,
  CreateTextSectionCommand,
  UpdateTextSectionCommand,
  CreateRestaurantMenuSectionCommand,
  UpdateRestaurantMenuSectionCommand
} from '../types'
import { HeroSectionType } from '../types/website.types'
import { TextAlignment } from '../types'

export const useCreateHeroSection = (websiteId: string) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (command: CreateHeroSectionCommand) => sectionApi.createHeroSection(command),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['pages', websiteId]
      })
    }
  })
}

export const useUpdateHeroSection = (websiteId: string, onSuccess?: () => void) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ heroSectionId, updates }: { heroSectionId: string, updates: UpdateHeroSectionCommand }) => 
      sectionApi.updateHeroSection(heroSectionId, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['pages', websiteId]
      })
      onSuccess?.()
    },
    onError: (error) => {
      console.error('Failed to save section:', error)
    }
  })
}

// Text Section hooks
export const useCreateTextSection = (websiteId: string) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (command: CreateTextSectionCommand) => sectionApi.createTextSection(command),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['pages', websiteId]
      })
    }
  })
}

export const useUpdateTextSection = (websiteId: string, onSuccess?: () => void) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ textSectionId, updates }: { textSectionId: string, updates: UpdateTextSectionCommand }) =>
      sectionApi.updateTextSection(textSectionId, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['pages', websiteId]
      })
      onSuccess?.()
    },
    onError: (error) => {
      console.error('Failed to save text section:', error)
    }
  })
}

// Restaurant Menu Section hooks
export const useCreateRestaurantMenuSection = (websiteId: string) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (command: CreateRestaurantMenuSectionCommand) => sectionApi.createRestaurantMenuSection(command),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['pages', websiteId]
      })
    }
  })
}

export const useUpdateRestaurantMenuSection = (websiteId: string, onSuccess?: () => void) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ restaurantMenuSectionId, updates }: { restaurantMenuSectionId: string, updates: UpdateRestaurantMenuSectionCommand }) =>
      sectionApi.updateRestaurantMenuSection(restaurantMenuSectionId, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['pages', websiteId]
      })
      onSuccess?.()
    },
    onError: (error) => {
      console.error('Failed to save restaurant menu section:', error)
    }
  })
}

export const useAddSectionWithDefaults = (websiteId: string, pageId: string, defaultMenuId?: string) => {
  const createHeroSection = useCreateHeroSection(websiteId)
  const createTextSection = useCreateTextSection(websiteId)
  const createRestaurantMenuSection = useCreateRestaurantMenuSection(websiteId)

  const addHeroSection = (sortOrder: number) => {
    const defaultHeroSection: CreateHeroSectionCommand = {
      websitePageId: pageId,
      sortOrder,
      title: 'Your Awesome Title',
      description: 'Add a compelling description that captures your audience\'s attention and clearly explains what you offer.',
      imageUrl: 'https://images.pexels.com/photos/2014773/pexels-photo-2014773.jpeg',
      imageAlt: 'Your Awesome Image',
      type: HeroSectionType.ImageRight,
      backgroundColor: '#ffffff',
      textColor: '#1f2937',
      buttonText: 'Get Started',
      buttonBackgroundColor: '#3b82f6',
      buttonTextColor: '#ffffff'
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
      textColor: '#1f2937'
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
      allowOrdering: true
    }

    createRestaurantMenuSection.mutate(defaultRestaurantMenuSection)
  }

  return {
    addHeroSection,
    addTextSection,
    addRestaurantMenuSection,
    isLoading: createHeroSection.isPending || createTextSection.isPending || createRestaurantMenuSection.isPending
  }
}