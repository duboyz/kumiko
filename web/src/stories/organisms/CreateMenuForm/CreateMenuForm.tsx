'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { ChefHat, Plus } from 'lucide-react'
import { useCreateRestaurantMenu } from '@shared'
import { useLocationSelection } from '@shared'
import { NoLocation } from '@/stories/Components/NoLocation/NoLocation'
import { RestaurantRequired } from '@/stories/Components/RestaurantRequired/RestaurantRequired'
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime'

interface CreateMenuFormProps {
  restaurantId: string
  restaurantName: string
  isLoading?: boolean
  router: AppRouterInstance
}

export function CreateMenuForm({ restaurantName, isLoading, router }: CreateMenuFormProps) {
  const [menuName, setMenuName] = useState('Main Menu')
  const [menuDescription, setMenuDescription] = useState('Our carefully crafted selection of dishes')

  const { selectedLocation, hasNoLocations } = useLocationSelection()

  const notRestaurant = selectedLocation?.type !== 'Restaurant'


  const { mutate: createMenu } = useCreateRestaurantMenu()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!menuName.trim()) return
    if (!selectedLocation?.id) return

    createMenu({
      name: menuName,
      description: menuDescription,
      restaurantId: selectedLocation.id,
    }, {
      onSuccess: (menu) => {
        if (menu) router.push(`/menus/${menu.id}`)
      }
    })
  }

  if (hasNoLocations) return <NoLocation />
  if (notRestaurant) return <RestaurantRequired />

  return (
    <div className="max-w-2xl mx-auto">

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="menuName"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Menu Name
          </label>
          <Input
            id="menuName"
            value={menuName}
            onChange={e => setMenuName(e.target.value)}
            placeholder="e.g., Main Menu, Dinner Menu, Lunch Specials"
            className="mt-2"
            required
          />
        </div>

        <div>
          <label
            htmlFor="menuDescription"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Description
          </label>
          <Textarea
            id="menuDescription"
            value={menuDescription}
            onChange={e => setMenuDescription(e.target.value)}
            placeholder="A brief description of your menu..."
            className="mt-2"
            rows={3}
          />
        </div>

        <div className="flex gap-3 pt-4">
          <Button type="submit" className="flex-1" disabled={isLoading || !menuName.trim()}>
            <Plus className="w-4 h-4 mr-2" />
            {isLoading ? 'Creating Menu...' : 'Create Menu'}
          </Button>
        </div>
      </form>

    </div>
  )
}