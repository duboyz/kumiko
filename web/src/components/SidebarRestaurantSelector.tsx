'use client'

import { useRouter } from 'next/navigation'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { SidebarMenuButton } from '@/components/ui/sidebar'
import { Building2, ChevronDown, Plus } from 'lucide-react'
import { LoadingSpinner } from '@/components/LoadingSpinner'
import { useRestaurantSelection } from '@shared'

export function SidebarRestaurantSelector() {
  const router = useRouter()
  const { selectedRestaurant, userRestaurants, isLoading, hasNoRestaurants, setSelectedRestaurant } = useRestaurantSelection()

  if (isLoading) {
    return (
      <div className="flex items-center gap-2">
        <LoadingSpinner size="sm" />
        <span className="text-xs">Loading...</span>
      </div>
    )
  }

  if (hasNoRestaurants) {
    return (
      <SidebarMenuButton size="lg" onClick={() => router.push('/onboarding')}>
        <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
          <Building2 className="size-4" />
        </div>
        <div className="grid flex-1 text-left text-sm leading-tight">
          <span className="truncate font-semibold">No Restaurant</span>
          <span className="truncate text-xs">Click to create</span>
        </div>
      </SidebarMenuButton>
    )
  }

  const displayRestaurant = selectedRestaurant || (userRestaurants.length > 0 ? userRestaurants[0] : null)

  if (!displayRestaurant) {
    return (
      <div className="text-xs text-muted-foreground p-2">
        No restaurant data
      </div>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <SidebarMenuButton size="lg">
          <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
            <Building2 className="size-4" />
          </div>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-semibold">{displayRestaurant.restaurant.name}</span>
            <span className="truncate text-xs">{displayRestaurant.role} • {displayRestaurant.restaurant.city}</span>
          </div>
          <ChevronDown className="ml-auto" />
        </SidebarMenuButton>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="start" className="w-64">
        {userRestaurants.length > 1 && (
          <>
            {userRestaurants.map((userRestaurant) => (
              <DropdownMenuItem
                key={userRestaurant.restaurant.id}
                onClick={() => setSelectedRestaurant(userRestaurant)}
                className={selectedRestaurant?.restaurant.id === userRestaurant.restaurant.id ? 'bg-accent' : ''}
              >
                <Building2 className="h-4 w-4 mr-2" />
                <div className="flex-1 min-w-0">
                  <div className="truncate font-medium">
                    {userRestaurant.restaurant.name}
                  </div>
                  <div className="truncate text-xs text-muted-foreground">
                    {userRestaurant.role} • {userRestaurant.restaurant.city}
                  </div>
                </div>
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
          </>
        )}

        <DropdownMenuItem onClick={() => router.push('/onboarding')}>
          <Plus className="h-4 w-4 mr-2" />
          <span>Add New Restaurant</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}