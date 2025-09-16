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
import { useLocationSelection } from '@shared'

export function SidebarRestaurantSelector() {
  const router = useRouter()
  const { selectedLocation, userLocations, isLoading, hasNoLocations, setSelectedLocation } = useLocationSelection()

  if (isLoading) {
    return (
      <div className="flex items-center gap-2">
        <LoadingSpinner size="sm" />
        <span className="text-xs">Loading...</span>
      </div>
    )
  }

  if (hasNoLocations) {
    return (
      <SidebarMenuButton size="lg" onClick={() => router.push('/onboarding')}>
        <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
          <Building2 className="size-4" />
        </div>
        <div className="grid flex-1 text-left text-sm leading-tight">
          <span className="truncate font-semibold">No Location</span>
          <span className="truncate text-xs">Click to create</span>
        </div>
      </SidebarMenuButton>
    )
  }

  const displayLocation = selectedLocation || (userLocations.length > 0 ? userLocations[0] : null)

  if (!displayLocation) {
    return (
      <div className="text-xs text-muted-foreground p-2">
        No location data
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
            <span className="truncate font-semibold">{displayLocation.name}</span>
            <span className="truncate text-xs">{displayLocation.role} • {displayLocation.city}</span>
          </div>
          <ChevronDown className="ml-auto" />
        </SidebarMenuButton>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="start" className="w-64">
        {userLocations.length > 1 && (
          <>
            {userLocations.map((location) => (
              <DropdownMenuItem
                key={`${location.type}-${location.id}`}
                onClick={() => setSelectedLocation(location)}
                className={selectedLocation?.id === location.id && selectedLocation?.type === location.type ? 'bg-accent' : ''}
              >
                <Building2 className="h-4 w-4 mr-2" />
                <div className="flex-1 min-w-0">
                  <div className="truncate font-medium">
                    {location.name}
                  </div>
                  <div className="truncate text-xs text-muted-foreground">
                    {location.role} • {location.city} • {location.type}
                  </div>
                </div>
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
          </>
        )}

        <DropdownMenuItem onClick={() => router.push('/onboarding')}>
          <Plus className="h-4 w-4 mr-2" />
          <span>Add New Location</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}