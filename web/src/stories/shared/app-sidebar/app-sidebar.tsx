'use client'

import * as React from 'react'
import { Home, Settings2, Globe, ChefHat, LogOut, List, ShoppingBag } from 'lucide-react'

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from '@/components/ui/sidebar'
import { SidebarRestaurantSelector } from '../SidebarRestaurantSelector'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useLocationSelection, useLogout } from '@shared'

// Menu items.
const items = [
  {
    title: 'Dashboard',
    url: '/dashboard',
    icon: Home,
  },
  {
    title: 'Menus',
    url: '/menus',
    icon: ChefHat,
    restaurantOnly: true,
  },
  {
    title: 'Menu items',
    url: '/menu-items',
    icon: List,
    restaurantOnly: true,
  },
  {
    title: 'Orders',
    url: '/orders',
    icon: ShoppingBag,
    restaurantOnly: true,
  },
  {
    title: 'Websites',
    url: '/websites',
    icon: Globe,
  },
  {
    title: 'Settings',
    url: '/settings',
    icon: Settings2,
  },
]

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname()
  const { selectedLocation } = useLocationSelection()
  const logoutMutation = useLogout()

  // Filter items based on location type
  const visibleItems = items.filter(item => {
    if (item.restaurantOnly) {
      return selectedLocation?.type === 'Restaurant'
    }
    return true
  })

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarRestaurantSelector />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {visibleItems.map(item => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={pathname === item.url}>
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="sm"
              onClick={() => logoutMutation.mutate()}
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
              disabled={logoutMutation.isPending}
            >
              <LogOut />
              <span>Logout</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
