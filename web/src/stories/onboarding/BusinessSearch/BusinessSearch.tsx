'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { MapPin, Star, Phone, Globe, ArrowRight } from 'lucide-react'
import { LoadingSpinner } from '@/components'
import { useSearchBusiness, ResponseBusinessDetails } from '@shared'
import { useOnboardingStore } from '@shared/stores/onboarding.store'

interface BusinessSearchProps {
  onBusinessSelect?: (business: ResponseBusinessDetails) => void
  selectedBusiness?: ResponseBusinessDetails | null
}

export default function BusinessSearch({ onBusinessSelect, selectedBusiness }: BusinessSearchProps) {
  const router = useRouter()
  const [query, setQuery] = useState('')
  const { mutate: searchMutation, isPending, error, data } = useSearchBusiness()
  const { setSelectedBusiness, nextStep } = useOnboardingStore()

  // Debounced search effect
  useEffect(() => {
    if (!query.trim()) return

    const timeoutId = setTimeout(() => {
      searchMutation({
        query: query.trim(),
        country: 'NO',
        limit: 10,
      })
    }, 500) // 500ms debounce delay

    return () => clearTimeout(timeoutId)
  }, [query, searchMutation])

  const businesses = data?.businesses || []

  const handleBusinessSelect = (business: ResponseBusinessDetails) => {
    if (onBusinessSelect) {
      onBusinessSelect(business)
    } else {
      // Store the selected business and move to next step
      setSelectedBusiness(business)
      nextStep()
    }
  }

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold">Find Your Restaurant</h1>
        <p className="text-muted-foreground">Search for your restaurant to get started with your online presence</p>
      </div>

      <div className="space-y-4">
        <div className="relative">
          <Input
            type="text"
            placeholder="Search for your restaurant (e.g., 'Pizza Express Oslo')"
            value={query}
            onChange={e => setQuery(e.target.value)}
            className="w-full pr-10 text-lg"
          />
          {isPending && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <LoadingSpinner size="sm" />
            </div>
          )}
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 bg-red-100 rounded-full flex items-center justify-center">
                <span className="text-red-600 text-xs">!</span>
              </div>
              <div>
                <h4 className="text-sm font-medium text-red-800">Search Error</h4>
                <p className="text-sm text-red-600 mt-1">{error.message}</p>
              </div>
            </div>
            <div className="mt-3">
              <button
                onClick={() => searchMutation({ query: query.trim(), country: 'NO', limit: 10 })}
                className="text-sm text-red-600 hover:text-red-800 underline"
              >
                Try again
              </button>
            </div>
          </div>
        )}
      </div>

      {businesses.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-center">Found {businesses.length} businesses</h3>
          <div className="grid gap-4">
            {businesses.map(business => {
              const isSelected = selectedBusiness?.placeId === business.placeId

              return (
                <Card
                  key={business.placeId}
                  className={`cursor-pointer transition-all hover:shadow-md ${isSelected ? 'ring-2 ring-primary' : ''}`}
                  onClick={() => handleBusinessSelect(business)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <CardTitle className="text-lg">{business.name}</CardTitle>
                        <CardDescription className="flex items-center gap-1 mt-1">
                          <MapPin className="h-4 w-4" />
                          {business.formattedAddress}
                        </CardDescription>
                      </div>
                      <div className="flex items-center gap-2">
                        {isSelected && <Badge variant="default">Selected</Badge>}
                        <ArrowRight className="h-4 w-4 text-muted-foreground" />
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                      {business.rating && (
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span>{business.rating}</span>
                          {business.userRatingsTotal && <span>({business.userRatingsTotal} reviews)</span>}
                        </div>
                      )}
                      {business.formattedPhoneNumber && (
                        <div className="flex items-center gap-1">
                          <Phone className="h-4 w-4" />
                          <span>{business.formattedPhoneNumber}</span>
                        </div>
                      )}
                      {business.website && (
                        <div className="flex items-center gap-1">
                          <Globe className="h-4 w-4" />
                          <span className="truncate">Website</span>
                        </div>
                      )}
                    </div>
                    {business.types.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {business.types.slice(0, 3).map(type => (
                          <Badge key={type} variant="outline" className="text-xs">
                            {type.replace(/_/g, ' ')}
                          </Badge>
                        ))}
                        {business.types.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{business.types.length - 3} more
                          </Badge>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      )}

      {query && !isPending && businesses.length === 0 && !error && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
          <div className="w-12 h-12 mx-auto bg-yellow-100 rounded-full flex items-center justify-center mb-4">
            <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-yellow-800 mb-2">No businesses found</h3>
          <p className="text-yellow-700 mb-4">We couldn't find any businesses matching "{query}"</p>
          <div className="text-sm text-yellow-600 space-y-1">
            <p>• Try a different search term</p>
            <p>• Check the spelling</p>
            <p>• Try searching by city or area</p>
          </div>
        </div>
      )}
    </div>
  )
}
