'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { MapPin, Edit, Save, X } from 'lucide-react'
import { useUpdateRestaurant, RestaurantBaseDto, UpdateRestaurantCommand } from '@shared'
import { toast } from 'sonner'

interface ContactInformationSettingsProps {
  restaurant: RestaurantBaseDto
}

interface ContactDetails {
  name: string
  description: string
  address: string
  city: string
  state: string
  zip: string
  country: string
}

export function ContactInformationSettings({ restaurant }: ContactInformationSettingsProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [contactDetails, setContactDetails] = useState<ContactDetails | null>(null)
  const updateRestaurant = useUpdateRestaurant()

  useEffect(() => {
    if (isEditing && !contactDetails) {
      setContactDetails({
        name: restaurant.name,
        description: restaurant.description || '',
        address: restaurant.address,
        city: restaurant.city,
        state: restaurant.state,
        zip: restaurant.zip,
        country: restaurant.country,
      })
    }
  }, [isEditing, restaurant, contactDetails])

  const handleSave = async () => {
    if (!contactDetails) {
      toast.error('Please fill in the required fields')
      return
    }

    try {
      const command: UpdateRestaurantCommand = {
        id: restaurant.id,
        name: contactDetails.name,
        description: contactDetails.description || null,
        address: contactDetails.address,
        city: contactDetails.city,
        state: contactDetails.state,
        zip: contactDetails.zip,
        country: contactDetails.country,
      }

      await updateRestaurant.mutateAsync(command)
      toast.success('Contact information updated successfully')
      setIsEditing(false)
      setContactDetails(null)
    } catch (error) {
      toast.error('Failed to update contact information')
      console.error('Error updating contact information:', error)
    }
  }

  const handleCancel = () => {
    setIsEditing(false)
    setContactDetails(null)
  }

  const handleChange = (field: keyof ContactDetails, value: string) => {
    setContactDetails(prev => prev ? { ...prev, [field]: value } : null)
  }

  if (!isEditing) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              <CardTitle>Contact Information</CardTitle>
            </div>
            <Button onClick={() => setIsEditing(true)} variant="outline" size="sm">
              <Edit className="w-4 h-4 mr-2" />
              Edit
            </Button>
          </div>
          <CardDescription>Business contact details</CardDescription>
        </CardHeader>
        <CardContent>
          <dl className="space-y-4">
            {/* Name */}
            <div>
              <dt className="text-sm font-medium text-muted-foreground mb-1">Business Name</dt>
              <dd className="text-sm">{restaurant.name}</dd>
            </div>

            {/* Description */}
            {restaurant.description && (
              <div>
                <dt className="text-sm font-medium text-muted-foreground mb-1">Description</dt>
                <dd className="text-sm text-muted-foreground">{restaurant.description}</dd>
              </div>
            )}

            {/* Address - Compact format */}
            <div>
              <dt className="text-sm font-medium text-muted-foreground mb-1">Address</dt>
              <dd className="text-sm">
                {restaurant.address}
                <br />
                {[restaurant.city, restaurant.state, restaurant.zip].filter(Boolean).join(', ')}
                {restaurant.country && (
                  <>
                    <br />
                    {restaurant.country}
                  </>
                )}
              </dd>
            </div>
          </dl>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            <CardTitle>Edit Contact Information</CardTitle>
          </div>
          <div className="flex gap-2">
            <Button onClick={handleCancel} variant="outline" size="sm" disabled={updateRestaurant.isPending}>
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
            <Button onClick={handleSave} size="sm" disabled={!contactDetails || updateRestaurant.isPending}>
              <Save className="w-4 h-4 mr-2" />
              {updateRestaurant.isPending ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {contactDetails && (
          <div className="space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Basic Information</h3>
              
              <div className="space-y-2">
                <Label htmlFor="name">Business Name *</Label>
                <Input
                  id="name"
                  value={contactDetails.name}
                  onChange={e => handleChange('name', e.target.value)}
                  placeholder="Enter business name"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={contactDetails.description}
                  onChange={e => handleChange('description', e.target.value)}
                  placeholder="Brief description of your business (optional)"
                  rows={3}
                />
              </div>
            </div>

            {/* Location */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Location</h3>
              
              <div className="space-y-2">
                <Label htmlFor="address">Street Address *</Label>
                <Input
                  id="address"
                  value={contactDetails.address}
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
                    value={contactDetails.city}
                    onChange={e => handleChange('city', e.target.value)}
                    placeholder="City"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="state">State/Province</Label>
                  <Input
                    id="state"
                    value={contactDetails.state}
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
                    value={contactDetails.zip}
                    onChange={e => handleChange('zip', e.target.value)}
                    placeholder="12345"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="country">Country *</Label>
                  <Input
                    id="country"
                    value={contactDetails.country}
                    onChange={e => handleChange('country', e.target.value)}
                    placeholder="NO"
                    required
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

