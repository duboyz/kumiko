import { useMutation } from '@tanstack/react-query'
import { searchApi } from '../api'
import { RequestSearchAddress, SearchBusinessResult } from '../types'

export const useSearchBusiness = () => {
  return useMutation<SearchBusinessResult, Error, RequestSearchAddress>({
    mutationFn: searchApi.searchBusiness
  })
}