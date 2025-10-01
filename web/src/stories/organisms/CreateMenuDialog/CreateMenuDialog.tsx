'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Plus } from 'lucide-react'
import { useCreateRestaurantMenu } from '@shared'
import { useLocationSelection } from '@shared'
import { NoLocation } from '@/stories/Components/NoLocation/NoLocation'
import { RestaurantRequired } from '@/stories/Components/RestaurantRequired/RestaurantRequired'
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime'

interface CreateMenuDialogProps {
  restaurantName: string
  router: AppRouterInstance
  triggerText: string
  triggerVariant?: 'default' | 'secondary' | 'destructive' | 'outline' | 'ghost' | 'link'
}

export function CreateMenuDialog({
  restaurantName,
  router,
  triggerText,
  triggerVariant = 'default',
}: CreateMenuDialogProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [menuName, setMenuName] = useState('Main Menu')
  const [menuDescription, setMenuDescription] = useState('Our carefully crafted selection of dishes')

  const { selectedLocation, hasNoLocations } = useLocationSelection()
  const notRestaurant = selectedLocation?.type !== 'Restaurant'

  const { mutate: createMenu, isPending } = useCreateRestaurantMenu()

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
          if (menu) {
            setIsOpen(false)
            router.push(`/menus/${menu.id}`)
          }
        },
      }
    )
  }

  if (hasNoLocations) return <NoLocation />
  if (notRestaurant) return <RestaurantRequired />

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant={triggerVariant}>{triggerText}</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create Menu</DialogTitle>
          <DialogDescription>Create a new menu for {restaurantName}.</DialogDescription>
        </DialogHeader>
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
            <Button type="submit" disabled={isPending || !menuName.trim()}>
              <Plus />
              {isPending ? 'Creating...' : 'Create Menu'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
