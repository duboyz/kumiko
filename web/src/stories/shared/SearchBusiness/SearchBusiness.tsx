'use client'

import { useState, useEffect, useRef } from 'react'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { MapPin, Star, Phone, Globe, Search } from 'lucide-react'
import { LoadingSpinner } from '@/components'
import { useSearchBusiness, ResponseBusinessDetails } from '@shared'
import { gsap } from 'gsap'

interface SearchBusinessProps {
  onBusinessSelect: (business: ResponseBusinessDetails) => void
  selectedBusiness?: ResponseBusinessDetails | null
}

export default function SearchBusiness({ onBusinessSelect, selectedBusiness }: SearchBusinessProps) {
  const [query, setQuery] = useState('')
  const { mutate: searchMutation, isPending, error, data } = useSearchBusiness()
  const containerRef = useRef<HTMLDivElement>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)
  const resultsRef = useRef<HTMLDivElement>(null)

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

  // GSAP animations
  useEffect(() => {
    if (!containerRef.current) return

    const tl = gsap.timeline()
    tl.fromTo(containerRef.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' })
  }, [])

  // Animate results when they appear
  useEffect(() => {
    if (!resultsRef.current || businesses.length === 0) return

    const cards = resultsRef.current.querySelectorAll('.business-card')
    gsap.fromTo(cards, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.3, stagger: 0.1, ease: 'power2.out' })
  }, [businesses])

  // Animate selection with immediate feedback
  useEffect(() => {
    if (!selectedBusiness) return

    const selectedCard = document.querySelector(`[data-place-id="${selectedBusiness.placeId}"]`)
    if (selectedCard) {
      // Quick selection animation
      gsap.fromTo(selectedCard, { scale: 1.05 }, { scale: 1.02, duration: 0.2, ease: 'power2.out' })
    }
  }, [selectedBusiness])

  return (
    <div ref={containerRef} className="space-y-6">
      <div className="space-y-4">
        <div className="flex justify-center">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              ref={searchInputRef}
              type="text"
              placeholder="Type your restaurant name here..."
              value={query}
              onChange={e => setQuery(e.target.value)}
              className="pl-10 pr-10 h-12 text-center transition-all duration-200 focus:scale-[1.02]"
            />
            {isPending && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <LoadingSpinner size="sm" />
              </div>
            )}
          </div>
        </div>

        {error && <div className="text-red-600 text-sm text-center">Error searching: {error.message}</div>}
      </div>

      {businesses.length > 0 && (
        <div ref={resultsRef} className="space-y-4">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-muted-foreground">
              Great! We found {businesses.length} {businesses.length === 1 ? 'match' : 'matches'}
            </h3>
            <p className="text-sm text-muted-foreground mt-1">Click on your restaurant below</p>
          </div>
          <div className="grid gap-3 max-w-2xl mx-auto">
            {businesses.map(business => {
              const isSelected = selectedBusiness?.placeId === business.placeId

              return (
                <Card
                  key={business.placeId}
                  data-place-id={business.placeId}
                  className={`business-card cursor-pointer transition-all duration-200 hover:shadow-md hover:scale-[1.02] ${
                    isSelected ? 'ring-2 ring-primary shadow-lg scale-[1.02] bg-primary/5' : ''
                  }`}
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
