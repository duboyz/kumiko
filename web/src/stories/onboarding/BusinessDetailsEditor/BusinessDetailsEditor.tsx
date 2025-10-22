'use client'

import { useState, useEffect, useRef } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Building2 } from 'lucide-react'
import type { ResponseBusinessDetails } from '@shared'
import { gsap } from 'gsap'
import Image from 'next/image'
import KumikoBusiness from '../assets/kumiko-business.png'

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

  // Focus animation
  const handleInputFocus = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const inputWrapper = e.target.parentElement
    if (!inputWrapper) return

    gsap.to(e.target, {
      scale: 1.01,
      duration: 0.2,
      ease: 'power1.out',
    })

    gsap.to(inputWrapper, {
      '--ring-opacity': 0.2,
      duration: 0.2,
    })
  }

  // Blur animation
  const handleInputBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    gsap.to(e.target, {
      scale: 1,
      duration: 0.2,
      ease: 'power1.out',
    })
  }

  return (
    <Card ref={cardRef}>
      <CardHeader>
        <div className="flex items-center gap-4">
          {/* Kumiko business icon - spans both lines */}
          <div className="flex-shrink-0">
            <Image
              src={KumikoBusiness}
              alt="Kumiko helping with business details"
              width={80}
              height={80}
              className="w-16 h-16 sm:w-20 sm:h-20 object-contain"
            />
          </div>

          {/* Title and description next to Kumiko */}
          <div className="flex-1">
            <CardTitle className="flex items-center gap-2">Review what we found</CardTitle>
            <CardDescription>
              {businessData
                ? 'We found your business! Please review and update any details below.'
                : "Let's set up your restaurant details so we can create your website."}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div ref={formFieldsRef} className="space-y-6">
          {/* Basic Information */}
          <div className="form-group space-y-4">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Basic Information</h3>

            <div className="grid gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">What's your restaurant called? *</Label>
                <Input
                  id="name"
                  value={details.name}
                  onChange={e => handleChange('name', e.target.value)}
                  onFocus={handleInputFocus}
                  onBlur={handleInputBlur}
                  placeholder="e.g., Mario's Pizza"
                  required
                  className="transition-transform duration-200"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Tell us about your place</Label>
                <Textarea
                  id="description"
                  value={details.description}
                  onChange={e => handleChange('description', e.target.value)}
                  onFocus={handleInputFocus}
                  onBlur={handleInputBlur}
                  placeholder="What makes your restaurant special? (optional)"
                  rows={3}
                  className="transition-transform duration-200"
                />
              </div>
            </div>
          </div>

          {/* Location */}
          <div className="form-group space-y-4">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Location</h3>

            <div className="grid gap-4">
              <div className="space-y-2">
                <Label htmlFor="address">Where are you located? *</Label>
                <Input
                  id="address"
                  value={details.address}
                  onChange={e => handleChange('address', e.target.value)}
                  onFocus={handleInputFocus}
                  onBlur={handleInputBlur}
                  placeholder="e.g., 123 Main Street"
                  required
                  className="transition-transform duration-200"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">City *</Label>
                  <Input
                    id="city"
                    value={details.city}
                    onChange={e => handleChange('city', e.target.value)}
                    onFocus={handleInputFocus}
                    onBlur={handleInputBlur}
                    placeholder="City"
                    required
                    className="transition-transform duration-200"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="state">State/Province</Label>
                  <Input
                    id="state"
                    value={details.state}
                    onChange={e => handleChange('state', e.target.value)}
                    onFocus={handleInputFocus}
                    onBlur={handleInputBlur}
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
                    onFocus={handleInputFocus}
                    onBlur={handleInputBlur}
                    placeholder="12345"
                    className="transition-transform duration-200"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="country">Country *</Label>
                  <Input
                    id="country"
                    value={details.country}
                    onChange={e => handleChange('country', e.target.value)}
                    onFocus={handleInputFocus}
                    onBlur={handleInputBlur}
                    placeholder="NO"
                    required
                    className="transition-transform duration-200"
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
                <Label htmlFor="phone">Phone number (optional)</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={details.phone}
                  onChange={e => handleChange('phone', e.target.value)}
                  onFocus={handleInputFocus}
                  onBlur={handleInputBlur}
                  placeholder="+47 123 45 678"
                  className="transition-transform duration-200"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="website">Do you have a website? (optional)</Label>
                <Input
                  id="website"
                  onFocus={handleInputFocus}
                  onBlur={handleInputBlur}
                  type="url"
                  value={details.website}
                  onChange={e => handleChange('website', e.target.value)}
                  placeholder="https://yourrestaurant.com"
                  className="transition-transform duration-200"
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
