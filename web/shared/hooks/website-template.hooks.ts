import { useMutation, useQueryClient } from '@tanstack/react-query'
import { websiteTemplateApi } from '../api'
import { CreateWebsiteFromTemplatesCommand } from '../types'

export const useCreateWebsiteFromTemplates = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateWebsiteFromTemplatesCommand) => websiteTemplateApi.createWebsiteFromTemplates(data),
    onSuccess: () => {
      // Invalidate website-related queries
      queryClient.invalidateQueries({ queryKey: ['websites'] })
      queryClient.invalidateQueries({ queryKey: ['restaurant-websites'] })
    },
  })
}

