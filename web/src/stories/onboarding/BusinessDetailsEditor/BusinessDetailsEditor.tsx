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
  onValidationChange?: (isValid: boolean) => void
}

export function BusinessDetailsEditor({ businessData, onChange, onValidationChange }: BusinessDetailsEditorProps) {
  const basicInfoCardRef = useRef<HTMLDivElement>(null)
  const locationCardRef = useRef<HTMLDivElement>(null)
  const contactCardRef = useRef<HTMLDivElement>(null)

  const [errors, setErrors] = useState<{
    name?: string
    address?: string
    city?: string
    country?: string
  }>({})

  const [details, setDetails] = useState<BusinessDetails>(() => {
    if (businessData) {
      return {
        name: businessData.name || '',
        address: businessData.street || businessData.formattedAddress || '',
        city: businessData.city || businessData.vicinity || '',
        state: businessData.state || '',
        zip: businessData.postalCode || '',
        country: businessData.country || 'NO',
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

  // Check if form is valid (all required fields filled)
  const isValid =
    details.name.trim() !== '' &&
    details.address.trim() !== '' &&
    details.city.trim() !== '' &&
    details.country.trim() !== ''

  useEffect(() => {
    onChange(details)
  }, [details, onChange])

  useEffect(() => {
    onValidationChange?.(isValid)
  }, [isValid, onValidationChange])

  // GSAP animations on mount
  useEffect(() => {
    const cards = [basicInfoCardRef.current, locationCardRef.current, contactCardRef.current].filter(Boolean)

    if (cards.length === 0) return

    gsap.set(cards, { opacity: 0, y: 20 })

    const tl = gsap.timeline()

    tl.to(cards, {
      opacity: 1,
      y: 0,
      duration: 0.4,
      stagger: 0.1,
      ease: 'power2.out',
    })
  }, [])

  const validateField = (field: keyof BusinessDetails, value: string) => {
    setErrors(prev => {
      const newErrors = { ...prev }

      switch (field) {
        case 'name':
          if (!value.trim()) {
            newErrors.name = 'Restaurant name is required'
          } else {
            delete newErrors.name
          }
          break
        case 'address':
          if (!value.trim()) {
            newErrors.address = 'Address is required'
          } else {
            delete newErrors.address
          }
          break
        case 'city':
          if (!value.trim()) {
            newErrors.city = 'City is required'
          } else {
            delete newErrors.city
          }
          break
        case 'country':
          if (!value.trim()) {
            newErrors.country = 'Country is required'
          } else {
            delete newErrors.country
          }
          break
      }

      return newErrors
    })
  }

  const handleChange = (field: keyof BusinessDetails, value: string) => {
    setDetails(prev => ({ ...prev, [field]: value }))
    // Validate immediately if there was an error (real-time validation feedback)
    setErrors(prev => {
      if (prev[field as keyof typeof prev]) {
        // If field has value, clear error; otherwise keep it
        if (value.trim()) {
          const newErrors = { ...prev }
          delete newErrors[field as keyof typeof newErrors]
          return newErrors
        }
      }
      return prev
    })
  }

  const handleBlur = (
    field: keyof BusinessDetails,
    value: string,
    e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    handleInputBlur(e)
    validateField(field, value)
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
    <div className="space-y-6">
      {/* Header with Kumiko icon */}
      <div className="flex items-center gap-4 mb-6">
        <div className="flex-shrink-0">
          <Image
            src={KumikoBusiness}
            alt="Kumiko helping with business details"
            width={80}
            height={80}
            className="w-16 h-16 sm:w-20 sm:h-20 object-contain"
          />
        </div>
        <div className="flex-1">
          <h2 className="text-2xl font-semibold">Review what we found</h2>
          <p className="text-muted-foreground">
            {businessData
              ? 'We found your business! Please review and update any details below.'
              : "Let's set up your restaurant details so we can create your website."}
          </p>
        </div>
      </div>

      {/* Basic Information Card */}
      <Card ref={basicInfoCardRef}>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
          <CardDescription>Tell us about your restaurant</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">What's your restaurant called? *</Label>
              <Input
                id="name"
                value={details.name}
                onChange={e => handleChange('name', e.target.value)}
                onFocus={handleInputFocus}
                onBlur={e => handleBlur('name', details.name, e)}
                placeholder="e.g., Mario's Pizza"
                required
                className={`transition-transform duration-200 ${errors.name ? 'border-destructive focus-visible:ring-destructive' : ''}`}
                aria-invalid={!!errors.name}
                aria-describedby={errors.name ? 'name-error' : undefined}
              />
              {errors.name && (
                <p id="name-error" className="text-sm text-destructive mt-1">
                  {errors.name}
                </p>
              )}
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
        </CardContent>
      </Card>

      {/* Location Card */}
      <Card ref={locationCardRef}>
        <CardHeader>
          <CardTitle>Location</CardTitle>
          <CardDescription>Where is your restaurant located?</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="address">Where are you located? *</Label>
              <Input
                id="address"
                value={details.address}
                onChange={e => handleChange('address', e.target.value)}
                onFocus={handleInputFocus}
                onBlur={e => handleBlur('address', details.address, e)}
                placeholder="e.g., 123 Main Street"
                required
                className={`transition-transform duration-200 ${errors.address ? 'border-destructive focus-visible:ring-destructive' : ''}`}
                aria-invalid={!!errors.address}
                aria-describedby={errors.address ? 'address-error' : undefined}
              />
              {errors.address && (
                <p id="address-error" className="text-sm text-destructive mt-1">
                  {errors.address}
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city">City *</Label>
                <Input
                  id="city"
                  value={details.city}
                  onChange={e => handleChange('city', e.target.value)}
                  onFocus={handleInputFocus}
                  onBlur={e => handleBlur('city', details.city, e)}
                  placeholder="City"
                  required
                  className={`transition-transform duration-200 ${errors.city ? 'border-destructive focus-visible:ring-destructive' : ''}`}
                  aria-invalid={!!errors.city}
                  aria-describedby={errors.city ? 'city-error' : undefined}
                />
                {errors.city && (
                  <p id="city-error" className="text-sm text-destructive mt-1">
                    {errors.city}
                  </p>
                )}
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
                  className="transition-transform duration-200"
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
                  onBlur={e => handleBlur('country', details.country, e)}
                  placeholder="NO"
                  required
                  className={`transition-transform duration-200 ${errors.country ? 'border-destructive focus-visible:ring-destructive' : ''}`}
                  aria-invalid={!!errors.country}
                  aria-describedby={errors.country ? 'country-error' : undefined}
                />
                {errors.country && (
                  <p id="country-error" className="text-sm text-destructive mt-1">
                    {errors.country}
                  </p>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contact Information Card */}
      <Card ref={contactCardRef}>
        <CardHeader>
          <CardTitle>Contact Information</CardTitle>
          <CardDescription>How can customers reach you?</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
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
        </CardContent>
      </Card>

      {/* Hidden fields from Google Places */}
      {details.latitude && details.longitude && (
        <div className="pt-4 border-t text-xs text-muted-foreground">
          <div className="flex items-center justify-between">
            <span>Google Place ID: {details.googlePlaceId}</span>
            <span>
              Coordinates: {parseFloat(details.latitude).toFixed(6)}, {parseFloat(details.longitude).toFixed(6)}
            </span>
          </div>
        </div>
      )}
    </div>
  )
}
