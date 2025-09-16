import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { pageApi } from '../api'
import type { CreateWebsitePageCommand } from '../types'

export const useCreatePage = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (command: CreateWebsitePageCommand) => {
      const response = await pageApi.createPage(command)
      if (!response.success) {
        throw new Error(response.message || 'Failed to create page')
      }
      return response.data
    },
    onSuccess: (data, variables) => {
      // Invalidate the pages query for the website
      queryClient.invalidateQueries({
        queryKey: ['pages', variables.websiteId]
      })
    }
  })
}

export const usePages = (websiteId: string) => {
  return useQuery({
    queryKey: ['pages', websiteId],
    queryFn: async () => {
      const response = await pageApi.getPages(websiteId)
      if (!response.success) {
        throw new Error(response.message || 'Failed to fetch pages')
      }
      return response.data
    },
    enabled: !!websiteId
  })
}