'use client'

import { useState, useEffect, useRef } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Building2 } from 'lucide-react'
import type { ResponseBusinessDetails } from '@shared'
import { gsap } from 'gsap'

export interface BusinessDetails {
  name: string
  address: string
  city: string
  state: string
  zip: string
  country: string
  phone: string
  website: string
  description: string
  latitude: string
  longitude: string
  googlePlaceId: string
}

interface BusinessDetailsEditorProps {
  businessData?: ResponseBusinessDetails
  onChange: (details: BusinessDetails) => void
}

export function BusinessDetailsEditor({ businessData, onChange }: BusinessDetailsEditorProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  const formFieldsRef = useRef<HTMLDivElement>(null)

  const [details, setDetails] = useState<BusinessDetails>(() => {
    if (businessData) {
      return {
        name: businessData.name || '',
        address: businessData.formattedAddress || '',
        city: businessData.vicinity || '',
        state: '',
        zip: '',
        country: 'NO',
        phone: businessData.formattedPhoneNumber || '',
        website: businessData.website || '',
        description: '',
        latitude: businessData.geometry?.location?.lat?.toString() || '',
        longitude: businessData.geometry?.location?.lng?.toString() || '',
        googlePlaceId: businessData.placeId || '',
      }
    }
    return {
      name: '',
      address: '',
      city: '',
      state: '',
      zip: '',
      country: 'NO',
      phone: '',
      website: '',
      description: '',
      latitude: '',
      longitude: '',
      googlePlaceId: '',
    }
  })

  useEffect(() => {
    onChange(details)
  }, [details, onChange])

  // GSAP animations on mount
  useEffect(() => {
    if (!cardRef.current || !formFieldsRef.current) return

    const formGroups = formFieldsRef.current.querySelectorAll('.form-group')

    gsap.set(cardRef.current, { opacity: 0, y: 20 })
    gsap.set(formGroups, { opacity: 0, x: -20 })

    const tl = gsap.timeline()

    tl.to(cardRef.current, {
      opacity: 1,
      y: 0,
      duration: 0.4,
      ease: 'power2.out',
    }).to(
      formGroups,
      {
        opacity: 1,
        x: 0,
        duration: 0.3,
        stagger: 0.05,
        ease: 'power2.out',
      },
      '-=0.2'
    )
  }, [])

  const handleChange = (field: keyof BusinessDetails, value: string) => {
    setDetails(prev => ({ ...prev, [field]: value }))
  }

  return (
    <Card ref={cardRef}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building2 className="w-5 h-5" />
          Business Details
        </CardTitle>
        <CardDescription>Review and edit your business information</CardDescription>
      </CardHeader>
      <CardContent>
        <div ref={formFieldsRef} className="space-y-6">
          {/* Basic Information */}
          <div className="form-group space-y-4">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Basic Information</h3>

            <div className="grid gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Business Name *</Label>
                <Input
                  id="name"
                  value={details.name}
                  onChange={e => handleChange('name', e.target.value)}
                  placeholder="Enter business name"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={details.description}
                  onChange={e => handleChange('description', e.target.value)}
                  placeholder="Brief description of your business (optional)"
                  rows={3}
                />
              </div>
            </div>
          </div>

          {/* Location */}
          <div className="form-group space-y-4">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Location</h3>

            <div className="grid gap-4">
              <div className="space-y-2">
                <Label htmlFor="address">Street Address *</Label>
                <Input
                  id="address"
                  value={details.address}
                  onChange={e => handleChange('address', e.target.value)}
                  placeholder="123 Main St"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">City *</Label>
                  <Input
                    id="city"
                    value={details.city}
                    onChange={e => handleChange('city', e.target.value)}
                    placeholder="City"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="state">State/Province</Label>
                  <Input
                    id="state"
                    value={details.state}
                    onChange={e => handleChange('state', e.target.value)}
                    placeholder="State"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="zip">Postal Code</Label>
                  <Input
                    id="zip"
                    value={details.zip}
                    onChange={e => handleChange('zip', e.target.value)}
                    placeholder="12345"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="country">Country *</Label>
                  <Input
                    id="country"
                    value={details.country}
                    onChange={e => handleChange('country', e.target.value)}
                    placeholder="NO"
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Contact Information</h3>

            <div className="grid gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={details.phone}
                  onChange={e => handleChange('phone', e.target.value)}
                  placeholder="+47 123 45 678"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="website">Website</Label>
                <Input
                  id="website"
                  type="url"
                  value={details.website}
                  onChange={e => handleChange('website', e.target.value)}
                  placeholder="https://example.com"
                />
              </div>
            </div>
          </div>

          {/* Hidden fields from Google Places */}
          {details.latitude && details.longitude && (
            <div className="pt-4 border-t">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>Google Place ID: {details.googlePlaceId}</span>
                <span>
                  Coordinates: {parseFloat(details.latitude).toFixed(6)}, {parseFloat(details.longitude).toFixed(6)}
                </span>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
