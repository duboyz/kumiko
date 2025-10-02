import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { pageApi } from '../api'
import type { CreateWebsitePageCommand, CreatePageFromTemplateCommand } from '../types'

export const useCreatePage = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (command: CreateWebsitePageCommand) => pageApi.createPage(command),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['pages', variables.websiteId],
      })
    },
  })
}

export const useCreatePageFromTemplate = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (command: CreatePageFromTemplateCommand) => pageApi.createPageFromTemplate(command),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['pages', variables.websiteId],
      })
    },
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

export const useDeletePage = (websiteId: string) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (pageId: string) => pageApi.deletePage(pageId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['pages', websiteId],
      })
    },
  })
}
