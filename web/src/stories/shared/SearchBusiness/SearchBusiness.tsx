'use client'

import { useState, useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { MapPin, Star, Phone, Globe } from 'lucide-react'
import { LoadingSpinner } from '@/components'
import { useSearchBusiness, ResponseBusinessDetails } from '@shared'

interface SearchBusinessProps {
  onBusinessSelect: (business: ResponseBusinessDetails) => void
  selectedBusiness?: ResponseBusinessDetails | null
}

export default function SearchBusiness({ onBusinessSelect, selectedBusiness }: SearchBusinessProps) {
  const [query, setQuery] = useState('')
  const { mutate: searchMutation, isPending, error, data } = useSearchBusiness()

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

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="relative">
          <Input
            type="text"
            placeholder="Search for your restaurant (e.g., 'Pizza Express Oslo')"
            value={query}
            onChange={e => setQuery(e.target.value)}
            className="w-full pr-10 border-1 border-gray-300 text-center"
          />
          {isPending && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <LoadingSpinner size="sm" />
            </div>
          )}
        </div>

        {error && (
          <div className="text-red-600 text-sm">Error searching: {error.message}</div>
        )}
      </div>

      {businesses.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Found {businesses.length} businesses</h3>
          <div className="grid gap-4">
            {businesses.map(business => {
              const isSelected = selectedBusiness?.placeId === business.placeId

              return (
                <Card
                  key={business.placeId}
                  className={`cursor-pointer transition-all hover:shadow-md ${isSelected ? 'ring-2 ring-primary' : ''}`}
                  onClick={() => onBusinessSelect(business)}
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
                      {isSelected && <Badge variant="default">Selected</Badge>}
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
    </div>
  )
}
