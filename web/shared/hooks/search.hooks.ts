import { useMutation } from '@tanstack/react-query'
import { searchApi } from '../api'
import { RequestSearchAddress } from '../types'

export const useSearchBusiness = () => {
  return useMutation({
    mutationFn: (data: RequestSearchAddress) => searchApi.searchBusiness(data)
  })
}