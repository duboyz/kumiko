import { useMutation, useQueryClient } from '@tanstack/react-query'
import { sectionApi } from '../api'
import type { CreateHeroSectionCommand, UpdateHeroSectionCommand, CreateTextSectionCommand, UpdateTextSectionCommand } from '../types'
import { HeroSectionType } from '../types/websiteTypes'
import { TextAlignment } from '../types'

export const useCreateHeroSection = (websiteId: string) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (command: CreateHeroSectionCommand) => {
      const response = await sectionApi.createHeroSection(command)
      if (!response.success) {
        throw new Error(response.message || 'Failed to create hero section')
      }
      return response.data
    },
    onSuccess: () => {
      // Invalidate the pages query to refresh sections
      queryClient.invalidateQueries({
        queryKey: ['pages', websiteId]
      })
    }
  })
}

export const useUpdateHeroSection = (websiteId: string, onSuccess?: () => void) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ heroSectionId, updates }: { heroSectionId: string, updates: UpdateHeroSectionCommand }) => {
      const response = await sectionApi.updateHeroSection(heroSectionId, updates)
      if (!response.success) {
        throw new Error(response.message || 'Failed to update hero section')
      }
      return response.data
    },
    onSuccess: () => {
      // Invalidate the pages query to refresh sections
      queryClient.invalidateQueries({
        queryKey: ['pages', websiteId]
      })
      // Call the optional success callback
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
    mutationFn: async (command: CreateTextSectionCommand) => {
      const response = await sectionApi.createTextSection(command)
      if (!response.success) {
        throw new Error(response.message || 'Failed to create text section')
      }
      return response.data
    },
    onSuccess: () => {
      // Invalidate the pages query to refresh sections
      queryClient.invalidateQueries({
        queryKey: ['pages', websiteId]
      })
    }
  })
}

export const useUpdateTextSection = (websiteId: string, onSuccess?: () => void) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ textSectionId, updates }: { textSectionId: string, updates: UpdateTextSectionCommand }) => {
      const response = await sectionApi.updateTextSection(textSectionId, updates)
      if (!response.success) {
        throw new Error(response.message || 'Failed to update text section')
      }
      return response.data
    },
    onSuccess: () => {
      // Invalidate the pages query to refresh sections
      queryClient.invalidateQueries({
        queryKey: ['pages', websiteId]
      })
      // Call the optional success callback
      onSuccess?.()
    },
    onError: (error) => {
      console.error('Failed to save text section:', error)
    }
  })
}

export const useAddSectionWithDefaults = (websiteId: string, pageId: string) => {
  const createHeroSection = useCreateHeroSection(websiteId)
  const createTextSection = useCreateTextSection(websiteId)

  const addHeroSection = (sortOrder: number) => {
    const defaultHeroSection: CreateHeroSectionCommand = {
      websitePageId: pageId,
      sortOrder,
      title: 'Your Awesome Title',
      description: 'Add a compelling description that captures your audience\'s attention and clearly explains what you offer.',
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

  return {
    addHeroSection,
    addTextSection,
    isLoading: createHeroSection.isPending || createTextSection.isPending
  }
}