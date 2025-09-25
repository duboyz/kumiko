'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { ChefHat, Plus } from 'lucide-react'

interface CreateMenuFormProps {
  restaurantId: string
  restaurantName: string
  onCreateMenu: (menuData: { name: string; description: string; restaurantId: string }) => void
  isLoading?: boolean
}

export function CreateMenuForm({ restaurantId, restaurantName, onCreateMenu, isLoading }: CreateMenuFormProps) {
  const [menuName, setMenuName] = useState('Main Menu')
  const [menuDescription, setMenuDescription] = useState('Our carefully crafted selection of dishes')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!menuName.trim()) return

    onCreateMenu({
      name: menuName,
      description: menuDescription,
      restaurantId: restaurantId,
    })
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
            <ChefHat className="w-6 h-6 text-primary" />
          </div>
          <CardTitle className="text-2xl">Create Your First Menu</CardTitle>
          <p className="text-muted-foreground">
            Get started by creating a menu for <span className="font-medium">{restaurantName}</span>
          </p>
        </CardHeader>
        <CardContent>
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
        </CardContent>
      </Card>
    </div>
  )
}