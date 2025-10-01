'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Plus } from 'lucide-react'
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

    createMenu(
      {
        name: menuName,
        description: menuDescription,
        restaurantId: selectedLocation.id,
      },
      {
        onSuccess: menu => {
          if (menu) router.push(`/menus/${menu.id}`)
        },
      }
    )
  }

  if (hasNoLocations) return <NoLocation />
  if (notRestaurant) return <RestaurantRequired />

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="menuName">Menu Name</Label>
        <Input
          id="menuName"
          value={menuName}
          onChange={e => setMenuName(e.target.value)}
          placeholder="e.g., Main Menu, Dinner Menu, Lunch Specials"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="menuDescription">Description</Label>
        <Textarea
          id="menuDescription"
          value={menuDescription}
          onChange={e => setMenuDescription(e.target.value)}
          placeholder="A brief description of your menu..."
          rows={3}
        />
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <Button type="submit" disabled={isLoading || !menuName.trim()}>
          <Plus />
          {isLoading ? 'Creating...' : 'Create Menu'}
        </Button>
      </div>
    </form>
  )
}
