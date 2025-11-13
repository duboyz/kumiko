'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Clock, Edit, Save, X } from 'lucide-react'
import { BusinessHoursEditor, BusinessHours } from '@/stories/onboarding'
import { useUpdateRestaurant, RestaurantBaseDto, UpdateRestaurantCommand } from '@shared'
import { toast } from 'sonner'
import { useTranslations } from 'next-intl'

interface BusinessHoursSettingsProps {
  restaurant: RestaurantBaseDto
}

// Parse business hours from JSON string
const parseBusinessHours = (hoursJson?: string | null): BusinessHours | null => {
  if (!hoursJson) return null
  try {
    return JSON.parse(hoursJson) as BusinessHours
  } catch {
    return null
  }
}

export function BusinessHoursSettings({ restaurant }: BusinessHoursSettingsProps) {
  const t = useTranslations('settings.businessHours')
  const [isEditing, setIsEditing] = useState(false)
  const [businessHours, setBusinessHours] = useState<BusinessHours | null>(null)
  const updateRestaurant = useUpdateRestaurant()

  useEffect(() => {
    if (isEditing && !businessHours) {
      const parsedHours = parseBusinessHours(restaurant.businessHours)
      setBusinessHours(parsedHours)
    }
  }, [isEditing, restaurant, businessHours])

  const handleSave = async () => {
    if (!businessHours) {
      toast.error(t('pleaseSetHours'))
      return
    }

    try {
      const command: UpdateRestaurantCommand = {
        id: restaurant.id,
        businessHours: JSON.stringify(businessHours),
      }

      await updateRestaurant.mutateAsync(command)
      toast.success(t('updateSuccess'))
      setIsEditing(false)
      setBusinessHours(null)
    } catch (error) {
      toast.error(t('updateError'))
      console.error('Error updating business hours:', error)
    }
  }

  const handleCancel = () => {
    setIsEditing(false)
    setBusinessHours(null)
  }

  if (!isEditing) {
    const parsedBusinessHours = parseBusinessHours(restaurant.businessHours)

    return (
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
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
          {parsedBusinessHours ? (
            <dl className="space-y-2">
              {Object.entries(parsedBusinessHours).map(([day, hours]) => (
                <div key={day} className="flex justify-between items-center text-sm">
                  <dt className="font-medium capitalize text-muted-foreground">{day}</dt>
                  <dd className="text-foreground">
                    {hours ? `${hours.open} - ${hours.close}` : t('closed')}
                  </dd>
                </div>
              ))}
            </dl>
          ) : (
            <p className="text-sm text-muted-foreground">{t('noBusinessHoursSet')}</p>
          )}
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              <CardTitle>{t('editTitle')}</CardTitle>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleCancel} variant="outline" size="sm" disabled={updateRestaurant.isPending}>
                <X className="w-4 h-4 mr-2" />
                {t('cancel')}
              </Button>
              <Button onClick={handleSave} size="sm" disabled={!businessHours || updateRestaurant.isPending}>
                <Save className="w-4 h-4 mr-2" />
                {updateRestaurant.isPending ? t('saving') : t('saveChanges')}
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      <BusinessHoursEditor
        initialHours={parseBusinessHours(restaurant.businessHours) || undefined}
        onChange={setBusinessHours}
      />
    </div>
  )
}

