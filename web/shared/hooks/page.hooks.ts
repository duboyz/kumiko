import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { pageApi } from '../api'
import type { CreateWebsitePageCommand } from '../types'

export const useCreatePage = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (command: CreateWebsitePageCommand) => pageApi.createPage(command),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['pages', variables.websiteId]
      })
    }
  })
}

export const usePages = (websiteId: string) => {
  return useQuery({
    queryKey: ['pages', websiteId],
    queryFn: () => pageApi.getPages(websiteId),
    enabled: !!websiteId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}