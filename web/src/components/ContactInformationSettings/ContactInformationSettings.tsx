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
import { useTranslations } from 'next-intl'

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
  const t = useTranslations('settings.contactInfo')
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
      toast.error(t('fillRequiredFields'))
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
      toast.success(t('updateSuccess'))
      setIsEditing(false)
      setContactDetails(null)
    } catch (error) {
      toast.error(t('updateError'))
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
              <CardTitle>{t('title')}</CardTitle>
            </div>
            <Button onClick={() => setIsEditing(true)} variant="outline" size="sm">
              <Edit className="w-4 h-4 mr-2" />
              {t('edit')}
            </Button>
          </div>
          <CardDescription>{t('description')}</CardDescription>
        </CardHeader>
        <CardContent>
          <dl className="space-y-4">
            {/* Name */}
            <div>
              <dt className="text-sm font-medium text-muted-foreground mb-1">{t('businessName')}</dt>
              <dd className="text-sm">{restaurant.name}</dd>
            </div>

            {/* Description */}
            {restaurant.description && (
              <div>
                <dt className="text-sm font-medium text-muted-foreground mb-1">{t('businessDescription')}</dt>
                <dd className="text-sm text-muted-foreground">{restaurant.description}</dd>
              </div>
            )}

            {/* Address - Compact format */}
            <div>
              <dt className="text-sm font-medium text-muted-foreground mb-1">{t('address')}</dt>
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
            <CardTitle>{t('editTitle')}</CardTitle>
          </div>
          <div className="flex gap-2">
            <Button onClick={handleCancel} variant="outline" size="sm" disabled={updateRestaurant.isPending}>
              <X className="w-4 h-4 mr-2" />
              {t('cancel')}
            </Button>
            <Button variant="default" onClick={handleSave} size="sm" disabled={!contactDetails || updateRestaurant.isPending}>
              <Save className="w-4 h-4 mr-2" />
              {updateRestaurant.isPending ? t('saving') : t('saveChanges')}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {contactDetails && (
          <div className="space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">{t('basicInformationSection')}</h3>

              <div className="space-y-2">
                <Label htmlFor="name">{t('businessNameLabel')}</Label>
                <Input
                  id="name"
                  value={contactDetails.name}
                  onChange={e => handleChange('name', e.target.value)}
                  placeholder={t('businessNamePlaceholder')}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">{t('descriptionLabel')}</Label>
                <Textarea
                  id="description"
                  value={contactDetails.description}
                  onChange={e => handleChange('description', e.target.value)}
                  placeholder={t('descriptionPlaceholder')}
                  rows={3}
                />
              </div>
            </div>

            {/* Location */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">{t('locationSection')}</h3>

              <div className="space-y-2">
                <Label htmlFor="address">{t('streetAddressLabel')}</Label>
                <Input
                  id="address"
                  value={contactDetails.address}
                  onChange={e => handleChange('address', e.target.value)}
                  placeholder={t('streetAddressPlaceholder')}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">{t('cityLabel')}</Label>
                  <Input
                    id="city"
                    value={contactDetails.city}
                    onChange={e => handleChange('city', e.target.value)}
                    placeholder={t('cityPlaceholder')}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="state">{t('stateLabel')}</Label>
                  <Input
                    id="state"
                    value={contactDetails.state}
                    onChange={e => handleChange('state', e.target.value)}
                    placeholder={t('statePlaceholder')}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="zip">{t('postalCodeLabel')}</Label>
                  <Input
                    id="zip"
                    value={contactDetails.zip}
                    onChange={e => handleChange('zip', e.target.value)}
                    placeholder={t('postalCodePlaceholder')}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="country">{t('countryLabel')}</Label>
                  <Input
                    id="country"
                    value={contactDetails.country}
                    onChange={e => handleChange('country', e.target.value)}
                    placeholder={t('countryPlaceholder')}
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

